// src/pages/packages/components/PackageViewDialog.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { PackageDto } from "@/api/core/package";
import { Gift, List, DollarSign, TrendingDown, Calendar, Edit, Trash2, Package } from "lucide-react";

interface PackageViewDialogProps {
  pkg: PackageDto | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (pkg: PackageDto) => void;
  onDelete?: (pkg: PackageDto) => void;
}

const PackageViewDialog: React.FC<PackageViewDialogProps> = ({ pkg, loading, isOpen, onClose, onEdit, onDelete }) => {
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Package Details" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
        </div>
      </Modal>
    );
  }

  if (!pkg) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Package Details" size="md">
        <div className="text-center py-8 text-[var(--text-secondary)]">No package data</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Package Details" size="lg">
      <div className="space-y-4">
        {/* Header: Name + Status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-[var(--primary-color)]" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Package Name</div>
              <div className="text-xl font-bold">{pkg.name}</div>
            </div>
          </div>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${pkg.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {pkg.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Treatments list */}
        <div className="flex items-start gap-3">
          <List className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
          <div className="flex-1">
            <div className="text-xs text-[var(--text-secondary)]">Treatments Included</div>
            <div className="bg-[var(--card-secondary-bg)] p-2 rounded-md text-sm">
              {pkg.treatments.map((t) => t.name).join(" • ")}
            </div>
          </div>
        </div>

        {/* Description (optional) */}
        {pkg.description && (
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
            <div className="flex-1">
              <div className="text-xs text-[var(--text-secondary)]">Description</div>
              <div className="text-sm">{pkg.description}</div>
            </div>
          </div>
        )}

        {/* Pricing block */}
        <div className="bg-[var(--card-secondary-bg)] rounded-md p-4 space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Pricing Summary
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Total Value</div>
              <div className="font-semibold">{formatCurrency(pkg.totalPrice)}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Package Price</div>
              <div className="font-semibold text-lg text-[var(--primary-color)]">{formatCurrency(pkg.discountedPrice)}</div>
            </div>
            <div className="col-span-2 flex justify-between items-center">
              <span className="text-xs text-[var(--text-secondary)]">Customer Savings</span>
              <span className="text-[var(--accent-orange)] font-medium flex items-center gap-1">
                <TrendingDown className="w-4 h-4" /> {formatCurrency(pkg.savings)}
              </span>
            </div>
          </div>
        </div>

        {/* Creation date */}
        <div className="flex items-start gap-3 pt-2 border-t border-[var(--border-color)]">
          <Calendar className="w-5 h-5 text-[var(--primary-color)] mt-0.5" />
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Created</div>
            <div className="text-sm">{formatDateTime(pkg.createdAt)}</div>
          </div>
        </div>

        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end gap-2 pt-2">
            {onEdit && (
              <Button variant="primary" size="sm" onClick={() => onEdit(pkg)}>
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete(pkg)}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PackageViewDialog;