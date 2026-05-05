// src/pages/packages/hooks/usePackages.ts
import packageApi, { PackageDto } from "@/api/core/package";
import { useState, useEffect, useCallback, useMemo } from "react";

export interface PackageFilters {
  search: string;
  activeOnly: boolean;
}

interface UsePackagesReturn {
  packages: PackageDto[];
  paginatedPackages: PackageDto[];
  filters: PackageFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedPackages: number[];
  setSelectedPackages: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof PackageDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof PackageDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof PackageFilters, value: any) => void;
  resetFilters: () => void;
  togglePackageSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof PackageDto) => void;
}

const usePackages = (): UsePackagesReturn => {
  const [allPackages, setAllPackages] = useState<PackageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PackageDto; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PackageFilters>({
    search: "",
    activeOnly: false,
  });

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await packageApi.getPackages({ page: 1, pageSize: 1000, search: filters.search || undefined });
      if (!res.success) throw new Error(res.message || "Failed to fetch packages");
      let items = res.data.items;
      if (filters.activeOnly) {
        items = items.filter((p) => p.isActive === true);
      }
      setAllPackages(items);
      setSelectedPackages([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.activeOnly]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const sortedPackages = useMemo(() => {
    const sorted = [...allPackages];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "name") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        } else if (key === "totalPrice" || key === "discountedPrice" || key === "savings") {
          aVal = aVal || 0;
          bVal = bVal || 0;
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allPackages, sortConfig]);

  const totalItems = sortedPackages.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedPackages = sortedPackages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof PackageFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", activeOnly: false });
    setCurrentPage(1);
  }, []);

  const togglePackageSelection = useCallback((id: number) => {
    setSelectedPackages((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedPackages((prev) =>
      prev.length === paginatedPackages.length ? [] : paginatedPackages.map((p) => p.id)
    );
  }, [paginatedPackages]);

  const handleSort = useCallback((key: keyof PackageDto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchPackages();
  }, [fetchPackages]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    packages: sortedPackages,
    paginatedPackages,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedPackages,
    setSelectedPackages,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    togglePackageSelection,
    toggleSelectAll,
    handleSort,
  };
};

export default usePackages;