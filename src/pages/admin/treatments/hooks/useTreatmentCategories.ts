import { useState, useEffect } from "react";
import categoryApi, { CategoryDto } from "@/api/core/category";

interface UseTreatmentCategoriesReturn {
  categories: CategoryDto[];
  loading: boolean;
  error: string | null;
}

export const useTreatmentCategories = (): UseTreatmentCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await categoryApi.getCategories({ page: 1, pageSize: 1000 });
        if (res.success) {
          setCategories(res.data.items);
        } else {
          throw new Error(res.message || "Failed to load categories");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading, error };
};