// src/pages/users/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, Users } from "lucide-react";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";

import useUsers from "./hooks/useUsers";
import useUserForm from "./hooks/useUserForm";
import useRoleAssignment from "./hooks/useRoleAssignment";
import useResetPassword from "./hooks/useResetPassword";
import UserFilterBar from "./components/UserFilterBar";
import UserTable from "./components/UserTable";
import UserViewDialog from "./components/UserViewDialog";
import UserFormDialog from "./components/UserFormDialog";
import RoleAssignmentModal from "./components/RoleAssignmentModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import useUserView from "./hooks/useUserView";
import userApi from "@/api/core/user";
import { dialogs } from "@/utils/dialogs";
import Pagination from "@/components/Shared/Pagination";

const UsersPage: React.FC = () => {
  const {
    paginatedUsers,
    users,
    filters,
    loading,
    error,
    pagination,
    selectedUsers,
    setSelectedUsers,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleUserSelection,
    toggleSelectAll,
    handleSort,
    rolesList,
  } = useUsers();

  const formDialog = useUserForm();
  const viewDialog = useUserView();
  const roleAssign = useRoleAssignment();
  const resetPwd = useResetPassword();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleToggleActive = async (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = !user.isActive;
    const confirmed = await dialogs.confirm({
      title: newStatus ? "Activate User" : "Deactivate User",
      message: `Are you sure you want to ${newStatus ? "activate" : "deactivate"} ${user.username}?`,
    });
    if (!confirmed) return;
    showLoading("Updating status...");
    try {
      const res = await userApi.activateUser(id, newStatus);
      if (res.success) {
        showToast(`User ${newStatus ? "activated" : "deactivated"}`, "success");
        reload();
      } else {
        throw new Error(res.message as string);
      }
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleDelete = async (user: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete User",
      message: `Delete user "${user.username}"? This action cannot be undone.`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await userApi.deleteUser(user.id);
      showToast("User deleted", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedUsers.length} users?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await Promise.all(selectedUsers.map((id) => userApi.deleteUser(id)));
      showToast(`${selectedUsers.length} users deleted`, "success");
      setSelectedUsers([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (users.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Users",
      message: `Export ${pagination.totalCount} users to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
    try {
      const headers = [
        "ID",
        "Username",
        "Full Name",
        "Email",
        "Roles",
        "Active",
        "Created At",
      ];
      const rows = users.map((u) => [
        u.id,
        u.username,
        u.fullName || "",
        u.email,
        u.roles?.join(";") || "",
        u.isActive ? "Yes" : "No",
        new Date(u.createdAt).toLocaleDateString(),
      ]);
      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_${new Date().toISOString().slice(0, 19)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Export completed", "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      setExportLoading(false);
      hideLoading();
    }
  };

  const getDisplayRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, pagination.totalCount);
    return { start, end };
  };
  const { start, end } = getDisplayRange();

  return (
    <div
      className="compact-card rounded-md shadow-md border"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 p-4">
        <div>
          <h2
            className="text-base font-semibold flex items-center gap-2"
            style={{ color: "var(--sidebar-text)" }}
          >
            <Users className="w-5 h-5" />
            User Management
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage system users and their roles
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="compact-button rounded-md flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: "var(--card-secondary-bg)",
              color: "var(--sidebar-text)",
            }}
          >
            <Filter className="icon-sm" /> Filters {showFilters ? "↑" : "↓"}
          </button>
          <button
            onClick={reload}
            disabled={loading}
            className="btn btn-secondary btn-sm rounded-md flex items-center gap-1"
          >
            <RefreshCw className={`icon-sm ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <Button
            onClick={handleExportCSV}
            disabled={exportLoading || users.length === 0}
            className="compact-button rounded-md flex items-center gap-1"
          >
            <Download className="icon-xs" />{" "}
            {exportLoading ? "..." : "Export CSV"}
          </Button>
          <Button
            onClick={formDialog.openAdd}
            variant="success"
            size="sm"
            icon={Plus}
            iconPosition="left"
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {users.length > 0 && (
        <div
          className="mx-4 mb-4 compact-card rounded-md border p-3 flex flex-wrap items-center justify-between"
          style={{
            backgroundColor: "var(--card-secondary-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></span>
            Total: {pagination.totalCount}
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Showing {start} to {end} of {pagination.totalCount} users
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <UserFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          roles={rolesList}
        />
      )}

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div
          className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between"
          style={{
            backgroundColor: "var(--accent-blue-light)",
            borderColor: "var(--accent-blue)",
          }}
        >
          <span className="font-medium text-sm">
            {selectedUsers.length} user(s) selected
          </span>
          <button
            className="compact-button bg-[var(--accent-red)] text-white rounded-md"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Table / Loading / Error */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : (
        <>
          <UserTable
            users={paginatedUsers}
            selectedUsers={selectedUsers}
            onToggleSelect={toggleUserSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(user) => viewDialog.open(user.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onResetPassword={(userId, email) => resetPwd.open(userId, email)}
            onAssignRole={roleAssign.open}
          />
          {users.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Users
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No users found.
              </p>
              <button
                onClick={formDialog.openAdd}
                className="mt-2 btn btn-primary btn-sm"
              >
                Add First User
              </button>
            </div>
          )}
          {users.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-2 p-4">
              <Pagination
                currentPage={currentPage}
                totalItems={pagination.totalCount}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[10, 25, 50, 100]}
              />
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <UserFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        userId={formDialog.userId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <UserViewDialog
        user={viewDialog.user}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
        onEdit={(user) => {
          viewDialog.close();
          formDialog.openEdit(user);
        }}
        onDelete={async (user) => {
          viewDialog.close();
          await handleDelete(user);
        }}
        onResetPassword={(userId, email) => {
          viewDialog.close();
          resetPwd.open(userId, email);
        }}
        onAssignRole={(user) => {
          viewDialog.close();
          roleAssign.open(user);
        }}
      />
      <RoleAssignmentModal
        isOpen={roleAssign.isOpen}
        user={roleAssign.user}
        onClose={roleAssign.close}
        onSuccess={reload}
      />
      <ResetPasswordModal
        isOpen={resetPwd.isOpen}
        userId={resetPwd.userId}
        userEmail={resetPwd.userEmail}
        onClose={resetPwd.close}
      />
    </div>
  );
};

export default UsersPage;
