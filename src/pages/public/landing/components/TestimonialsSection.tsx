import React from "react";
import { Star } from "lucide-react";
import { testimonials } from "../data/landingData";

const TestimonialsSection: React.FC = () => {
  return (
    <section className="bg-[var(--primary-color)]/10 py-12 md:py-16 px-4">
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">What Our Clients Say</h2>
        <p className="text-gray-600">Real stories, real results.</p>
      </div>
      <div className="container mx-auto grid md:grid-cols-3 gap-5">
        {testimonials.map((t, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex text-yellow-400 mb-2">{Array(t.rating).fill(0).map((_,i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
            <p className="text-gray-700 mb-3 text-sm">"{t.text}"</p>
            <p className="font-semibold">— {t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;