"use client";

import React, { useState } from "react";
import { Check, Leaf, Crown, Diamond as DiamondIcon, ArrowRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { PackageData } from "../data";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";

interface Props {
  pkg: PackageData;
  isGuest: boolean;
  onViewDetails: (pkg: PackageData) => void;
  index?: number;
}

export default function PackageCard({ pkg, isGuest, onViewDetails, index = 0 }: Props) {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const showToastAndNavigate = (pkgId: string, pkgName: string) => {
    if (isGuest) {
      setShowLoginModal(true);
    } else {
      router.push(`/book?pkg=${pkgId}&fromSelect=true`);
    }
  };

  const getCardTheme = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("silver")) {
      return {
        bg: "bg-[#F5F6F8]",
        textTitle: "text-[#8899A6]",
        textPrice: "text-[#3D4C53]",
        textLabel: "text-[#8899A6]",
        Icon: Leaf,
        ribbonOuter: "bg-[#D1D9E0]",
        ribbonInner: "bg-[#E6ECF0]",
        shadow: "shadow-[10px_10px_30px_#d1d9e6,_-10px_-10px_30px_#ffffff]",
        iconShadow: "shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#ffffff,5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff]",
      };
    }
    if (lower.includes("gold")) {
      return {
        bg: "bg-[#FAEFDF]",
        textTitle: "text-[#B38D4F]",
        textPrice: "text-[#5C4520]",
        textLabel: "text-[#B38D4F]",
        Icon: Crown,
        ribbonOuter: "bg-[#D19A3B]",
        ribbonInner: "bg-[#EBC781]",
        shadow: "shadow-[10px_10px_30px_#e5d7c3,_-10px_-10px_30px_#ffffff]",
        iconShadow: "shadow-[inset_2px_2px_5px_#e5d7c3,_inset_-2px_-2px_5px_#ffffff,5px_5px_10px_#e5d7c3,_-5px_-5px_10px_#ffffff]",
      };
    }
    return {
      bg: "bg-[#F0F4F8]",
      textTitle: "text-[#657F93]",
      textPrice: "text-[#2B3B47]",
      textLabel: "text-[#657F93]",
      Icon: DiamondIcon,
      ribbonOuter: "bg-[#4A6478]",
      ribbonInner: "bg-[#809BB0]",
      shadow: "shadow-[10px_10px_30px_#d0d9e3,_-10px_-10px_30px_#ffffff]",
      iconShadow: "shadow-[inset_2px_2px_5px_#d0d9e3,_inset_-2px_-2px_5px_#ffffff,5px_5px_10px_#d0d9e3,_-5px_-5px_10px_#ffffff]",
    };
  };

  const theme = getCardTheme(pkg.name);
  const Icon = theme.Icon;
  const isMostLoved = pkg.name.toLowerCase().includes("gold");
  const displayGuests = pkg.guestsLabel || `UP TO ${(pkg as any).maxGuests || 250} GUESTS`;

  return (
    <>
      <div className={`relative w-full h-[600px] perspective-[2000px] group cursor-pointer stagger-${index + 1}`}>
      <div className="w-full h-full relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] hover:scale-[1.02]">
        
        {/* --- FRONT FACE --- */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[2.5rem] ${theme.bg} ${theme.shadow} flex flex-col items-center justify-between p-10 overflow-hidden pointer-events-auto group-hover:pointer-events-none`}>
          
          {/* Decorative Ribbons on the right edge */}
          <div className={`absolute top-0 right-0 w-[60px] h-full ${theme.ribbonOuter} opacity-80 rounded-l-[100%] translate-x-4`}></div>
          <div className={`absolute top-[5%] right-0 w-[40px] h-[90%] ${theme.ribbonInner} rounded-l-[100%] translate-x-2`}></div>
          
          {/* MOST CHOSEN Badge for Gold */}
          {isMostLoved && (
            <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 bg-[#C99B4C] text-white text-[10px] uppercase tracking-widest px-6 py-2 font-bold rounded-b-xl shadow-md z-10">
              Most Chosen
            </div>
          )}

          {/* Icon Badge */}
          <div className={`w-20 h-20 rounded-full bg-white flex items-center justify-center ${theme.iconShadow} mt-4 relative z-10`}>
            <Icon className={`w-8 h-8 ${theme.textTitle}`} strokeWidth={1.5} />
          </div>

          {/* Title */}
          <div className="text-center mt-6 relative z-10">
            <h3 className={`text-2xl font-serif uppercase tracking-[0.15em] ${theme.textTitle}`}>
              {pkg.name.split(' ')[0]}
            </h3>
            <p className={`text-[9px] uppercase tracking-[0.3em] ${theme.textLabel} mt-1 font-semibold`}>Package</p>
            <div className="w-1.5 h-1.5 rotate-45 border border-current mx-auto mt-4 opacity-40 text-current"></div>
          </div>

          {/* Price & Guests */}
          <div className="text-center mt-6 relative z-10">
            <h2 className={`text-4xl font-serif ${theme.textPrice} leading-none`}>
              {pkg.priceLabel || pkg.priceValue}
            </h2>
            <p className={`text-[10px] uppercase tracking-widest ${theme.textLabel} mt-3 font-bold`}>
              {displayGuests}
            </p>
          </div>

          {/* Description */}
          <p className={`text-[11px] leading-relaxed text-center font-medium mt-6 px-4 ${theme.textLabel} relative z-10 opacity-90`}>
            {pkg.description}
          </p>

          {/* View Details Fake Button & Arrow */}
          <div className="mt-8 w-full relative z-10 flex flex-col items-center gap-6">
            <div className={`border border-current rounded-full px-8 py-3 flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold ${theme.textTitle} opacity-70`}>
              View Details <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <ChevronDown className={`w-5 h-5 ${theme.textTitle} opacity-30`} />
          </div>
        </div>

        {/* --- BACK FACE --- */}
        <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[2.5rem] ${theme.bg} ${theme.shadow} flex flex-col p-10 overflow-hidden pointer-events-none group-hover:pointer-events-auto`}>
          
          {/* Decorative faint background icon */}
          <Icon className={`absolute -right-10 -bottom-10 w-64 h-64 ${theme.textTitle} opacity-5`} strokeWidth={0.5} />

          <h3 className={`text-lg font-serif uppercase tracking-widest ${theme.textTitle} mb-6 border-b border-current pb-4 opacity-70`}>
            {pkg.name.split(' ')[0]} Features
          </h3>

          {/* Features List */}
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
            {pkg.features.map((feature: string, idx: number) => (
              <div key={idx} className={`flex items-start gap-3 text-xs ${theme.textPrice} font-medium`}>
                <Check className={`w-4 h-4 ${theme.textTitle} shrink-0 mt-0.5`} strokeWidth={2.5} />
                <span className="leading-relaxed opacity-90">{feature}</span>
              </div>
            ))}
          </div>

          {/* Proceed to Booking Button */}
          <div className="mt-8 relative z-10">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                showToastAndNavigate(pkg.id, pkg.name);
              }}
              className={`w-full py-4 text-[11px] uppercase tracking-widest font-bold rounded-xl transition-all duration-300 flex justify-center items-center gap-2 text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl ${
                pkg.name.toLowerCase().includes('gold') 
                  ? 'bg-gradient-to-r from-[#D19A3B] to-[#C99B4C] hover:from-[#B88730] hover:to-[#B5893F]' 
                  : pkg.name.toLowerCase().includes('silver')
                    ? 'bg-gradient-to-r from-[#8899A6] to-[#748796] hover:from-[#748796] hover:to-[#607482]'
                    : 'bg-gradient-to-r from-[#4A6478] to-[#5C7C8A] hover:from-[#3D5569] hover:to-[#4A6478]'
              }`}
            >
              Proceed to Booking <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        message={`Please log in to select the ${pkg.name} Package and begin your booking.`} 
      />
    </div>
    </>
  );
}
