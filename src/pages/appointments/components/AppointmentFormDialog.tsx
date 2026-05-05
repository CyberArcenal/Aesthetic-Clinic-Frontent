// src/pages/appointments/components/AppointmentFormDialog.tsx
import React from "react";
import type { AppointmentResponseDto } from "../../../api/core/appointment";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";

interface AppointmentFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  appointmentId: number | null;
  initialData: Partial<AppointmentResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  isOpen,
  mode,
  appointmentId,
  initialData,
  onClose,
  onSuccess,
}) => {
  // Placeholder – full form will be added later
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Book Appointment" : "Edit Appointment"}
      size="md"
    >
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">
          Appointment form will be implemented here.
        </p>
        <p className="text-sm text-[var(--text-tertiary)] mt-2">
          (Coming soon)
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={onClose}>
          Save (placeholder)
        </Button>
      </div>
    </Modal>
  );
};

export default AppointmentFormDialog;
