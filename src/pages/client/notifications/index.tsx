import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { authStore } from "../../../stores/authStore";
import notificationApi from "../../../api/core/notification";
import type { NotificationResponseDto } from "../../../api/core/notification";
import { formatDateTime } from "../../../utils/formatters";
import { showToast } from "../../../utils/notification";

const ClientNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authStore.getUser();

  const fetchNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await notificationApi.getUserNotifications(user.id);
      if (res.success) setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n));
      showToast("Marked as read", "success");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast("Deleted", "success");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-12">Loading notifications...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-gray-500">Stay updated with clinic announcements and reminders.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">No notifications.</div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => (
            <div key={notif.id} className={`bg-white rounded-xl shadow-sm p-4 flex flex-wrap justify-between items-center gap-3 ${!notif.isRead ? 'border-l-4 border-[var(--primary-color)]' : ''}`}>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{notif.title || "Notification"}</p>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(notif.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                {!notif.isRead && (
                  <button onClick={() => markAsRead(notif.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Mark read">
                    <CheckCircle size={18} />
                  </button>
                )}
                <button onClick={() => deleteNotification(notif.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientNotifications;