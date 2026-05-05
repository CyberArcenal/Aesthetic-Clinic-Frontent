// src/pages/appointments/components/AppointmentTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import type { AppointmentResponseDto } from "../../../api/core/appointment";
import { formatDateTime } from "../../../utils/formatters";

interface AppointmentTableProps {
  appointments: AppointmentResponseDto[];
  selectedAppointments: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof AppointmentResponseDto) => void;
  sortConfig: { key: keyof AppointmentResponseDto; direction: "asc" | "desc" };
  onView: (appointment: AppointmentResponseDto) => void;
  onEdit: (appointment: AppointmentResponseDto) => void;
  onDelete: (appointment: AppointmentResponseDto) => void;
  onStatusChange?: (id: number, newStatus: string) => void;
}

const statusColors: Record<string, string> = {
  Scheduled: "bg-[var(--accent-blue)] text-white",
  Confirmed: "bg-[var(--accent-green)] text-white",
  Completed: "bg-[var(--accent-emerald)] text-white",
  Cancelled: "bg-[var(--accent-red)] text-white",
  NoShow: "bg-[var(--accent-orange)] text-white",
};

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  selectedAppointments,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
}) => {
  const getSortIcon = (key: keyof AppointmentResponseDto) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="icon-sm" /> : <ChevronDown className="icon-sm" />;
  };

  return (
    <div className="overflow-x-auto rounded-md border compact-table" style={{ borderColor: "var(--border-color)" }}>
      <table className="min-w-full">
        <thead style={{ backgroundColor: "var(--card-secondary-bg)" }}>
          <tr>
            <th className="w-10 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">
              <input type="checkbox" checked={appointments.length > 0 && selectedAppointments.length === appointments.length} onChange={onToggleSelectAll} className="h-3 w-3 rounded" />
            </th>
            <th onClick={() => onSort("clientName")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Client {getSortIcon("clientName")}</div>
            </th>
            <th onClick={() => onSort("treatmentName")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Treatment {getSortIcon("treatmentName")}</div>
            </th>
            <th onClick={() => onSort("appointmentDateTime")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Date & Time {getSortIcon("appointmentDateTime")}</div>
            </th>
            <th onClick={() => onSort("status")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Status {getSortIcon("status")}</div>
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {appointments.map((apt) => (
            <tr key={apt.id} onClick={() => onView(apt)} className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td className="px-2 py-2 whitespace-nowrap">
                <input type="checkbox" checked={selectedAppointments.includes(apt.id)} onClick={(e) => e.stopPropagation()} onChange={() => onToggleSelect(apt.id)} className="h-3 w-3 rounded" />
               </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>{apt.clientName || `Client #${apt.clientId}`}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>{apt.treatmentName || `Treatment #${apt.treatmentId}`}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>{formatDateTime(apt.appointmentDateTime, true)}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[apt.status || "Scheduled"] || "bg-gray-200 text-gray-800"}`}>
                  {apt.status || "Scheduled"}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onView(apt); }} className="p-1 hover:bg-[var(--card-hover-bg)] rounded" title="View">
                    <Eye className="w-4 h-4 text-[var(--accent-blue)]" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(apt); }} className="p-1 hover:bg-[var(--card-hover-bg)] rounded" title="Edit">
                    <Edit className="w-4 h-4 text-[var(--accent-yellow)]" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(apt); }} className="p-1 hover:bg-[var(--card-hover-bg)] rounded" title="Delete">
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

export default AppointmentTable;