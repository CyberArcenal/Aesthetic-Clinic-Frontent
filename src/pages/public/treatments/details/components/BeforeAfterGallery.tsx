// src/pages/public/treatments/details/components/BeforeAfterGallery.tsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Images } from "lucide-react";
import ImageLightbox from "../../../../../components/UI/ImageLightbox";

interface BeforeAfterItem {
  id: number;
  beforeImage: string;
  afterImage: string;
  clientName?: string;
  treatmentName?: string;
  description?: string;
}

interface BeforeAfterGalleryProps {
  treatmentId?: number;
  treatmentName?: string;
}

// Mock data (same as before)
const getMockBeforeAfter = (
  treatmentId?: number,
  treatmentName?: string,
): BeforeAfterItem[] => {
  const mockData: BeforeAfterItem[] = [
    {
      id: 1,
      beforeImage:
        "https://placehold.co/600x400/FFCCCC/FFFFFF?text=Before+Acne",
      afterImage: "https://placehold.co/600x400/CCFFCC/FFFFFF?text=After+Acne",
      clientName: "Maria",
      treatmentName: "Acne Treatment",
      description: "After 3 sessions",
    },
    {
      id: 2,
      beforeImage:
        "https://placehold.co/600x400/FFDDDD/FFFFFF?text=Before+Wrinkles",
      afterImage:
        "https://placehold.co/600x400/CCFFCC/FFFFFF?text=After+Wrinkles",
      clientName: "John",
      treatmentName: "Botox",
      description: "2 weeks post-treatment",
    },
    {
      id: 3,
      beforeImage:
        "https://placehold.co/600x400/FFEECC/FFFFFF?text=Before+Scars",
      afterImage: "https://placehold.co/600x400/CCFFCC/FFFFFF?text=After+Scars",
      clientName: "Lisa",
      treatmentName: "Microneedling",
      description: "After 2 sessions",
    },
  ];
  if (treatmentName) {
    return mockData.filter((item) =>
      item.treatmentName?.toLowerCase().includes(treatmentName.toLowerCase()),
    );
  }
  return mockData;
};

const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({
  treatmentId,
  treatmentName,
}) => {
  const items = getMockBeforeAfter(treatmentId, treatmentName);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Prepare array of all images (before and after) for lightbox slideshow
  const allImages = items.flatMap((item) => [
    {
      src: item.beforeImage,
      alt: `Before: ${item.clientName} - ${item.description || ""}`,
      caption: `Before: ${item.clientName} (${item.description || ""})`,
    },
    {
      src: item.afterImage,
      alt: `After: ${item.clientName} - ${item.description || ""}`,
      caption: `After: ${item.clientName} (${item.description || ""})`,
    },
  ]);

  // Compute starting index if user clicks on a specific image
  const handleImageClick = (globalIndex: number) => {
    setLightboxIndex(globalIndex);
    setLightboxOpen(true);
  };

  if (items.length === 0) return null;

  return (
    <>
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Images className="w-5 h-5 text-[var(--primary-color)]" />
          <h2 className="text-lg font-semibold text-gray-800">
            Real Client Results
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          See the transformation our clients have achieved with this treatment.
        </p>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.5 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          loop={true}
          className="before-after-swiper pb-10"
        >
          {items.map((item, itemIndex) => {
            // Compute global indices for before and after images
            const beforeGlobalIndex = itemIndex * 2;
            const afterGlobalIndex = itemIndex * 2 + 1;
            return (
              <SwiperSlide key={item.id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="grid grid-cols-2 gap-0">
                    {/* Before image */}
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => handleImageClick(beforeGlobalIndex)}
                    >
                      <img
                        src={item.beforeImage}
                        alt="Before"
                        className="w-full h-48 object-cover transition group-hover:scale-105 duration-300"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        BEFORE
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                          Click to zoom
                        </span>
                      </div>
                    </div>
                    {/* After image */}
                    <div
                      className="relative cursor-pointer group"
                      onClick={() => handleImageClick(afterGlobalIndex)}
                    >
                      <img
                        src={item.afterImage}
                        alt="After"
                        className="w-full h-48 object-cover transition group-hover:scale-105 duration-300"
                      />
                      <div className="absolute bottom-2 right-2 bg-[var(--primary-color)] text-white text-xs px-2 py-0.5 rounded">
                        AFTER
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                          Click to zoom
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-gray-800 text-sm">
                      {item.clientName}
                    </p>
                    <p className="text-gray-500 text-xs">{item.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="text-center mt-3">
          <a
            href="/photos"
            className="text-xs text-[var(--primary-color)] hover:underline"
          >
            View more success stories →
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};

export default BeforeAfterGallery;
