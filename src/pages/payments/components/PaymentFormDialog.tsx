// src/pages/payments/components/PaymentFormDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import type { PaymentResponseDto } from "@/api/core/billing";

interface PaymentFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  paymentId: number | null;
  initialData: Partial<PaymentResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentFormDialog: React.FC<PaymentFormDialogProps> = ({ isOpen, mode, onClose, onSuccess }) => {
  // Placeholder – full form will be added later
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Record Payment" : "Edit Payment"} size="md">
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">Payment form will be implemented here.</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-2">(Coming soon)</p>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={onClose}>
          Save (placeholder)
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentFormDialog;