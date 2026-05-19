import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Image from 'next/image';

const LandingHero = () => {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex flex-col font-sans text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/luxury_ballroom_bg.png"
          alt="Luxury Ballroom"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark/Warm gradient overlay for readability and mood */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between text-xs tracking-widest font-medium uppercase border-b border-white/10">
        {/* Left Logo */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-[1px] bg-white"></div>
          <span className="text-lg normal-case font-serif tracking-normal"><span className="font-semibold">EASCC</span></span>
        </div>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-12 text-gray-300">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Packages</a>
          <a href="#" className="hover:text-white transition-colors">Virtual Tour</a>
          <a href="#" className="hover:text-white transition-colors">Book</a>
          <a href="#" className="hover:text-white transition-colors">My Account</a>
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-8">
          <a href="#" className="hidden sm:block text-gray-300 hover:text-white transition-colors">Sign In</a>
          <a href="#" className="border border-[#c69c6d] text-[#c69c6d] px-6 py-2 hover:bg-[#c69c6d] hover:text-black transition-colors">
            Reserve
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-7xl">
        <div className="space-y-6">
          {/* Subheading */}
          <p className="text-[#c69c6d] text-xs tracking-[0.2em] uppercase font-semibold">
            Est. 1962 · Colombo, Sri Lanka
          </p>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight">
            An evening that becomes<br />
            <span className="italic text-[#d9b891]">your forever.</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-gray-300 text-sm md:text-base leading-relaxed">
            A single, devoted ballroom. Twelve-metre vaulted ceilings, Bohemian crystal, and<br className="hidden md:block" />
            a service team trained in the rituals of celebration — orchestrated for one<br className="hidden md:block" />
            wedding at a time.
          </p>

          {/* Action Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
            <button className="w-full sm:w-auto bg-[#c69c6d] text-black px-8 py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-semibold hover:bg-[#b0885a] transition-colors">
              Reserve Your Date
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button className="w-full sm:w-auto border border-white/30 bg-black/20 backdrop-blur-sm text-white px-8 py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-semibold hover:bg-white/10 transition-colors">
              <PlayCircle className="w-4 h-4" />
              Virtual Tour
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingHero;
