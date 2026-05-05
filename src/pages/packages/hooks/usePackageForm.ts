// src/pages/packages/hooks/usePackageForm.ts
import { PackageDto } from "@/api/core/package";
import { useState } from "react";

export type FormMode = "add" | "edit";

interface UsePackageFormReturn {
  isOpen: boolean;
  mode: FormMode;
  packageId: number | null;
  initialData: Partial<PackageDto> | null;
  openAdd: () => void;
  openEdit: (pkg: PackageDto) => void;
  close: () => void;
}

const usePackageForm = (): UsePackageFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [packageId, setPackageId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<PackageDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setPackageId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (pkg: PackageDto) => {
    setMode("edit");
    setPackageId(pkg.id);
    setInitialData(pkg);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, packageId, initialData, openAdd, openEdit, close };
};

export default usePackageForm;