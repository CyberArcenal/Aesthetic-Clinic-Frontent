// src/pages/invoices/components/FilterBar.tsx
import React from "react";
import type { InvoiceFilters } from "../hooks/useInvoices";

interface FilterBarProps {
  filters: InvoiceFilters;
  onFilterChange: (key: keyof InvoiceFilters, value: string) => void;
  onReset: () => void;
  clients?: { id: number; name: string }[]; // optional for client filter
}

const statusOptions = [
  { value: "", label: "All" },
  { value: "Draft", label: "Draft" },
  { value: "Sent", label: "Sent" },
  { value: "Paid", label: "Paid" },
  { value: "Partial", label: "Partial" },
  { value: "Overdue", label: "Overdue" },
  { value: "Cancelled", label: "Cancelled" },
];

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onReset, clients = [] }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 compact-card rounded-md border p-3"
      style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}
    >
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Search
        </label>
        <input
          type="text"
          placeholder="Invoice # or client name..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Client
        </label>
        <select
          value={filters.clientId}
          onChange={(e) => onFilterChange("clientId", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        >
          <option value="">All Clients</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id.toString()}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          From Date (Issue)
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
          To Date (Issue)
        </label>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => onFilterChange("toDate", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
      </div>
      <div className="md:col-span-5 flex justify-end">
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

export default FilterBar;