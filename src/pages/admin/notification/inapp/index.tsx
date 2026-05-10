// src/pages/notifications/inapp/index.tsx
import React, { useState } from "react";
import { Bell, CheckCheck, Trash2, RefreshCw } from "lucide-react";
import Button from "@/components/UI/Button";
import {showToast, showLoading, hideLoading } from "@/utils/notification";
import useInAppNotifications from "./hooks/useInAppNotifications";
import NotificationCard from "./components/NotificationCard";
import NotificationFilterBar from "./components/NotificationFilterBar";
import { dialogs } from "@/utils/dialogs";
import Pagination from "@/components/Shared/Pagination";

const InAppNotificationsPage: React.FC = () => {
  const {
    paginatedNotifications,
    notifications,
    filters,
    loading,
    error,
    pagination,
    selectedNotifications,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    bulkDelete,
  } = useInAppNotifications();

  const [processing, setProcessing] = useState(false);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      showToast("Notification marked as read", "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    }
  };

  const handleMarkAllAsRead = async () => {
    const confirmed = await dialogs.confirm({
      title: "Mark All as Read",
      message: "Mark all notifications as read?",
    });
    if (!confirmed) return;
    setProcessing(true);
    showLoading("Marking all as read...");
    try {
      await markAllAsRead();
      showToast("All notifications marked as read", "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    } finally {
      setProcessing(false);
      hideLoading();
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
    });
    if (!confirmed) return;
    setProcessing(true);
    showLoading("Deleting...");
    try {
      await deleteNotification(id);
      showToast("Notification deleted", "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    } finally {
      setProcessing(false);
      hideLoading();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNotifications.length === 0) {
      dialogs.alert({ title: "Info", message: "No notifications selected", icon: "info" });
      return;
    }
    const confirmed = await dialogs.confirm({
      title: "Bulk Delete",
      message: `Delete ${selectedNotifications.length} notifications?`,
    });
    if (!confirmed) return;
    setProcessing(true);
    showLoading("Deleting...");
    try {
      await bulkDelete();
      showToast(`${selectedNotifications.length} notifications deleted`, "success");
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    } finally {
      setProcessing(false);
      hideLoading();
    }
  };

  const getDisplayRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, pagination.totalCount);
    return { start, end };
  };
  const { start, end } = getDisplayRange();

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
      </div>
    );
  }

  return (
    <div className="compact-card rounded-md shadow-md border p-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--sidebar-text)" }}>
            <Bell className="w-5 h-5" />
            In-App Notifications
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">View and manage your notifications</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={reload} disabled={loading} className="btn btn-secondary btn-sm flex items-center gap-1">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <button onClick={handleMarkAllAsRead} disabled={processing} className="btn btn-primary btn-sm flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </button>
          )}
          {selectedNotifications.length > 0 && (
            <button onClick={handleBulkDelete} disabled={processing} className="btn btn-danger btn-sm flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Delete Selected ({selectedNotifications.length})
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <NotificationFilterBar filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters} hasNotifications={notifications.length > 0} />

      {/* Notifications List */}
      {error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : paginatedNotifications.length === 0 ? (
        <div className="text-center py-12 border rounded-md" style={{ borderColor: "var(--border-color)" }}>
          <Bell className="w-12 h-12 mx-auto mb-2 text-[var(--text-secondary)]" />
          <p className="text-[var(--text-secondary)]">No notifications found.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalItems={pagination.totalCount}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[10, 20, 50]}
                showPageSize={true}
              />
              <div className="text-xs text-center text-[var(--text-secondary)] mt-2">
                Showing {start} to {end} of {pagination.totalCount} notifications
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InAppNotificationsPage;