// src/pages/users/hooks/useRoleAssignment.ts
import { UserResponseDto } from "@/api/core/user";
import { useState } from "react";

interface UseRoleAssignmentReturn {
  isOpen: boolean;
  user: UserResponseDto | null;
  open: (user: UserResponseDto) => void;
  close: () => void;
}

const useRoleAssignment = (): UseRoleAssignmentReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserResponseDto | null>(null);

  const open = (u: UserResponseDto) => {
    setUser(u);
    setIsOpen(true);
  };

  const close = () => {
    setUser(null);
    setIsOpen(false);
  };

  return { isOpen, user, open, close };
};

export default useRoleAssignment;