import React from "react";
import type { AppointmentResponseDto } from "../../../../api/core/appointment";
import Modal from "../../../../components/UI/Modal";
import Button from "../../../../components/UI/Button";

interface DayAppointmentsModalProps {
  isOpen: boolean;
  date: Date | null;
  appointments: AppointmentResponseDto[];
  onClose: () => void;
  onViewAppointment?: (id: number) => void;
}

const DayAppointmentsModal: React.FC<DayAppointmentsModalProps> = ({
  isOpen,
  date,
  appointments,
  onClose,
  onViewAppointment,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Appointments for ${date?.toLocaleDateString() || ""}`} size="lg">
      {appointments.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">No appointments on this day.</div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => onViewAppointment?.(apt.id)}
              className="p-3 rounded-md border cursor-pointer hover:bg-[var(--card-secondary-bg)] transition-colors"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium" style={{ color: "var(--sidebar-text)" }}>
                    {apt.clientName || `Client #${apt.clientId}`}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {apt.treatmentName || "Treatment"} • {new Date(apt.appointmentDateTime).toLocaleTimeString()}
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `var(--accent-${apt.status === "Confirmed" ? "green" : apt.status === "Cancelled" ? "red" : "blue"})`,
                    color: "white",
                  }}
                >
                  {apt.status || "Scheduled"}
                </span>
              </div>
              {apt.notes && <div className="text-xs text-[var(--text-tertiary)] mt-1">{apt.notes}</div>}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default DayAppointmentsModal;