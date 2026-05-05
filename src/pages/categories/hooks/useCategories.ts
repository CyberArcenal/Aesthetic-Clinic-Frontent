// src/pages/treatments/categories/hooks/useCategories.ts
import categoryApi, { CategoryDto } from "@/api/core/category";
import { useState, useEffect, useCallback, useMemo } from "react";

export interface CategoryFilters {
  search: string;
}

interface UseCategoriesReturn {
  categories: CategoryDto[];
  paginatedCategories: CategoryDto[];
  filters: CategoryFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  sortConfig: { key: keyof CategoryDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof CategoryDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof CategoryFilters, value: string) => void;
  resetFilters: () => void;
  toggleCategorySelection: (name: string) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof CategoryDto) => void;
}

const useCategories = (): UseCategoriesReturn => {
  const [allCategories, setAllCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof CategoryDto; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryApi.getCategories({ page: 1, pageSize: 1000, search: filters.search || undefined });
      if (!res.success) throw new Error(res.message || "Failed to fetch categories");
      setAllCategories(res.data.items);
      setSelectedCategories([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Sorting
  const sortedCategories = useMemo(() => {
    const sorted = [...allCategories];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "name") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allCategories, sortConfig]);

  const totalItems = sortedCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedCategories = sortedCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof CategoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "" });
    setCurrentPage(1);
  }, []);

  const toggleCategorySelection = useCallback((name: string) => {
    setSelectedCategories((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedCategories((prev) =>
      prev.length === paginatedCategories.length ? [] : paginatedCategories.map((c) => c.name)
    );
  }, [paginatedCategories]);

  const handleSort = useCallback((key: keyof CategoryDto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    categories: sortedCategories,
    paginatedCategories,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedCategories,
    setSelectedCategories,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleCategorySelection,
    toggleSelectAll,
    handleSort,
  };
};

export default useCategories;