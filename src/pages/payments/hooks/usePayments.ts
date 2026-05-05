// src/pages/payments/hooks/usePayments.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import type { PaymentResponseDto } from "../../../api/core/billing";
import billingApi from "../../../api/core/billing";

export interface PaymentFilters {
  search: string;
  method: string;
  fromDate: string;
  toDate: string;
}

interface UsePaymentsReturn {
  payments: PaymentResponseDto[];
  paginatedPayments: PaymentResponseDto[];
  filters: PaymentFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedPayments: number[];
  setSelectedPayments: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof PaymentResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof PaymentResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof PaymentFilters, value: string) => void;
  resetFilters: () => void;
  togglePaymentSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof PaymentResponseDto) => void;
}

const usePayments = (): UsePaymentsReturn => {
  const [allPayments, setAllPayments] = useState<PaymentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PaymentResponseDto; direction: "asc" | "desc" }>({
    key: "paymentDate",
    direction: "desc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<PaymentFilters>({
    search: "",
    method: "",
    fromDate: "",
    toDate: "",
  });

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page: currentPage, pageSize };
      if (filters.method) params.method = filters.method;
      const res = await billingApi.getPayments(params);
      if (!res.success) throw new Error(res.message || "Failed to fetch payments");
      let items = res.data.items;
      // client-side filtering for search (invoice number) and date range
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter((p) => p.invoiceNumber?.toLowerCase().includes(searchLower));
      }
      if (filters.fromDate) {
        const from = new Date(filters.fromDate);
        items = items.filter((p) => new Date(p.paymentDate) >= from);
      }
      if (filters.toDate) {
        const to = new Date(filters.toDate);
        items = items.filter((p) => new Date(p.paymentDate) <= to);
      }
      setAllPayments(items);
      setSelectedPayments([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters.method, filters.search, filters.fromDate, filters.toDate]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Sorting
  const sortedPayments = useMemo(() => {
    const sorted = [...allPayments];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "invoiceNumber" || key === "method") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        } else if (key === "paymentDate") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allPayments, sortConfig]);

  const totalItems = sortedPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedPayments = sortedPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof PaymentFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", method: "", fromDate: "", toDate: "" });
    setCurrentPage(1);
  }, []);

  const togglePaymentSelection = useCallback((id: number) => {
    setSelectedPayments((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedPayments((prev) =>
      prev.length === paginatedPayments.length ? [] : paginatedPayments.map((p) => p.id)
    );
  }, [paginatedPayments]);

  const handleSort = useCallback((key: keyof PaymentResponseDto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchPayments();
  }, [fetchPayments]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    payments: sortedPayments,
    paginatedPayments,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedPayments,
    setSelectedPayments,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    togglePaymentSelection,
    toggleSelectAll,
    handleSort,
  };
};

export default usePayments;