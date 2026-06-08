"use client";

import { useState, useEffect } from "react";
import { packagesData, PackageData } from "./data";
import PackageCard from "./components/PackageCard";
import PackageDetailsModal from "./components/PackageDetailsModal";
import MainNavbar from "@/components/landing/shared/MainNavbar";

export default function PackagesPage() {
  const [isGuest, setIsGuest] = useState(true);
  const [selectedDetailsPkg, setSelectedDetailsPkg] = useState<PackageData | null>(null);

  // For demonstration, try to read from localStorage if they came from /login
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === "customer" || user === "decorator") {
      setIsGuest(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F0E6D0] flex flex-col font-sans text-[#2C1E14]">
      
      <MainNavbar />

      {/* Demo Toggle Banner (Temporary for Testing) */}
      <div className="bg-[#2C1E14] text-[#C9A84C] p-3 text-center flex items-center justify-center gap-4 shadow-md sticky top-0 z-40 border-b border-[#C9A84C]/30">
        <span className="font-medium text-sm">
          Viewing as: <strong className="uppercase tracking-wide">{isGuest ? "Guest User" : "Registered Customer"}</strong>
        </span>
        <button 
          onClick={() => setIsGuest(!isGuest)}
          className="bg-[#C9A84C] text-[#2C1E14] px-4 py-1 text-xs font-bold rounded-sm hover:bg-[#B89238] transition-colors btn-interactive"
        >
          Toggle Role
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-[#2C1E14] text-white">
        <div className="absolute inset-0 bg-[url('/luxury_ballroom_bg.png')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E14]/50 to-[#2C1E14]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center section-reveal">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold mb-4">
            Our Offerings
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 drop-shadow-sm leading-tight stagger-1">
            Curated Wedding Packages
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed stagger-2">
            From intimate gatherings to grand celebrations, choose the perfect framework that brings your dream wedding to life.
          </p>

          {isGuest && (
            <div className="inline-flex flex-col items-center p-8 bg-white/5 backdrop-blur-md rounded-sm shadow-xl border border-[#C9A84C]/20 card-entrance stagger-3 hover-glow">
              <span className="material-symbols-outlined text-[#C9A84C] text-[32px] mb-3">lock_person</span>
              <h3 className="font-serif text-white text-xl">Sign in to unlock booking features</h3>
              <p className="text-gray-400 text-xs font-light mt-2 mb-6 max-w-sm">You need an account to select dates and customize packages within your client portal.</p>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 bg-[#C9A84C] text-[#2C1E14] text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#B89238] transition-colors btn-interactive" onClick={() => window.location.href='/login'}>
                  Login
                </button>
                <button className="px-6 py-2.5 border border-[#C9A84C]/50 text-[#C9A84C] text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#C9A84C]/10 transition-colors btn-interactive">
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto px-4 py-24 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packagesData.map((pkg, index) => (
            <PackageCard 
              key={pkg.id} 
              pkg={pkg} 
              isGuest={isGuest} 
              onViewDetails={setSelectedDetailsPkg}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      <PackageDetailsModal 
        isOpen={!!selectedDetailsPkg} 
        onClose={() => setSelectedDetailsPkg(null)} 
        pkg={selectedDetailsPkg} 
      />

    </div>
  );
}
