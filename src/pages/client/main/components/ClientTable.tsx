// src/pages/clients/components/ClientTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ClientResponseDto } from "../../../../api/core/client";
import { formatDate } from "../../../../utils/formatters";

interface ClientTableProps {
  clients: ClientResponseDto[];
  selectedClients: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof ClientResponseDto) => void;
  sortConfig: { key: keyof ClientResponseDto; direction: "asc" | "desc" };
  onView: (client: ClientResponseDto) => void;
  onEdit: (client: ClientResponseDto) => void;
  onDelete: (client: ClientResponseDto) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  selectedClients,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const getSortIcon = (key: keyof ClientResponseDto) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="icon-sm" /> : <ChevronDown className="icon-sm" />;
  };

  return (
    <div className="overflow-x-auto rounded-md border compact-table" style={{ borderColor: "var(--border-color)" }}>
      <table className="min-w-full" style={{ borderColor: "var(--border-color)" }}>
        <thead style={{ backgroundColor: "var(--card-secondary-bg)" }}>
          <tr>
            <th className="w-10 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              <input
                type="checkbox"
                checked={clients.length > 0 && selectedClients.length === clients.length}
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded border-gray-300"
                style={{ color: "var(--accent-blue)" }}
              />
            </th>
            <th onClick={() => onSort("fullName")} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">
              <div className="flex items-center gap-1">Name {getSortIcon("fullName")}</div>
            </th>
            <th onClick={() => onSort("email")} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">
              <div className="flex items-center gap-1">Email {getSortIcon("email")}</div>
            </th>
            <th onClick={() => onSort("phoneNumber")} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">
              <div className="flex items-center gap-1">Phone {getSortIcon("phoneNumber")}</div>
            </th>
            <th onClick={() => onSort("createdAt")} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer">
              <div className="flex items-center gap-1">Registered {getSortIcon("createdAt")}</div>
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {clients.map((client) => (
            <tr
              key={client.id}
              onClick={() => onView(client)}
              className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedClients.includes(client.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(client.id)}
                  className="h-3 w-3 rounded border-gray-300"
                  style={{ color: "var(--accent-blue)" }}
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {client.fullName || `${client.firstName} ${client.lastName}`}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {client.email}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {client.phoneNumber || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {formatDate(client.createdAt)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onView(client); }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-[var(--accent-blue)]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(client); }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-[var(--accent-yellow)]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(client); }}
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

export default ClientTable;