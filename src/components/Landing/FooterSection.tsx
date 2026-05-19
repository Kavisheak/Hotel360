import React from 'react';
import { ArrowRight } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="w-full bg-[#151210] flex flex-col items-center">
      
      {/* Top CTA Section */}
      <div className="w-full py-24 md:py-32 px-6 flex flex-col items-center text-center max-w-3xl">
        <p className="text-[#c69c6d] text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold mb-6">
          Reservations Open
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6">
          Begin the conversation.
        </h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
          A bespoke evening starts with a single date. View availability and compose your celebration in minutes.
        </p>
        <button className="bg-[#c69c6d] text-black px-8 py-4 flex items-center justify-center gap-3 text-[10px] md:text-xs tracking-widest uppercase font-semibold hover:bg-[#b0885a] transition-colors">
          Reserve Your Date
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-8 md:px-16 lg:px-24 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column - Brand */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold mb-6">
              EASCC
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-6 leading-snug max-w-sm">
              Where every union becomes a <span className="italic text-[#c69c6d]">legacy.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              A singular wedding sanctuary in the heart of Colombo — crafted for couples who measure celebration in details.
            </p>
          </div>

          {/* Spacer for large screens */}
          <div className="hidden lg:block lg:col-span-3"></div>

          {/* Middle Column - Explore */}
          <div className="lg:col-span-2 flex flex-col">
            <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold mb-6">
              Explore
            </p>
            <ul className="flex flex-col gap-4 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Packages</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Virtual Tour</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reserve a Date</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Client Portal</a></li>
            </ul>
          </div>

          {/* Right Column - Visit */}
          <div className="lg:col-span-2 flex flex-col">
            <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold mb-6">
              Visit
            </p>
            <div className="flex flex-col gap-4 text-gray-300 text-sm mb-8">
              <p>14 Galle Face Terrace<br />Colombo 03, Sri Lanka</p>
              <p><a href="tel:+94115551820" className="hover:text-white transition-colors">+94 11 555 1820</a></p>
              <p><a href="mailto:concierge@eascc.lk" className="hover:text-white transition-colors">concierge@eascc.lk</a></p>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Footer */}
      <div className="w-full max-w-7xl px-8 md:px-16 lg:px-24">
        <div className="w-full border-t border-[#c69c6d]/30 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
          <p>&copy; 2026 EASCC &middot; All Rights Reserved</p>
          <p>Crafted with Intention</p>
        </div>
      </div>

    </footer>
  );
};

export default FooterSection;
