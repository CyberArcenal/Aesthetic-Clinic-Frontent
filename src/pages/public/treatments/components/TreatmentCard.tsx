// src/pages/public/treatments/components/TreatmentCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Clock, DollarSign, Sparkles } from "lucide-react";
import { TreatmentResponseDto } from "../../../../api/core/treatment";

interface TreatmentCardProps {
  treatment: TreatmentResponseDto;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-purple)] h-2"></div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{treatment.name}</h3>
          {treatment.isActive && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Available</span>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{treatment.description || "No description"}</p>
        {treatment.category && (
          <div className="mb-2">
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{treatment.category}</span>
          </div>
        )}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Clock size={14} /> {treatment.durationMinutes} min</span>
            <span className="flex items-center gap-1"><DollarSign size={14} /> {treatment.price.toLocaleString()}</span>
          </div>
          <Link
            to={`/treatments/${treatment.id}`}
            className="text-[var(--primary-color)] hover:text-[var(--primary-hover)] font-medium text-sm flex items-center gap-1"
          >
            View Details <Sparkles size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;