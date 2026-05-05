// src/pages/staff/components/StaffFormDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { StaffResponseDto } from "@/api/core/staff";

interface StaffFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  staffId: number | null;
  initialData: Partial<StaffResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

const StaffFormDialog: React.FC<StaffFormDialogProps> = ({ isOpen, mode, onClose, onSuccess }) => {
  // Placeholder – full form will be added later
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Add Staff Member" : "Edit Staff Member"} size="md">
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">Staff form will be implemented here.</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-2">(Coming soon)</p>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={onClose}>Save (placeholder)</Button>
      </div>
    </Modal>
  );
};

export default StaffFormDialog;