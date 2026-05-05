// src/pages/photos/hooks/usePhotoView.ts
import { PhotoResponseDto } from "@/api/core/photos";
import { useState } from "react";

interface UsePhotoViewReturn {
  photo: PhotoResponseDto | null;
  isOpen: boolean;
  open: (photo: PhotoResponseDto) => void;
  close: () => void;
}

const usePhotoView = (): UsePhotoViewReturn => {
  const [photo, setPhoto] = useState<PhotoResponseDto | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = (p: PhotoResponseDto) => {
    setPhoto(p);
    setIsOpen(true);
  };

  const close = () => {
    setPhoto(null);
    setIsOpen(false);
  };

  return { photo, isOpen, open, close };
};

export default usePhotoView;