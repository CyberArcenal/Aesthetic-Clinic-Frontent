// src/pages/appointments/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, CalendarDays } from "lucide-react";
import useAppointments from "./hooks/useAppointments";
import useAppointmentForm from "./hooks/useAppointmentForm";
import useAppointmentView from "./hooks/useAppointmentView";
import FilterBar from "./components/FilterBar";
import AppointmentTable from "./components/AppointmentTable";
import AppointmentFormDialog from "./components/AppointmentFormDialog";
import AppointmentViewDialog from "./components/AppointmentViewDialog";
import { dialogs } from "../../../utils/dialogs";
import {
  hideLoading,
  showLoading,
  showToast,
} from "../../../utils/notification";
import appointmentApi from "../../../api/core/appointment";
import Button from "../../../components/UI/Button";
import Pagination from "../../../components/Shared/Pagination";

const AppointmentsPage: React.FC = () => {
  const {
    paginatedAppointments,
    appointments,
    filters,
    loading,
    error,
    pagination,
    selectedAppointments,
    setSelectedAppointments,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleAppointmentSelection,
    toggleSelectAll,
    handleSort,
  } = useAppointments();

  const formDialog = useAppointmentForm();
  const viewDialog = useAppointmentView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleDelete = async (apt: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Appointment",
      message: `Delete appointment for ${apt.clientName || `client #${apt.clientId}`}?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await appointmentApi.deleteAppointment(apt.id);
      showToast("Appointment deleted", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAppointments.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedAppointments.length} appointments?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await Promise.all(
        selectedAppointments.map((id) => appointmentApi.deleteAppointment(id)),
      );
      showToast(
        `${selectedAppointments.length} appointments deleted`,
        "success",
      );
      setSelectedAppointments([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (appointments.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Appointments",
      message: `Export ${pagination.totalCount} appointments to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    try {
      const headers = [
        "ID",
        "Client",
        "Treatment",
        "Date/Time",
        "Status",
        "Staff",
        "Notes",
      ];
      const rows = appointments.map((a) => [
        a.id,
        a.clientName || a.clientId,
        a.treatmentName || a.treatmentId,
        new Date(a.appointmentDateTime).toLocaleString(),
        a.status || "",
        a.assignedStaff || "",
        a.notes || "",
      ]);
      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `appointments_${new Date().toISOString().slice(0, 19)}.csv`;
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
            Appointments
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage clinic appointments
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
            disabled={exportLoading || appointments.length === 0}
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
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {appointments.length > 0 && (
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
            Showing {start} to {end} of {pagination.totalCount} appointments
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
      {selectedAppointments.length > 0 && (
        <div
          className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between"
          style={{
            backgroundColor: "var(--accent-blue-light)",
            borderColor: "var(--accent-blue)",
          }}
        >
          <span className="font-medium text-sm">
            {selectedAppointments.length} appointment(s) selected
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
          <AppointmentTable
            appointments={paginatedAppointments}
            selectedAppointments={selectedAppointments}
            onToggleSelect={toggleAppointmentSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(appointment) => {
              viewDialog.open(appointment.id);
            }}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
          />
          {appointments.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <CalendarDays
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No appointments found.
              </p>
              <button
                onClick={formDialog.openAdd}
                className="mt-2 btn btn-primary btn-sm"
              >
                Book First Appointment
              </button>
            </div>
          )}
          {appointments.length > 0 && pagination.totalPages > 1 && (
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
      <AppointmentFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        appointmentId={formDialog.appointmentId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <AppointmentViewDialog
        appointment={viewDialog.appointment}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
        onEdit={(apt) => {
          viewDialog.close();
          formDialog.openEdit(apt);
        }}
        onDelete={async (apt) => {
          viewDialog.close();
          await handleDelete(apt);
        }}
      />
    </div>
  );
};

export default AppointmentsPage;
