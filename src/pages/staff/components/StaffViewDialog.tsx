// src/pages/staff/components/StaffViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import { StaffResponseDto } from "@/api/core/staff";
import { formatDate } from "@/utils/formatters";

interface StaffViewDialogProps {
  staff: StaffResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const StaffViewDialog: React.FC<StaffViewDialogProps> = ({ staff, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : staff ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-xs text-[var(--text-secondary)]">Name</div><div className="text-sm font-medium">{staff.name}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Position</div><div className="text-sm">{staff.position || "-"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Email</div><div className="text-sm">{staff.email || "-"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Phone</div><div className="text-sm">{staff.phone || "-"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Status</div><div className="text-sm">{staff.isActive ? "Active" : "Inactive"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Created</div><div className="text-sm">{formatDate(staff.createdAt)}</div></div>
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No staff data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default StaffViewDialog;