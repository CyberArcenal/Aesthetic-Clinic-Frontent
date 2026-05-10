// src/pages/appointments/hooks/useAppointmentFormData.ts
import clientApi, { ClientResponseDto } from "@/api/core/client";
import treatmentApi, { TreatmentResponseDto } from "@/api/core/treatment";
import { useState, useEffect } from "react";

interface FormDataOptions {
  clients: ClientResponseDto[];
  treatments: TreatmentResponseDto[];
  loading: boolean;
  error: string | null;
}

export const useAppointmentFormData = (): FormDataOptions => {
  const [clients, setClients] = useState<ClientResponseDto[]>([]);
  const [treatments, setTreatments] = useState<TreatmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [clientsRes, treatmentsRes] = await Promise.all([
          clientApi.getClients({ page: 1, pageSize: 1000 }),
          treatmentApi.getTreatments({ page: 1, pageSize: 1000 }),
        ]);
        if (clientsRes.success) setClients(clientsRes.data.items);
        if (treatmentsRes.success) setTreatments(treatmentsRes.data.items);
      } catch (err: any) {
        setError(err.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { clients, treatments, loading, error };
};