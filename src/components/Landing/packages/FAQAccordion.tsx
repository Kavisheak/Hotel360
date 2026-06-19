import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQ_DATA } from "./types";

export default function FAQAccordion() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  return (
    <section className="bg-white dark:bg-[#0A0A0A] py-16 md:py-24 px-6 border-b border-[#D4C9A8]/30 dark:border-[#C9A84C]/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[#805D3A] dark:text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold section-reveal">
            Client Support
          </p>
          <h2 className="text-3xl font-serif text-[#2C1E14] dark:text-white leading-tight section-reveal stagger-1">
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
                className="border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 rounded-sm bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-all duration-300 hover-glow"
              >
                <button
                  onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`text-xs font-semibold transition-colors ${isOpen ? 'text-[#805D3A] dark:text-[#C9A84C]' : 'text-gray-200'}`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C] shrink-0" />
                  )}
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
                  }`}
                >
                  <div className="pt-1 text-xs text-gray-600 dark:text-gray-400 font-light leading-relaxed border-t border-white/10 mt-2">
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
