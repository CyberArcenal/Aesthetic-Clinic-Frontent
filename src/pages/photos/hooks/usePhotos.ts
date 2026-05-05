// src/pages/photos/hooks/usePhotos.ts
import photoApi, { PhotoResponseDto } from "@/api/core/photos";
import { useState, useEffect, useCallback } from "react";

interface UsePhotosReturn {
  photos: PhotoResponseDto[];
  loading: boolean;
  error: string | null;
  filter: "all" | "before" | "after";
  setFilter: (filter: "all" | "before" | "after") => void;
  reload: () => void;
  deletePhoto: (id: number) => Promise<void>;
}

const usePhotos = (clientId: number | null): UsePhotosReturn => {
  const [photos, setPhotos] = useState<PhotoResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "before" | "after">("all");

  const fetchPhotos = useCallback(async () => {
    if (!clientId) {
      setPhotos([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let res;
      if (filter === "before") {
        res = await photoApi.getBeforePhotos(clientId);
      } else if (filter === "after") {
        res = await photoApi.getAfterPhotos(clientId);
      } else {
        res = await photoApi.getPhotosByClient(clientId);
      }
      if (!res.success) throw new Error(res.message as string);
      setPhotos(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId, filter]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const deletePhoto = async (id: number) => {
    const res = await photoApi.deletePhoto(id);
    if (!res.success) throw new Error(res.message as string);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const reload = () => fetchPhotos();

  return { photos, loading, error, filter, setFilter, reload, deletePhoto };
};

export default usePhotos;