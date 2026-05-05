// src/pages/packages/components/PackageFormDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";

interface PackageFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  packageId: number | null;
  initialData: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PackageFormDialog: React.FC<PackageFormDialogProps> = ({ isOpen, mode, onClose, onSuccess }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Create Package" : "Edit Package"} size="lg">
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">Package form will be implemented here.</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-2">(Coming soon)</p>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={onClose}>Save (placeholder)</Button>
      </div>
    </Modal>
  );
};

export default PackageFormDialog;