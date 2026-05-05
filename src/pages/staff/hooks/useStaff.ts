// src/pages/staff/hooks/useStaff.ts
import staffApi, { StaffResponseDto } from "@/api/core/staff";
import { useState, useEffect, useCallback, useMemo } from "react";

export interface StaffFilters {
  search: string;
  position: string;
  activeOnly: boolean;
}

interface UseStaffReturn {
  staff: StaffResponseDto[];
  paginatedStaff: StaffResponseDto[];
  filters: StaffFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedStaff: number[];
  setSelectedStaff: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof StaffResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof StaffResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof StaffFilters, value: any) => void;
  resetFilters: () => void;
  toggleStaffSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof StaffResponseDto) => void;
  positions: string[];
}

const useStaff = (): UseStaffReturn => {
  const [allStaff, setAllStaff] = useState<StaffResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof StaffResponseDto; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<StaffFilters>({
    search: "",
    position: "",
    activeOnly: false,
  });
  const [positions, setPositions] = useState<string[]>([]);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await staffApi.getStaff({ page: 1, pageSize: 1000 });
      if (!res.success) throw new Error(res.message || "Failed to fetch staff");
      let items = res.data.items;
      // Client‑side filtering
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(
          (s) =>
            s.name?.toLowerCase().includes(searchLower) ||
            s.email?.toLowerCase().includes(searchLower) ||
            s.position?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.position) {
        items = items.filter((s) => s.position === filters.position);
      }
      if (filters.activeOnly) {
        items = items.filter((s) => s.isActive === true);
      }
      setAllStaff(items);
      setSelectedStaff([]);
      // Extract unique positions
      const uniquePositions = Array.from(new Set(items.map((s) => s.position).filter((p) => p))) as string[];
      uniquePositions.sort();
      setPositions(uniquePositions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.position, filters.activeOnly]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Sorting
  const sortedStaff = useMemo(() => {
    const sorted = [...allStaff];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "name" || key === "position" || key === "email") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allStaff, sortConfig]);

  const totalItems = sortedStaff.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedStaff = sortedStaff.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof StaffFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", position: "", activeOnly: false });
    setCurrentPage(1);
  }, []);

  const toggleStaffSelection = useCallback((id: number) => {
    setSelectedStaff((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedStaff((prev) =>
      prev.length === paginatedStaff.length ? [] : paginatedStaff.map((s) => s.id)
    );
  }, [paginatedStaff]);

  const handleSort = useCallback((key: keyof StaffResponseDto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchStaff();
  }, [fetchStaff]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    staff: sortedStaff,
    paginatedStaff,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedStaff,
    setSelectedStaff,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleStaffSelection,
    toggleSelectAll,
    handleSort,
    positions,
  };
};

export default useStaff;