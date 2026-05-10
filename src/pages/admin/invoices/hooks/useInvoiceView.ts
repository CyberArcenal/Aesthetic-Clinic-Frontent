// src/pages/invoices/hooks/useInvoiceView.ts
import { useState } from "react";
import type { InvoiceResponseDto } from "../../../../api/core/billing";
import billingApi from "../../../../api/core/billing";
import { hideLoading, showLoading } from "../../../../utils/notification";
import { dialogs } from "../../../../utils/dialogs";


interface UseInvoiceViewReturn {
  invoice: InvoiceResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const useInvoiceView = (): UseInvoiceViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading invoice...");
    try {
      const res = await billingApi.getInvoice(id);
      if (!res.success) throw new Error(res.message as string);
      setInvoice(res.data);
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
    setInvoice(null);
  };

  return { invoice, loading, isOpen, open, close };
};

export default useInvoiceView;