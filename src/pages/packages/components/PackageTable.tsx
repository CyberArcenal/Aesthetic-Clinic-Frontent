// src/pages/packages/components/PackageTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { PackageDto } from "@/api/core/package";
import { formatCurrency } from "@/utils/formatters";

interface PackageTableProps {
  packages: PackageDto[];
  selectedPackages: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof PackageDto) => void;
  sortConfig: { key: keyof PackageDto; direction: "asc" | "desc" };
  onView: (pkg: PackageDto) => void;
  onEdit: (pkg: PackageDto) => void;
  onDelete: (pkg: PackageDto) => void;
  onToggleActive: (id: number) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  selectedPackages,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const getSortIcon = (key: keyof PackageDto) => {
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
                checked={packages.length > 0 && selectedPackages.length === packages.length}
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded"
              />
            </th>
            <th onClick={() => onSort("name")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Package {getSortIcon("name")}</div>
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Treatments</th>
            <th onClick={() => onSort("totalPrice")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Total Value {getSortIcon("totalPrice")}</div>
            </th>
            <th onClick={() => onSort("discountedPrice")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Package Price {getSortIcon("discountedPrice")}</div>
            </th>
            <th onClick={() => onSort("savings")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Savings {getSortIcon("savings")}</div>
            </th>
            <th onClick={() => onSort("isActive")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Status {getSortIcon("isActive")}</div>
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {packages.map((pkg) => (
            <tr
              key={pkg.id}
              onClick={() => onView(pkg)}
              className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedPackages.includes(pkg.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(pkg.id)}
                  className="h-3 w-3 rounded"
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {pkg.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {pkg.treatments.map((t) => t.name).join(", ")}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatCurrency(pkg.totalPrice)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--accent-green)" }}>
                {formatCurrency(pkg.discountedPrice)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--accent-orange)" }}>
                {formatCurrency(pkg.savings)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(pkg.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                  style={{
                    backgroundColor: pkg.isActive ? "var(--accent-green-light)" : "var(--card-secondary-bg)",
                    color: pkg.isActive ? "var(--accent-green)" : "var(--text-secondary)",
                  }}
                >
                  {pkg.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                  {pkg.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(pkg);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-[var(--accent-blue)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(pkg);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-[var(--accent-yellow)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(pkg);
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

export default PackageTable;