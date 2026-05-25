import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Image from 'next/image';

const LandingHero = () => {
  return (
    <div className="relative w-full h-screen min-h-[500px] max-h-[800px] flex flex-col font-sans text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/luxury_ballroom_bg.png"
          alt="Luxury Ballroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 w-full px-6 py-4 flex items-center justify-between text-xs tracking-widest font-medium uppercase border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-[1px] bg-white"></div>
          <span className="text-base normal-case font-serif tracking-normal"><span className="font-semibold">EASCC</span></span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Packages</a>
          <a href="/vendors" className="hover:text-white transition-colors">Vendors</a>
          <a href="#" className="hover:text-white transition-colors">Virtual Tour</a>
          <a href="#" className="hover:text-white transition-colors">Book</a>
          <a href="#" className="hover:text-white transition-colors">My Account</a>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hidden sm:block text-gray-300 hover:text-white transition-colors">Sign In</a>
          <a href="#" className="border border-[#c69c6d] text-[#c69c6d] px-5 py-1.5 hover:bg-[#c69c6d] hover:text-black transition-colors text-[11px]">
            Reserve
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-7xl">
        <div className="space-y-4">
          <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold">
            Est. 1962 · Colombo, Sri Lanka
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            An evening that becomes<br />
            <span className="italic text-[#d9b891]">your forever.</span>
          </h1>

          <p className="max-w-xl text-gray-300 text-sm leading-relaxed">
            A single, devoted ballroom. Twelve-metre vaulted ceilings, Bohemian crystal, and
            a service team trained in the rituals of celebration — orchestrated for one
            wedding at a time.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button className="w-full sm:w-auto bg-[#c69c6d] text-black px-6 py-3 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-semibold hover:bg-[#b0885a] transition-colors">
              Reserve Your Date
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            
            <button className="w-full sm:w-auto border border-white/30 bg-black/20 backdrop-blur-sm text-white px-6 py-3 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-semibold hover:bg-white/10 transition-colors">
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
