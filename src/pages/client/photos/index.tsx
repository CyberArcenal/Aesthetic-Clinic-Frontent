import React, { useState, useEffect } from "react";
import { Camera, Calendar, User } from "lucide-react";
import { authStore } from "../../../stores/authStore";
import photoApi from "../../../api/core/photos";
import type { PhotoResponseDto } from "../../../api/core/photos";
import ImageLightbox from "../../../components/UI/ImageLightbox";

const ClientPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const user = authStore.getUser();

  useEffect(() => {
    const fetch = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await photoApi.getPhotosByClient(user.id);
        if (res.success) setPhotos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.id]);

  const beforePhotos = photos.filter(p => p.isBefore);
  const afterPhotos = photos.filter(p => !p.isBefore);
  const allImages = photos.map(p => ({ src: p.filePath || "", alt: p.description || "Treatment photo", caption: `${p.isBefore ? "Before" : "After"} - ${new Date(p.createdAt).toLocaleDateString()}` }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) return <div className="text-center py-12">Loading photos...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Treatment Photos</h1>
        <p className="text-gray-500">View your before and after photos taken during treatments.</p>
      </div>

      {photos.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">No photos available yet.</div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Camera size={18} className="text-red-500" /> Before Photos</h2>
              {beforePhotos.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-400">No before photos</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {beforePhotos.map((p, idx) => (
                    <div key={p.id} className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition" onClick={() => openLightbox(photos.findIndex(ph => ph.id === p.id))}>
                      <img src={p.filePath || `https://via.placeholder.com/300x200?text=Before`} alt="Before" className="w-full h-32 object-cover" />
                      <div className="p-2 text-xs text-gray-600">{p.description || new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* After Photos */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Camera size={18} className="text-green-500" /> After Photos</h2>
              {afterPhotos.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-400">No after photos</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {afterPhotos.map((p, idx) => (
                    <div key={p.id} className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition" onClick={() => openLightbox(photos.findIndex(ph => ph.id === p.id))}>
                      <img src={p.filePath || `https://via.placeholder.com/300x200?text=After`} alt="After" className="w-full h-32 object-cover" />
                      <div className="p-2 text-xs text-gray-600">{p.description || new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ImageLightbox images={allImages} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
        </>
      )}
    </div>
  );
};

export default ClientPhotos;