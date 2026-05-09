// src/pages/public/treatments/hooks/usePublicTreatmentDetail.ts
import treatmentApi, { TreatmentResponseDto } from "@/api/core/treatment";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export const usePublicTreatmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [treatment, setTreatment] = useState<TreatmentResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatment = async () => {
      if (!id) {
        setError("Treatment ID not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await treatmentApi.getTreatment(parseInt(id));
        if (res.success && res.data) {
          setTreatment(res.data);
        } else {
          setError(res.message || "Treatment not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load treatment");
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id]);

  return { treatment, loading, error };
};