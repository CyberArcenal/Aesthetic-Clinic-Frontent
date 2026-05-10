// src/pages/treatments/categories/hooks/useCategoryView.ts
import { useState } from "react";
import { showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import categoryApi, { CategoryDto } from "@/api/core/category";

interface UseCategoryViewReturn {
  category: CategoryDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (name: string) => Promise<void>;
  close: () => void;
}

const useCategoryView = (): UseCategoryViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<CategoryDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (name: string) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading category details...");
    try {
      const res = await categoryApi.getCategory(name);
      if (!res.success) throw new Error(res.message as string);
      setCategory(res.data);
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
      setIsOpen(false);
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const close = () => {
    setIsOpen(false);
    setCategory(null);
  };

  return { category, loading, isOpen, open, close };
};

export default useCategoryView;