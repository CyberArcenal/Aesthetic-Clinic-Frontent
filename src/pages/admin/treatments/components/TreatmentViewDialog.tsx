// src/pages/treatments/components/TreatmentViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { TreatmentResponseDto } from "@/api/core/treatment";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Stethoscope, Clock, DollarSign, Tag, FileText, Calendar, Edit, Trash2 } from "lucide-react";

interface TreatmentViewDialogProps {
  treatment: TreatmentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (treatment: TreatmentResponseDto) => void;
  onDelete?: (treatment: TreatmentResponseDto) => void;
}

const TreatmentViewDialog: React.FC<TreatmentViewDialogProps> = ({
  treatment,
  loading,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Treatment Details" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!treatment) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Treatment Details" size="md">
        <div className="text-center py-8 text-[var(--text-secondary)]">No treatment data</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Treatment Details" size="md">
      <div className="space-y-4">
        {/* Header with name and status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Treatment</div>
              <div className="text-lg font-bold">{treatment.name}</div>
            </div>
          </div>
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              treatment.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {treatment.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-3">
          {treatment.category && (
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">Category</div>
                <div className="font-medium">{treatment.category}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Duration</div>
              <div className="font-medium">{treatment.durationMinutes} minutes</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Price</div>
              <div className="font-semibold text-lg">{formatCurrency(treatment.price)}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Created</div>
              <div className="font-medium">{formatDateTime(treatment.createdAt)}</div>
            </div>
          </div>

          {treatment.description && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-[var(--text-secondary)]">Description</div>
                <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{treatment.description}</div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
            {onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(treatment)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(treatment)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TreatmentViewDialog;