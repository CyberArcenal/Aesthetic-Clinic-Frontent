// src/pages/notifications/templates/components/TemplateFormDialog.tsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import notificationApi, { CreateNotificationTemplateDto, UpdateNotificationTemplateDto } from "@/api/core/notification";


interface TemplateFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  templateId: number | null;
  initialData: any;
  onClose: () => void;
  onSuccess: () => void;
}

const TemplateFormDialog: React.FC<TemplateFormDialogProps> = ({ isOpen, mode, templateId, initialData, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSubject(initialData.subject || "");
      setContent(initialData.content || "");
    } else {
      setName("");
      setSubject("");
      setContent("");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name.trim() || !subject.trim() || !content.trim()) {
      dialogs.alert({ title: "Error", message: "All fields are required", icon: "warning" });
      return;
    }
    setLoading(true);
    showLoading(mode === "add" ? "Creating template..." : "Updating template...");
    try {
      if (mode === "add") {
        const data: CreateNotificationTemplateDto = { name, subject, content };
        const res = await notificationApi.createTemplate(data);
        if (!res.success) throw new Error(res.message as string);
        showToast("Template created", "success");
      } else {
        if (!templateId) throw new Error("No template ID");
        const data: UpdateNotificationTemplateDto = { name, subject, content };
        const res = await notificationApi.updateTemplate(templateId, data);
        if (!res.success) throw new Error(res.message as string);
        showToast("Template updated", "success");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Create Template" : "Edit Template"} size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Template Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="compact-input w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="compact-input w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} className="compact-input w-full border rounded-md px-3 py-2" />
          <p className="text-xs text-[var(--text-secondary)] mt-1">Use placeholders like <code className="bg-[var(--card-secondary-bg)] px-1 rounded">{`{ ClientName }`}</code> etc.</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </Modal>
  );
};

export default TemplateFormDialog;