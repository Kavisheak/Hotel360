import React from "react";
import { Sparkles } from "lucide-react";

export default function VendorsHero() {
  return (
    <section className="relative w-full py-16 bg-[#1A1512] text-white overflow-hidden border-b border-[#c69c6d]/20">
      {/* Subtle Decorative Background Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[#c69c6d]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Approved Luxury Partners</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif leading-tight">
          Curate Your <span className="italic text-[#c69c6d]">Unforgettable Union</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-light leading-relaxed">
          We collaborate only with Colombo's elite decorators, musical maestros, and visual storytellers. Vetted for aesthetic excellence and meticulously trained to orchestrate within the grand EASCC Ballroom.
        </p>
      </div>
    </section>
  );
}
