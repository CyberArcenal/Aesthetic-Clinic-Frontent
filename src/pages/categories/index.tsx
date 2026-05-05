// src/pages/treatments/categories/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, FolderOpen } from "lucide-react";
import Button from "@/components/UI/Button";
import {showToast, showLoading, hideLoading } from "@/utils/notification";


import useCategories from "./hooks/useCategories";
import useCategoryForm from "./hooks/useCategoryForm";
import useCategoryView from "./hooks/useCategoryView";
import CategoryFilterBar from "./components/CategoryFilterBar";
import CategoryTable from "./components/CategoryTable";
import CategoryViewDialog from "./components/CategoryViewDialog";
import CategoryFormDialog from "./components/CategoryFormDialog";
import { dialogs } from "@/utils/dialogs";
import categoryApi from "@/api/core/category";
import Pagination from "@/components/Shared/Pagination";

const CategoriesPage: React.FC = () => {
  const {
    paginatedCategories,
    categories,
    filters,
    loading,
    error,
    pagination,
    selectedCategories,
    setSelectedCategories,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleCategorySelection,
    toggleSelectAll,
    handleSort,
  } = useCategories();

  const formDialog = useCategoryForm();
  const viewDialog = useCategoryView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleDelete = async (category: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Category",
      message: `Category "${category.name}" has ${category.count} treatments. They will lose their category assignment. Delete anyway?`,
    });
    if (!confirmed) return;
    showLoading("Deleting category...");
    try {
      const res = await categoryApi.deleteCategory(category.name);
      if (!res.success) throw new Error(res.message as string);
      showToast("Category deleted", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedCategories.length} categories? Treatments will lose their category assignment.`,
    });
    if (!confirmed) return;
    showLoading("Deleting categories...");
    try {
      for (const name of selectedCategories) {
        await categoryApi.deleteCategory(name);
      }
      showToast(`${selectedCategories.length} categories deleted`, "success");
      setSelectedCategories([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (categories.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Categories",
      message: `Export ${pagination.totalCount} categories to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
    try {
      const headers = ["Name", "Treatments Count"];
      const rows = categories.map((c) => [c.name, c.count]);
      const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `categories_${new Date().toISOString().slice(0, 19)}.csv`;
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
    <div className="compact-card rounded-md shadow-md border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 p-4">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: "var(--sidebar-text)" }}>
            <FolderOpen className="w-5 h-5" />
            Treatment Categories
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Manage unique categories used in treatments
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="compact-button rounded-md flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
            style={{ backgroundColor: "var(--card-secondary-bg)", color: "var(--sidebar-text)" }}
          >
            <Filter className="icon-sm" /> Filters {showFilters ? "↑" : "↓"}
          </button>
          <button onClick={reload} disabled={loading} className="btn btn-secondary btn-sm rounded-md flex items-center gap-1">
            <RefreshCw className={`icon-sm ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <Button onClick={handleExportCSV} disabled={exportLoading || categories.length === 0} className="compact-button rounded-md flex items-center gap-1">
            <Download className="icon-xs" /> {exportLoading ? "..." : "Export CSV"}
          </Button>
          <Button onClick={formDialog.openAdd} variant="success" size="sm" icon={Plus} iconPosition="left">
            Add Category
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {categories.length > 0 && (
        <div className="mx-4 mb-4 compact-card rounded-md border p-3 flex flex-wrap items-center justify-between" style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></span>Total: {pagination.totalCount}</div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Showing {start} to {end} of {pagination.totalCount} categories</div>
        </div>
      )}

      {/* Filters */}
      {showFilters && <CategoryFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />}

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <div className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between" style={{ backgroundColor: "var(--accent-blue-light)", borderColor: "var(--accent-blue)" }}>
          <span className="font-medium text-sm">{selectedCategories.length} category(s) selected</span>
          <button className="compact-button bg-[var(--accent-red)] text-white rounded-md" onClick={handleBulkDelete}>Delete Selected</button>
        </div>
      )}

      {/* Table / Loading / Error */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : (
        <>
          <CategoryTable
            categories={paginatedCategories}
            selectedCategories={selectedCategories}
            onToggleSelect={toggleCategorySelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(category) => viewDialog.open(category.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
          />
          {categories.length === 0 && (
            <div className="text-center py-8 border rounded-md" style={{ borderColor: "var(--border-color)" }}>
              <FolderOpen className="icon-xl mx-auto mb-2" style={{ color: "var(--text-secondary)" }} />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>No categories found.</p>
              <button onClick={formDialog.openAdd} className="mt-2 btn btn-primary btn-sm">Add First Category</button>
            </div>
          )}
          {categories.length > 0 && pagination.totalPages > 1 && (
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
      <CategoryFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        categoryName={formDialog.categoryName}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <CategoryViewDialog
        category={viewDialog.category}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
      />
    </div>
  );
};

export default CategoriesPage;