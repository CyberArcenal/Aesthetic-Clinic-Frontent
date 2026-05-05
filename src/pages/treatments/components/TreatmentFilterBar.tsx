// src/pages/treatments/components/TreatmentFilterBar.tsx
import React from "react";
import type { TreatmentFilters } from "../hooks/useTreatments";

interface TreatmentFilterBarProps {
  filters: TreatmentFilters;
  onFilterChange: (key: keyof TreatmentFilters, value: any) => void;
  onReset: () => void;
  categories: string[];
}

const TreatmentFilterBar: React.FC<TreatmentFilterBarProps> = ({ filters, onFilterChange, onReset, categories }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 compact-card rounded-md border p-3"
      style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}
    >
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Search
        </label>
        <input
          type="text"
          placeholder="Treatment name..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Status
        </label>
        <select
          value={filters.activeOnly ? "active" : "all"}
          onChange={(e) => onFilterChange("activeOnly", e.target.value === "active")}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        >
          <option value="all">All</option>
          <option value="active">Active Only</option>
        </select>
      </div>
      <div className="flex items-end">
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

export default TreatmentFilterBar;