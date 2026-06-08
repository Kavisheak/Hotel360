import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQ_DATA } from "./types";

export default function FAQAccordion() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-16 md:py-24 px-6 border-b border-[#D4C9A8]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold section-reveal">
            Client Support
          </p>
          <h2 className="text-3xl font-serif text-gray-900 leading-tight section-reveal stagger-1">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto mt-4 section-reveal stagger-2"></div>
        </div>

        <div className="space-y-4 section-reveal stagger-3">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFAQIndex === index;
            return (
              <div 
                key={index}
                className="border border-[#D4C9A8] rounded-sm bg-[#F0E6D0]/20 hover:bg-[#F0E6D0]/50 transition-all duration-300 hover-glow"
              >
                <button
                  onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-xs font-semibold text-[#2C1E14]">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C9A84C] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#C9A84C] shrink-0" />
                  )}
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
                  }`}
                >
                  <div className="pt-1 text-xs text-gray-600 font-light leading-relaxed border-t border-[#D4C9A8]/50 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
