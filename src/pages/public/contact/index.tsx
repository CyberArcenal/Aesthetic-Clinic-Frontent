// src/pages/public/contact/index.tsx
import React, { useEffect } from "react";
import { useContact } from "./hooks/useContact";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import SocialLinks from "./components/SocialLinks";
import FAQ from "./components/FAQ";
import Map from "@/components/UI/Map";

const ContactPage: React.FC = () => {
  const { location, socialLinks, loading, error } = useContact();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
        <p className="mt-3 text-gray-500">Loading contact information...</p>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-red-600 mb-2">Failed to load contact information</h3>
          <p className="text-red-500">{error || "Unable to load data"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-purple)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <div className="w-24 h-1 bg-white/80 mx-auto mb-5 rounded"></div>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              We’re here to answer your questions and help you achieve your aesthetic goals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Info + Social Links */}
          <div className="space-y-8">
            <ContactInfo location={location} loading={loading} />
            <SocialLinks links={socialLinks} />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Find Us Here</h2>
            <p className="text-gray-600 mb-6">{location.address}</p>
          </div>
          <Map coordinates={location.coordinates} address={location.address} />
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default ContactPage;