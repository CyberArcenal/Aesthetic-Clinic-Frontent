// src/pages/staff/components/StaffFilterBar.tsx
import React from "react";
import type { StaffFilters } from "../hooks/useStaff";

interface StaffFilterBarProps {
  filters: StaffFilters;
  onFilterChange: (key: keyof StaffFilters, value: any) => void;
  onReset: () => void;
  positions: string[];
}

const StaffFilterBar: React.FC<StaffFilterBarProps> = ({ filters, onFilterChange, onReset, positions }) => {
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
          placeholder="Name, email, position..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Position
        </label>
        <select
          value={filters.position}
          onChange={(e) => onFilterChange("position", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        >
          <option value="">All Positions</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
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

export default StaffFilterBar;