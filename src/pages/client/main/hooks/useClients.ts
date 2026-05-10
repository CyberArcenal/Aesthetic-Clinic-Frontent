// src/pages/clients/hooks/useClients.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import type { ClientResponseDto } from "../../../../api/core/client";
import clientApi from "../../../../api/core/client";

export interface ClientFilters {
  search: string;
  dateFrom: string;
  dateTo: string;
}

interface UseClientsReturn {
  clients: ClientResponseDto[];
  paginatedClients: ClientResponseDto[];
  filters: ClientFilters;
  setFilters: React.Dispatch<React.SetStateAction<ClientFilters>>;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedClients: number[];
  setSelectedClients: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof ClientResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof ClientResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof ClientFilters, value: string) => void;
  resetFilters: () => void;
  toggleClientSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof ClientResponseDto) => void;
}

const useClients = (): UseClientsReturn => {
  const [allClients, setAllClients] = useState<ClientResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ClientResponseDto; direction: "asc" | "desc" }>({
    key: "createdAt",
    direction: "desc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<ClientFilters>({
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientApi.getClients({ page: 1, pageSize: 1000, search: filters.search || undefined });
      if (!res.success) throw new Error(res.message || "Failed to fetch clients");
      let clients = res.data.items;
      // Apply client‑side date filters
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom);
        clients = clients.filter(c => new Date(c.createdAt) >= from);
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        clients = clients.filter(c => new Date(c.createdAt) <= to);
      }
      setAllClients(clients);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.dateFrom, filters.dateTo]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Sorting
  const sortedClients = useMemo(() => {
    const sorted = [...allClients];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "fullName") {
          aVal = a.fullName?.toLowerCase() || "";
          bVal = b.fullName?.toLowerCase() || "";
        } else if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        } else if (aVal instanceof Date || (typeof aVal === "string" && aVal.includes("-"))) {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allClients, sortConfig]);

  const totalItems = sortedClients.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedClients = sortedClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof ClientFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", dateFrom: "", dateTo: "" });
    setCurrentPage(1);
  }, []);

  const toggleClientSelection = useCallback((id: number) => {
    setSelectedClients(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedClients(prev =>
      prev.length === paginatedClients.length ? [] : paginatedClients.map(c => c.id)
    );
  }, [paginatedClients]);

  const handleSort = useCallback((key: keyof ClientResponseDto) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchClients();
  }, [fetchClients]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    clients: sortedClients,
    paginatedClients,
    filters,
    setFilters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedClients,
    setSelectedClients,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleClientSelection,
    toggleSelectAll,
    handleSort,
  };
};

export default useClients;