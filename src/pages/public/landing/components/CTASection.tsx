import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";

const CTASection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 px-4 text-center bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-purple)] text-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Transform Your Skin?</h2>
        <p className="text-base md:text-lg mb-5 opacity-90">Book your consultation today and get a free skin analysis.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-[var(--primary-color)] font-semibold py-2.5 px-6 rounded-full hover:shadow-lg transition">
          <CalendarCheck className="w-5 h-5" /> Schedule Appointment
        </Link>
      </div>
    </section>
  );
};

export default CTASection;