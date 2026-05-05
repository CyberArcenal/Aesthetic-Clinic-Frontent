// src/pages/photos/components/PhotoViewModal.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import { PhotoResponseDto } from "@/api/core/photos";
import { formatDate } from "@/utils/formatters";

interface PhotoViewModalProps {
  photo: PhotoResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const PhotoViewModal: React.FC<PhotoViewModalProps> = ({ photo, isOpen, onClose }) => {
  if (!photo) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Photo Details" size="lg">
      <div className="space-y-4">
        <img src={photo.filePath} alt={photo.description || "Photo"} className="w-full rounded-md" />
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-[var(--text-secondary)]">Type:</span> {photo.isBefore ? "Before" : "After"}</div>
          <div><span className="text-[var(--text-secondary)]">Uploaded:</span> {formatDate(photo.createdAt)}</div>
          {photo.description && <div className="col-span-2"><span className="text-[var(--text-secondary)]">Description:</span> {photo.description}</div>}
          {photo.fileSize > 0 && <div><span className="text-[var(--text-secondary)]">Size:</span> {(photo.fileSize / 1024).toFixed(0)} KB</div>}
          {photo.mimeType && <div><span className="text-[var(--text-secondary)]">Type:</span> {photo.mimeType}</div>}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default PhotoViewModal;