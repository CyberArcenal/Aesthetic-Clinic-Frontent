// src/pages/invoices/components/InvoiceTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import type { InvoiceResponseDto } from "../../../api/core/billing";
import { formatCurrency, formatDate } from "../../../utils/formatters";


interface InvoiceTableProps {
  invoices: InvoiceResponseDto[];
  selectedInvoices: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof InvoiceResponseDto) => void;
  sortConfig: { key: keyof InvoiceResponseDto; direction: "asc" | "desc" };
  onView: (invoice: InvoiceResponseDto) => void;
  onEdit: (invoice: InvoiceResponseDto) => void;
  onDelete: (invoice: InvoiceResponseDto) => void;
  onStatusChange?: (id: number, newStatus: string) => void;
}

const statusColors: Record<string, string> = {
  Draft: "bg-gray-200 text-gray-800",
  Sent: "bg-blue-100 text-blue-800",
  Paid: "bg-green-100 text-green-800",
  Partial: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800",
  Cancelled: "bg-red-100 text-red-800",
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  selectedInvoices,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getSortIcon = (key: keyof InvoiceResponseDto) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="icon-sm" /> : <ChevronDown className="icon-sm" />;
  };

  return (
    <div className="overflow-x-auto rounded-md border compact-table" style={{ borderColor: "var(--border-color)" }}>
      <table className="min-w-full">
        <thead style={{ backgroundColor: "var(--card-secondary-bg)" }}>
          <tr>
            <th className="w-10 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">
              <input
                type="checkbox"
                checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded"
              />
            </th>
            <th onClick={() => onSort("invoiceNumber")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Invoice # {getSortIcon("invoiceNumber")}</div>
            </th>
            <th onClick={() => onSort("clientName")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Client {getSortIcon("clientName")}</div>
            </th>
            <th onClick={() => onSort("issueDate")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Issue Date {getSortIcon("issueDate")}</div>
            </th>
            <th onClick={() => onSort("dueDate")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Due Date {getSortIcon("dueDate")}</div>
            </th>
            <th onClick={() => onSort("total")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Total {getSortIcon("total")}</div>
            </th>
            <th onClick={() => onSort("status")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Status {getSortIcon("status")}</div>
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Balance</th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              onClick={() => onView(inv)}
              className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedInvoices.includes(inv.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(inv.id)}
                  className="h-3 w-3 rounded"
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {inv.invoiceNumber}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {inv.clientName || `Client #${inv.clientId}`}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(inv.issueDate)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {inv.dueDate ? formatDate(inv.dueDate) : "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {formatCurrency(inv.total)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <select
                  value={inv.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onStatusChange?.(inv.id, e.target.value)}
                  className="text-xs px-2 py-1 rounded-md border"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    borderColor: "var(--border-color)",
                    color: "var(--sidebar-text)",
                  }}
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatCurrency(inv.balanceDue)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(inv);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-[var(--accent-blue)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(inv);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-[var(--accent-yellow)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(inv);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--accent-red)]" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;