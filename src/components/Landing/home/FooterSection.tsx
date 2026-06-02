import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FooterSection = () => {
  return (
    <footer className="w-full bg-[#151210] flex flex-col items-center">
      
      {/* Top CTA Section */}
      <div className="w-full py-16 md:py-20 px-6 flex flex-col items-center text-center max-w-3xl">
        <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
          Reservations Open
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-4">
          Begin the conversation.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
          A bespoke evening starts with a single date. View availability and compose your celebration in minutes.
        </p>
        <Link href="/customer/book" className="bg-[#c69c6d] text-black px-6 py-3 flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase font-semibold hover:bg-[#b0885a] transition-colors">
          Reserve Your Date
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">
          
          {/* Left Column - Brand */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
              EASCC
            </p>
            <h3 className="text-xl md:text-2xl font-serif text-white mb-4 leading-snug max-w-sm">
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
            <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
              Explore
            </p>
            <ul className="flex flex-col gap-3 text-gray-300 text-sm">
              <li><Link href="/customer/packages" className="hover:text-white transition-colors">Packages</Link></li>
              <li><Link href="/customer/vendors" className="hover:text-white transition-colors">Vendors</Link></li>
              <li><Link href="/customer/virtual-tour" className="hover:text-white transition-colors">Virtual Tour</Link></li>
              <li><Link href="/customer/book" className="hover:text-white transition-colors">Reserve a Date</Link></li>
              <li><Link href="/customer" className="hover:text-white transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          {/* Right Column - Visit */}
          <div className="lg:col-span-2 flex flex-col">
            <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
              Visit
            </p>
            <div className="flex flex-col gap-3 text-gray-300 text-sm mb-6">
              <p>14 Galle Face Terrace<br />Colombo 03, Sri Lanka</p>
              <p><a href="tel:+94115551820" className="hover:text-white transition-colors">+94 11 555 1820</a></p>
              <p><a href="mailto:concierge@eascc.lk" className="hover:text-white transition-colors">concierge@eascc.lk</a></p>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
              <Link href="#" className="hover:text-white transition-colors">Facebook</Link>
              <Link href="#" className="hover:text-white transition-colors">YouTube</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Footer */}
      <div className="w-full max-w-6xl px-6 md:px-12 lg:px-20">
        <div className="w-full border-t border-[#c69c6d]/30 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-gray-500 uppercase tracking-widest">
          <p>&copy; 2026 EASCC &middot; All Rights Reserved</p>
          <p>Crafted with Intention</p>
        </div>
      </div>

    </footer>
  );
};

export default FooterSection;
