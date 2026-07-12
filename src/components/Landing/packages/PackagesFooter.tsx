import React from "react";
import Link from "next/link";

export default function PackagesFooter() {
  return (
    <footer className="w-full bg-[#151210] border-t border-[#c69c6d]/20 text-[#2C1E14] dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-[1px] bg-[#c69c6d]"></div>
          <span className="text-sm font-serif tracking-normal text-[#FAF6EE]">EASCC &copy; 2026</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-semibold">
          <Link href="/" className="hover:text-[#2C1E14] dark:text-white transition-colors duration-200">Home</Link>
          <Link href="/customer/packages" className="text-[#C69C6D] hover:text-[#2C1E14] dark:text-white transition-colors duration-200">Packages</Link>
          <Link href="/customer/vendors" className="hover:text-[#2C1E14] dark:text-white transition-colors duration-200">Vendors</Link>
          <Link href="/customer/virtual-tour" className="hover:text-[#2C1E14] dark:text-white transition-colors duration-200">Virtual Tour</Link>
          <Link href="/customer/virtual-tour" className="hover:text-[#2C1E14] dark:text-white transition-colors duration-200">Book</Link>
        </div>
        
        <p className="text-[9px] text-gray-600 uppercase tracking-widest font-semibold">Crafted with Intention</p>
      </div>
    </footer>
  );
}
