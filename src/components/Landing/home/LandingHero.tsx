"use client";

import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MainNavbar from '@/components/landing/shared/MainNavbar';

const LandingHero = () => {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen min-h-[500px] max-h-[800px] flex flex-col font-sans text-white overflow-hidden">
      {/* Background Image - pointer-events-none so it never blocks clicks */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/luxury_ballroom_bg.png"
          alt="Luxury Ballroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#7B5B2E]/40 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A110A]/95 via-[#4A3515]/40 to-[#1A110A]/85 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A110A]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      <style>{`
        @keyframes legacy-zoom {
          0%, 100% {
            transform: scale(1);
            color: #C9A84C;
          }
          50% {
            transform: scale(1.05);
            color: #FFFFFF;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          }
        }
        .animate-legacy {
          display: inline-block;
          animation: legacy-zoom 5s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation Bar */}
      <MainNavbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pt-20">
        <div className="space-y-6 flex flex-col items-center">
          {/* Overline */}
          <div className="flex items-center gap-4 text-reveal stagger-1">
            <div className="w-8 h-[1px] bg-[#C9A84C]/60"></div>
            <p className="text-white/90 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-semibold">
              Elite Asian Signature Celebration & Convention Center
            </p>
            <div className="w-8 h-[1px] bg-[#C9A84C]/60"></div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight text-reveal stagger-2 text-white">
            Where Every Union<br />
            <span className="italic font-light animate-legacy">Becomes A Legacy</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-gray-200 text-sm md:text-base leading-relaxed text-reveal stagger-3 font-light">
            A singular wedding sanctuary in the heart of Batticaloa — crafted for couples 
            who measure celebration in details.
          </p>

          {/* Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 text-reveal stagger-4">
            <button 
              onClick={() => router.push('/book')}
              className="btn-interactive w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black px-8 py-3.5 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
            >
              Reserve Your Date
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => router.push('/customer/packages')}
              className="btn-interactive w-full sm:w-auto border border-[#C9A84C]/60 bg-black/20 backdrop-blur-sm text-[#C9A84C] px-8 py-3.5 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-[#C9A84C]/10 transition-colors"
            >
              Explore Packages
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Stats */}
          <div className="pt-16 flex items-center gap-6 md:gap-12 text-[#C9A84C] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold text-reveal stagger-4 opacity-80">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A84C]/60"></div>
              <span>24k sq.ft</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A84C]/60"></div>
              <span>12m height</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A84C]/60"></div>
              <span>800 guests</span>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A84C]/60 ml-3"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingHero;
