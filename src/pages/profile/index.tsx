// src/components/Shared/ProfileModal.tsx
import React, { useState } from "react";
import { User, Mail, Shield, Calendar, Key, Lock, X } from "lucide-react";
import { authStore } from "@/stores/authStore";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import authApi from "@/api/core/auth";
import { formatDate } from "@/utils/formatters";


interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const user = authStore.getUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChanging, setPasswordChanging] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-red-100 text-red-800";
      case "Staff": return "bg-blue-100 text-blue-800";
      case "Client": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      dialogs.alert({ title: "Error", message: "Please fill in all password fields", icon: "warning" });
      return;
    }
    if (newPassword !== confirmPassword) {
      dialogs.alert({ title: "Error", message: "New passwords do not match", icon: "warning" });
      return;
    }
    if (newPassword.length < 6) {
      dialogs.alert({ title: "Error", message: "Password must be at least 6 characters", icon: "warning" });
      return;
    }
    setPasswordChanging(true);
    showLoading("Changing password...");
    try {
      const res = await authApi.changePassword({ currentPassword, newPassword });
      if (res.success) {
        showToast("Password changed successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        throw new Error(res.message || "Failed to change password");
      }
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    } finally {
      setPasswordChanging(false);
      hideLoading();
    }
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-[var(--card-bg)] rounded-lg p-6 max-w-sm w-full mx-4">
          <p className="text-center">User not found. Please log in again.</p>
          <button onClick={onClose} className="mt-4 btn btn-primary w-full">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-[var(--card-bg)] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
        style={{ borderColor: "var(--border-color)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--card-bg)] z-10">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--sidebar-text)" }}>
            <User className="w-5 h-5" />
            My Profile
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--card-hover-bg)] rounded">
            <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* User header */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center">
              <User className="w-8 h-8 text-[var(--primary-color)]" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: "var(--sidebar-text)" }}>
                {user.fullName || user.username}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.roles?.map((role) => (
                  <span key={role} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Profile info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Username</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--card-secondary-bg)]">
                <User className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm" style={{ color: "var(--sidebar-text)" }}>{user.username}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Email</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--card-secondary-bg)]">
                <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm" style={{ color: "var(--sidebar-text)" }}>{user.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Full Name</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--card-secondary-bg)]">
                <User className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm" style={{ color: "var(--sidebar-text)" }}>{user.fullName || "Not set"}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Status</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--card-secondary-bg)]">
                <Shield className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className={`text-sm font-medium ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Member Since</label>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--card-secondary-bg)]">
                <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm" style={{ color: "var(--sidebar-text)" }}>{formatDate(user.createdAt)}</span>
              </div>
            </div>
            {user.lastLoginAt && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Last Login</label>
                <div className="flex items-center gap-2 p-2 rounded-md bg-[var(--card-secondary-bg)]">
                  <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-sm" style={{ color: "var(--sidebar-text)" }}>{formatDate(user.lastLoginAt)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="border-t border-[var(--border-color)] pt-4">
            <h4 className="font-semibold flex items-center gap-2 mb-3" style={{ color: "var(--sidebar-text)" }}>
              <Key className="w-4 h-4" />
              Change Password
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="compact-input w-full border rounded-md px-3 py-2"
                  style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="compact-input w-full border rounded-md px-3 py-2"
                    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="compact-input w-full border rounded-md px-3 py-2"
                    style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={passwordChanging}
                  className="btn btn-primary btn-sm flex items-center gap-1"
                >
                  <Lock className="w-4 h-4" />
                  {passwordChanging ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;