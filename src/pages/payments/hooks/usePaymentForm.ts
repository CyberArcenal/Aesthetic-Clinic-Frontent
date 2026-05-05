// src/pages/payments/hooks/usePaymentForm.ts
import { useState } from "react";
import type { PaymentResponseDto } from "../../../api/core/billing";

export type FormMode = "add" | "edit";

interface UsePaymentFormReturn {
  isOpen: boolean;
  mode: FormMode;
  paymentId: number | null;
  initialData: Partial<PaymentResponseDto> | null;
  openAdd: () => void;
  openEdit: (payment: PaymentResponseDto) => void;
  close: () => void;
}

const usePaymentForm = (): UsePaymentFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<PaymentResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setPaymentId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (payment: PaymentResponseDto) => {
    setMode("edit");
    setPaymentId(payment.id);
    setInitialData(payment);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, paymentId, initialData, openAdd, openEdit, close };
};

export default usePaymentForm;