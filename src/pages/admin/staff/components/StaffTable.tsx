// src/pages/staff/components/StaffTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { StaffResponseDto } from "@/api/core/staff";

interface StaffTableProps {
  staff: StaffResponseDto[];
  selectedStaff: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof StaffResponseDto) => void;
  sortConfig: { key: keyof StaffResponseDto; direction: "asc" | "desc" };
  onView: (staff: StaffResponseDto) => void;
  onEdit: (staff: StaffResponseDto) => void;
  onDelete: (staff: StaffResponseDto) => void;
  onToggleActive: (id: number) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
  staff,
  selectedStaff,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const getSortIcon = (key: keyof StaffResponseDto) => {
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
                checked={staff.length > 0 && selectedStaff.length === staff.length}
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded"
              />
            </th>
            <th onClick={() => onSort("name")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Name {getSortIcon("name")}</div>
            </th>
            <th onClick={() => onSort("position")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Position {getSortIcon("position")}</div>
            </th>
            <th onClick={() => onSort("email")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Email {getSortIcon("email")}</div>
            </th>
            <th onClick={() => onSort("phone")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Phone {getSortIcon("phone")}</div>
            </th>
            <th onClick={() => onSort("isActive")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Status {getSortIcon("isActive")}</div>
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {staff.map((s) => (
            <tr
              key={s.id}
              onClick={() => onView(s)}
              className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedStaff.includes(s.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(s.id)}
                  className="h-3 w-3 rounded"
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {s.name}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {s.position || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {s.email || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {s.phone || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(s.id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                  style={{
                    backgroundColor: s.isActive ? "var(--accent-green-light)" : "var(--card-secondary-bg)",
                    color: s.isActive ? "var(--accent-green)" : "var(--text-secondary)",
                  }}
                >
                  {s.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                  {s.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(s);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-[var(--accent-blue)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(s);
                    }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-[var(--accent-yellow)]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(s);
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

export default StaffTable;