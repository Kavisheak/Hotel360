import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function PackagesHero() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] md:h-auto md:min-h-0 md:py-24 flex flex-col justify-center bg-white dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white overflow-hidden border-b border-[#D4C9A8]/30 dark:border-[#C9A84C]/20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/packages_hero_bg.png"
          alt="Packages Hero Background"
          fill
          className="object-cover opacity-40 dark:opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:from-transparent dark:via-[#0A0A0A]/60 dark:to-[#0A0A0A]"></div>
      </div>

      {/* Subtle Decorative Background Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[#805D3A]/20 dark:bg-white"></div>
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-[#805D3A]/20 dark:bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#805D3A]/20 dark:bg-white"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[#805D3A] dark:text-[#C9A84C]">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">Signature Offerings</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif leading-tight text-reveal stagger-2">
          Three frameworks.<br />
          <span className="italic text-[#805D3A] dark:text-[#C9A84C]">Infinite expression.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed text-reveal stagger-3">
          We believe in transparent, comprehensive pricing. Select a foundation below, and collaborate with your EASCC concierge to tailor every detail to your vision.
        </p>
      </div>
    </section>
  );
}
