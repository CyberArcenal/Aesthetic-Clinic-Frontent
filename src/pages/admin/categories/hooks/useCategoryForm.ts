// src/pages/treatments/categories/hooks/useCategoryForm.ts
import { CategoryDto } from "@/api/core/category";
import { useState } from "react";

export type FormMode = "add" | "edit";

interface UseCategoryFormReturn {
  isOpen: boolean;
  mode: FormMode;
  categoryName: string | null;
  initialData: Partial<CategoryDto> | null;
  openAdd: () => void;
  openEdit: (category: CategoryDto) => void;
  close: () => void;
}

const useCategoryForm = (): UseCategoryFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<CategoryDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setCategoryName(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (category: CategoryDto) => {
    setMode("edit");
    setCategoryName(category.name);
    setInitialData(category);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, categoryName, initialData, openAdd, openEdit, close };
};

export default useCategoryForm;