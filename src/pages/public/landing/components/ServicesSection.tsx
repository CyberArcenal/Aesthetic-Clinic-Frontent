import React from "react";
import { services } from "../data/landingData";

const ServicesSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Our Premium Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Cutting-edge aesthetic treatments tailored to your unique needs.</p>
      </div>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 md:p-6 border border-gray-100">
            <service.icon className="w-10 h-10 md:w-12 md:h-12 text-[var(--primary-color)] mb-3" />
            <h3 className="text-lg md:text-xl font-semibold mb-1">{service.name}</h3>
            <p className="text-gray-600 text-sm">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;