// src/pages/public/treatments/hooks/usePublicTreatments.ts
import { useState, useEffect, useCallback } from "react";
import treatmentApi, { TreatmentResponseDto } from "../../../../api/core/treatment";

interface Filters {
  search: string;
  category: string;
}

export const usePublicTreatments = () => {
  const [treatments, setTreatments] = useState<TreatmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    totalCount: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<Filters>({ search: "", category: "" });
  const [categories, setCategories] = useState<string[]>([]);

  const fetchTreatments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await treatmentApi.getTreatments({
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: filters.search || undefined,
      });
      if (res.success) {
        setTreatments(res.data.items);
        setPagination(prev => ({
          ...prev,
          totalCount: res.data.totalCount,
          totalPages: res.data.totalPages,
        }));
        // Extract unique categories from the fetched items
        const cats = Array.from(new Set(res.data.items.map(t => t.category).filter(Boolean))) as string[];
        setCategories(cats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters.search]);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    treatments,
    loading,
    pagination,
    filters,
    categories,
    handleFilterChange,
    handlePageChange,
  };
};