import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { packages } from "../data/landingData";

const PackagesSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-12 md:py-16 px-4">
      <div className="container mx-auto text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Exclusive Packages
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Save more with our curated treatment bundles.
        </p>
      </div>
      <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition hover:scale-105 flex flex-col h-full ${pkg.popular ? "border-2 border-[var(--primary-color)] relative" : ""}`}
          >
            {pkg.popular && (
              <div className="bg-[var(--primary-color)] text-white text-xs font-bold py-1 px-3 absolute top-4 right-4 rounded-full z-10">
                Most Popular
              </div>
            )}
            {/* Content section - grows to fill space */}
            <div className="p-5 md:p-6 flex-1">
              <h3 className="text-xl md:text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="mb-3">
                <span className="text-2xl md:text-3xl font-bold text-[var(--primary-color)]">
                  {pkg.price}
                </span>
                <span className="text-gray-400 line-through ml-2 text-sm">
                  {pkg.original}
                </span>
              </div>
              <ul className="space-y-1.5 mb-4">
                {pkg.treatments.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {t}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500">⏱ {pkg.duration}</p>
            </div>

            {/* Button section - always at bottom */}
            <div className="p-5 md:p-6 pt-0 md:pt-0">
              <Link
                to="/register"
                className="block text-center bg-[var(--primary-color)] text-white py-2.5 rounded-lg hover:bg-[var(--primary-hover)] transition text-sm md:text-base"
              >
                Book Package
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PackagesSection;
