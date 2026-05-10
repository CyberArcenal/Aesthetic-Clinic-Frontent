// src/pages/treatments/categories/components/CategoryFilterBar.tsx
import React from "react";
import type { CategoryFilters } from "../hooks/useCategories";

interface CategoryFilterBarProps {
  filters: CategoryFilters;
  onFilterChange: (key: keyof CategoryFilters, value: string) => void;
  onReset: () => void;
}

const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 compact-card rounded-md border p-3"
      style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}
    >
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
          Search
        </label>
        <input
          type="text"
          placeholder="Category name..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
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

export default CategoryFilterBar;