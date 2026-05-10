// src/pages/staff/hooks/useStaffForm.ts
import { StaffResponseDto } from "@/api/core/staff";
import { useState } from "react";

export type FormMode = "add" | "edit";

interface UseStaffFormReturn {
  isOpen: boolean;
  mode: FormMode;
  staffId: number | null;
  initialData: Partial<StaffResponseDto> | null;
  openAdd: () => void;
  openEdit: (staff: StaffResponseDto) => void;
  close: () => void;
}

const useStaffForm = (): UseStaffFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [staffId, setStaffId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<StaffResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setStaffId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (staff: StaffResponseDto) => {
    setMode("edit");
    setStaffId(staff.id);
    setInitialData(staff);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, staffId, initialData, openAdd, openEdit, close };
};

export default useStaffForm;