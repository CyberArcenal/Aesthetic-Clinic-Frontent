// src/pages/payments/components/PaymentViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import type { PaymentResponseDto } from "@/api/core/billing";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface PaymentViewDialogProps {
  payment: PaymentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentViewDialog: React.FC<PaymentViewDialogProps> = ({ payment, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : payment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Invoice #</div>
              <div className="text-sm font-medium">{payment.invoiceNumber}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Amount</div>
              <div className="text-sm font-medium">{formatCurrency(payment.amount)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Payment Date</div>
              <div className="text-sm">{formatDate(payment.paymentDate)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Method</div>
              <div className="text-sm">{payment.method}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Reference Number</div>
              <div className="text-sm">{payment.referenceNumber || "-"}</div>
            </div>
          </div>
          {payment.notes && (
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Notes</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{payment.notes}</div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No payment data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default PaymentViewDialog;