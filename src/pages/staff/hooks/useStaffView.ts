// src/pages/staff/hooks/useStaffView.ts
import { useState } from "react";
import { showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import staffApi, { StaffResponseDto } from "@/api/core/staff";

interface UseStaffViewReturn {
  staff: StaffResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const useStaffView = (): UseStaffViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState<StaffResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading staff details...");
    try {
      const res = await staffApi.getStaffMember(id);
      if (!res.success) throw new Error(res.message as string);
      setStaff(res.data);
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
    setStaff(null);
  };

  return { staff, loading, isOpen, open, close };
};

export default useStaffView;