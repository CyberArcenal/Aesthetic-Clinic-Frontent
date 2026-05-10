// src/pages/clients/hooks/useClientForm.ts
import { useState } from "react";
import type { ClientResponseDto } from "../../../../api/core/client";

export type FormMode = "add" | "edit";

interface UseClientFormReturn {
  isOpen: boolean;
  mode: FormMode;
  clientId: number | null;
  initialData: Partial<ClientResponseDto> | null;
  openAdd: () => void;
  openEdit: (client: ClientResponseDto) => void;
  close: () => void;
}

const useClientForm = (): UseClientFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [clientId, setClientId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<ClientResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setClientId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (client: ClientResponseDto) => {
    setMode("edit");
    setClientId(client.id);
    setInitialData(client);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return { isOpen, mode, clientId, initialData, openAdd, openEdit, close };
};

export default useClientForm;