import React from "react";
import { ShieldCheck, Clock, Award } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="bg-[#1A1512] text-white py-12 px-6 border-t border-[#c69c6d]/20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#c69c6d]/20 pb-6 md:pb-0 md:pr-8">
          <div className="flex justify-center md:justify-start text-[#c69c6d]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">100% Quality Vetted</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Every vendor is legally licensed, background-checked, and highly rated across the Colombo event community.
          </p>
        </div>

        <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#c69c6d]/20 pb-6 md:pb-0 md:pr-8">
          <div className="flex justify-center md:justify-start text-[#c69c6d]">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">Venue Trained</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Familiar with EASCC rules, safety policies, structural wiring setups, and logistics to ensure seamless execution.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-center md:justify-start text-[#c69c6d]">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-serif text-lg">Bespoke Customization</h4>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Collaborate directly with vendor managers and the EASCC concierge to adapt templates specifically to your guest list.
          </p>
        </div>

      </div>
    </section>
  );
}
