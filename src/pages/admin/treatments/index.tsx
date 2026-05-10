// src/pages/treatments/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, Stethoscope } from "lucide-react";
import Button from "@/components/UI/Button";
import Pagination from "@/components/Shared/Pagination";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import treatmentApi from "@/api/core/treatment";

import useTreatments from "./hooks/useTreatments";
import useTreatmentForm from "./hooks/useTreatmentForm";
import useTreatmentView from "./hooks/useTreatmentView";
import TreatmentFilterBar from "./components/TreatmentFilterBar";
import TreatmentTable from "./components/TreatmentTable";
import TreatmentViewDialog from "./components/TreatmentViewDialog";
import TreatmentFormDialog from "./components/TreatmentFormDialog";
import { dialogs } from "@/utils/dialogs";

const TreatmentsPage: React.FC = () => {
  const {
    paginatedTreatments,
    treatments,
    filters,
    loading,
    error,
    pagination,
    selectedTreatments,
    setSelectedTreatments,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleTreatmentSelection,
    toggleSelectAll,
    handleSort,
    categories,
  } = useTreatments();

  const formDialog = useTreatmentForm();
  const viewDialog = useTreatmentView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleToggleActive = async (id: number) => {
    showLoading("Updating status...");
    try {
      const res = await treatmentApi.toggleTreatmentActive(id);
      if (res.success) {
        showToast("Status updated", "success");
        reload();
      } else {
        throw new Error(res.error as string);
      }
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleDelete = async (treatment: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Treatment",
      message: `Delete treatment "${treatment.name}"?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await treatmentApi.deleteTreatment(treatment.id);
      showToast("Treatment deleted", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTreatments.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedTreatments.length} treatments?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await Promise.all(
        selectedTreatments.map((id) => treatmentApi.deleteTreatment(id)),
      );
      showToast(`${selectedTreatments.length} treatments deleted`, "success");
      setSelectedTreatments([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (treatments.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Treatments",
      message: `Export ${pagination.totalCount} treatments to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
    try {
      const headers = [
        "ID",
        "Name",
        "Category",
        "Duration (min)",
        "Price",
        "Active",
      ];
      const rows = treatments.map((t) => [
        t.id,
        t.name,
        t.category || "",
        t.durationMinutes,
        t.price,
        t.isActive ? "Yes" : "No",
      ]);
      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `treatments_${new Date().toISOString().slice(0, 19)}.csv`;
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
            <Stethoscope className="w-5 h-5" />
            Service Catalog
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage treatments and services
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
            disabled={exportLoading || treatments.length === 0}
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
            Add Treatment
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {treatments.length > 0 && (
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
            Showing {start} to {end} of {pagination.totalCount} treatments
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <TreatmentFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          categories={categories as string[]}
        />
      )}

      {/* Bulk Actions */}
      {selectedTreatments.length > 0 && (
        <div
          className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between"
          style={{
            backgroundColor: "var(--accent-blue-light)",
            borderColor: "var(--accent-blue)",
          }}
        >
          <span className="font-medium text-sm">
            {selectedTreatments.length} treatment(s) selected
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
          <TreatmentTable
            treatments={paginatedTreatments}
            selectedTreatments={selectedTreatments}
            onToggleSelect={toggleTreatmentSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(treatment) => viewDialog.open(treatment.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          {treatments.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Stethoscope
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No treatments found.
              </p>
              <button
                onClick={formDialog.openAdd}
                className="mt-2 btn btn-primary btn-sm"
              >
                Add First Treatment
              </button>
            </div>
          )}
          {treatments.length > 0 && pagination.totalPages > 1 && (
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
      <TreatmentFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        treatmentId={formDialog.treatmentId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <TreatmentViewDialog
        treatment={viewDialog.treatment}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
        onEdit={(treatment) => {
          viewDialog.close();
          formDialog.openEdit(treatment);
        }}
        onDelete={async (treatment) => {
          viewDialog.close();
          await handleDelete(treatment);
        }}
      />
    </div>
  );
};

export default TreatmentsPage;
