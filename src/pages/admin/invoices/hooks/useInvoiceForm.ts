// src/pages/invoices/hooks/useInvoiceForm.ts
import { useState } from "react";
import type { InvoiceResponseDto } from "../../../../api/core/billing";

export type FormMode = "add" | "edit";

interface UseInvoiceFormReturn {
  isOpen: boolean;
  mode: FormMode;
  invoiceId: number | null;
  initialData: Partial<InvoiceResponseDto> | null;
  openAdd: () => void;
  openEdit: (invoice: InvoiceResponseDto) => void;
  close: () => void;
}

const useInvoiceForm = (): UseInvoiceFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<InvoiceResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setInvoiceId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (invoice: InvoiceResponseDto) => {
    setMode("edit");
    setInvoiceId(invoice.id);
    setInitialData(invoice);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, invoiceId, initialData, openAdd, openEdit, close };
};

export default useInvoiceForm;