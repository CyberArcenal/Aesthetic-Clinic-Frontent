// src/pages/public/treatments/details/index.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, DollarSign, CalendarCheck, ArrowLeft, Sparkles, Tag } from "lucide-react";
import { authStore } from "../../../../stores/authStore";
import BeforeAfterGallery from "./components/BeforeAfterGallery";  // ✅ import gallery
import { usePublicTreatmentDetail } from "./hooks/usePublicTreatmentDetail";

const PublicTreatmentDetailPage: React.FC = () => {
  const { treatment, loading, error } = usePublicTreatmentDetail();
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (!treatment) return;
    if (authStore.isAuthenticated()) {
      navigate(`/appointments/book?treatmentId=${treatment.id}`);
    } else {
      navigate(`/login?redirect=/treatments/${treatment.id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
        <p className="mt-3 text-gray-500">Loading treatment details...</p>
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl max-w-md mx-auto">
          <p className="font-semibold">{error || "Treatment not found"}</p>
          <Link to="/treatments" className="mt-4 inline-block text-[var(--primary-color)] hover:underline">
            ← Back to all treatments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Back button */}
      <Link to="/treatments" className="inline-flex items-center gap-1 text-gray-500 hover:text-[var(--primary-color)] mb-6 text-sm">
        <ArrowLeft size={16} /> Back to all treatments
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-purple)] h-2"></div>
            <div className="p-6 md:p-8">
              {treatment.category && (
                <div className="mb-3">
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">
                    <Tag size={12} /> {treatment.category}
                  </span>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{treatment.name}</h1>

              <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} className="text-[var(--primary-color)]" />
                  <span>{treatment.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={18} className="text-[var(--primary-color)]" />
                  <span className="font-semibold text-lg">{treatment.price.toLocaleString()} PHP</span>
                </div>
                {treatment.isActive && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Available</span>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">About this treatment</h2>
                <p className="text-gray-600 leading-relaxed">
                  {treatment.description || "No description available. Please contact our clinic for more information about this treatment."}
                </p>
              </div>

              {/* ✅ Before & After Gallery Section */}
              <BeforeAfterGallery treatmentId={treatment.id} treatmentName={treatment.name} />

              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-gray-800 mb-2">What to expect</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Professional consultation before treatment</li>
                  <li>• Hygienic and modern facilities</li>
                  <li>• Aftercare instructions provided</li>
                  <li>• Follow-up support available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Booking CTA */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <div className="text-center mb-4">
              <Sparkles className="w-10 h-10 text-[var(--primary-color)] mx-auto mb-2" />
              <h3 className="text-xl font-bold text-gray-800">Ready to glow?</h3>
              <p className="text-gray-500 text-sm mt-1">Book your appointment today</p>
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Treatment price:</span>
                <span className="font-semibold">{treatment.price.toLocaleString()} PHP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration:</span>
                <span>{treatment.durationMinutes} minutes</span>
              </div>
            </div>
            <button
              onClick={handleBookNow}
              className="w-full btn btn-primary py-2.5 flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <CalendarCheck size={18} /> Book Now
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Free consultation included • Secure booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTreatmentDetailPage;