// src/pages/photos/components/PhotoGallery.tsx
import React from "react";
import { Camera, Trash2 } from "lucide-react";
import { PhotoResponseDto } from "@/api/core/photos";
import { formatDate } from "@/utils/formatters";

interface PhotoGalleryProps {
  photos: PhotoResponseDto[];
  loading: boolean;
  onView: (photo: PhotoResponseDto) => void;
  onDelete: (id: number) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, loading, onView, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md" style={{ borderColor: "var(--border-color)" }}>
        <Camera className="w-12 h-12 mx-auto mb-2 text-[var(--text-secondary)]" />
        <p className="text-[var(--text-secondary)]">No photos found for this client.</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">Upload photos to track treatment progress.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-all"
          style={{ borderColor: "var(--border-color)" }}
          onClick={() => onView(photo)}
        >
          <img
            src={photo.filePath}
            alt={photo.description || "Photo"}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image";
            }}
          />
          <div className="absolute top-2 left-2">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: photo.isBefore ? "var(--accent-blue)" : "var(--accent-green)",
                color: "white",
              }}
            >
              {photo.isBefore ? "Before" : "After"}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(photo.id);
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
          <div className="p-2 text-xs text-[var(--text-secondary)] truncate">
            {photo.description || formatDate(photo.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;