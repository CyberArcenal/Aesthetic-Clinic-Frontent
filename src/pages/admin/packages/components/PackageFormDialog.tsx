// src/pages/packages/components/PackageFormDialog.tsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, TrendingDown } from "lucide-react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import packageApi, {
  CreatePackageDto,
  UpdatePackageDto,
} from "@/api/core/package";
import { usePackageFormData } from "../hooks/usePackageFormData";
import type { PackageDto } from "@/api/core/package";

interface PackageFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  packageId: number | null;
  initialData: Partial<PackageDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Zod schema
const packageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  description: z.string().optional(),
  treatmentIds: z.array(z.number()).min(1, "Select at least one treatment"),
  discountedPrice: z.number().min(0, "Discounted price must be ≥ 0"),
});

type FormValues = z.infer<typeof packageSchema>;

const PackageFormDialog: React.FC<PackageFormDialogProps> = ({
  isOpen,
  mode,
  packageId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    treatments,
    loading: loadingTreatments,
    error: treatmentsError,
  } = usePackageFormData();
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      description: "",
      treatmentIds: [],
      discountedPrice: 0,
    },
  });

  const selectedTreatmentIds = watch("treatmentIds");
  const discountedPrice = watch("discountedPrice") || 0;

  // Calculate total price from selected treatments
  useEffect(() => {
    const selected = treatments.filter((t) =>
      selectedTreatmentIds.includes(t.id),
    );
    const total = selected.reduce((sum, t) => sum + t.price, 0);
    setCalculatedTotal(total);
    // If discounted price is not set, optionally set it to total? No, keep user input.
  }, [selectedTreatmentIds, treatments]);

  // Populate form when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      setValue("name", initialData.name || "");
      setValue("description", initialData.description || "");
      const ids = initialData.treatments?.map((t) => t.id) || [];
      setValue("treatmentIds", ids);
      setValue("discountedPrice", initialData.discountedPrice || 0);
    } else {
      reset({
        name: "",
        description: "",
        treatmentIds: [],
        discountedPrice: 0,
      });
      setCalculatedTotal(0);
    }
  }, [initialData, mode, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (mode === "add") {
      try {
        const createData: CreatePackageDto = {
          name: data.name,
          description: data.description || undefined,
          treatmentIds: data.treatmentIds,
          discountedPrice: data.discountedPrice,
        };
        await packageApi.createPackage(createData);
        showToast("Package created successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to create package");
      }
    } else if (mode === "edit" && packageId) {
      try {
        const updateData: UpdatePackageDto = {
          name: data.name,
          description: data.description,
          treatmentIds: data.treatmentIds,
          discountedPrice: data.discountedPrice,
        };
        await packageApi.updatePackage(packageId, updateData);
        showToast("Package updated successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to update package");
      }
    }
  };

  const toggleTreatment = (treatmentId: number) => {
    const current = selectedTreatmentIds;
    if (current.includes(treatmentId)) {
      setValue(
        "treatmentIds",
        current.filter((id) => id !== treatmentId),
      );
    } else {
      setValue("treatmentIds", [...current, treatmentId]);
    }
  };

  const savings = calculatedTotal - discountedPrice;

  return (
    <Modal
      isOpen={isOpen}
      safetyClose
      onClose={onClose}
      title={mode === "add" ? "Create Package" : "Edit Package"}
      size="lg"
    >
      {treatmentsError ? (
        <div className="p-4 text-red-500">
          Error loading treatments: {treatmentsError}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Package Name */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Package Name *
            </label>
            <input
              type="text"
              {...register("name")}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              placeholder="e.g., Glow Up Package"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Description
            </label>
            <textarea
              {...register("description")}
              rows={2}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              placeholder="Brief description of the package..."
            />
          </div>

          {/* Treatments Multi-Select */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Treatments in Package *
            </label>
            <div
              className="border rounded-md p-3 max-h-60 overflow-y-auto"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              {loadingTreatments ? (
                <div
                  className="text-center py-4 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Loading treatments...
                </div>
              ) : treatments.length === 0 ? (
                <div
                  className="text-center py-4 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No active treatments found.
                </div>
              ) : (
                <div className="space-y-2">
                  {treatments.map((treatment) => (
                    <label
                      key={treatment.id}
                      className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTreatmentIds.includes(treatment.id)}
                        onChange={() => toggleTreatment(treatment.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="flex-1 text-sm">{treatment.name}</span>
                      <span className="text-xs text-green-600">
                        ₱{treatment.price.toFixed(2)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.treatmentIds && (
              <p className="text-xs text-red-500 mt-1">
                {errors.treatmentIds.message}
              </p>
            )}
          </div>

          {/* Pricing Section */}
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total value of treatments:</span>
              <span className="font-semibold">
                ₱{calculatedTotal.toFixed(2)}
              </span>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Package Discounted Price (₱) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("discountedPrice", { valueAsNumber: true })}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              />
              {errors.discountedPrice && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.discountedPrice.message}
                </p>
              )}
            </div>
            {discountedPrice > 0 && calculatedTotal > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  <TrendingDown size={14} /> Customer savings:
                </span>
                <span className="font-bold">
                  ₱{Math.max(0, savings).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                  ? "Create Package"
                  : "Update Package"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default PackageFormDialog;
