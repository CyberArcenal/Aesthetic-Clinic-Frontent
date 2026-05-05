// src/pages/users/components/ResetPasswordModal.tsx
import React, { useState } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";

interface ResetPasswordModalProps {
  isOpen: boolean;
  userId: number | null;
  userEmail: string;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, userId, userEmail, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userId) return;
    setLoading(true);
    showLoading("Sending reset email...");
    try {
      // Placeholder – replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast(`Password reset email sent to ${userEmail}`, "success");
      onClose();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Password Reset Email" size="sm">
      <div className="space-y-4">
        <p className="text-sm">Send a password reset link to the user's email address:</p>
        <p className="text-sm font-medium" style={{ color: "var(--primary-color)" }}>{userEmail}</p>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={handleSend} disabled={loading}>{loading ? "Sending..." : "Send Email"}</Button>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;