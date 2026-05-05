// src/pages/treatments/categories/components/CategoryFormDialog.tsx
import React, { useState } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import categoryApi from "@/api/core/category";
import { dialogs } from "@/utils/dialogs";


interface CategoryFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  categoryName?: string | null;
  initialData: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  isOpen,
  mode,
  categoryName,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    showLoading(mode === "add" ? "Creating category..." : "Renaming category...");
    try {
      if (mode === "add") {
        const res = await categoryApi.createCategory({ name: name.trim() });
        if (!res.success) throw new Error(res.message as string);
        showToast("Category created", "success");
      } else {
        if (!categoryName) throw new Error("No category name provided");
        const res = await categoryApi.updateCategory(categoryName, { name: name.trim() });
        if (!res.success) throw new Error(res.message as string);
        showToast("Category renamed", "success");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Create Category" : "Edit Category"} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
            placeholder="e.g., Facial"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={handleSubmit}>Save</Button>
      </div>
    </Modal>
  );
};

export default CategoryFormDialog;