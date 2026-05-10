// src/pages/photos/components/UploadPhotoModal.tsx
import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { CreatePhotoDto } from "@/api/core/photos";
import appointmentApi, { AppointmentResponseDto } from "@/api/core/appointment";
import { Upload, Image as ImageIcon } from "lucide-react";

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
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | "">("");
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch client appointments for dropdown
  useEffect(() => {
    if (isOpen && clientId) {
      const fetchAppointments = async () => {
        setLoadingAppointments(true);
        try {
          const res = await appointmentApi.getAppointmentsByClient(clientId);
          if (res.success) {
            setAppointments(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch appointments", error);
        } finally {
          setLoadingAppointments(false);
        }
      };
      fetchAppointments();
    }
  }, [isOpen, clientId]);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      handleFile(droppedFile);
    } else {
      alert("Please drop an image file (JPEG, PNG, etc.)");
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    const success = await onUpload({
      clientId,
      appointmentId: selectedAppointmentId ? Number(selectedAppointmentId) : undefined,
      isBefore,
      description: description.trim() || undefined,
      file,
    });
    if (success) {
      setFile(null);
      setPreview(null);
      setDescription("");
      setIsBefore(true);
      setSelectedAppointmentId("");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} safetyClose={true} onClose={onClose} title="Upload Photo" size="md">
      <div className="space-y-4">
        {/* Appointment dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Associated Appointment (optional)
          </label>
          <select
            value={selectedAppointmentId}
            onChange={(e) => setSelectedAppointmentId(e.target.value ? Number(e.target.value) : "")}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }}
            disabled={loadingAppointments}
          >
            <option value="">-- None --</option>
            {appointments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.treatmentName || `Treatment #${apt.treatmentId}`} - {new Date(apt.appointmentDateTime).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

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

        {/* Drag & Drop Area */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Image File
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragOver ? "border-[var(--primary-color)] bg-[var(--primary-color)]/10" : "border-[var(--border-color)]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-md" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                <p className="text-sm text-[var(--text-secondary)]">Click or drag & drop an image here</p>
                <p className="text-xs text-[var(--text-tertiary)]">JPEG, PNG, GIF (Max 10MB)</p>
              </div>
            )}
          </div>
        </div>
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