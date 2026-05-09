// src/pages/public/contact/components/SocialLinks.tsx
import React from 'react';
import { SocialLinksData } from '../hooks/useContact';
import { Globe, Share2, X } from 'lucide-react';

interface Props {
  links: SocialLinksData | null;
}

const SocialLinks: React.FC<Props> = ({ links }) => {
  if (!links) return null;

  const platforms = [
    { icon: Globe, url: links.website_url || "", label: 'Website', bgColor: 'bg-gray-500' },
    { icon: Share2, url: links.instagram_url || "", label: 'Instagram', bgColor: 'bg-pink-500' },
    { icon: X, url: links.twitter_url || "", label: 'Twitter', bgColor: 'bg-blue-400' },
  ];

  const validLinks = platforms.filter(p => p.url && p.url !== '#');

  if (validLinks.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Connect With Us</h2>
      <p className="text-gray-600 mb-6">Follow us on social media for updates and promotions.</p>
      <div className="flex flex-wrap gap-4">
        {validLinks.map(({ icon: Icon, url, label, bgColor }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-white hover:opacity-80 transition`}
            aria-label={label}
          >
            <Icon size={20} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;