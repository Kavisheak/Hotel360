import React from "react";
import Link from "next/link";

export default function VendorsHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#151210]/95 backdrop-blur-md border-b border-[#c69c6d]/20 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-5 h-[1px] bg-[#c69c6d] group-hover:w-8 transition-all duration-300"></div>
          <span className="font-serif text-lg tracking-wider text-[#FAF6EE] normal-case">
            EASCC <span className="font-light italic text-[#c69c6d] text-sm">Conference Center</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-gray-300">
          <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
          <Link href="/packages" className="hover:text-white transition-colors duration-200">Packages</Link>
          <Link href="/vendors" className="text-[#c69c6d] border-b border-[#c69c6d] pb-0.5 font-bold tracking-widest">Vendors</Link>
          <Link href="#" className="hover:text-white transition-colors duration-200">Virtual Tour</Link>
          <Link href="#" className="hover:text-white transition-colors duration-200">Book</Link>
        </nav>

        {/* Call to Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-white transition-colors duration-200">
            Sign In
          </Link>
          <Link 
            href="#" 
            className="border border-[#c69c6d] text-[#c69c6d] px-4 py-1.5 hover:bg-[#c69c6d] hover:text-black transition-all duration-300 text-[10px] uppercase font-bold tracking-widest"
          >
            Reserve
          </Link>
        </div>
      </div>
    </header>
  );
}
