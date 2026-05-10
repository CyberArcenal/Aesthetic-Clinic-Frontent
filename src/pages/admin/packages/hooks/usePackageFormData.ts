import { useState, useEffect } from "react";
import treatmentApi, { TreatmentResponseDto } from "@/api/core/treatment";

interface PackageFormDataOptions {
  treatments: TreatmentResponseDto[];
  loading: boolean;
  error: string | null;
}

export const usePackageFormData = (): PackageFormDataOptions => {
  const [treatments, setTreatments] = useState<TreatmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      setLoading(true);
      try {
        // Fetch only active treatments
        const res = await treatmentApi.getTreatments({ page: 1, pageSize: 1000 });
        if (res.success) {
          setTreatments(res.data.items.filter(t => t.isActive));
        } else {
          throw new Error(res.message || "Failed to load treatments");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load treatments");
      } finally {
        setLoading(false);
      }
    };
    fetchTreatments();
  }, []);

  return { treatments, loading, error };
};