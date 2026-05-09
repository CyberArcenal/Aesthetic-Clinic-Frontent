// src/pages/public/contact/components/FAQ.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: 'Do I need to book an appointment?',
    answer: 'Yes, we highly recommend booking an appointment to ensure availability and minimize waiting time. You can book online through our website or call us directly.',
  },
  {
    question: 'What treatments do you offer?',
    answer: 'We offer a wide range of aesthetic treatments including HydraFacial, Botox, Dermal Fillers, Laser Hair Removal, Microneedling, Chemical Peels, and more. Visit our Treatments page for the full list.',
  },
  {
    question: 'Are your treatments safe?',
    answer: 'Absolutely. All our treatments are performed by certified professionals using medical-grade equipment. We follow strict hygiene and safety protocols.',
  },
  {
    question: 'How do I prepare for my first visit?',
    answer: 'For your first visit, please arrive 15 minutes early to complete patient forms. Bring a valid ID and any relevant medical records. Avoid makeup or skincare products on the treatment area if possible.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, credit/debit cards (Visa, Mastercard), GCash, and bank transfers. Payment plans are available for selected packages.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
        <div className="w-24 h-1 bg-[var(--primary-color)] mx-auto mt-3 rounded"></div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Common questions about our clinic and services
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md">
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-5 text-left"
              >
                <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
                {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-gray-600 border-t border-gray-100 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;