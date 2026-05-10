// src/pages/invoices/components/InvoiceViewDialog.tsx
import React from "react";
import type { InvoiceResponseDto } from "@/api/core/billing";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatters";
import {
  Receipt,
  User,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";

interface InvoiceViewDialogProps {
  invoice: InvoiceResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (invoice: InvoiceResponseDto) => void;
  onDelete?: (invoice: InvoiceResponseDto) => void;
}

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Unpaid: "bg-red-100 text-red-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-orange-100 text-orange-800",
  Cancelled: "bg-gray-100 text-gray-800",
  Refunded: "bg-purple-100 text-purple-800",
};

const InvoiceViewDialog: React.FC<InvoiceViewDialogProps> = ({
  invoice,
  loading,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details" size="lg">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!invoice) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details" size="lg">
        <div className="text-center py-8 text-[var(--text-secondary)]">No invoice data</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details" size="lg">
      <div className="space-y-4">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Invoice Number</div>
            <div className="text-xl font-bold text-[var(--primary-color)]">{invoice.invoiceNumber}</div>
          </div>
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[invoice.status || "Pending"]}`}>
            {invoice.status || "Pending"}
          </span>
        </div>

        {/* Two-column info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Client</div>
              <div className="font-medium">{invoice.clientName || `Client #${invoice.clientId}`}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Receipt className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Appointment</div>
              <div className="font-medium">{invoice.appointmentId ? `#${invoice.appointmentId}` : "N/A"}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Issue Date</div>
              <div className="font-medium">{formatDate(invoice.issueDate)}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Due Date</div>
              <div className="font-medium">{invoice.dueDate ? formatDate(invoice.dueDate) : "Not set"}</div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-[var(--card-secondary-bg)] rounded-md p-4 space-y-2">
          <h4 className="font-medium text-sm text-[var(--sidebar-text)] flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Financial Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Subtotal</div>
              <div className="font-semibold">{formatCurrency(invoice.subtotal)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Tax</div>
              <div className="font-semibold">{formatCurrency(invoice.tax)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Total</div>
              <div className="font-semibold text-lg">{formatCurrency(invoice.total)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Amount Paid</div>
              <div className="text-green-600 font-medium">{formatCurrency(invoice.amountPaid)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Balance Due</div>
              <div className="text-red-600 font-medium">{formatCurrency(invoice.balanceDue)}</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div className="flex-1">
              <div className="text-xs text-[var(--text-secondary)]">Notes</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{invoice.notes}</div>
            </div>
          </div>
        )}

        {/* Meta info */}
        <div className="text-xs text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-color)]">
          Created: {formatDateTime(invoice.createdAt)}
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-2">
            {onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(invoice)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(invoice)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InvoiceViewDialog;