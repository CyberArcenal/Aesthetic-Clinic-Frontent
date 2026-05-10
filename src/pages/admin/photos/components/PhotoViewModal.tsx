// src/pages/photos/components/PhotoViewModal.tsx
import React from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { PhotoResponseDto } from "@/api/core/photos";
import { formatDate } from "@/utils/formatters";
import { Camera, Calendar, FileText, Info, Trash2 } from "lucide-react";

interface PhotoViewModalProps {
  photo: PhotoResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (photoId: number) => void;
}

const PhotoViewModal: React.FC<PhotoViewModalProps> = ({ photo, isOpen, onClose, onDelete }) => {
  if (!photo) return null;

  const handleDelete = () => {
    if (onDelete) {
      onClose(); // close modal first
      onDelete(photo.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Photo Details" size="lg">
      <div className="space-y-4">
        {/* Image */}
        <div className="bg-[var(--card-secondary-bg)] rounded-md overflow-hidden">
          <img
            src={photo.filePath}
            alt={photo.description || "Photo"}
            className="w-full max-h-96 object-contain rounded-md"
          />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Camera className="w-4 h-4 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Photo Type</div>
              <div className="font-medium">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${photo.isBefore ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                  {photo.isBefore ? "Before" : "After"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">Uploaded</div>
              <div className="font-medium">{formatDate(photo.createdAt)}</div>
            </div>
          </div>
          {photo.description && (
            <div className="flex items-start gap-2 col-span-2">
              <FileText className="w-4 h-4 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">Description</div>
                <div className="font-medium">{photo.description}</div>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[var(--primary-color)] mt-0.5" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">File Size</div>
              <div className="font-medium">{(photo.fileSize / 1024).toFixed(0)} KB</div>
            </div>
          </div>
          {photo.mimeType && (
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[var(--primary-color)] mt-0.5" />
              <div>
                <div className="text-xs text-[var(--text-secondary)]">MIME Type</div>
                <div className="font-medium">{photo.mimeType}</div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          {onDelete && (
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PhotoViewModal;