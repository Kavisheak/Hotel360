import React from "react";
import { ShieldCheck, Clock, Award } from "lucide-react";

export default function VendorsTrust() {
  return (
    <section className="bg-white dark:bg-transparent text-[#2C1E14] dark:text-white py-12 px-6 border-t border-[#D4C9A8]/30 dark:border-[#C9A84C]/20 mt-12 section-reveal transition-colors duration-300">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#D4C9A8] dark:border-[#C9A84C]/20 pb-6 md:pb-0 md:pr-8 hover-lift stagger-1">
          <div className="flex justify-center md:justify-start text-[#805D3A] dark:text-[#C9A84C]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">100% Quality Vetted</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            Every vendor is legally licensed, background-checked, and highly rated across the Colombo event community.
          </p>
        </div>

        <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#D4C9A8] dark:border-[#C9A84C]/20 pb-6 md:pb-0 md:pr-8 hover-lift stagger-2">
          <div className="flex justify-center md:justify-start text-[#805D3A] dark:text-[#C9A84C]">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">Venue Trained</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            Familiar with EASCC rules, safety policies, structural wiring setups, and logistics to ensure seamless execution.
          </p>
        </div>

        <div className="space-y-2 hover-lift stagger-3">
          <div className="flex justify-center md:justify-start text-[#805D3A] dark:text-[#C9A84C]">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">Bespoke Customization</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            Collaborate directly with vendor managers and the EASCC concierge to adapt templates specifically to your guest list.
          </p>
        </div>

      </div>
    </section>
  );
}
