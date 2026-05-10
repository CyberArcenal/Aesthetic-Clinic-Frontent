// src/pages/users/components/RoleAssignmentModal.tsx
import React, { useState, useEffect } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import { UserResponseDto } from "@/api/core/user";
import roleApi, { RoleResponseDto } from "@/api/core/role";

interface RoleAssignmentModalProps {
  isOpen: boolean;
  user: UserResponseDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
  isOpen,
  user,
  onClose,
  onSuccess,
}) => {
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadRoles();
      // Pre‑select current roles? We need to map role names to role IDs.
      // For simplicity, we'll just load the list.
      setSelectedRoleIds([]);
    }
  }, [isOpen, user]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const res = await roleApi.getRoles();
      if (res.success) {
        setRoles(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    // Placeholder: actual role assignment should call userApi.updateUser with rolesToAdd/rolesToRemove
    showToast("Role assignment feature coming soon", "info");
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Roles - ${user?.username || ""}`}
      size="md"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={role.id}
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRoleIds([...selectedRoleIds, role.id]);
                    } else {
                      setSelectedRoleIds(
                        selectedRoleIds.filter((id) => id !== role.id),
                      );
                    }
                  }}
                />
                <span className="text-sm">{role.name}</span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {role.description}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Save Roles
        </Button>
      </div>
    </Modal>
  );
};

export default RoleAssignmentModal;
