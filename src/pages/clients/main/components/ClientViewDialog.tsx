// src/pages/clients/components/ClientViewDialog.tsx
import React from "react";
import type { ClientResponseDto } from "../../../../api/core/client";
import Modal from "../../../../components/UI/Modal";
import { formatDate } from "../../../../utils/formatters";

interface ClientViewDialogProps {
  client: ClientResponseDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const ClientViewDialog: React.FC<ClientViewDialogProps> = ({ client, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Client Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      ) : client ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Full Name</div>
              <div className="text-sm font-medium" style={{ color: "var(--sidebar-text)" }}>
                {client.fullName || `${client.firstName} ${client.lastName}`}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Email</div>
              <div className="text-sm" style={{ color: "var(--sidebar-text)" }}>{client.email}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Phone</div>
              <div className="text-sm" style={{ color: "var(--sidebar-text)" }}>{client.phoneNumber || "-"}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Date of Birth</div>
              <div className="text-sm" style={{ color: "var(--sidebar-text)" }}>
                {client.dateOfBirth ? formatDate(client.dateOfBirth) : "-"}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Registered</div>
              <div className="text-sm" style={{ color: "var(--sidebar-text)" }}>{formatDate(client.createdAt)}</div>
            </div>
          </div>
          {client.skinHistory && (
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Skin History</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md" style={{ color: "var(--sidebar-text)" }}>
                {client.skinHistory}
              </div>
            </div>
          )}
          {client.allergies && (
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Allergies</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md" style={{ color: "var(--sidebar-text)" }}>
                {client.allergies}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No client data</p>
      )}
    </Modal>
  );
};

export default ClientViewDialog;