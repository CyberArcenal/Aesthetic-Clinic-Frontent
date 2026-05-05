// src/pages/photos/hooks/useClientSearch.ts
import clientApi, { ClientResponseDto } from "@/api/core/client";
import debounce from "@/utils/debounce";
import { useState, useEffect, useMemo } from "react";

interface UseClientSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clients: ClientResponseDto[];
  loading: boolean;
  selectedClient: ClientResponseDto | null;
  setSelectedClient: (client: ClientResponseDto | null) => void;
}

const useClientSearch = (): UseClientSearchReturn => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<ClientResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientResponseDto | null>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (term: string) => {
        if (!term.trim()) {
          setClients([]);
          return;
        }
        setLoading(true);
        try {
          const res = await clientApi.getClients({ page: 1, pageSize: 20, search: term });
          if (res.success) {
            setClients(res.data.items);
          } else {
            setClients([]);
          }
        } catch {
          setClients([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return { searchTerm, setSearchTerm, clients, loading, selectedClient, setSelectedClient };
};

export default useClientSearch;