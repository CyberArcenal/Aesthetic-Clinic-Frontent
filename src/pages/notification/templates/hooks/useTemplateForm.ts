// src/pages/notifications/templates/hooks/useTemplateForm.ts
import { useState } from "react";
import type { NotificationTemplateResponseDto } from "@/api/notification";

export type FormMode = "add" | "edit";

interface UseTemplateFormReturn {
  isOpen: boolean;
  mode: FormMode;
  templateId: number | null;
  initialData: Partial<NotificationTemplateResponseDto> | null;
  openAdd: () => void;
  openEdit: (template: NotificationTemplateResponseDto) => void;
  close: () => void;
}

const useTemplateForm = (): UseTemplateFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<NotificationTemplateResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setTemplateId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (template: NotificationTemplateResponseDto) => {
    setMode("edit");
    setTemplateId(template.id);
    setInitialData(template);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, templateId, initialData, openAdd, openEdit, close };
};

export default useTemplateForm;