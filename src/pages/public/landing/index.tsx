import React from "react";
import HeroSection from "./components/HeroSection";
import BeforeAfterGallery from "./components/BeforeAfterGallery";
import ServicesSection from "./components/ServicesSection";
import PackagesSection from "./components/PackagesSection";
import LocationSection from "./components/LocationSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <BeforeAfterGallery />
      <ServicesSection />
      <PackagesSection />
      <LocationSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;