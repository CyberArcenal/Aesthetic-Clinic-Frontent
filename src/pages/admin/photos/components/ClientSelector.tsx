// src/pages/photos/components/ClientSelector.tsx
import { ClientResponseDto } from "@/api/core/client";
import React from "react";

interface ClientSelectorProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  clients: ClientResponseDto[];
  loading: boolean;
  selectedClient: ClientResponseDto | null;
  onSelect: (client: ClientResponseDto | null) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  searchTerm,
  onSearchChange,
  clients,
  loading,
  selectedClient,
  onSelect,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
        Select Client
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="compact-input w-full border rounded-md px-3 py-2"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
        />
        {loading && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--accent-blue)]"></div>
          </div>
        )}
      </div>
      {clients.length > 0 && !selectedClient && (
        <div
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border rounded-md shadow-lg"
          style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
        >
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => onSelect(client)}
              className="px-3 py-2 hover:bg-[var(--card-secondary-bg)] cursor-pointer"
            >
              <div className="font-medium">{client.fullName || `${client.firstName} ${client.lastName}`}</div>
              <div className="text-xs text-[var(--text-secondary)]">{client.email}</div>
            </div>
          ))}
        </div>
      )}
      {selectedClient && (
        <div
          className="mt-2 p-2 border rounded-md flex justify-between items-center"
          style={{ backgroundColor: "var(--card-secondary-bg)", borderColor: "var(--border-color)" }}
        >
          <div>
            <span className="font-medium">{selectedClient.fullName || `${selectedClient.firstName} ${selectedClient.lastName}`}</span>
            <span className="text-xs text-[var(--text-secondary)] ml-2">({selectedClient.email})</span>
          </div>
          <button onClick={() => onSelect(null)} className="text-xs text-[var(--danger-color)] hover:underline">
            Change
          </button>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;