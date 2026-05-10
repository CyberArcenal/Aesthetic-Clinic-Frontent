// src/pages/payments/hooks/usePaymentView.ts
import { useState } from "react";
import billingApi, { type PaymentResponseDto } from "@/api/core/billing";
import { showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";

interface UsePaymentViewReturn {
  payment: PaymentResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const usePaymentView = (): UsePaymentViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [payment, setPayment] = useState<PaymentResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading payment details...");
    try {
      const res = await billingApi.getPayment(id);
      if (!res.success) throw new Error(res.error as string);
      setPayment(res.data);
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
    setPayment(null);
  };

  return { payment, loading, isOpen, open, close };
};

export default usePaymentView;