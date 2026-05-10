// src/pages/treatments/components/TreatmentFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import treatmentApi, { TreatmentResponseDto, CreateTreatmentDto, UpdateTreatmentDto } from "@/api/core/treatment";
import { useTreatmentCategories } from "../hooks/useTreatmentCategories";

interface TreatmentFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  treatmentId: number | null;
  initialData: Partial<TreatmentResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Schema with isActive as required boolean
const treatmentSchema = z.object({
  name: z.string().min(1, "Treatment name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price must be ≥ 0"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof treatmentSchema>;

const TreatmentFormDialog: React.FC<TreatmentFormDialogProps> = ({
  isOpen,
  mode,
  treatmentId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const { categories, loading: loadingCategories, error: categoriesError } = useTreatmentCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      durationMinutes: 60,
      price: 0,
      isActive: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        category: initialData.category || "",
        durationMinutes: initialData.durationMinutes || 60,
        price: initialData.price || 0,
        isActive: initialData.isActive ?? true,
      });
    } else {
      reset({
        name: "",
        description: "",
        category: "",
        durationMinutes: 60,
        price: 0,
        isActive: true,
      });
    }
  }, [initialData, mode, reset]);

  const onSubmit = async (data: FormValues) => {
    if (mode === "add") {
      try {
        const createData: CreateTreatmentDto = {
          name: data.name,
          description: data.description || undefined,
          category: data.category || undefined,
          durationMinutes: data.durationMinutes,
          price: data.price,
          isActive: data.isActive,
        };
        await treatmentApi.createTreatment(createData);
        showToast("Treatment created successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to create treatment");
      }
    } else if (mode === "edit" && treatmentId) {
      try {
        const updateData: UpdateTreatmentDto = {
          name: data.name,
          description: data.description,
          category: data.category,
          durationMinutes: data.durationMinutes,
          price: data.price,
          isActive: data.isActive,
        };
        await treatmentApi.updateTreatment(treatmentId, updateData);
        showToast("Treatment updated successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to update treatment");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose
      onClose={onClose}
      title={mode === "add" ? "Add Treatment" : "Edit Treatment"}
      size="lg"
    >
      {categoriesError ? (
        <div className="p-4 text-red-500">Error loading categories: {categoriesError}</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Treatment Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Treatment Name *
            </label>
            <input
              type="text"
              {...register("name")}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              placeholder="e.g., HydraFacial"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              placeholder="Detailed description of the treatment..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
                Category
              </label>
              <select
                {...register("category")}
                disabled={loadingCategories}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count} treatments)
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
                Duration (minutes) *
              </label>
              <input
                type="number"
                step="5"
                {...register("durationMinutes", { valueAsNumber: true })}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              />
              {errors.durationMinutes && <p className="text-xs text-red-500 mt-1">{errors.durationMinutes.message}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
                Price (₱) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
            </div>

            {/* Active Status */}
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
                <input type="checkbox" {...register("isActive")} className="w-4 h-4" />
                Active (available for booking)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Create Treatment" : "Update Treatment"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default TreatmentFormDialog;