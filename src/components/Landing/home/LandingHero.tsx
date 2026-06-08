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
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C1E14]/85 via-[#2C1E14]/45 to-[#2C1E14]/65 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E14]/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Navigation Bar */}
      <MainNavbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-7xl pt-20">
        <div className="space-y-4">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold text-reveal stagger-1">
            Est. 1962 · Colombo, Sri Lanka
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-reveal stagger-2">
            An evening that becomes<br />
            <span className="italic text-[#D4BD6E]">your forever.</span>
          </h1>

          <p className="max-w-xl text-gray-300 text-sm leading-relaxed text-reveal stagger-3">
            A single, devoted ballroom. Twelve-metre vaulted ceilings, Bohemian crystal, and
            a service team trained in the rituals of celebration — orchestrated for one
            wedding at a time.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 text-reveal stagger-4">
            <button 
              onClick={() => router.push('/book')}
              className="btn-interactive pulse-glow w-full sm:w-auto bg-[#C9A84C] text-[#2C1E14] px-6 py-3 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-semibold hover:bg-[#B89238] transition-colors"
            >
              Reserve Your Date
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            
            <button 
              onClick={() => router.push('/virtual-tour')}
              className="btn-interactive w-full sm:w-auto border border-white/30 bg-[#2C1E14]/20 backdrop-blur-sm text-white px-6 py-3 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-semibold hover:bg-white/10 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Virtual Tour
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingHero;
