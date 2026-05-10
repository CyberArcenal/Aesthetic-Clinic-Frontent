// src/pages/treatments/categories/components/CategoryFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import categoryApi from "@/api/core/category";
import { dialogs } from "@/utils/dialogs";

interface CategoryFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  categoryName?: string | null;
  initialData: any; // CategoryDto-like
  onClose: () => void;
  onSuccess: () => void;
}

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100, "Name too long"),
});

type FormValues = z.infer<typeof categorySchema>;

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  isOpen,
  mode,
  categoryName,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setValue("name", initialData.name || "");
    } else {
      reset({ name: "" });
    }
  }, [mode, initialData, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    const nameTrimmed = data.name.trim();
    if (!nameTrimmed) return;

    showLoading(mode === "add" ? "Creating category..." : "Renaming category...");
    try {
      if (mode === "add") {
        const res = await categoryApi.createCategory({ name: nameTrimmed });
        if (!res.success) throw new Error(res.message as string);
        showToast("Category created successfully", "success");
      } else {
        if (!categoryName) throw new Error("No category name provided for update");
        const res = await categoryApi.updateCategory(categoryName, { name: nameTrimmed });
        if (!res.success) throw new Error(res.message as string);
        showToast("Category renamed successfully", "success");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.error(err.message || "Failed to save category");
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Create Category" : "Edit Category"}
      size="md"
      safetyClose={true}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Category Name *
          </label>
          <input
            type="text"
            {...register("name")}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
            placeholder="e.g., Facial, Body, Injectables"
            autoFocus
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormDialog;