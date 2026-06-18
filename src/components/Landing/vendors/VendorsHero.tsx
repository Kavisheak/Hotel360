import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function VendorsHero() {
  return (
    <section className="relative w-full py-24 bg-white dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white overflow-hidden border-b border-[#D4C9A8]/30 dark:border-[#C9A84C]/20 transition-colors duration-300">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/vendors_hero_bg_v3.png"
          alt="Vendors Hero Background Light"
          fill
          className="object-cover opacity-100 dark:hidden"
          priority
        />
        <Image
          src="/luxury_ballroom_bg.png"
          alt="Vendors Hero Background Dark"
          fill
          className="object-cover opacity-40 mix-blend-overlay hidden dark:block"
          priority
        />
        {/* Horizontal gradient to wash out the center for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/95 to-transparent dark:via-[#0A0A0A]/95"></div>
        {/* Vertical gradient to smoothly blend into the section below */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white dark:from-[#0A0A0A]/80 dark:via-[#0A0A0A]/70 dark:to-[#0A0A0A]"></div>
      </div>

      {/* Subtle Decorative Background Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[#805D3A] dark:text-[#C9A84C]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">Approved Luxury Partners</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif leading-tight text-reveal stagger-2">
          Curate Your <span className="italic text-[#805D3A] dark:text-[#C9A84C]">Unforgettable Union</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-700 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed text-reveal stagger-3">
          We collaborate only with Colombo&apos;s elite decorators, musical maestros, and visual storytellers. Vetted for aesthetic excellence and meticulously trained to orchestrate within the grand EASCC Ballroom.
        </p>
      </div>
    </section>
  );
}
