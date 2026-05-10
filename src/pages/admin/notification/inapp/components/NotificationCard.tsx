// src/pages/notifications/inapp/components/NotificationCard.tsx
import React from "react";
import { Eye, Trash2, CheckCheck, Bell, AlertCircle, CheckCircle, Info } from "lucide-react";
import { NotificationResponseDto } from "@/api/core/notification";
import { formatDateTime } from "@/utils/formatters";

interface NotificationCardProps {
  notification: NotificationResponseDto;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const getTypeIcon = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-[var(--accent-green)]" />;
    case "warning":
      return <AlertCircle className="w-5 h-5 text-[var(--accent-orange)]" />;
    case "error":
      return <AlertCircle className="w-5 h-5 text-[var(--accent-red)]" />;
    case "info":
      return <Info className="w-5 h-5 text-[var(--accent-blue)]" />;
    default:
      return <Bell className="w-5 h-5 text-[var(--text-secondary)]" />;
  }
};

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead, onDelete }) => {
  return (
    <div
      className={`relative p-4 rounded-lg border transition-all hover:shadow-md ${
        !notification.isRead
          ? "bg-[var(--accent-blue-light)] border-[var(--accent-blue)]"
          : "bg-[var(--card-secondary-bg)] border-[var(--border-color)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`text-sm font-semibold ${!notification.isRead ? "text-[var(--sidebar-text)]" : "text-[var(--text-secondary)]"}`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 ml-2">
              {!notification.isRead && (
                <button
                  onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }}
                  className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                  title="Mark as read"
                >
                  <CheckCheck className="w-4 h-4 text-[var(--accent-green)]" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                className="p-1 hover:bg-[var(--card-hover-bg)] rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-[var(--accent-red)]" />
              </button>
            </div>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{notification.message}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-tertiary)]">
            <span>{formatDateTime(notification.createdAt)}</span>
            {notification.actionUrl && (
              <a href={notification.actionUrl} className="text-[var(--accent-blue)] hover:underline">View details</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;