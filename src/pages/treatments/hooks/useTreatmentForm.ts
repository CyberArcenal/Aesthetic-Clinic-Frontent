// src/pages/treatments/hooks/useTreatmentForm.ts
import { TreatmentResponseDto } from "@/api/core/treatment";
import { useState } from "react";

export type FormMode = "add" | "edit";

interface UseTreatmentFormReturn {
  isOpen: boolean;
  mode: FormMode;
  treatmentId: number | null;
  initialData: Partial<TreatmentResponseDto> | null;
  openAdd: () => void;
  openEdit: (treatment: TreatmentResponseDto) => void;
  close: () => void;
}

const useTreatmentForm = (): UseTreatmentFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [treatmentId, setTreatmentId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<TreatmentResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setTreatmentId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (treatment: TreatmentResponseDto) => {
    setMode("edit");
    setTreatmentId(treatment.id);
    setInitialData(treatment);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, treatmentId, initialData, openAdd, openEdit, close };
};

export default useTreatmentForm;