// src/pages/treatments/components/TreatmentViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import { TreatmentResponseDto } from "@/api/core/treatment";
import { formatCurrency } from "@/utils/formatters";


interface TreatmentViewDialogProps {
  treatment: TreatmentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const TreatmentViewDialog: React.FC<TreatmentViewDialogProps> = ({ treatment, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Treatment Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : treatment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Name</div>
              <div className="text-sm font-medium">{treatment.name}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Category</div>
              <div className="text-sm">{treatment.category || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Duration</div>
              <div className="text-sm">{treatment.durationMinutes} minutes</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Price</div>
              <div className="text-sm font-medium">{formatCurrency(treatment.price)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Status</div>
              <div className="text-sm">{treatment.isActive ? "Active" : "Inactive"}</div>
            </div>
          </div>
          {treatment.description && (
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Description</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{treatment.description}</div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No treatment data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default TreatmentViewDialog;