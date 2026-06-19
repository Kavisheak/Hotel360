"use client";

import React from 'react';
import { ArrowRight, PlayCircle, Building2, Award, ConciergeBell } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LandingHero = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen min-h-[500px] max-h-[800px] flex flex-col font-sans text-[#2C1E14] dark:text-white overflow-hidden transition-colors duration-300">
      {/* Background Image - pointer-events-none so it never blocks clicks */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/light_ballroom_bg.png"
          alt="Luxury Ballroom Light"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center dark:hidden"
        />
        <Image
          src="/luxury_ballroom_bg.png"
          alt="Luxury Ballroom Dark"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center hidden dark:block"
        />
        <div className="absolute inset-0 bg-[#E3C77B]/20 dark:bg-[#7B5B2E]/20 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/60 via-white/40 to-white/90 dark:from-black/95 dark:via-black/50 dark:to-black/95 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0A0A0A]/80 dark:via-transparent dark:to-transparent pointer-events-none" />
        {/* Horizontal gradient to wash out the center for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/95 to-transparent dark:via-[#0A0A0A]/95 pointer-events-none"></div>
      </div>

      <style>{`
        @keyframes legacy-zoom {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-legacy {
          display: inline-block;
          animation: legacy-zoom 5s ease-in-out infinite;
          color: #C9A84C;
        }
      `}</style>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pb-10">
        <div className="space-y-6 flex flex-col items-center">
          {/* Overline */}
          <div className="flex items-center gap-4 text-reveal stagger-1">
            <div className="w-8 h-[1px] bg-[#805D3A]/40 dark:bg-[#C9A84C]/60"></div>
            <p className="text-[#805D3A] dark:text-white/90 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-semibold">
              SOUTH ASIA'S SIGNATURE CELEBRATION & CONVENTION CENTER
            </p>
            <div className="w-8 h-[1px] bg-[#805D3A]/40 dark:bg-[#C9A84C]/60"></div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight text-reveal stagger-2 text-[#2C1E14] dark:text-white">
            Where Every Union<br />
            <span className="italic font-light animate-legacy">Becomes A Legacy</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-[#805D3A] dark:text-gray-200 text-sm md:text-base leading-relaxed text-reveal stagger-3 font-medium">
            A timeless wedding sanctuary in the heart of Batticaloa — crafted for stories 
            who deserve to be remembered forever.
          </p>

          {/* Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 text-reveal stagger-4">
            <button 
              onClick={() => router.push('/book')}
              className="btn-interactive w-full sm:w-auto bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-black px-8 py-3.5 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-[#C9A84C] dark:hover:bg-[#B5953F] transition-all"
            >
              Reserve Your Date
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => router.push('/customer/packages')}
              className="btn-interactive w-full sm:w-auto border border-[#D4C9A8] dark:border-[#C9A84C]/50 bg-white dark:bg-transparent backdrop-blur-sm text-[#805D3A] dark:text-[#C9A84C] px-8 py-3.5 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-gray-50 dark:hover:bg-[#C9A84C]/10 transition-colors"
            >
              Explore Packages
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      {/* Bottom Bar overlaying the hero */}
      <div className="absolute bottom-0 left-0 w-full bg-white/95 dark:bg-black/80 backdrop-blur-md border-t border-[#805D3A]/10 dark:border-white/10 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-reveal stagger-4">
          <div className="flex-1 w-full sm:w-auto py-5 flex justify-center items-center gap-3 border-r border-[#805D3A]/10 dark:border-white/10">
            <Building2 size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#805D3A] dark:text-[#C9A84C]">Curated Spaces</span>
          </div>
          <div className="flex-1 w-full sm:w-auto py-5 flex justify-center items-center gap-3 border-r border-[#805D3A]/10 dark:border-white/10">
            <Award size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#805D3A] dark:text-[#C9A84C]">Top Service</span>
          </div>
          <div className="flex-1 w-full sm:w-auto py-5 flex justify-center items-center gap-3">
            <ConciergeBell size={16} className="text-[#C9A84C]" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#805D3A] dark:text-[#C9A84C]">Best Catering</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;