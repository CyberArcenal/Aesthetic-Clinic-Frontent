// src/pages/invoices/components/InvoiceFormDialog.tsx
import React from "react";
import type { InvoiceResponseDto } from "../../../api/core/billing";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";

interface InvoiceFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  invoiceId: number | null;
  initialData: Partial<InvoiceResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({ isOpen, mode, onClose, onSuccess }) => {
  // Placeholder – full form will be added later
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Create Invoice" : "Edit Invoice"} size="md">
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">Invoice form will be implemented here.</p>
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

export default InvoiceFormDialog;