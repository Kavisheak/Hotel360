"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { packagesData, PackageData } from "./data";
import PackageCard from "./components/PackageCard";
import PackageDetailsModal from "./components/PackageDetailsModal";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import CompareFrameworks from "./components/CompareFrameworks";
import EstimateInvestment from "./components/EstimateInvestment";
import PackagesFAQ from "./components/PackagesFAQ";
import FooterSection from "@/components/landing/shared/Footer";
import { CheckCircle2, UserCheck, Star } from "lucide-react";

export default function PackagesPage() {
  const [isGuest, setIsGuest] = useState(true);
  const [selectedDetailsPkg, setSelectedDetailsPkg] = useState<PackageData | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === "customer" || user === "decorator") {
      setIsGuest(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col font-sans text-[#2C1E14]">
      
      <MainNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-[#2C1E14] text-white">
        <div className="absolute inset-0">
          <Image
            src="/luxury_ballroom_bg.png"
            alt="Luxury Ballroom"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C1E14]/70 via-[#2C1E14]/50 to-[#2C1E14]"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-left mt-10 section-reveal">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
            Event Packages
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 drop-shadow-sm leading-tight stagger-1">
            Tailored Experience.<br />Timeless Moments.
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mb-10 font-light leading-relaxed stagger-2">
            Choose the perfect package that fits your vision.<br />We'll handle the rest.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 w-full -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packagesData.map((pkg, index) => (
            <div key={pkg.id} className={pkg.name === "Gold" ? "lg:-mt-4" : ""}>
              <PackageCard 
                pkg={pkg} 
                isGuest={isGuest} 
                onViewDetails={setSelectedDetailsPkg}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Analysis / Compare Frameworks */}
      <CompareFrameworks />

      {/* Projection Tool / Estimate Investment */}
      <EstimateInvestment />

      {/* Client Support / FAQ */}
      <PackagesFAQ />

      {/* Features Strip */}
      <section className="w-full bg-[#2C1E14] py-16 border-t border-[#C9A84C]/20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-white">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 mb-5 border border-[#C9A84C] rounded-sm flex items-center justify-center">
              <CheckCircle2 className="text-[#C9A84C] w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-[#F0E6D0]">100% Quality Vetted</h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs">
              Every vendor is legally licensed, management-checked, and highly rated across the Colombo event community.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 mb-5 border border-[#C9A84C] rounded-sm flex items-center justify-center">
              <UserCheck className="text-[#C9A84C] w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-[#F0E6D0]">Venue Trained</h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs">
              Familiar with EASCC rules, safety policies, structural ceiling systems, and layouts to ensure seamless execution.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-12 h-12 mb-5 border border-[#C9A84C] rounded-sm flex items-center justify-center">
              <Star className="text-[#C9A84C] w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-3 text-[#F0E6D0]">Bespoke Customization</h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-xs">
              Collaborates directly with venue managers and the EASCC concierge to build templates specifically for your guest list.
            </p>
          </div>
        </div>
      </section>

      {/* Common Footer (Includes Pre-Footer CTA) */}
      <FooterSection />

      {/* Modals */}
      <PackageDetailsModal 
        isOpen={!!selectedDetailsPkg} 
        onClose={() => setSelectedDetailsPkg(null)} 
        pkg={selectedDetailsPkg} 
      />

    </div>
  );
}
