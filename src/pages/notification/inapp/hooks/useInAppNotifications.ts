// src/pages/notifications/inapp/hooks/useInAppNotifications.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { authStore } from "@/stores/authStore";
import notificationApi, { NotificationResponseDto } from "@/api/core/notification";

export interface NotificationFilters {
  status: "all" | "unread" | "read";
}

interface UseInAppNotificationsReturn {
  notifications: NotificationResponseDto[];
  paginatedNotifications: NotificationResponseDto[];
  filters: NotificationFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedNotifications: number[];
  setSelectedNotifications: React.Dispatch<React.SetStateAction<number[]>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (filter: NotificationFilters) => void;
  resetFilters: () => void;
  toggleNotificationSelection: (id: number) => void;
  toggleSelectAll: () => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  bulkDelete: () => Promise<void>;
}

const useInAppNotifications = (): UseInAppNotificationsReturn => {
  const [allNotifications, setAllNotifications] = useState<NotificationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<NotificationFilters>({ status: "all" });

  const userId = authStore.getUser()?.id;

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setAllNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await notificationApi.getUserNotifications(userId, 200); // fetch up to 200
      if (!res.success) throw new Error(res.message as string || "Failed to fetch notifications");
      let items = res.data;
      if (filters.status === "unread") {
        items = items.filter((n) => !n.isRead);
      } else if (filters.status === "read") {
        items = items.filter((n) => n.isRead);
      }
      setAllNotifications(items);
      setSelectedNotifications([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, filters.status]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const totalItems = allNotifications.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedNotifications = allNotifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (filter: NotificationFilters) => {
    setFilters(filter);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ status: "all" });
    setCurrentPage(1);
  };

  const toggleNotificationSelection = (id: number) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedNotifications((prev) =>
      prev.length === paginatedNotifications.length ? [] : paginatedNotifications.map((n) => n.id)
    );
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await notificationApi.markNotificationRead(id);
      if (res.success) {
        setAllNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      } else {
        throw new Error(res.message as string);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    try {
      const res = await notificationApi.markAllNotificationsRead(userId);
      if (res.success) {
        setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setSelectedNotifications([]);
      } else {
        throw new Error(res.message as string);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const res = await notificationApi.deleteNotification(id);
      if (res.success) {
        setAllNotifications((prev) => prev.filter((n) => n.id !== id));
        setSelectedNotifications((prev) => prev.filter((i) => i !== id));
      } else {
        throw new Error(res.message as string);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const bulkDelete = async () => {
    if (selectedNotifications.length === 0) return;
    for (const id of selectedNotifications) {
      await deleteNotification(id);
    }
  };

  const reload = () => fetchNotifications();

  const setPageSizeHandler = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    notifications: allNotifications,
    paginatedNotifications,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedNotifications,
    setSelectedNotifications,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleNotificationSelection,
    toggleSelectAll,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    bulkDelete,
  };
};

export default useInAppNotifications;