// src/pages/photos/index.tsx
import React, { useState } from "react";
import { Plus, Image } from "lucide-react";
import Button from "@/components/UI/Button";
import ClientSelect from "@/components/Selects/Client";

import usePhotos from "./hooks/usePhotos";
import usePhotoUpload from "./hooks/usePhotoUpload";
import usePhotoView from "./hooks/usePhotoView";

import PhotoGallery from "./components/PhotoGallery";
import UploadPhotoModal from "./components/UploadPhotoModal";
import PhotoViewModal from "./components/PhotoViewModal";
import { dialogs } from "@/utils/dialogs";

const PhotosPage: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const {
    photos,
    loading: photosLoading,
    filter,
    setFilter,
    reload,
    deletePhoto,
  } = usePhotos(selectedClientId);
  const uploadModal = usePhotoUpload(reload);
  const viewModal = usePhotoView();

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm({
      title: "Delete Photo",
      message:
        "Are you sure you want to delete this photo? This action cannot be undone.",
    });
    if (!confirmed) return;
    try {
      await deletePhoto(id);
      dialogs.alert({
        title: "Success",
        message: "Photo deleted",
        icon: "success",
      });
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    }
  };

  return (
    <div
      className="compact-card rounded-md shadow-md border p-4"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h2
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: "var(--sidebar-text)" }}
          >
            <Image className="w-5 h-5" />
            Photo Gallery
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Manage client before/after photos
          </p>
        </div>
        {selectedClientId && (
          <Button
            onClick={uploadModal.open}
            variant="success"
            size="sm"
            icon={Plus}
            iconPosition="left"
          >
            Upload Photo
          </Button>
        )}
      </div>

      <div className="mb-4">
        <ClientSelect
          value={selectedClientId}
          onChange={(id) => setSelectedClientId(id)}
          placeholder="Select a client to view photos..."
          className="w-full"
        />
      </div>

      {selectedClientId && (
        <>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "all"
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("before")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "before"
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)]"
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setFilter("after")}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === "after"
                  ? "bg-[var(--primary-color)] text-white"
                  : "bg-[var(--card-secondary-bg)] text-[var(--sidebar-text)]"
              }`}
            >
              After
            </button>
          </div>

          <PhotoGallery
            photos={photos}
            loading={photosLoading}
            onView={viewModal.open}
            onDelete={handleDelete}
          />
        </>
      )}

      <UploadPhotoModal
        isOpen={uploadModal.isOpen}
        onClose={uploadModal.close}
        clientId={selectedClientId || 0}
        onUpload={uploadModal.upload}
        uploading={uploadModal.uploading}
      />
      <PhotoViewModal
        photo={viewModal.photo}
        isOpen={viewModal.isOpen}
        onClose={viewModal.close}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default PhotosPage;
