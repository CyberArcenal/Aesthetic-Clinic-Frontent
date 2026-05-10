// src/pages/appointments/hooks/useAppointmentForm.ts
import { useState } from "react";
import type { AppointmentResponseDto } from "../../../../api/core/appointment";

export type FormMode = "add" | "edit";

interface UseAppointmentFormReturn {
  isOpen: boolean;
  mode: FormMode;
  appointmentId: number | null;
  initialData: Partial<AppointmentResponseDto> | null;
  openAdd: () => void;
  openEdit: (appointment: AppointmentResponseDto) => void;
  close: () => void;
}

const useAppointmentForm = (): UseAppointmentFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<AppointmentResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setAppointmentId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (appointment: AppointmentResponseDto) => {
    setMode("edit");
    setAppointmentId(appointment.id);
    setInitialData(appointment);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, appointmentId, initialData, openAdd, openEdit, close };
};

export default useAppointmentForm;