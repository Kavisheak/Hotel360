"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function BookHero() {
  return (
    <section className="relative w-full py-20 bg-white dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white overflow-hidden border-b border-[#E8DFC9] dark:border-[#C9A84C]/20 transition-colors duration-300">
      
      {/* Background Image on Right */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-full z-0">
        <Image
          src="/vendors_hero_bg_v3.png"
          alt="Crystal Pavilion Venue"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-xl space-y-4 py-12">
          <div className="flex items-center gap-2 text-[#A6955C] dark:text-[#C9A84C]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">Exclusive Booking Office</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif leading-tight text-[#1A1512] dark:text-white text-reveal stagger-2">
            Compose Your <span className="italic text-[#A6955C] dark:text-[#C9A84C]">Historic Union</span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed text-reveal stagger-3 pt-2">
            By holding only one wedding per day, EASCC guarantees absolute, uninterrupted focus on your celebration. Plan your date, hours, and guests details below to coordinate with our concierge.
          </p>
        </div>
      </div>
    </section>
  );
}
