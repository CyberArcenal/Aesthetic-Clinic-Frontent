// src/pages/payments/index.tsx
import React, { useState } from "react";
import { Plus, Download, Filter, RefreshCw, CreditCard } from "lucide-react";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import billingApi from "@/api/core/billing";

import usePayments from "./hooks/usePayments";
import usePaymentForm from "./hooks/usePaymentForm";
import usePaymentView from "./hooks/usePaymentView";
import PaymentFilterBar from "./components/PaymentFilterBar";
import PaymentTable from "./components/PaymentTable";
import PaymentViewDialog from "./components/PaymentViewDialog";
import PaymentFormDialog from "./components/PaymentFormDialog";
import { dialogs } from "@/utils/dialogs";
import Pagination from "@/components/Shared/Pagination";

const PaymentsPage: React.FC = () => {
  const {
    paginatedPayments,
    payments,
    filters,
    loading,
    error,
    pagination,
    selectedPayments,
    setSelectedPayments,
    sortConfig,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    togglePaymentSelection,
    toggleSelectAll,
    handleSort,
  } = usePayments();

  const formDialog = usePaymentForm();
  const viewDialog = usePaymentView();

  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleDelete = async (payment: any) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Payment",
      message: `Delete payment of ${payment.amount} for invoice #${payment.invoiceNumber}?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await billingApi.deletePayment(payment.id);
      showToast("Payment deleted", "success");
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPayments.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedPayments.length} payments?`,
    });
    if (!confirmed) return;
    showLoading("Deleting...");
    try {
      await Promise.all(selectedPayments.map((id) => billingApi.deletePayment(id)));
      showToast(`${selectedPayments.length} payments deleted`, "success");
      setSelectedPayments([]);
      reload();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    } finally {
      hideLoading();
    }
  };

  const handleExportCSV = async () => {
    if (payments.length === 0) return;
    const confirmed = await dialogs.confirm({
      title: "Export Payments",
      message: `Export ${pagination.totalCount} payments to CSV?`,
    });
    if (!confirmed) return;
    setExportLoading(true);
    showLoading("Generating CSV...");
    try {
      const headers = ["ID", "Invoice #", "Amount", "Payment Date", "Method", "Reference #"];
      const rows = payments.map((p) => [
        p.id,
        p.invoiceNumber,
        p.amount,
        new Date(p.paymentDate).toLocaleDateString(),
        p.method,
        p.referenceNumber || "",
      ]);
      const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments_${new Date().toISOString().slice(0, 19)}.csv`;
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
            <CreditCard className="w-5 h-5" />
            Payments
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Track all payment transactions
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
            disabled={exportLoading || payments.length === 0}
            className="compact-button rounded-md flex items-center gap-1"
          >
            <Download className="icon-xs" /> {exportLoading ? "..." : "Export CSV"}
          </Button>
          <Button onClick={formDialog.openAdd} variant="success" size="sm" icon={Plus} iconPosition="left">
            Record Payment
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      {payments.length > 0 && (
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
            Showing {start} to {end} of {pagination.totalCount} payments
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && <PaymentFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} />}

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <div
          className="mx-4 mb-2 compact-card rounded-md border p-2 flex items-center justify-between"
          style={{ backgroundColor: "var(--accent-blue-light)", borderColor: "var(--accent-blue)" }}
        >
          <span className="font-medium text-sm">{selectedPayments.length} payment(s) selected</span>
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
          <PaymentTable
            payments={paginatedPayments}
            selectedPayments={selectedPayments}
            onToggleSelect={togglePaymentSelection}
            onToggleSelectAll={toggleSelectAll}
            onSort={(key) => {handleSort(key as keyof typeof paginatedPayments[0])}}
            sortConfig={sortConfig}
            onView={(payment) => {viewDialog.open(payment.id)}}
            onEdit={formDialog.openEdit}
            onDelete={handleDelete}
          />
          {payments.length === 0 && (
            <div className="text-center py-8 border rounded-md" style={{ borderColor: "var(--border-color)" }}>
              <CreditCard className="icon-xl mx-auto mb-2" style={{ color: "var(--text-secondary)" }} />
              <p className="text-base" style={{ color: "var(--sidebar-text)" }}>No payments found.</p>
              <button onClick={formDialog.openAdd} className="mt-2 btn btn-primary btn-sm">
                Record First Payment
              </button>
            </div>
          )}
          {payments.length > 0 && pagination.totalPages > 1 && (
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
      <PaymentFormDialog
        isOpen={formDialog.isOpen}
        mode={formDialog.mode}
        paymentId={formDialog.paymentId}
        initialData={formDialog.initialData}
        onClose={formDialog.close}
        onSuccess={reload}
      />
      <PaymentViewDialog
        payment={viewDialog.payment}
        loading={viewDialog.loading}
        isOpen={viewDialog.isOpen}
        onClose={viewDialog.close}
      />
    </div>
  );
};

export default PaymentsPage;