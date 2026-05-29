import React from "react";
import { Sparkles } from "lucide-react";

export default function PackagesHero() {
  return (
    <section className="relative w-full py-20 md:py-24 bg-[#1A1512] text-white overflow-hidden border-b border-[#c69c6d]/20">
      {/* Subtle Decorative Background Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-5">
        <div className="flex items-center justify-center gap-2 text-[#c69c6d]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Refined Celebration Frameworks</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
          Three Frameworks.<br />
          <span className="italic text-[#c69c6d]">Infinite Expression.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-light leading-relaxed">
          We host precisely one wedding per day, dedicating the entire estate and our elite catering, design, and production teams entirely to your event. Select from our signature templates and orchestrate them to your precise scale.
        </p>
      </div>
    </section>
  );
}
