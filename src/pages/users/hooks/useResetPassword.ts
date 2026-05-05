// src/pages/users/hooks/useResetPassword.ts
import { useState } from "react";

interface UseResetPasswordReturn {
  isOpen: boolean;
  userId: number | null;
  userEmail: string;
  open: (userId: number, email: string) => void;
  close: () => void;
}

const useResetPassword = (): UseResetPasswordReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const open = (id: number, email: string) => {
    setUserId(id);
    setUserEmail(email);
    setIsOpen(true);
  };

  const close = () => {
    setUserId(null);
    setUserEmail("");
    setIsOpen(false);
  };

  return { isOpen, userId, userEmail, open, close };
};

export default useResetPassword;