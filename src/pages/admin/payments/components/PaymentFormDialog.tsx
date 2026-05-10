// src/pages/payments/components/PaymentFormDialog.tsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import billingApi, { CreatePaymentDto } from "@/api/core/billing";
import { usePaymentFormData } from "../hooks/usePaymentFormData";
import type { PaymentResponseDto } from "@/api/core/billing";

interface PaymentFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  paymentId: number | null;
  initialData: Partial<PaymentResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Payment methods
const paymentMethods = [
  { value: "Cash", label: "Cash" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "GCash", label: "GCash" },
  { value: "PayPal", label: "PayPal" },
  { value: "Check", label: "Check" },
];

// Zod schema
const paymentSchema = z.object({
  invoiceId: z.number().min(1, "Invoice is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
  method: z.string().min(1, "Payment method is required"),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof paymentSchema>;

const PaymentFormDialog: React.FC<PaymentFormDialogProps> = ({
  isOpen,
  mode,
  paymentId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    invoices,
    loading: loadingInvoices,
    error: invoicesError,
  } = usePaymentFormData();
  const [selectedInvoiceBalance, setSelectedInvoiceBalance] =
    React.useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: 0,
      amount: 0,
      paymentDate: new Date().toISOString().slice(0, 10),
      method: "",
      referenceNumber: "",
      notes: "",
    },
  });

  const selectedInvoiceId = watch("invoiceId");
  const enteredAmount = watch("amount") || 0;

  // Update balance when invoice changes
  useEffect(() => {
    if (selectedInvoiceId && invoices.length) {
      const invoice = invoices.find((inv) => inv.id === selectedInvoiceId);
      setSelectedInvoiceBalance(invoice?.balanceDue || 0);
      // Optionally, auto-set amount to balance due? We'll let user decide, but we can set a default?
      // Not auto-setting to avoid accidental overcharge.
    } else {
      setSelectedInvoiceBalance(0);
    }
  }, [selectedInvoiceId, invoices]);

  // Populate form when editing (though payments are rarely edited, we support it)
  useEffect(() => {
    if (initialData && mode === "edit") {
      setValue("invoiceId", initialData.invoiceId || 0);
      setValue("amount", initialData.amount || 0);
      if (initialData.paymentDate) {
        setValue("paymentDate", initialData.paymentDate.slice(0, 10));
      }
      setValue("method", initialData.method || "");
      setValue("referenceNumber", initialData.referenceNumber || "");
      setValue("notes", initialData.notes || "");
    } else {
      reset({
        invoiceId: 0,
        amount: 0,
        paymentDate: new Date().toISOString().slice(0, 10),
        method: "",
        referenceNumber: "",
        notes: "",
      });
      setSelectedInvoiceBalance(0);
    }
  }, [initialData, mode, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    // Validate amount does not exceed balance due
    if (data.amount > selectedInvoiceBalance) {
      dialogs.error(
        `Payment amount cannot exceed the outstanding balance (₱${selectedInvoiceBalance.toFixed(2)})`,
      );
      return;
    }

    if (mode === "add") {
      try {
        const createData: CreatePaymentDto = {
          invoiceId: data.invoiceId,
          amount: data.amount,
          paymentDate: new Date(data.paymentDate).toISOString(),
          method: data.method,
          referenceNumber: data.referenceNumber || undefined,
          notes: data.notes || undefined,
        };
        await billingApi.createPayment(createData);
        showToast("Payment recorded successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to record payment");
      }
    } else if (mode === "edit" && paymentId) {
      // Note: API might not support updating payments; if it does, we'll implement. For now, show not supported.
      dialogs.info(
        "Editing payments is not supported. Please delete and re-enter if needed.",
      );
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose
      onClose={onClose}
      title={mode === "add" ? "Record Payment" : "Edit Payment"}
      size="lg"
    >
      {invoicesError ? (
        <div className="p-4 text-red-500">
          Error loading invoices: {invoicesError}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Invoice Select */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Invoice *
            </label>
            <select
              {...register("invoiceId", { valueAsNumber: true })}
              disabled={loadingInvoices || mode === "edit"}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <option value={0}>Select an invoice</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.clientName} (Due: ₱
                  {inv.balanceDue.toFixed(2)})
                </option>
              ))}
            </select>
            {errors.invoiceId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.invoiceId.message}
              </p>
            )}
            {selectedInvoiceBalance > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Outstanding balance: ₱{selectedInvoiceBalance.toFixed(2)}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Payment Amount (₱) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Payment Date */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Payment Date *
              </label>
              <input
                type="date"
                {...register("paymentDate")}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              />
              {errors.paymentDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.paymentDate.message}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--sidebar-text)" }}
              >
                Payment Method *
              </label>
              <select
                {...register("method")}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--border-color)",
                }}
              >
                <option value="">Select method</option>
                {paymentMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              {errors.method && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.method.message}
                </p>
              )}
            </div>
          </div>

          {/* Reference Number (optional) */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--sidebar-text)" }}
            >
              Reference Number (optional)
            </label>
            <input
              type="text"
              {...register("referenceNumber")}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              placeholder="Check #, Transaction ID, etc."
            />
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
              rows={2}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
              placeholder="Additional information..."
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
                  ? "Record Payment"
                  : "Update Payment"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default PaymentFormDialog;
