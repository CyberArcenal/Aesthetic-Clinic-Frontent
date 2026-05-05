import React, { useState } from "react";
import { Download, RefreshCw, History, Calendar } from "lucide-react";
import useAppointments from "../appointments/hooks/useAppointments";
import useAppointmentView from "../appointments/hooks/useAppointmentView";
import { dialogs } from "../../utils/dialogs";
import { hideLoading, showLoading, showToast } from "../../utils/notification";
import Button from "../../components/UI/Button";
import AppointmentTable from "../appointments/components/AppointmentTable";
import AppointmentViewDialog from "../appointments/components/AppointmentViewDialog";
import Pagination from "../../components/Shared/Pagination";

const AppointmentHistoryPage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const {
    paginatedAppointments,
    appointments,
    filters,
    loading,
    error,
    pagination,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    handleSort,
    sortConfig,
  } = useAppointments({ toDate: today }); // default to past appointments

  const viewDialog = useAppointmentView();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportCSV = async () => {
    if (appointments.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export History",
      message: `Export ${pagination.totalCount} appointments to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
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
      a.download = `appointment_history_${new Date().toISOString().slice(0, 19)}.csv`;
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
            <History className="w-5 h-5" />
            Appointment History
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Past appointments (completed, cancelled, no‑show)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            <Download className="icon-xs" />
            {exportLoading ? "..." : "Export CSV"}
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
              Total records: {pagination.totalCount}
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Showing {start} to {end} of {pagination.totalCount} appointments
          </div>
        </div>
      )}

      {/* Filters (status + date range) */}
      <div className="mx-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          >
            <option value="">All</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="NoShow">No Show</option>
          </select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--sidebar-text)" }}
          >
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
              color: "var(--sidebar-text)",
            }}
          />
        </div>
      </div>

      {/* Table / Loading / Error */}
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
            selectedAppointments={[]} // no bulk actions on history page
            onToggleSelect={() => {}}
            onToggleSelectAll={() => {}}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(appointment) => {
              viewDialog.open(appointment.id);
            }}
            onEdit={() => {}} // no edit in history
            onDelete={() => {}} // no delete in history
          />
          {appointments.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Calendar
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No past appointments found.
              </p>
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

      <AppointmentViewDialog
        appointment={viewDialog.appointment}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
      />
    </div>
  );
};

export default AppointmentHistoryPage;
