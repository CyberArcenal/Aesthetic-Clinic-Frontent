// src/pages/payments/components/PaymentFilterBar.tsx
import React from "react";
import type { PaymentFilters } from "../hooks/usePayments";

interface PaymentFilterBarProps {
  filters: PaymentFilters;
  onFilterChange: (key: keyof PaymentFilters, value: string) => void;
  onReset: () => void;
}

const methodOptions = [
  { value: "", label: "All" },
  { value: "Cash", label: "Cash" },
  { value: "CreditCard", label: "Credit Card" },
  { value: "DebitCard", label: "Debit Card" },
  { value: "GCash", label: "GCash" },
  { value: "BankTransfer", label: "Bank Transfer" },
];

const PaymentFilterBar: React.FC<PaymentFilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 compact-card rounded-md border p-3"
      style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}
    >
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Invoice #
        </label>
        <input
          type="text"
          placeholder="Search invoice number..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Payment Method
        </label>
        <select
          value={filters.method}
          onChange={(e) => onFilterChange("method", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        >
          {methodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          From Date
        </label>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => onFilterChange("fromDate", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          To Date
        </label>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => onFilterChange("toDate", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
      </div>
      <div className="md:col-span-4 flex justify-end">
        <button
          onClick={onReset}
          className="compact-button w-full md:w-auto px-4 py-2 rounded-md transition-colors"
          style={{ backgroundColor: "var(--primary-color)", color: "var(--sidebar-text)" }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default PaymentFilterBar;