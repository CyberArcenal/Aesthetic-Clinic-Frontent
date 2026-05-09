// src/pages/landing/components/LocationSection.tsx
import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Map from "@/components/UI/Map";

const LocationSection: React.FC = () => {
  // Clinic coordinates (Makati City approximate)
  const coordinates = "14.5547,121.0244";
  const address = "123 Health Street, Makati City, Metro Manila, Philippines";

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Visit Our Clinic</h2>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Located in the heart of Makati, our state-of-the-art facility offers a serene and hygienic environment.
          </p>
          <div className="space-y-3 text-sm md:text-base">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--primary-color)] mt-0.5 flex-shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[var(--primary-color)] flex-shrink-0" />
              <span>+63 2 1234 5678 | +63 917 123 4567</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[var(--primary-color)] flex-shrink-0" />
              <span>info@aestheticclinic.com</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[var(--primary-color)] flex-shrink-0" />
              <span>
                Weekdays: 9AM–6PM<br />Sat: 10AM–4PM<br />Sun: Closed
              </span>
            </div>
          </div>
          <div className="flex gap-4 mt-6 text-[var(--primary-color)] font-medium">
            <a href="#" className="hover:underline text-sm">Facebook</a>
            <a href="#" className="hover:underline text-sm">Instagram</a>
            <a href="#" className="hover:underline text-sm">Twitter</a>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
          <Map coordinates={coordinates} address={address} height="h-56 md:h-80" />
        </div>
      </div>
    </section>
  );
};

export default LocationSection;