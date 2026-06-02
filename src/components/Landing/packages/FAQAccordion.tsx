import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQ_DATA } from "./types";

export default function FAQAccordion() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);

  return (
    <section className="bg-white border-t border-[#E8DFC9] py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold">
            Client Support
          </p>
          <h2 className="text-3xl font-serif text-gray-900 leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-[1px] bg-[#c69c6d] mx-auto mt-4"></div>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFAQIndex === index;
            return (
              <div 
                key={index}
                className="border border-[#E8DFC9] rounded-sm bg-[#FAF6EE]/20 hover:bg-white transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFAQIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-xs font-semibold text-[#1A1512]">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#c69c6d] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#c69c6d] shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs text-gray-600 font-light leading-relaxed border-t border-[#FAF6EE]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
