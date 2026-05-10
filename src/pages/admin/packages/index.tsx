// src/pages/packages/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, Gift } from "lucide-react";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";

import usePackages from "./hooks/usePackages";
import usePackageForm from "./hooks/usePackageForm";
import usePackageView from "./hooks/usePackageView";
import PackageFilterBar from "./components/PackageFilterBar";
import PackageTable from "./components/PackageTable";
import PackageViewDialog from "./components/PackageViewDialog";
import PackageFormDialog from "./components/PackageFormDialog";
import packageApi from "@/api/core/package";
import { dialogs } from "@/utils/dialogs";
import Pagination from "@/components/Shared/Pagination";

const PackagesPage: React.FC = () => {
  const {
    paginatedPackages,
    packages,
    filters,
    loading,
    error,
    pagination,
    selectedPackages,
    setSelectedPackages,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    togglePackageSelection,
    toggleSelectAll,
    handleSort,
  } = usePackages();

  const formDialog = usePackageForm();
  const viewDialog = usePackageView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleToggleActive = async (id: number) => {
    showLoading("Updating status...");
    try {
      const res = await packageApi.togglePackageActive(id);
      if (res.success) {
        showToast("Status updated", "success");
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

  const handleDelete = async (pkg: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Package",
      message: `Delete package "${pkg.name}"?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await packageApi.deletePackage(pkg.id);
      showToast("Package deleted", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPackages.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedPackages.length} packages?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await Promise.all(
        selectedPackages.map((id) => packageApi.deletePackage(id)),
      );
      showToast(`${selectedPackages.length} packages deleted`, "success");
      setSelectedPackages([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (packages.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Packages",
      message: `Export ${pagination.totalCount} packages to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
    try {
      const headers = [
        "ID",
        "Name",
        "Treatments",
        "Total Value",
        "Package Price",
        "Savings",
        "Active",
      ];
      const rows = packages.map((p) => [
        p.id,
        p.name,
        p.treatments.map((t: { name: any }) => t.name).join(";"),
        p.totalPrice,
        p.discountedPrice,
        p.savings,
        p.isActive ? "Yes" : "No",
      ]);
      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `packages_${new Date().toISOString().slice(0, 19)}.csv`;
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
            <Gift className="w-5 h-5" />
            Packages
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage bundled treatment packages
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
            disabled={exportLoading || packages.length === 0}
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
            Create Package
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {packages.length > 0 && (
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
            Showing {start} to {end} of {pagination.totalCount} packages
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <PackageFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />
      )}

      {/* Bulk Actions */}
      {selectedPackages.length > 0 && (
        <div
          className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between"
          style={{
            backgroundColor: "var(--accent-blue-light)",
            borderColor: "var(--accent-blue)",
          }}
        >
          <span className="font-medium text-sm">
            {selectedPackages.length} package(s) selected
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
          <PackageTable
            packages={paginatedPackages}
            selectedPackages={selectedPackages}
            onToggleSelect={togglePackageSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(pkg) => viewDialog.open(pkg.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
          {packages.length === 0 && (
            <div
              className="text-center py-8 border rounded-md"
              style={{ borderColor: "var(--border-color)" }}
            >
              <Gift
                className="icon-xl mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>
                No packages found.
              </p>
              <button
                onClick={formDialog.openAdd}
                className="mt-2 btn btn-primary btn-sm"
              >
                Create First Package
              </button>
            </div>
          )}
          {packages.length > 0 && pagination.totalPages > 1 && (
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
      <PackageFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        packageId={formDialog.packageId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <PackageViewDialog
        pkg={viewDialog.pkg}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
        onEdit={(pkg) => {
          viewDialog.close();
          formDialog.openEdit(pkg);
        }}
        onDelete={async (pkg) => {
          viewDialog.close();
          await handleDelete(pkg);
        }}
      />
    </div>
  );
};

export default PackagesPage;
