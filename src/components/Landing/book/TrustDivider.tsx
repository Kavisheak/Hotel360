"use client";

import React from "react";
import { ShieldCheck, Clock, Award } from "lucide-react";

export default function TrustDivider() {
  return (
    <section className="bg-[#2C1E14] text-white py-12 px-6 border-t border-[#C9A84C]/20 mt-12 rounded-sm hover-glow transition-all duration-300">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 text-center md:text-left">
        
        <div className="space-y-2 border-b border-[#C9A84C]/20 pb-6 hover-lift stagger-1">
          <div className="flex justify-center md:justify-start text-[#C9A84C]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">100% Date Exclusivity</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            We pledge 100% estate dedication. You alone will occupy the grand ballroom, arrival foyer, and gardens for the entire duration of your wedding.
          </p>
        </div>

        <div className="space-y-2 border-b border-[#C9A84C]/20 pb-6 hover-lift stagger-2">
          <div className="flex justify-center md:justify-start text-[#C9A84C]">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">Custom Timeline Bending</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Morning, Evening, or Full-Day configurations adapt precisely to your auspicious hour requirements, complete with early arrival suites.
          </p>
        </div>

        <div className="space-y-2 hover-lift stagger-3">
          <div className="flex justify-center md:justify-start text-[#C9A84C]">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">Deposit Holding Grace</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Enjoy a 48-hour complimentary calendar hold while coordinating payment transfers and booking walkthroughs.
          </p>
        </div>

      </div>
    </section>
  );
}
