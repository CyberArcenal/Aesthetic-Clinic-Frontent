// src/pages/treatments/categories/components/CategoryViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import { CategoryDto } from "@/api/core/category";

interface CategoryViewDialogProps {
  category: CategoryDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const CategoryViewDialog: React.FC<CategoryViewDialogProps> = ({ category, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : category ? (
        <div className="space-y-4">
          <div><div className="text-xs text-[var(--text-secondary)]">Name</div><div className="text-sm font-medium">{category.name}</div></div>
          <div><div className="text-xs text-[var(--text-secondary)]">Treatments using this category</div><div className="text-sm">{category.count}</div></div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No category data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default CategoryViewDialog;