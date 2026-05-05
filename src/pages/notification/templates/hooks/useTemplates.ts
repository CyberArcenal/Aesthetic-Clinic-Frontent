// src/pages/notifications/templates/hooks/useTemplates.ts
import notificationApi, { NotificationTemplateResponseDto } from "@/api/core/notification";
import { useState, useEffect, useCallback, useMemo } from "react";


export interface TemplateFilters {
  search: string;
}

interface UseTemplatesReturn {
  templates: NotificationTemplateResponseDto[];
  paginatedTemplates: NotificationTemplateResponseDto[];
  filters: TemplateFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedTemplates: number[];
  setSelectedTemplates: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof NotificationTemplateResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof NotificationTemplateResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof TemplateFilters, value: string) => void;
  resetFilters: () => void;
  toggleTemplateSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof NotificationTemplateResponseDto) => void;
  deleteTemplate: (id: number) => Promise<void>;
  bulkDelete: () => Promise<void>;
}

const useTemplates = (): UseTemplatesReturn => {
  const [allTemplates, setAllTemplates] = useState<NotificationTemplateResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof NotificationTemplateResponseDto; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TemplateFilters>({ search: "" });

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page: 1, pageSize: 1000, search: filters.search || undefined };
      const res = await notificationApi.getTemplates(params);
      if (!res.success) throw new Error(res.message || "Failed to fetch templates");
      setAllTemplates(res.data.items);
      setSelectedTemplates([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Sorting
  const sortedTemplates = useMemo(() => {
    const sorted = [...allTemplates];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "name" || key === "subject") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        } else if (key === "createdAt") {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allTemplates, sortConfig]);

  const totalItems = sortedTemplates.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedTemplates = sortedTemplates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = useCallback((key: keyof NotificationTemplateResponseDto) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }));
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((key: keyof TemplateFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "" });
    setCurrentPage(1);
  }, []);

  const toggleTemplateSelection = useCallback((id: number) => {
    setSelectedTemplates(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedTemplates(prev => prev.length === paginatedTemplates.length ? [] : paginatedTemplates.map(t => t.id));
  }, [paginatedTemplates]);

  const deleteTemplate = async (id: number) => {
    const res = await notificationApi.deleteTemplate(id);
    if (!res.success) throw new Error(res.message as string);
    await fetchTemplates();
  };

  const bulkDelete = async () => {
    for (const id of selectedTemplates) await deleteTemplate(id);
  };

  const reload = () => fetchTemplates();

  const setPageSizeHandler = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    templates: sortedTemplates,
    paginatedTemplates,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedTemplates,
    setSelectedTemplates,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleTemplateSelection,
    toggleSelectAll,
    handleSort,
    deleteTemplate,
    bulkDelete,
  };
};

export default useTemplates;