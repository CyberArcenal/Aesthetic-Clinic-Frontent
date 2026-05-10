import { useState, useEffect } from "react";
import roleApi, { RoleResponseDto } from "@/api/core/role";

interface UserFormDataOptions {
  roles: RoleResponseDto[];
  loading: boolean;
  error: string | null;
}

export const useUserFormData = (): UserFormDataOptions => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await roleApi.getRoles();
        if (res.success) {
          setRoles(res.data);
        } else {
          throw new Error(res.message || "Failed to load roles");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return { roles, loading, error };
};