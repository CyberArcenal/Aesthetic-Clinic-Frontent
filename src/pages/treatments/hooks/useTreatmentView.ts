// src/pages/treatments/hooks/useTreatmentView.ts
import { useState } from "react";
import { showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import treatmentApi, { TreatmentResponseDto } from "@/api/core/treatment";

interface UseTreatmentViewReturn {
  treatment: TreatmentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const useTreatmentView = (): UseTreatmentViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [treatment, setTreatment] = useState<TreatmentResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading treatment details...");
    try {
      const res = await treatmentApi.getTreatment(id);
      if (!res.success) throw new Error(res.error as string);
      setTreatment(res.data);
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
      setIsOpen(false);
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  const close = () => {
    setIsOpen(false);
    setTreatment(null);
  };

  return { treatment, loading, isOpen, open, close };
};

export default useTreatmentView;