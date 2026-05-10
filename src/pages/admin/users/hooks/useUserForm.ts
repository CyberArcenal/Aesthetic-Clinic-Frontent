// src/pages/users/hooks/useUserForm.ts
import { UserResponseDto } from "@/api/core/user";
import { useState } from "react";

export type FormMode = "add" | "edit";

interface UseUserFormReturn {
  isOpen: boolean;
  mode: FormMode;
  userId: number | null;
  initialData: Partial<UserResponseDto> | null;
  openAdd: () => void;
  openEdit: (user: UserResponseDto) => void;
  close: () => void;
}

const useUserForm = (): UseUserFormReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormMode>("add");
  const [userId, setUserId] = useState<number | null>(null);
  const [initialData, setInitialData] = useState<Partial<UserResponseDto> | null>(null);

  const openAdd = () => {
    setMode("add");
    setUserId(null);
    setInitialData(null);
    setIsOpen(true);
  };

  const openEdit = (user: UserResponseDto) => {
    setMode("edit");
    setUserId(user.id);
    setInitialData(user);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, mode, userId, initialData, openAdd, openEdit, close };
};

export default useUserForm;