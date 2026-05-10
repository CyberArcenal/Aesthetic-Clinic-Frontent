// src/pages/treatments/components/TreatmentTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { TreatmentResponseDto } from "@/api/core/treatment";
import { formatCurrency } from "@/utils/formatters";


interface TreatmentTableProps {
  treatments: TreatmentResponseDto[];
  selectedTreatments: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof TreatmentResponseDto) => void;
  sortConfig: { key: keyof TreatmentResponseDto; direction: "asc" | "desc" };
  onView: (treatment: TreatmentResponseDto) => void;
  onEdit: (treatment: TreatmentResponseDto) => void;
  onDelete: (treatment: TreatmentResponseDto) => void;
  onToggleActive: (id: number) => void;
}

const TreatmentTable: React.FC<TreatmentTableProps> = ({
  treatments,
  selectedTreatments,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const getSortIcon = (key: keyof TreatmentResponseDto) => {
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
                checked={treatments.length > 0 && selectedTreatments.length === treatments.length}
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded"
              />
            </th>
            <th onClick={() => onSort("name")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Treatment {getSortIcon("name")}</div>
            </th>
            <th onClick={() => onSort("category")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Category {getSortIcon("category")}</div>
            </th>
            <th onClick={() => onSort("durationMinutes")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Duration {getSortIcon("durationMinutes")}</div>
            </th>
            <th onClick={() => onSort("price")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Price {getSortIcon("price")}</div>
            </th>
            <th onClick={() => onSort("isActive")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Status {getSortIcon("isActive")}</div>
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {treatments.map((t) => (
            <tr
              key={t.id}
              onClick={() => onView(t)}
              className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedTreatments.includes(t.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(t.id)}
                  className="h-3 w-3 rounded"
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {t.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {t.category || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {t.durationMinutes} min
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--accent-green)" }}>
                {formatCurrency(t.price)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(t.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                  style={{
                    backgroundColor: t.isActive ? "var(--accent-green-light)" : "var(--card-secondary-bg)",
                    color: t.isActive ? "var(--accent-green)" : "var(--text-secondary)",
                  }}
                >
                  {t.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                  {t.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(t);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-[var(--accent-blue)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(t);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-[var(--accent-yellow)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(t);
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

export default TreatmentTable;