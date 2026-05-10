import { useState, useEffect } from "react";
import clientApi, { ClientResponseDto } from "@/api/core/client";

interface InvoiceFormDataOptions {
  clients: ClientResponseDto[];
  loading: boolean;
  error: string | null;
}

export const useInvoiceFormData = (): InvoiceFormDataOptions => {
  const [clients, setClients] = useState<ClientResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const res = await clientApi.getClients({ page: 1, pageSize: 1000 });
        if (res.success) {
          setClients(res.data.items);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return { clients, loading, error };
};