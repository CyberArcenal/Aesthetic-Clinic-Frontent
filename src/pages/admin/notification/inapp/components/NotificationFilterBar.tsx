// src/pages/notifications/inapp/components/NotificationFilterBar.tsx
import React from "react";
import type { NotificationFilters } from "../hooks/useInAppNotifications";

interface NotificationFilterBarProps {
  filters: NotificationFilters;
  onFilterChange: (filter: NotificationFilters) => void;
  onReset: () => void;
  hasNotifications: boolean;
}

const NotificationFilterBar: React.FC<NotificationFilterBarProps> = ({ filters, onFilterChange, onReset, hasNotifications }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange({ status: "all" })}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            filters.status === "all" ? "bg-[var(--primary-color)] text-white" : "bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange({ status: "unread" })}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            filters.status === "unread" ? "bg-[var(--primary-color)] text-white" : "bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)]"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => onFilterChange({ status: "read" })}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            filters.status === "read" ? "bg-[var(--primary-color)] text-white" : "bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)]"
          }`}
        >
          Read
        </button>
      </div>
      {hasNotifications && (
        <button onClick={onReset} className="text-xs text-[var(--primary-color)] hover:underline">
          Reset
        </button>
      )}
    </div>
  );
};

export default NotificationFilterBar;