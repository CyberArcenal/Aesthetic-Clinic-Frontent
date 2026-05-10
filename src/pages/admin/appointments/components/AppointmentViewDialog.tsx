// src/pages/appointments/components/AppointmentViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { formatDateTime } from "@/utils/formatters";
import { Calendar, Clock, User, Stethoscope, FileText, Tag, Edit, Trash2 } from "lucide-react";
import type { AppointmentResponseDto } from "@/api/core/appointment";

interface AppointmentViewDialogProps {
  appointment: AppointmentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (appointment: AppointmentResponseDto) => void;
  onDelete?: (appointment: AppointmentResponseDto) => void;
}

const statusColors: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  Confirmed: "bg-green-100 text-green-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
  NoShow: "bg-orange-100 text-orange-800",
};

const AppointmentViewDialog: React.FC<AppointmentViewDialogProps> = ({
  appointment,
  loading,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!appointment) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="md">
        <div className="text-center py-8 text-[var(--text-secondary)]">No data available</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="lg">
      <div className="space-y-4">
        {/* Two-column info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Client</div>
              <div className="font-medium">{appointment.clientName || `Client #${appointment.clientId}`}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Stethoscope className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Treatment</div>
              <div className="font-medium">{appointment.treatmentName || `Treatment #${appointment.treatmentId}`}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Date & Time</div>
              <div className="font-medium">{formatDateTime(appointment.appointmentDateTime, true)}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Duration</div>
              <div className="font-medium">{appointment.durationMinutes} minutes</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Staff</div>
              <div className="font-medium">{appointment.assignedStaff || "Not assigned"}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Status</div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[appointment.status || "Scheduled"] || "bg-gray-100 text-gray-800"}`}>
                {appointment.status || "Scheduled"}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div className="flex items-start gap-3 pt-2 border-t border-[var(--border-color)]">
            <FileText className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div className="flex-1">
              <div className="text-xs text-[var(--text-secondary)]">Notes</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{appointment.notes}</div>
            </div>
          </div>
        )}

        {/* Meta info */}
        <div className="text-xs text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-color)]">
          Created: {formatDateTime(appointment.createdAt)}
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-2">
            {onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(appointment)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(appointment)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AppointmentViewDialog;