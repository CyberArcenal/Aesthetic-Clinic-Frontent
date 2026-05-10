// src/pages/users/components/UserTable.tsx
import React from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Power, PowerOff, Mail, Key, Shield } from "lucide-react";
import { UserResponseDto } from "@/api/core/user";

interface UserTableProps {
  users: UserResponseDto[];
  selectedUsers: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onSort: (key: keyof UserResponseDto) => void;
  sortConfig: { key: keyof UserResponseDto; direction: "asc" | "desc" };
  onView: (user: UserResponseDto) => void;
  onEdit: (user: UserResponseDto) => void;
  onDelete: (user: UserResponseDto) => void;
  onToggleActive: (id: number) => void;
  onResetPassword: (userId: number, email: string) => void;
  onAssignRole: (user: UserResponseDto) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onToggleSelect,
  onToggleSelectAll,
  onSort,
  sortConfig,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onResetPassword,
  onAssignRole,
}) => {
  const getSortIcon = (key: keyof UserResponseDto) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="icon-sm" /> : <ChevronDown className="icon-sm" />;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-red-100 text-red-800";
      case "Staff": return "bg-blue-100 text-blue-800";
      case "Client": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto rounded-md border compact-table" style={{ borderColor: "var(--border-color)" }}>
      <table className="min-w-full">
        <thead style={{ backgroundColor: "var(--card-secondary-bg)" }}>
          <tr>
            <th className="w-10 px-2 py-2 text-left text-xs font-medium uppercase tracking-wider">
              <input
                type="checkbox"
                checked={users.length > 0 && selectedUsers.length === users.length}
                onChange={onToggleSelectAll}
                className="h-3 w-3 rounded"
              />
            </th>
            <th onClick={() => onSort("username")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Username {getSortIcon("username")}</div>
            </th>
            <th onClick={() => onSort("fullName")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Full Name {getSortIcon("fullName")}</div>
            </th>
            <th onClick={() => onSort("email")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Email {getSortIcon("email")}</div>
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Roles</th>
            <th onClick={() => onSort("isActive")} className="px-4 py-2 text-left text-xs font-medium uppercase cursor-pointer">
              <div className="flex items-center gap-1">Status {getSortIcon("isActive")}</div>
            </th>
            <th className="px-4 py-2 text-right text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "var(--card-bg)" }}>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => onView(user)}
              className="hover:bg-[var(--card-secondary-bg)] transition-colors cursor-pointer"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td className="px-2 py-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(user.id)}
                  className="h-3 w-3 rounded"
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {user.username}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {user.fullName || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {user.email}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {user.roles?.map((role) => (
                    <span key={role} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}>
                      {role}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleActive(user.id); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs"
                  style={{
                    backgroundColor: user.isActive ? "var(--accent-green-light)" : "var(--card-secondary-bg)",
                    color: user.isActive ? "var(--accent-green)" : "var(--text-secondary)",
                  }}
                >
                  {user.isActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                  {user.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-right text-sm">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onView(user); }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-[var(--accent-blue)]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(user); }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-[var(--accent-yellow)]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAssignRole(user); }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Assign Roles"
                  >
                    <Shield className="w-4 h-4 text-[var(--accent-purple)]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onResetPassword(user.id, user.email == undefined? "": user.email); }}
                    className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                    title="Send Password Reset Email"
                  >
                    <Mail className="w-4 h-4 text-[var(--accent-orange)]" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(user); }}
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

export default UserTable;