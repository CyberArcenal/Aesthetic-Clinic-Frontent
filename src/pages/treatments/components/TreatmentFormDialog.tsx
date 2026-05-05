// src/pages/treatments/components/TreatmentFormDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { TreatmentResponseDto } from "@/api/core/treatment";

interface TreatmentFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  treatmentId: number | null;
  initialData: Partial<TreatmentResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

const TreatmentFormDialog: React.FC<TreatmentFormDialogProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess,
}) => {
  // Placeholder – full form will be added later
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Treatment" : "Edit Treatment"}
      size="md"
    >
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">
          Treatment form will be implemented here.
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

export default TreatmentFormDialog;
