// src/renderer/pages/notifications/hooks/useNotificationView.ts
import { useState } from 'react';
import { showError } from '../../../utils/notification';
import notificationApi, { type NotificationResponseDto } from '../../../api/core/notification';


export const useNotificationView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationResponseDto | null>(null);

  const open = async (id: number) => {
    setIsOpen(true);
    setLoading(true);
    try {
      const response = await notificationApi.getUserNotification(id);
      if (!response.success) throw new Error(response.message as string);
      setNotification(response.data);
    } catch (err: any) {
      showError(err.message || 'Failed to load notification');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setNotification(null);
  };

  return {
    isOpen,
    loading,
    notification,
    open,
    close,
  };
};