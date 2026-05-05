// src/pages/users/components/UserViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import { UserResponseDto } from "@/api/core/user";
import { formatDate } from "@/utils/formatters";

interface UserViewDialogProps {
  user: UserResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const UserViewDialog: React.FC<UserViewDialogProps> = ({ user, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : user ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-xs text-[var(--text-secondary)]">Username</div><div className="text-sm">{user.username}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Full Name</div><div className="text-sm">{user.fullName || "-"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Email</div><div className="text-sm">{user.email}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Status</div><div className="text-sm">{user.isActive ? "Active" : "Inactive"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Roles</div><div className="text-sm">{user.roles?.join(", ") || "-"}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Created</div><div className="text-sm">{formatDate(user.createdAt)}</div></div>
            {user.lastLoginAt && <div><div className="text-xs text-[var(--text-secondary)]">Last Login</div><div className="text-sm">{formatDate(user.lastLoginAt)}</div></div>}
          </div>
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No user data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default UserViewDialog;