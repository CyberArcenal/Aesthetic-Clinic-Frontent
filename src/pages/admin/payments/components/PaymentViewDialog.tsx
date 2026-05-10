// src/pages/payments/components/PaymentViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import type { PaymentResponseDto } from "@/api/core/billing";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { CreditCard, Receipt, Calendar, Banknote, Hash, FileText, Edit, Trash2 } from "lucide-react";

interface PaymentViewDialogProps {
  payment: PaymentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (payment: PaymentResponseDto) => void;
  onDelete?: (payment: PaymentResponseDto) => void;
}

const methodColors: Record<string, string> = {
  Cash: "bg-green-100 text-green-800",
  "Credit Card": "bg-blue-100 text-blue-800",
  "Debit Card": "bg-blue-100 text-blue-800",
  "Bank Transfer": "bg-purple-100 text-purple-800",
  GCash: "bg-indigo-100 text-indigo-800",
  PayPal: "bg-sky-100 text-sky-800",
  Check: "bg-gray-100 text-gray-800",
};

const PaymentViewDialog: React.FC<PaymentViewDialogProps> = ({
  payment,
  loading,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!payment) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="md">
        <div className="text-center py-8 text-[var(--text-secondary)]">No payment data</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <CreditCard className="w-6 h-6 text-[var(--primary-color)] mt-0.5" />
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Payment ID</div>
            <div className="font-mono text-sm">#{payment.id}</div>
          </div>
        </div>

        {/* Invoice Number */}
        <div className="flex items-start gap-3">
          <Receipt className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Invoice</div>
            <div className="font-medium">{payment.invoiceNumber || `#${payment.invoiceId}`}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <div className="flex items-start gap-3">
            <Banknote className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Amount</div>
              <div className="text-xl font-bold text-[var(--primary-color)]">{formatCurrency(payment.amount)}</div>
            </div>
          </div>

          {/* Payment Date */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Payment Date</div>
              <div className="font-medium">{formatDateTime(payment.paymentDate)}</div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-start gap-3">
          <div className="w-5 h-5" /> {/* spacer for alignment */}
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Method</div>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${methodColors[payment.method || ""] || "bg-gray-100 text-gray-800"}`}>
              {payment.method || "Unknown"}
            </span>
          </div>
        </div>

        {/* Reference Number */}
        {payment.referenceNumber && (
          <div className="flex items-start gap-3">
            <Hash className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Reference Number</div>
              <div className="font-mono text-sm">{payment.referenceNumber}</div>
            </div>
          </div>
        )}

        {/* Notes */}
        {payment.notes && (
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div className="flex-1">
              <div className="text-xs text-[var(--text-secondary)]">Notes</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{payment.notes}</div>
            </div>
          </div>
        )}

        {/* Meta info */}
        <div className="text-xs text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-color)]">
          Recorded: {formatDateTime(payment.createdAt)}
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-2">
            {onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(payment)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(payment)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PaymentViewDialog;