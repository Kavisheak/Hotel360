import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function VendorsHero() {
  return (
    <section className="relative w-full py-24 bg-[#2C1E14] text-white overflow-hidden border-b border-[#C9A84C]/20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/Frontimg.png"
          alt="Vendors Hero Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E14]/50 via-[#2C1E14]/70 to-[#2C1E14]"></div>
      </div>

      {/* Subtle Decorative Background Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[#C9A84C]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">Approved Luxury Partners</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif leading-tight text-reveal stagger-2">
          Curate Your <span className="italic text-[#C9A84C]">Unforgettable Union</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base font-light leading-relaxed text-reveal stagger-3">
          We collaborate only with Colombo&apos;s elite decorators, musical maestros, and visual storytellers. Vetted for aesthetic excellence and meticulously trained to orchestrate within the grand EASCC Ballroom.
        </p>
      </div>
    </section>
  );
}
