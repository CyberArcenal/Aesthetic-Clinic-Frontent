// src/pages/invoices/components/InvoiceFormDialog.tsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  InvoiceResponseDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from "@/api/core/billing";
import billingApi from "@/api/core/billing";
import { useInvoiceFormData } from "../hooks/useInvoiceFormData";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import ClientSelect from "@/components/Selects/Client";
import { showToast } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";

interface InvoiceFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  invoiceId: number | null;
  initialData: Partial<InvoiceResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Zod validation schema
const invoiceSchema = z.object({
  clientId: z.number().min(1, "Client is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().optional(),
  subtotal: z.number().min(0, "Subtotal must be ≥ 0"),
  tax: z.number().min(0, "Tax must be ≥ 0").optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof invoiceSchema>;

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({
  isOpen,
  mode,
  invoiceId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    clients,
    loading: loadingClients,
    error: clientsError,
  } = useInvoiceFormData();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: 0,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      subtotal: 0,
      tax: 0,
      notes: "",
    },
  });

  // Auto-calculate total display (not stored in form, just for preview)
  const subtotal = watch("subtotal") || 0;
  const tax = watch("tax") || 0;
  const total = subtotal + tax;

  // Populate form when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      setValue("clientId", initialData.clientId || 0);
      if (initialData.issueDate) {
        setValue("issueDate", initialData.issueDate.slice(0, 10));
      }
      if (initialData.dueDate) {
        setValue("dueDate", initialData.dueDate.slice(0, 10));
      }
      setValue("subtotal", initialData.subtotal || 0);
      setValue("tax", initialData.tax || 0);
      setValue("notes", initialData.notes || "");
    } else {
      reset({
        clientId: 0,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: "",
        subtotal: 0,
        tax: 0,
        notes: "",
      });
    }
  }, [initialData, mode, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (mode === "add") {
      try {
        const createData: CreateInvoiceDto = {
          clientId: data.clientId,
          issueDate: new Date(data.issueDate).toISOString(),
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString()
            : undefined,
          subtotal: data.subtotal,
          tax: data.tax || 0,
          notes: data.notes || undefined,
        };
        await billingApi.createInvoice(createData);
        showToast("Invoice created successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to create invoice");
      }
    } else if (mode === "edit" && invoiceId) {
      try {
        const updateData: UpdateInvoiceDto = {
          issueDate: data.issueDate
            ? new Date(data.issueDate).toISOString()
            : undefined,
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString()
            : undefined,
          subtotal: data.subtotal,
          tax: data.tax,
          notes: data.notes,
        };
        await billingApi.updateInvoice(invoiceId, updateData);
        showToast("Invoice updated successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to update invoice");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose
      onClose={onClose}
      title={mode === "add" ? "Create Invoice" : "Edit Invoice"}
      size="lg"
    >
      {clientsError ? (
        <div className="p-4 text-red-500">
          Error loading data: {clientsError}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Client Select */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Client *
            </label>
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <ClientSelect
                  value={field.value === 0 ? null : field.value}
                  onChange={(val) => field.onChange(val ?? 0)}
                  disabled={mode === "edit"} // client cannot be changed after creation? optional
                />
              )}
            />
            {errors.clientId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.clientId.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Issue Date */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Issue Date *
              </label>
              <input
                type="date"
                {...register("issueDate")}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              />
              {errors.issueDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.issueDate.message}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Due Date (optional)
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Subtotal */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Subtotal (₱)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("subtotal", { valueAsNumber: true })}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              />
              {errors.subtotal && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.subtotal.message}
                </p>
              )}
            </div>

            {/* Tax */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Tax (₱)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("tax", { valueAsNumber: true })}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              />
              {errors.tax && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.tax.message}
                </p>
              )}
            </div>
          </div>

          {/* Calculated Total (read-only) */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-lg">₱{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Notes
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              placeholder="Payment terms, additional info..."
            />
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
                  ? "Create Invoice"
                  : "Update Invoice"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default InvoiceFormDialog;
