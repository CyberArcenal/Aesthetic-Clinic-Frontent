// src/pages/invoices/components/InvoiceViewDialog.tsx
import React from "react";
import type { InvoiceResponseDto } from "../../../api/core/billing";
import Modal from "../../../components/UI/Modal";
import { formatCurrency, formatDate } from "../../../utils/formatters";


interface InvoiceViewDialogProps {
  invoice: InvoiceResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceViewDialog: React.FC<InvoiceViewDialogProps> = ({ invoice, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : invoice ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Invoice #</div>
              <div className="text-sm font-medium">{invoice.invoiceNumber}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Client</div>
              <div className="text-sm">{invoice.clientName || `ID ${invoice.clientId}`}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Issue Date</div>
              <div className="text-sm">{formatDate(invoice.issueDate)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Due Date</div>
              <div className="text-sm">{invoice.dueDate ? formatDate(invoice.dueDate) : "-"}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Subtotal</div>
              <div className="text-sm">{formatCurrency(invoice.subtotal)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Tax</div>
              <div className="text-sm">{formatCurrency(invoice.tax)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Total</div>
              <div className="text-sm font-medium">{formatCurrency(invoice.total)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Amount Paid</div>
              <div className="text-sm">{formatCurrency(invoice.amountPaid)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Balance Due</div>
              <div className="text-sm">{formatCurrency(invoice.balanceDue)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Status</div>
              <div className="text-sm">{invoice.status}</div>
            </div>
          </div>
          {invoice.notes && (
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Notes</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{invoice.notes}</div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No invoice data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default InvoiceViewDialog;