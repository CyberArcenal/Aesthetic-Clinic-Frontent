// src/pages/public/contact/components/ContactInfo.tsx
import React, { useState } from 'react';
import { LocationData } from '../hooks/useContact';
import MapModal from '@/components/UI/MapModal'; // gagamitin natin sa ibaba
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface Props {
  location: LocationData | null;
  loading: boolean;
}

const ContactInfo: React.FC<Props> = ({ location, loading }) => {
  const [mapModalOpen, setMapModalOpen] = useState(false);

  if (loading) return <div className="bg-card rounded-2xl shadow-xl p-8">Loading contact info...</div>;
  if (!location) return null;

  const { email, phone, address, availability } = location;
  const availabilityLines = availability.split('\n');

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
        <div className="space-y-6">
          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-[var(--primary-color)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">{email}</p>
              <a href={`mailto:${email}`} className="text-sm text-[var(--primary-color)] hover:underline mt-1 inline-block">
                Send us an email
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-[var(--primary-color)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">{phone}</p>
              <a href={`tel:${phone}`} className="text-sm text-[var(--primary-color)] hover:underline mt-1 inline-block">
                Call us
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[var(--primary-color)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Location</h3>
              <p className="text-gray-600">{address}</p>
              <button
                onClick={() => setMapModalOpen(true)}
                className="text-sm text-[var(--primary-color)] hover:underline mt-1"
              >
                View on map
              </button>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-[var(--primary-color)]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Clinic Hours</h3>
              {availabilityLines.map((line, idx) => (
                <p key={idx} className="text-gray-600 text-sm">{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal (kung gusto ng popup map) */}
      {location.coordinates && (
        <MapModal
          isOpen={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          coordinates={location.coordinates}
          address={address}
        />
      )}
    </>
  );
};

export default ContactInfo;