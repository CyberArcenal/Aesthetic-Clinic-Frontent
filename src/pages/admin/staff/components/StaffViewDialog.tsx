// src/pages/staff/components/StaffViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { StaffResponseDto } from "@/api/core/staff";
import { formatDate, formatDateTime } from "@/utils/formatters";
import { User, Mail, Phone, Briefcase, Calendar, Edit, Trash2, UserCog } from "lucide-react";

interface StaffViewDialogProps {
  staff: StaffResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (staff: StaffResponseDto) => void;
  onDelete?: (staff: StaffResponseDto) => void;
}

const StaffViewDialog: React.FC<StaffViewDialogProps> = ({
  staff,
  loading,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Staff Details" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!staff) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Staff Details" size="md">
        <div className="text-center py-8 text-[var(--text-secondary)]">No staff data</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Details" size="md">
      <div className="space-y-4">
        {/* Header with avatar and status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Staff Member</div>
              <div className="text-lg font-bold">{staff.name}</div>
            </div>
          </div>
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              staff.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {staff.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Position</div>
              <div className="font-medium">{staff.position || "Not specified"}</div>
            </div>
          </div>

          {staff.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">Email Address</div>
                <div className="font-medium">{staff.email}</div>
              </div>
            </div>
          )}

          {staff.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">Phone Number</div>
                <div className="font-medium">{staff.phone}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Member Since</div>
              <div className="font-medium">{formatDate(staff.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
            {onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(staff)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(staff)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default StaffViewDialog;