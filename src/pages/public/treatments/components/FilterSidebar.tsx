// src/pages/public/treatments/components/FilterSidebar.tsx
import React from "react";
import { Search, X } from "lucide-react";

interface FilterSidebarProps {
  search: string;
  category: string;
  categories: string[];
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onReset: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  search,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Search size={18} /> Filters
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Treatment name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[var(--primary-color)]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {(search || category) && (
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-red-500 mt-2"
          >
            <X size={14} /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;