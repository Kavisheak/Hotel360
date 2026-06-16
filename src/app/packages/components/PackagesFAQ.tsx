"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: "How far in advance should we reserve our date?", answer: "We recommend reserving your date 9 to 12 months in advance, especially for high-season weekends. This ensures availability of both the ballroom and your preferred vendor teams." },
  { question: "Can we customize or mix elements of different packages?", answer: "Absolutely. Our packages serve as a framework. You can elevate elements like culinary tiers or add exclusive vendor services through your dedicated event coordinator." },
  { question: "What is your policy regarding outside vendors?", answer: "To maintain our rigorous quality standards, we require you to select from our vetted pool of premium partner vendors for core services like Decor, DJ, and Videography." },
  { question: "How do additional guest charges work if we exceed the base capacity?", answer: "Additional guests beyond the package base are charged on a per-head basis determined by your selected Culinary Tier and Beverage Package. Your coordinator will provide exact figures during the planning phase." },
  { question: "What is the payment schedule and reservation deposit?", answer: "A 25% non-refundable deposit secures your date. A second installment of 25% is due 6 months prior, and the final balance must be cleared 30 days before the event." }
];

export default function PackagesFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="w-full bg-[#F0E6D0] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-[#A67C52] text-[10px] tracking-[0.2em] uppercase font-bold mb-3 text-center">
          Client Support
        </p>
        <h2 className="text-3xl md:text-5xl font-serif text-[#2C1E14] mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-[#D4C9A8] rounded-sm overflow-hidden shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none hover:bg-[#F9F7F2] transition-colors"
              >
                <span className={`text-sm font-bold ${openIdx === idx ? 'text-[#C9A84C]' : 'text-[#2C1E14]'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-[#A67C52] transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-5 pt-2 text-sm text-gray-600 font-light leading-relaxed border-t border-[#F0E6D0] mx-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
