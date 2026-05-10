// src/pages/treatments/categories/components/CategoryViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { FolderOpen, Package, Edit, Trash2 } from "lucide-react";
import { CategoryDto } from "@/api/core/category";

interface CategoryViewDialogProps {
  category: CategoryDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (category: CategoryDto) => void;
  onDelete?: (category: CategoryDto) => void;
}

const CategoryViewDialog: React.FC<CategoryViewDialogProps> = ({
  category,
  loading,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!category) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="md">
        <div className="text-center py-8 text-[var(--text-secondary)]">No category data</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Category Details" size="md">
      <div className="space-y-4">
        {/* Name */}
        <div className="flex items-start gap-3">
          <FolderOpen className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Category Name</div>
            <div className="font-medium text-base">{category.name}</div>
          </div>
        </div>

        {/* Treatment Count */}
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Treatments Using This Category</div>
            <div className="font-medium">{category.count}</div>
          </div>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
            {onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(category)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(category)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}

        {/* Fallback close button if no actions */}
        {!onEdit && !onDelete && (
          <div className="flex justify-end pt-4 border-t border-[var(--border-color)]">
            <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CategoryViewDialog;