// src/pages/photos/components/UploadPhotoModal.tsx
import React, { useState } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { CreatePhotoDto } from "@/api/core/photos";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: number;
  onUpload: (data: CreatePhotoDto) => Promise<boolean>;
  uploading: boolean;
}

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({ isOpen, onClose, clientId, onUpload, uploading }) => {
  const [isBefore, setIsBefore] = useState(true);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    const success = await onUpload({
      clientId,
      isBefore,
      description: description.trim() || undefined,
      file,
    });
    if (success) {
      setFile(null);
      setPreview(null);
      setDescription("");
      setIsBefore(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Photo" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Photo Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked={isBefore} onChange={() => setIsBefore(true)} /> Before
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={!isBefore} onChange={() => setIsBefore(false)} /> After
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
            placeholder="e.g., Day 1, Week 2, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Image File
          </label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
        </div>
        {preview && (
          <div className="mt-2">
            <img src={preview} alt="Preview" className="max-h-48 rounded-md" />
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="success" onClick={handleSubmit} disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </Modal>
  );
};

export default UploadPhotoModal;