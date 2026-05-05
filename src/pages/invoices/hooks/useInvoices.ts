// src/pages/invoices/hooks/useInvoices.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import type { InvoiceResponseDto } from "../../../api/core/billing";
import billingApi from "../../../api/core/billing";

export interface InvoiceFilters {
  search: string;
  status: string;
  clientId: string;
  fromDate: string;
  toDate: string;
}

interface UseInvoicesReturn {
  invoices: InvoiceResponseDto[];
  paginatedInvoices: InvoiceResponseDto[];
  filters: InvoiceFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedInvoices: number[];
  setSelectedInvoices: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof InvoiceResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof InvoiceResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof InvoiceFilters, value: string) => void;
  resetFilters: () => void;
  toggleInvoiceSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof InvoiceResponseDto) => void;
}

const useInvoices = (): UseInvoicesReturn => {
  const [allInvoices, setAllInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InvoiceResponseDto; direction: "asc" | "desc" }>({
    key: "issueDate",
    direction: "desc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: "",
    status: "",
    clientId: "",
    fromDate: "",
    toDate: "",
  });

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page: currentPage, pageSize };
      if (filters.status) params.status = filters.status;
      if (filters.clientId) params.clientId = parseInt(filters.clientId);
      const res = await billingApi.getInvoices(params);
      if (!res.success) throw new Error(res.message || "Failed to fetch invoices");
      let items = res.data.items;
      // client-side filtering for search and date range (since backend doesn't support them)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(
          (inv) =>
            inv.invoiceNumber?.toLowerCase().includes(searchLower) ||
            inv.clientName?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.fromDate) {
        const from = new Date(filters.fromDate);
        items = items.filter((inv) => new Date(inv.issueDate) >= from);
      }
      if (filters.toDate) {
        const to = new Date(filters.toDate);
        items = items.filter((inv) => new Date(inv.issueDate) <= to);
      }
      setAllInvoices(items);
      setSelectedInvoices([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters.status, filters.clientId, filters.search, filters.fromDate, filters.toDate]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Sorting
  const sortedInvoices = useMemo(() => {
    const sorted = [...allInvoices];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "clientName" || key === "invoiceNumber") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        } else if (key === "issueDate" || key === "dueDate") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allInvoices, sortConfig]);

  const totalItems = sortedInvoices.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedInvoices = sortedInvoices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof InvoiceFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", status: "", clientId: "", fromDate: "", toDate: "" });
    setCurrentPage(1);
  }, []);

  const toggleInvoiceSelection = useCallback((id: number) => {
    setSelectedInvoices((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedInvoices((prev) =>
      prev.length === paginatedInvoices.length ? [] : paginatedInvoices.map((inv) => inv.id)
    );
  }, [paginatedInvoices]);

  const handleSort = useCallback((key: keyof InvoiceResponseDto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    invoices: sortedInvoices,
    paginatedInvoices,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedInvoices,
    setSelectedInvoices,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleInvoiceSelection,
    toggleSelectAll,
    handleSort,
  };
};

export default useInvoices;