// src/pages/invoices/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, Receipt } from "lucide-react";
import useInvoiceForm from "./hooks/useInvoiceForm";
import useInvoiceView from "./hooks/useInvoiceView";
import FilterBar from "./components/FilterBar";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceViewDialog from "./components/InvoiceViewDialog";
import InvoiceFormDialog from "./components/InvoiceFormDialog";
import useInvoices from "./hooks/useInvoices";
import { dialogs } from "../../utils/dialogs";
import { hideLoading, showLoading, showToast } from "../../utils/notification";
import billingApi from "../../api/core/billing";
import Button from "../../components/UI/Button";
import Pagination from "../../components/Shared/Pagination";

// Hardcoded client list – replace with actual client API later
const dummyClients = [{ id: 1, name: "Sample Client" }];

const InvoicesPage: React.FC = () => {
  const {
    paginatedInvoices,
    invoices,
    filters,
    loading,
    error,
    pagination,
    selectedInvoices,
    setSelectedInvoices,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleInvoiceSelection,
    toggleSelectAll,
    handleSort,
  } = useInvoices();

  const formDialog = useInvoiceForm();
  const viewDialog = useInvoiceView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const confirmed = await dialogs.confirm({
      title: "Update Invoice Status",
      message: `Change status to "${newStatus}"?`,
    });
    if (!confirmed) return;
    showLoading("Updating status...");
    try {
      const res = await billingApi.updateInvoiceStatus(id, { status: newStatus });
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

  const handleDelete = async (invoice: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Invoice",
      message: `Delete invoice #${invoice.invoiceNumber}?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await billingApi.deleteInvoice(invoice.id);
      showToast("Invoice deleted", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInvoices.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedInvoices.length} invoices?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await Promise.all(selectedInvoices.map((id) => billingApi.deleteInvoice(id)));
      showToast(`${selectedInvoices.length} invoices deleted`, "success");
      setSelectedInvoices([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (invoices.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Invoices",
      message: `Export ${pagination.totalCount} invoices to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
    try {
      const headers = ["ID", "Invoice #", "Client", "Issue Date", "Due Date", "Total", "Status", "Balance"];
      const rows = invoices.map((inv) => [
        inv.id,
        inv.invoiceNumber,
        inv.clientName || inv.clientId,
        new Date(inv.issueDate).toLocaleDateString(),
        inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "",
        inv.total,
        inv.status,
        inv.balanceDue,
      ]);
      const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoices_${new Date().toISOString().slice(0, 19)}.csv`;
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
            <Receipt className="w-5 h-5" />
            Invoices
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Manage client invoices and track payments
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
            disabled={exportLoading || invoices.length === 0}
            className="compact-button rounded-md flex items-center gap-1"
          >
            <Download className="icon-xs" /> {exportLoading ? "..." : "Export CSV"}
          </Button>
          <Button onClick={formDialog.openAdd} variant="success" size="sm" icon={Plus} iconPosition="left">
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {invoices.length > 0 && (
        <div
          className="mx-4 mb-4 compact-card rounded-md border p-3 flex flex-wrap items-center justify-between"
          style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></span>
              Total: {pagination.totalCount}
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Showing {start} to {end} of {pagination.totalCount} invoices
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && <FilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} clients={dummyClients} />}

      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div
          className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between"
          style={{ backgroundColor: "var(--accent-blue-light)", borderColor: "var(--accent-blue)" }}
        >
          <span className="font-medium text-sm">{selectedInvoices.length} invoice(s) selected</span>
          <button className="compact-button bg-[var(--accent-red)] text-white rounded-md" onClick={handleBulkDelete}>
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
          <InvoiceTable
            invoices={paginatedInvoices}
            selectedInvoices={selectedInvoices}
            onToggleSelect={toggleInvoiceSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            onView={(invoice) => {viewDialog.open(invoice.id)}}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
          {invoices.length === 0 && (
            <div className="text-center py-8 border rounded-md" style={{ borderColor: "var(--border-color)" }}>
              <Receipt className="icon-xl mx-auto mb-2" style={{ color: "var(--text-secondary)" }} />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>No invoices found.</p>
              <button onClick={formDialog.openAdd} className="mt-2 btn btn-primary btn-sm">
                Create First Invoice
              </button>
            </div>
          )}
          {invoices.length > 0 && pagination.totalPages > 1 && (
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
      <InvoiceFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        invoiceId={formDialog.invoiceId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <InvoiceViewDialog
        invoice={viewDialog.invoice}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
      />
    </div>
  );
};

export default InvoicesPage;