// src/pages/photos/hooks/usePhotoUpload.ts
import { useState } from "react";
import { showToast, showLoading, hideLoading } from "@/utils/notification";
import photoApi, { CreatePhotoDto } from "@/api/core/photos";

interface UsePhotoUploadReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  upload: (data: CreatePhotoDto) => Promise<boolean>;
  uploading: boolean;
}

const usePhotoUpload = (onSuccess: () => void): UsePhotoUploadReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const upload = async (data: CreatePhotoDto): Promise<boolean> => {
    setUploading(true);
    showLoading("Uploading photo...");
    try {
      const res = await photoApi.uploadPhoto(data);
      if (!res.success) throw new Error(res.message as string);
      showToast("Photo uploaded successfully", "success");
      onSuccess();
      close();
      return true;
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
      return false;
    } finally {
      setUploading(false);
      hideLoading();
    }
  };

  return { isOpen, open, close, upload, uploading };
};

export default usePhotoUpload;