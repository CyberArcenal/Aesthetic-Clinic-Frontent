// src/pages/packages/components/PackageViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import { formatCurrency } from "@/utils/formatters";
import { PackageDto } from "@/api/core/package";

interface PackageViewDialogProps {
  pkg: PackageDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const PackageViewDialog: React.FC<PackageViewDialogProps> = ({ pkg, loading, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Package Details" size="md">
      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div></div>
      ) : pkg ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-xs text-[var(--text-secondary)]">Name</div><div className="text-sm font-medium">{pkg.name}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Status</div><div className="text-sm">{pkg.isActive ? "Active" : "Inactive"}</div></div>
            <div className="col-span-2">
              <div className="text-xs text-[var(--text-secondary)]">Treatments</div>
              <div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{pkg.treatments.map((t) => t.name).join(", ")}</div>
            </div>
            <div><div className="text-xs text-[var(--text-secondary)]">Total Value</div><div className="text-sm">{formatCurrency(pkg.totalPrice)}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Package Price</div><div className="text-sm font-medium">{formatCurrency(pkg.discountedPrice)}</div></div>
            <div><div className="text-xs text-[var(--text-secondary)]">Savings</div><div className="text-sm text-[var(--accent-orange)]">{formatCurrency(pkg.savings)}</div></div>
          </div>
          {pkg.description && (
            <div><div className="text-xs text-[var(--text-secondary)]">Description</div><div className="text-sm bg-[var(--card-secondary-bg)] p-2 rounded-md">{pkg.description}</div></div>
          )}
        </div>
      ) : (
        <p className="text-center py-4 text-[var(--text-secondary)]">No package data</p>
      )}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default PackageViewDialog;