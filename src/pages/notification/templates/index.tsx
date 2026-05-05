// src/pages/notifications/templates/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, FileText } from "lucide-react";
import Button from "@/components/UI/Button";
import {showToast, showLoading, hideLoading } from "@/utils/notification";
import useTemplates from "./hooks/useTemplates";
import useTemplateForm from "./hooks/useTemplateForm";
import useTemplateView from "./hooks/useTemplateView";
import TemplateFilterBar from "./components/TemplateFilterBar";
import TemplateFormDialog from "./components/TemplateFormDialog";
import TemplateViewDialog from "./components/TemplateViewDialog";
import { dialogs } from "@/utils/dialogs";
import Pagination from "@/components/Shared/Pagination";
import TemplateTable from "./components/TemplateTable";
import { NotificationTemplateResponseDto } from "@/api/core/notification";

const TemplatesPage: React.FC = () => {
  const {
    paginatedTemplates,
    templates,
    filters,
    loading,
    error,
    pagination,
    selectedTemplates,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleTemplateSelection,
    toggleSelectAll,
    handleSort,
    sortConfig,
    deleteTemplate,
    bulkDelete,
  } = useTemplates();

  const formDialog = useTemplateForm();
  const viewDialog = useTemplateView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm({ title: "Delete Template", message: "Delete this template?" });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await deleteTemplate(id);
      showToast("Template deleted", "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTemplates.length === 0) return;
    const confirmed = await dialogs.confirm({ title: "Bulk Delete", message: `Delete ${selectedTemplates.length} templates?` });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await bulkDelete();
      showToast(`${selectedTemplates.length} templates deleted`, "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (templates.length === 0) return;
    const confirmed = await dialogs.confirm({ title: "Export Templates", message: `Export ${pagination.totalCount} templates to CSV?` });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
    try {
      const headers = ["ID", "Name", "Subject", "Content", "Created At"];
      const rows = templates.map((t) => [t.id, t.name, t.subject, t.content, new Date(t.createdAt).toLocaleString()]);
      const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `templates_${new Date().toISOString().slice(0, 19)}.csv`;
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

  if (loading && templates.length === 0) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div></div>;

  return (
    <div className="compact-card rounded-md shadow-md border p-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5" /> Notification Templates</h2>
          <p className="text-sm">Manage reusable notification templates</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="compact-button rounded-md flex items-center gap-1"><Filter className="icon-sm" /> Filters</button>
          <button onClick={reload} disabled={loading} className="btn btn-secondary btn-sm"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
          <Button onClick={handleExportCSV} disabled={exportLoading || templates.length === 0} className="compact-button"><Download className="icon-xs" /> Export CSV</Button>
          {selectedTemplates.length > 0 && <Button onClick={handleBulkDelete} variant="danger">Delete Selected ({selectedTemplates.length})</Button>}
          <Button onClick={formDialog.openAdd} variant="success" icon={Plus}>Add Template</Button>
        </div>
      </div>

      {showFilters && <TemplateFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />}

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">No templates found.</div>
      ) : (
        <>
          <TemplateTable
            templates={paginatedTemplates}
            selectedTemplates={selectedTemplates}
            onToggleSelect={toggleTemplateSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig as { key: keyof NotificationTemplateResponseDto; direction: "asc" | "desc" }}
            onView={(template) => viewDialog.open(template.id)}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
          />
          {pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalItems={pagination.totalCount}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[10, 25, 50, 100]}
              />
              <div className="text-xs text-center mt-2">Showing {start} to {end} of {pagination.totalCount} templates</div>
            </div>
          )}
        </>
      )}

      <TemplateFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        templateId={formDialog.templateId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <TemplateViewDialog
        template={viewDialog.template}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
      />
    </div>
  );
};

export default TemplatesPage;