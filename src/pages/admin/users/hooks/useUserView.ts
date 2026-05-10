// src/pages/users/hooks/useUserView.ts
import { useState } from "react";
import { showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import userApi, { UserResponseDto } from "@/api/core/user";

interface UseUserViewReturn {
  user: UserResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  open: (id: number) => Promise<void>;
  close: () => void;
}

const useUserView = (): UseUserViewReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(false);

  const open = async (id: number) => {
    setLoading(true);
    setIsOpen(true);
    showLoading("Loading user details...");
    try {
      const res = await userApi.getUser(id);
      if (!res.success) throw new Error(res.message as string);
      setUser(res.data);
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
    setUser(null);
  };

  return { user, loading, isOpen, open, close };
};

export default useUserView;