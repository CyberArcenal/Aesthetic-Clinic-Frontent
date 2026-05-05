// src/pages/notifications/templates/hooks/useTemplateView.ts
import { useState } from "react";
import { showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import notificationApi, { NotificationTemplateResponseDto } from "@/api/core/notification";

interface UseTemplateViewReturn {
  template: NotificationTemplateResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const useTemplateView = (): UseTemplateViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [template, setTemplate] = useState<NotificationTemplateResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading template...");
    try {
      const res = await notificationApi.getTemplate(id);
      if (!res.success) throw new Error(res.message as string);
      setTemplate(res.data);
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
      setIsOpen(false);
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const close = () => {
    setIsOpen(false);
    setTemplate(null);
  };

  return { template, loading, isOpen, open, close };
};

export default useTemplateView;