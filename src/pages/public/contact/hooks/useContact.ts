// src/pages/public/contact/hooks/useContact.ts
import { useState, useEffect } from 'react';
import systemConfigAPI from '@/api/core/system_config';
import { showError } from '@/utils/notification';

export interface LocationData {
  email: string;
  phone: string;
  address: string;
  coordinates: string; // "lat,lng"
  availability: string; // clinic hours
}

export interface SocialLinksData {
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
}

export const useContact = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kunin ang clinic settings mula sa system config (o gumamit ng hardcoded fallback)
        const res = await systemConfigAPI.getGroupedConfig();
        if (res.status && res.data) {
          const clinic = res.data.grouped_settings.clinic;
          const general = res.data.grouped_settings.general;
          // I-construct ang LocationData mula sa settings
          const locationData: LocationData = {
            email: clinic.email || 'info@aestheticclinic.com',
            phone: clinic.phone || '+63 2 1234 5678',
            address: clinic.address || '123 Health St., Makati City, Philippines',
            coordinates: '14.5547,121.0244', // approximate Makati coordinates
            availability: `Weekdays: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM\nSunday: Closed`,
          };
          setLocation(locationData);

          // Social links (kung wala sa config, gumamit ng placeholder)
          setSocialLinks({
            facebook_url: 'https://facebook.com/aestheticclinic',
            instagram_url: 'https://instagram.com/aestheticclinic',
            twitter_url: 'https://twitter.com/aestheticclinic',
          });
        } else {
          throw new Error('Failed to load clinic data');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load contact information');
        showError('Failed to load contact information');
        // Fallback data para hindi mabakante ang page
        setLocation({
          email: 'info@aestheticclinic.com',
          phone: '+63 2 1234 5678',
          address: '123 Health St., Makati City, Philippines',
          coordinates: '14.5547,121.0244',
          availability: 'Weekdays: 9AM-6PM\nSaturday: 10AM-4PM\nSunday: Closed',
        });
        setSocialLinks({
          facebook_url: '#',
          instagram_url: '#',
          twitter_url: '#',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { location, socialLinks, loading, error };
};