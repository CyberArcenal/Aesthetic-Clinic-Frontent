import { useState, useEffect } from "react";
import billingApi, { InvoiceResponseDto } from "@/api/core/billing";

interface PaymentFormDataOptions {
  invoices: InvoiceResponseDto[];
  loading: boolean;
  error: string | null;
}

export const usePaymentFormData = (): PaymentFormDataOptions => {
  const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        // Fetch all invoices (paginated, but we'll get first page with large pageSize to have options)
        const res = await billingApi.getInvoices({ page: 1, pageSize: 1000 });
        if (res.success) {
          // Filter invoices that have balance due > 0
          const unpaid = res.data.items.filter(inv => inv.balanceDue > 0);
          setInvoices(unpaid);
        } else {
          throw new Error(res.message || "Failed to load invoices");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return { invoices, loading, error };
};