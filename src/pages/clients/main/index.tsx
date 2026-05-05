import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router-dom";

import useClients from "./hooks/useClients";
import useClientForm from "./hooks/useClientForm";
import useClientView from "./hooks/useClientView";
import FilterBar from "./components/FilterBar";
import ClientTable from "./components/ClientTable";
import ClientFormDialog from "./components/ClientFormDialog";
import ClientViewDialog from "./components/ClientViewDialog";
import { dialogs } from "../../../utils/dialogs";
import {
  hideLoading,
  showLoading,
  showToast,
} from "../../../utils/notification";
import clientApi from "../../../api/core/client";
import Button from "../../../components/UI/Button";
import Pagination from "../../../components/Shared/Pagination";

const ClientsPage: React.FC = () => {
  const {
    paginatedClients,
    clients,
    filters,
    loading,
    error,
    pagination,
    selectedClients,
    setSelectedClients,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleClientSelection,
    toggleSelectAll,
    handleSort,
  } = useClients();

  const formDialog = useClientForm();
  const viewDialog = useClientView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleDelete = async (client: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Client",
      message: `Are you sure you want to delete ${client.fullName || `${client.firstName} ${client.lastName}`}?`,
    });
    if (!confirmed) return;
    showLoading("Deleting client...");
    try {
      await clientApi.deleteClient(client.id);
      showToast("Client deleted successfully", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedClients.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedClients.length} clients?`,
    });
    if (!confirmed) return;
    showLoading("Deleting selected clients...");
    try {
      await Promise.all(
        selectedClients.map((id) => clientApi.deleteClient(id)),
      );
      showToast(`${selectedClients.length} clients deleted`, "success");
      setSelectedClients([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (clients.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Clients",
      message: `Export ${pagination.totalCount} clients to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    try {
      // Simple CSV generation
      const headers = [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Registered",
      ];
      const rows = clients.map((c) => [
        c.id,
        c.firstName || "",
        c.lastName || "",
        c.email || "",
        c.phoneNumber || "",
        new Date(c.createdAt).toLocaleDateString(),
      ]);
      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clients_${new Date().toISOString().slice(0, 19)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Export completed", "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      setExportLoading(false);
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
            className="text-base font-semibold"
            style={{ color: "var(--sidebar-text)" }}
          >
            Clients
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage your clinic clients
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
            disabled={exportLoading || clients.length === 0}
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
            Add Client
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {clients.length > 0 && (
        <div
          className="mx-4 mb-4 compact-card rounded-md border p-3 flex flex-wrap items-center justify-between"
          style={{
            backgroundColor: "var(--card-secondary-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></span>
              Total: {pagination.totalCount}
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Showing {start} to {end} of {pagination.totalCount} clients
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
      )}

      {/* Bulk Actions */}
      {selectedClients.length > 0 && (
        <div
          className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between"
          style={{
            backgroundColor: "var(--accent-blue-light)",
            borderColor: "var(--accent-blue)",
          }}
        >
          <span className="font-medium text-sm">
            {selectedClients.length} client(s) selected
          </span>
          <button
            className="compact-button bg-[var(--accent-red)] text-white rounded-md"
            onClick={handleBulkDelete}
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : (
        <>
          <ClientTable
            clients={paginatedClients}
            selectedClients={selectedClients}
            onToggleSelect={toggleClientSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(client) => {viewDialog.open(client.id)}}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
          />
          {clients.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Users
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No clients found.
              </p>
              <button
                onClick={formDialog.openAdd}
                className="mt-2 btn btn-primary btn-sm"
              >
                Add First Client
              </button>
            </div>
          )}
          {clients.length > 0 && pagination.totalPages > 1 && (
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
      <ClientFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        clientId={formDialog.clientId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <ClientViewDialog
        client={viewDialog.client}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
      />
    </div>
  );
};

export default ClientsPage;
