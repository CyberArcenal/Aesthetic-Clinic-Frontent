// src/pages/notifications/templates/components/TemplateViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import { NotificationTemplateResponseDto } from "@/api/core/notification";
import { formatDate } from "@/utils/formatters";
import Button from "@/components/UI/Button";


interface TemplateViewDialogProps {
  template: NotificationTemplateResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const TemplateViewDialog: React.FC<TemplateViewDialogProps> = ({ template, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Template Details" size="lg">
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : template ? (
        <div className="space-y-4">
          <div><label className="text-xs font-medium">Name</label><div className="mt-1">{template.name}</div></div>
          <div><label className="text-xs font-medium">Subject</label><div className="mt-1">{template.subject}</div></div>
          <div><label className="text-xs font-medium">Content</label><div className="mt-1 p-2 bg-[var(--card-secondary-bg)] rounded-md whitespace-pre-wrap">{template.content}</div></div>
          <div><label className="text-xs font-medium">Created</label><div className="mt-1">{formatDate(template.createdAt)}</div></div>
        </div>
      ) : (
        <p>No data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default TemplateViewDialog;