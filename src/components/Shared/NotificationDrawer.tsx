// src/components/NotificationDrawer.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import type { NotificationResponseDto } from "../../api/core/notification";
import { useNotificationView } from "../../pages/admin/notification/hooks/useNotificationView";
import { authStore } from "../../stores/authStore";
import notificationApi from "../../api/core/notification";
import { dialogs } from "../../utils/dialogs";
import NotificationViewDialog from "../../pages/admin/notification/components/NotificationViewDialog";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onUnreadCountChange,
}) => {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const pageSize = 15;

  const notificationView = useNotificationView();

  // Get current user ID from auth store
  const currentUser = authStore.getUser();
  const userId = currentUser?.id;

  // Reset when drawer opens
  useEffect(() => {
    if (isOpen && userId) {
      setPage(1);
      setNotifications([]);
      fetchUnreadCount();
      fetchNotifications(true);
    }
  }, [isOpen, userId]);

  // Fetch when page changes
  useEffect(() => {
    if (!isOpen || !userId) return;
    if (page > 1) fetchNotifications(false);
  }, [page]);

  const fetchNotifications = async (reset: boolean = false) => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await notificationApi.getUserNotifications(userId, pageSize);
      if (res.success && res.data) {
        // The endpoint returns an array; we need to handle pagination manually
        // Since the API doesn't return paginated metadata, we assume all are fetched.
        // For proper pagination, you'd need a paginated endpoint (like GET /api/v1/notifications?page=...).
        // We'll treat the whole array as one page for now.
        const newItems = res.data;
        setNotifications((prev) => (reset ? newItems : [...prev, ...newItems]));
        setHasMore(newItems.length === pageSize);
      } else {
        throw new Error(res.message || "Failed to load notifications");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    if (!userId) return;
    try {
      const res = await notificationApi.getUserUnreadCount(userId);
      if (res.success) {
        const count = res.data;
        setUnreadCount(count);
        onUnreadCountChange?.(count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await notificationApi.markNotificationRead(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        const newUnreadCount = Math.max(0, unreadCount - 1);
        setUnreadCount(newUnreadCount);
        onUnreadCountChange?.(newUnreadCount);
      } else {
        throw new Error(res.message as string);
      }
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      const res = await notificationApi.markAllNotificationsRead(userId);
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        onUnreadCountChange?.(0);
      } else {
        throw new Error(res.error || "Failed to mark all as read");
      }
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
    });
    if (!confirmed) return;

    try {
      const res = await notificationApi.deleteNotification(id);
      if (res.success) {
        const wasUnread =
          notifications.find((n) => n.id === id)?.isRead === false;
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        if (wasUnread) {
          const newUnreadCount = Math.max(0, unreadCount - 1);
          setUnreadCount(newUnreadCount);
          onUnreadCountChange?.(newUnreadCount);
        }
      } else {
        throw new Error(res.message || "Delete failed");
      }
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message });
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const isLongMessage = (msg: string) => msg.length > 100;

  const getTypeIcon = (type?: string) => {
    const colorMap: Record<string, string> = {
      success: "var(--accent-green)",
      warning: "var(--accent-amber)",
      error: "var(--accent-red)",
      info: "var(--accent-blue)",
    };
    const bgColor = colorMap[type || "info"] || "var(--text-tertiary)";
    return (
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: bgColor }}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--card-bg)] border-l border-[var(--border-color)] shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[var(--accent-blue)]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-[var(--accent-blue)]">
                    ({unreadCount} unread)
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
            >
              <X className="w-5 h-5 text-[var(--text-tertiary)]" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-end gap-2 p-2 border-b border-[var(--border-color)]">
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)] rounded transition-colors disabled:opacity-50"
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading && notifications.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-blue)]" />
              </div>
            ) : error ? (
              <div className="text-center p-6">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-[var(--accent-red)]" />
                <p className="text-sm text-[var(--text-primary)]">{error}</p>
                <button
                  onClick={() => {
                    setPage(1);
                    setNotifications([]);
                    fetchNotifications(true);
                  }}
                  className="mt-3 px-4 py-2 bg-[var(--accent-blue)] text-white rounded text-sm"
                >
                  Retry
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-6">
                <Bell className="w-10 h-10 mx-auto mb-2 text-[var(--text-tertiary)]" />
                <p className="text-sm text-[var(--text-primary)]">
                  No notifications yet
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  When you get notifications, they'll appear here.
                </p>
              </div>
            ) : (
              <>
                {notifications.map((n) => {
                  const expanded = expandedIds.has(n.id);
                  const longMessage = isLongMessage(n.message || "");
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleMarkAsRead(n.id)}
                      className={`group relative p-3 rounded-lg border cursor-pointer ${
                        n.isRead
                          ? "border-[var(--border-color)] bg-[var(--card-secondary-bg)]"
                          : "border-[var(--accent-blue)] bg-[var(--accent-blue-light)]"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              n.isRead
                                ? "text-[var(--text-secondary)]"
                                : "text-[var(--text-primary)]"
                            }`}
                          >
                            {n.title}
                          </p>
                          <div className="mt-1">
                            <p
                              className={`text-xs text-[var(--text-tertiary)] ${
                                !expanded ? "line-clamp-2" : ""
                              }`}
                            >
                              {n.message}
                            </p>
                            {longMessage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded(n.id);
                                }}
                                className="mt-1 text-xs text-[var(--accent-blue)] hover:underline flex items-center gap-1"
                              >
                                {expanded ? (
                                  <>
                                    Show less <ChevronUp className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    Read more{" "}
                                    <ChevronDown className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-[var(--text-tertiary)] mt-2">
                            {format(
                              new Date(n.createdAt),
                              "MMM dd, yyyy • hh:mm a",
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(n.id);
                              }}
                              className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-4 h-4 text-[var(--accent-blue)]" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(n.id);
                            }}
                            className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-[var(--accent-red)]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {hasMore && (
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="w-full py-2 text-sm text-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)] rounded transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "Load more"
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <NotificationViewDialog
        isOpen={notificationView.isOpen}
        notification={notificationView.notification}
        loading={notificationView.loading}
        onClose={notificationView.close}
      />
    </div>
  );
};
