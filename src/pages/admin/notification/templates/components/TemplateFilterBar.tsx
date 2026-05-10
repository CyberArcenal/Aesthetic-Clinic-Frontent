// src/pages/notifications/templates/components/TemplateFilterBar.tsx
import React from "react";
import type { TemplateFilters } from "../hooks/useTemplates";

interface TemplateFilterBarProps {
  filters: TemplateFilters;
  onFilterChange: (key: keyof TemplateFilters, value: string) => void;
  onReset: () => void;
}

const TemplateFilterBar: React.FC<TemplateFilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 compact-card rounded-md border p-3" style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}>
      <div>
        <label className="block text-sm font-medium mb-1">Search</label>
        <input type="text" placeholder="Name or subject..." value={filters.search} onChange={(e) => onFilterChange("search", e.target.value)} className="compact-input w-full border rounded-md px-3 py-2" />
      </div>
      <div className="flex items-end">
        <button onClick={onReset} className="compact-button w-full md:w-auto px-4 py-2 rounded-md" style={{ backgroundColor: "var(--primary-color)", color: "var(--sidebar-text)" }}>Reset Filters</button>
      </div>
    </div>
  );
};

export default TemplateFilterBar;