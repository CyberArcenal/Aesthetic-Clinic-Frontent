// src/pages/appointments/hooks/useAppointments.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import type { AppointmentResponseDto } from "../../../../api/core/appointment";
import appointmentApi from "../../../../api/core/appointment";

export interface AppointmentFilters {
  search: string;
  status: string;
  fromDate: string;
  toDate: string;
}

interface UseAppointmentsReturn {
  appointments: AppointmentResponseDto[];
  paginatedAppointments: AppointmentResponseDto[];
  filters: AppointmentFilters;
  setFilters: React.Dispatch<React.SetStateAction<AppointmentFilters>>;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedAppointments: number[];
  setSelectedAppointments: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof AppointmentResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof AppointmentResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof AppointmentFilters, value: string) => void;
  resetFilters: () => void;
  toggleAppointmentSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof AppointmentResponseDto) => void;
}

const useAppointments = (initialFilters?: Partial<AppointmentFilters>): UseAppointmentsReturn => {
  const [allAppointments, setAllAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointments, setSelectedAppointments] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof AppointmentResponseDto; direction: "asc" | "desc" }>({
    key: "appointmentDateTime",
    direction: "desc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AppointmentFilters>({
    search: "",
    status: "",
   fromDate: initialFilters?.fromDate || "",
    toDate: initialFilters?.toDate || "",
  });

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page: currentPage, pageSize };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.fromDate) params.fromDate = filters.fromDate;
      if (filters.toDate) params.toDate = filters.toDate;
      const res = await appointmentApi.getAppointments(params);
      if (!res.success) throw new Error(res.message || "Failed to fetch appointments");
      const items = res.data.items;
      setAllAppointments(items);
      setSelectedAppointments([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters.search, filters.status, filters.fromDate, filters.toDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Sorting (client-side for simplicity)
  const sortedAppointments = useMemo(() => {
    const sorted = [...allAppointments];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "clientName" || key === "treatmentName" || key === "assignedStaff") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        } else if (key === "appointmentDateTime") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allAppointments, sortConfig]);

  const totalItems = sortedAppointments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedAppointments = sortedAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof AppointmentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", status: "", fromDate: "", toDate: "" });
    setCurrentPage(1);
  }, []);

  const toggleAppointmentSelection = useCallback((id: number) => {
    setSelectedAppointments(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedAppointments(prev =>
      prev.length === paginatedAppointments.length ? [] : paginatedAppointments.map(a => a.id)
    );
  }, [paginatedAppointments]);

  const handleSort = useCallback((key: keyof AppointmentResponseDto) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    appointments: sortedAppointments,
    paginatedAppointments,
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
    selectedAppointments,
    setSelectedAppointments,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleAppointmentSelection,
    toggleSelectAll,
    handleSort,
  };
};

export default useAppointments;