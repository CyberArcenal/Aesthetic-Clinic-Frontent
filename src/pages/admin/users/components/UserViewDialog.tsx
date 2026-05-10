// src/pages/users/components/UserViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { UserResponseDto } from "@/api/core/user";
import { formatDate, formatDateTime } from "@/utils/formatters";
import { User, Mail, Calendar, Shield, Key, Edit, Trash2, Users, UserCog } from "lucide-react";

interface UserViewDialogProps {
  user: UserResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (user: UserResponseDto) => void;
  onDelete?: (user: UserResponseDto) => void;
  onResetPassword?: (userId: number, email: string) => void;
  onAssignRole?: (user: UserResponseDto) => void;
}

const UserViewDialog: React.FC<UserViewDialogProps> = ({
  user,
  loading,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onResetPassword,
  onAssignRole,
}) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
        <div className="text-center py-8 text-[var(--text-secondary)]">No user data</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
      <div className="space-y-4">
        {/* Header with avatar and status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-[var(--primary-color)]" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Username</div>
              <div className="text-lg font-bold">{user.username}</div>
            </div>
          </div>
          <span
            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 gap-3">
          {user.fullName && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">Full Name</div>
                <div className="font-medium">{user.fullName}</div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Email Address</div>
              <div className="font-medium">{user.email}</div>
            </div>
          </div>

          {user.roles && user.roles.length > 0 && (
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">Roles</div>
                <div className="font-medium flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <span key={role} className="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Account Created</div>
              <div className="font-medium">{formatDate(user.createdAt)}</div>
            </div>
          </div>

          {user.lastLoginAt && (
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">Last Login</div>
                <div className="font-medium">{formatDateTime(user.lastLoginAt)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)] flex-wrap">
          {onResetPassword && (
            <Button variant="secondary" size="sm" onClick={() => onResetPassword(user.id, user.email || "")}>
              <Key className="w-4 h-4 mr-1" /> Reset Password
            </Button>
          )}
          {onAssignRole && (
            <Button variant="secondary" size="sm" onClick={() => onAssignRole(user)}>
              <Shield className="w-4 h-4 mr-1" /> Manage Roles
            </Button>
          )}
          {onEdit && (
            <Button variant="primary" size="sm" onClick={() => onEdit(user)}>
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(user)}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserViewDialog;