"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Can the ballroom accommodate over 500 guests?",
      answer: "Yes, our pillarless Grand Ballroom can comfortably seat up to 800 guests in a banquet style, or up to 1,200 for a standing cocktail reception."
    },
    {
      question: "Are outside caterers permitted?",
      answer: "We maintain our culinary excellence by working exclusively with our in-house Executive Chef and culinary team. However, we do accommodate specific dietary requirements and cultural preferences."
    },
    {
      question: "Do you offer parking facilities for our guests?",
      answer: "Yes, we provide secure, on-site parking for up to 250 vehicles, complete with professional valet services and a dedicated VIP drop-off area."
    },
    {
      question: "How far in advance should we book?",
      answer: "Due to high demand, particularly during peak wedding seasons, we recommend securing your date 9 to 12 months in advance."
    },
    {
      question: "Can we arrange a menu tasting?",
      answer: "Absolutely. A complimentary bespoke menu tasting for up to 4 guests is included in both our Gold and Diamond packages."
    }
  ];

  return (
    <section className="w-full bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex justify-center section-reveal relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent"></div>
      
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-4 text-reveal stagger-1">
            <div className="w-8 h-[1px] bg-[#C9A84C]/60"></div>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase font-bold">
              Curated Answers
            </p>
            <div className="w-8 h-[1px] bg-[#C9A84C]/60"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight text-reveal stagger-2">
            Frequently <span className="italic text-[#C9A84C] font-light">Asked.</span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="w-full space-y-2 text-reveal stagger-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border border-[#C9A84C]/20 transition-all duration-300 ${isOpen ? 'bg-[#111111]' : 'bg-transparent hover:bg-[#111111]/50'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left"
                >
                  <span className={`font-serif text-lg md:text-xl transition-colors duration-300 ${isOpen ? 'text-[#C9A84C]' : 'text-gray-200'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-[#C9A84C] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="px-6 pb-6 text-gray-400 font-light text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
