// src/pages/packages/hooks/usePackageView.ts
import { useState } from "react";
import { showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import packageApi, { PackageDto } from "@/api/core/package";

interface UsePackageViewReturn {
  pkg: PackageDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const usePackageView = (): UsePackageViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [pkg, setPkg] = useState<PackageDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading package details...");
    try {
      const res = await packageApi.getPackage(id);
      if (!res.success) throw new Error(res.message as string);
      setPkg(res.data);
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
    setPkg(null);
  };

  return { pkg, loading, isOpen, open, close };
};

export default usePackageView;