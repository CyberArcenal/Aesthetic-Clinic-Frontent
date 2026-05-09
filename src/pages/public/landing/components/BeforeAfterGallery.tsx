import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { beforeAfterImages } from "../data/landingData";

const BeforeAfterGallery: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Real Results</h2>
          <p className="text-gray-600 max-w-xl mx-auto">See the transformation our clients have achieved.</p>
        </div>
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 2.5, spaceBetween: 30 }
          }}
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          loop={true}
          className="before-after-swiper pb-12"
        >
          {beforeAfterImages.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative">
                    <img src={item.before} alt="Before" className="w-full h-48 md:h-64 object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">BEFORE</div>
                  </div>
                  <div className="relative">
                    <img src={item.after} alt="After" className="w-full h-48 md:h-64 object-cover" />
                    <div className="absolute bottom-2 right-2 bg-[var(--primary-color)] text-white text-xs px-2 py-1 rounded">AFTER</div>
                  </div>
                </div>
                <div className="p-3 text-center font-medium text-gray-700">{item.title}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BeforeAfterGallery;