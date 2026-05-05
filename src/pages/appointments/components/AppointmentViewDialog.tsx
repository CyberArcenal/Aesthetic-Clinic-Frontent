// src/pages/appointments/components/AppointmentViewDialog.tsx
import React from "react";
import Modal from "../../../components/UI/Modal";
import type { AppointmentResponseDto } from "../../../api/core/appointment";
import { formatDateTime } from "../../../utils/formatters";


interface AppointmentViewDialogProps {
  appointment: AppointmentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentViewDialog: React.FC<AppointmentViewDialogProps> = ({ appointment, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : appointment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-xs text-[var(--text-secondary)]">Client</div><div className="text-sm font-medium">{appointment.clientName || `ID ${appointment.clientId}`}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Treatment</div><div className="text-sm">{appointment.treatmentName || `ID ${appointment.treatmentId}`}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Date & Time</div><div className="text-sm">{formatDateTime(appointment.appointmentDateTime, true)}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Duration</div><div className="text-sm">{appointment.durationMinutes} minutes</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Staff</div><div className="text-sm">{appointment.assignedStaff || "Not assigned"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Status</div><div className="text-sm">{appointment.status}</div></div>
          </div>
          {appointment.notes && (
            <div><div className="text-xs text-[var(--text-secondary)]">Notes</div><div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{appointment.notes}</div></div>
          )}
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No data</p>
      )}
    </Modal>
  );
};

export default AppointmentViewDialog;