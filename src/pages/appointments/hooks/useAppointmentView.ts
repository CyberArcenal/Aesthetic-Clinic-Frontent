// src/pages/appointments/hooks/useAppointmentView.ts
import { useState } from "react";
import type { AppointmentResponseDto } from "../../../api/core/appointment";
import appointmentApi from "../../../api/core/appointment";
import { hideLoading, showLoading } from "../../../utils/notification";
import { dialogs } from "../../../utils/dialogs";


interface UseAppointmentViewReturn {
  appointment: AppointmentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const useAppointmentView = (): UseAppointmentViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading appointment details...");
    try {
      const res = await appointmentApi.getAppointment(id);
      if (!res.success) throw new Error(res.message as string);
      setAppointment(res.data);
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
    setAppointment(null);
  };

  return { appointment, loading, isOpen, open, close };
};

export default useAppointmentView;