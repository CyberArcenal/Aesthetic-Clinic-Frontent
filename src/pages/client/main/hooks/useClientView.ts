// src/pages/clients/hooks/useClientView.ts
import { useState } from "react";
import type { ClientResponseDto } from "../../../../api/core/client";
import { hideLoading, showLoading } from "../../../../utils/notification";
import clientApi from "../../../../api/core/client";
import { dialogs } from "../../../../utils/dialogs";

interface UseClientViewReturn {
  client: ClientResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const useClientView = (): UseClientViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [client, setClient] = useState<ClientResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading client details...");
    try {
      const res = await clientApi.getClient(id);
      if (!res.success) throw new Error(res.message as string);
      setClient(res.data);
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
    setClient(null);
  };

  return { client, loading, isOpen, open, close };
};

export default useClientView;