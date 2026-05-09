import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, ChevronRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-purple)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Your Journey to <span className="text-yellow-300">Beautiful Skin</span> Starts Here
          </h1>
          <p className="text-base md:text-lg mb-6 opacity-90">
            Experience premium aesthetic treatments in a relaxing, medical-grade environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link to="/register" className="bg-white text-[var(--primary-color)] hover:bg-gray-100 font-semibold py-2.5 px-5 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base">
              <CalendarCheck className="w-4 h-4" /> Book Now
            </Link>
            <Link to="/treatments" className="border border-white hover:bg-white/20 py-2.5 px-5 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base">
              View Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 md:h-12">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" opacity="0.2"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;