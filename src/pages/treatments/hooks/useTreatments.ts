// src/pages/treatments/hooks/useTreatments.ts
import treatmentApi, { TreatmentResponseDto } from "@/api/core/treatment";
import { useState, useEffect, useCallback, useMemo } from "react";

export interface TreatmentFilters {
  search: string;
  category: string;
  activeOnly: boolean;
}

interface UseTreatmentsReturn {
  treatments: TreatmentResponseDto[];
  paginatedTreatments: TreatmentResponseDto[];
  filters: TreatmentFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedTreatments: number[];
  setSelectedTreatments: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof TreatmentResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof TreatmentResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof TreatmentFilters, value: any) => void;
  resetFilters: () => void;
  toggleTreatmentSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof TreatmentResponseDto) => void;
  categories: (string | undefined)[],
}

const useTreatments = (): UseTreatmentsReturn => {
  const [allTreatments, setAllTreatments] = useState<TreatmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TreatmentResponseDto; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TreatmentFilters>({
    search: "",
    category: "",
    activeOnly: false,
  });

  const fetchTreatments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all treatments (backend pagination supports search, but we'll just get all with large pageSize and filter client-side for simplicity)
      const res = await treatmentApi.getTreatments({ page: 1, pageSize: 1000 });
      if (!res.success) throw new Error(res.message || "Failed to fetch treatments");
      let items = res.data.items;
      // Client-side filtering
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter((t) => t.name?.toLowerCase().includes(searchLower));
      }
      if (filters.category) {
        items = items.filter((t) => t.category === filters.category);
      }
      if (filters.activeOnly) {
        items = items.filter((t) => t.isActive === true);
      }
      setAllTreatments(items);
      setSelectedTreatments([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.category, filters.activeOnly]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  // Sorting
  const sortedTreatments = useMemo(() => {
    const sorted = [...allTreatments];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "name" || key === "category") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        } else if (key === "price" || key === "durationMinutes") {
          aVal = aVal || 0;
          bVal = bVal || 0;
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allTreatments, sortConfig]);

  const totalItems = sortedTreatments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedTreatments = sortedTreatments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof TreatmentFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", category: "", activeOnly: false });
    setCurrentPage(1);
  }, []);

  const toggleTreatmentSelection = useCallback((id: number) => {
    setSelectedTreatments((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedTreatments((prev) =>
      prev.length === paginatedTreatments.length ? [] : paginatedTreatments.map((t) => t.id)
    );
  }, [paginatedTreatments]);

  const handleSort = useCallback((key: keyof TreatmentResponseDto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(allTreatments.map((t) => t.category).filter((c) => c));
    return Array.from(cats).sort();
  }, [allTreatments]);

  return {
    treatments: sortedTreatments,
    paginatedTreatments,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedTreatments,
    setSelectedTreatments,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleTreatmentSelection,
    toggleSelectAll,
    handleSort,
    categories,
  };
};

export default useTreatments;