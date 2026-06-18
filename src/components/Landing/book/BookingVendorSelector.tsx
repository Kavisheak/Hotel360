"use client";

import React, { useState } from "react";
import { Sparkles, Palette, Music, Video, ShoppingCart, Heart } from "lucide-react";
import { VENDORS_DATA } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";

interface VendorsState {
  decorator: string;
  dj: string;
  videographer: string;
}

interface BookingVendorSelectorProps {
  vendors: VendorsState;
  onChange: (vendors: VendorsState) => void;
}

export default function BookingVendorSelector({ vendors, onChange }: BookingVendorSelectorProps) {
  const [filterType, setFilterType] = useState<"all" | "cart" | "favorites">("all");
  const { cartVendors, favoriteVendors } = useVendorCartStore();
  
  const updateVendor = (category: keyof VendorsState, value: string) => {
    onChange({ ...vendors, [category]: value });
  };

  const decorators = VENDORS_DATA.filter(v => v.category === "decorators");
  const djs = VENDORS_DATA.filter(v => v.category === "djs");
  const videographers = VENDORS_DATA.filter(v => v.category === "others");

  const renderCategory = (
    title: string, 
    icon: React.ReactNode, 
    categoryKey: keyof VendorsState, 
    vendorList: typeof VENDORS_DATA
  ) => {
    const displayedVendors = vendorList.filter((v) => {
      if (filterType === "cart") return cartVendors?.includes(v.id);
      if (filterType === "favorites") return favoriteVendors?.includes(v.id);
      return true;
    });

    return (
      <div>
        <h4 className="flex items-center gap-2 text-sm font-serif font-semibold text-gray-900 mb-3">
          {icon} {title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => updateVendor(categoryKey, "none")}
            className={`
              p-3 border rounded-sm cursor-pointer transition-all flex flex-col items-center text-center justify-center hover-glow btn-interactive
              ${vendors[categoryKey] === "none" 
                ? "border-[#C9A84C] bg-gradient-to-br from-[#D4AF37]/10 to-[#8C6D23]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] ring-1 ring-[#C9A84C]" 
                : "border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A] hover:border-[#C9A84C]/80"
              }
            `}
          >
            <span className={`text-xs font-semibold mb-1 ${vendors[categoryKey] === "none" ? 'text-[#C9A84C]' : 'text-gray-600 dark:text-gray-400'}`}>
              No Selection
            </span>
            <span className="text-[9px] text-[#C9A84C]/80 font-bold tracking-wider">
              LKR 0
            </span>
          </div>

          {displayedVendors.map((opt) => {
            const isSelected = vendors[categoryKey] === opt.id;
            return (
              <div 
                key={opt.id}
                onClick={() => updateVendor(categoryKey, opt.id)}
                className={`
                  p-3 border rounded-sm cursor-pointer transition-all flex items-center gap-3 hover-glow btn-interactive
                  ${isSelected 
                    ? "border-[#C9A84C] bg-gradient-to-br from-[#D4AF37]/10 to-[#8C6D23]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] ring-1 ring-[#C9A84C]" 
                    : "border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A] hover:border-[#C9A84C]/80"
                  }
                `}
              >
                <div className="w-12 h-12 shrink-0 rounded-sm overflow-hidden bg-[#0A0A0A] border border-[#C9A84C]/20">
                  <img src={opt.image} alt={opt.name} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#C9A84C]' : 'text-[#2C1E14] dark:text-gray-200'}`}>
                    {opt.name}
                  </span>
                  <span className="text-[9px] text-gray-600 dark:text-gray-500 mt-0.5 uppercase tracking-wider">
                    {opt.rating} ⭐ • <span className="text-[#C9A84C]/80">{opt.priceLevelLabel}</span>
                  </span>
                  <span className="text-[10px] text-[#C9A84C] font-bold mt-1">
                    {opt.startingPrice}
                  </span>
                  
                  <a 
                    href={`/customer/vendorProfile/${opt.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[9px] uppercase tracking-widest text-[#D4AF37] hover:text-[#2C1E14] dark:text-white font-bold mt-2 flex items-center gap-1 transition-colors"
                  >
                    View Profile ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 hover-glow p-4 rounded-sm transition-all duration-300 bg-[#FDFBF7] dark:bg-[#111111] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
      <label className="block text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold flex items-center gap-1.5 border-b border-[#C9A84C]/30 pb-3 mb-4">
        <Sparkles className="w-4 h-4 text-[#C9A84C]" /> Step 2: Preliminary Vendors
      </label>

      <div className="flex items-center flex-wrap gap-2 mb-6 border-b border-[#C9A84C]/30 pb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-600 dark:text-gray-400 mr-2">Filter By:</span>
        <button 
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all rounded-sm border ${filterType === "all" ? "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black border-[#C9A84C] shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-transparent border-[#C9A84C]/30 text-gray-600 dark:text-gray-400 hover:text-[#2C1E14] dark:text-white hover:border-[#C9A84C]"}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilterType("cart")}
          className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest transition-all rounded-sm border ${filterType === "cart" ? "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black border-[#C9A84C] shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-transparent border-[#C9A84C]/30 text-gray-600 dark:text-gray-400 hover:text-[#2C1E14] dark:text-white hover:border-[#C9A84C]"}`}
        >
          <ShoppingCart className="w-3 h-3" /> Cart
        </button>
        <button 
          onClick={() => setFilterType("favorites")}
          className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest transition-all rounded-sm border ${filterType === "favorites" ? "bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black border-[#C9A84C] shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-transparent border-[#C9A84C]/30 text-gray-600 dark:text-gray-400 hover:text-[#2C1E14] dark:text-white hover:border-[#C9A84C]"}`}
        >
          <Heart className="w-3 h-3" /> Favorites
        </button>
      </div>

      <div className="space-y-8">
        {renderCategory("Decorator", <Palette className="w-4 h-4 text-[#C9A84C]" />, "decorator", decorators)}
        {renderCategory("DJ & Music", <Music className="w-4 h-4 text-[#C9A84C]" />, "dj", djs)}
        {renderCategory("Cinematic Videography", <Video className="w-4 h-4 text-[#C9A84C]" />, "videographer", videographers)}
      </div>
      
      <p className="text-[10px] text-gray-600 dark:text-gray-500 font-light mt-4 italic text-center">
        View full portfolios and reviews in the dedicated Vendors portal.
      </p>
    </div>
  );
}
