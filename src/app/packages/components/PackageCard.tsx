"use client";

import Image from "next/image";
import { PackageData } from "../data";
import { useRouter } from "next/navigation";
import { Check, Users } from "lucide-react";
import React, { useState } from "react";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";

interface Props {
  pkg: PackageData;
  isGuest: boolean;
  onViewDetails: (pkg: PackageData) => void;
  index?: number;
}

export default function PackageCard({ pkg, isGuest, onViewDetails, index = 0 }: Props) {
  const router = useRouter();
  const isGold = pkg.name === "Gold";
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  return (
    <div className={`relative bg-[#FDFBF7] dark:bg-[#111111] flex flex-col h-full group hover-lift shadow-sm hover:shadow-xl transition-all duration-300 ${isGold ? 'border-2 border-[#D4C9A8] dark:border-[#C9A84C]' : 'border border-[#D4C9A8] dark:border-[#C9A84C]/30'} stagger-${index + 1}`}>
      
      {/* MOST CHOSEN Badge */}
      {isGold && (
        <div className="absolute top-0 right-4 -translate-y-1/2 bg-[#805D3A] dark:bg-[#C9A84C] text-[#FDFBF7] dark:text-[#2C1E14] text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1 shadow-md z-10">
          Most Chosen
        </div>
      )}

      {/* Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <Image 
          src={pkg.image}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col">
        
        {/* Title & Price */}
        <div className="mb-4">
          <h3 className="text-2xl md:text-3xl font-serif text-[#2C1E14] dark:text-white mb-1">{pkg.name} Package</h3>
          <p className="text-2xl md:text-3xl font-serif text-[#805D3A] dark:text-[#C9A84C]">{pkg.priceLabel}</p>
        </div>

        {/* Guest Count */}
        <div className="flex items-center gap-2 text-[#805D3A] dark:text-[#C9A84C] mb-4">
          <Users size={14} className="text-[#805D3A] dark:text-[#C9A84C]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2C1E14] dark:text-white">{pkg.guestsLabel}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-400 text-sm font-light leading-relaxed mb-8">{pkg.description}</p>
        
        {/* Features List */}
        <div className="space-y-4 mb-8 flex-1">
          {pkg.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-gray-700 dark:text-gray-300 text-xs font-medium leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions Section */}
        <div className="mt-auto">
          <button 
            onClick={() => {
              if (isGuest) {
                setShowLoginModal(true);
              } else {
                router.push(`/book?pkg=${pkg.id}`);
              }
            }}
            className={`w-full py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] transition-all btn-interactive ${
              isGold 
                ? 'bg-[#805D3A] dark:bg-[#C9A84C] text-[#FDFBF7] dark:text-[#2C1E14] hover:bg-[#6A4B2D] dark:hover:bg-[#B89238]' 
                : 'bg-transparent text-[#2C1E14] dark:text-white border border-[#2C1E14] dark:border-[#C9A84C]/50 hover:bg-[#2C1E14] dark:hover:bg-[#C9A84C]/10 hover:text-white dark:hover:text-[#C9A84C]'
            }`}
          >
            Select {pkg.name}
          </button>
        </div>
      </div>

      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        message={`Please log in to select the ${pkg.name} Package and begin your booking.`} 
      />
    </div>
  );
}
