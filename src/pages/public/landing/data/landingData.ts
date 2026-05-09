import { Sparkles, Shield, Heart, Stethoscope, Award } from "lucide-react";

export const packages = [
  {
    name: "Glow Up Package",
    price: "₱5,500",
    original: "₱6,500",
    treatments: ["HydraFacial", "Dermaplaning", "LED Light Therapy"],
    duration: "90 mins",
    popular: true,
  },
  {
    name: "Botox & Fillers",
    price: "₱12,500",
    original: "₱15,000",
    treatments: ["2 areas Botox", "1 syringe Filler"],
    duration: "60 mins",
    popular: false,
  },
  {
    name: "Ultimate Rejuvenation",
    price: "₱8,900",
    original: "₱11,200",
    treatments: ["Chemical Peel", "Microneedling", "PRP"],
    duration: "120 mins",
    popular: true,
  },
];

export const services = [
  { name: "HydraFacial", icon: Sparkles, desc: "Deep cleansing + hydration" },
  { name: "Botox", icon: Shield, desc: "Wrinkle relaxer" },
  { name: "Dermal Fillers", icon: Heart, desc: "Volume restoration" },
  { name: "Laser Hair Removal", icon: Sparkles, desc: "Permanent reduction" },
  { name: "Microneedling", icon: Stethoscope, desc: "Collagen induction" },
  { name: "Chemical Peels", icon: Award, desc: "Skin resurfacing" },
];

export const testimonials = [
  { name: "Maria R.", text: "The staff is professional and the results are amazing! Highly recommend the Glow Up package.", rating: 5 },
  { name: "John S.", text: "I've been coming here for a year. Always clean, on time, and my skin has never looked better.", rating: 5 },
  { name: "Lisa T.", text: "Affordable packages and great customer service. Will definitely return.", rating: 4 },
];

export const beforeAfterImages = [
  { before: "https://placehold.co/600x400/FFCCCC/FFFFFF?text=Before+1", after: "https://placehold.co/600x400/CCFFCC/FFFFFF?text=After+1", title: "Acne Treatment" },
  { before: "https://placehold.co/600x400/FFCCCC/FFFFFF?text=Before+2", after: "https://placehold.co/600x400/CCFFCC/FFFFFF?text=After+2", title: "Wrinkle Reduction" },
  { before: "https://placehold.co/600x400/FFCCCC/FFFFFF?text=Before+3", after: "https://placehold.co/600x400/CCFFCC/FFFFFF?text=After+3", title: "Skin Rejuvenation" },
  { before: "https://placehold.co/600x400/FFCCCC/FFFFFF?text=Before+4", after: "https://placehold.co/600x400/CCFFCC/FFFFFF?text=After+4", title: "Scar Removal" },
];