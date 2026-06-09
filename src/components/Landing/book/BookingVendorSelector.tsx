"use client";

import React from "react";
import { Sparkles, Palette, Music, Video } from "lucide-react";
import { VENDORS_DATA } from "@/components/landing/vendors/types";

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
  
  const updateVendor = (category: keyof VendorsState, value: string) => {
    onChange({ ...vendors, [category]: value });
  };

  const decorators = VENDORS_DATA.filter(v => v.category === "decorators");
  const djs = VENDORS_DATA.filter(v => v.category === "djs");
  const videographers = VENDORS_DATA.filter(v => v.category === "others" && v.id === "luxe-cinema");

  const renderCategory = (
    title: string, 
    icon: React.ReactNode, 
    categoryKey: keyof VendorsState, 
    vendorList: typeof VENDORS_DATA
  ) => {
    return (
      <div>
        <h4 className="flex items-center gap-2 text-sm font-serif font-semibold text-gray-900 mb-3">
          {icon} {title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => updateVendor(categoryKey, "none")}
            className={`
              p-3 border rounded-sm cursor-pointer transition-all flex flex-col items-center text-center justify-center hover-lift btn-interactive
              ${vendors[categoryKey] === "none" 
                ? "border-[#C9A84C] bg-[#F0E6D0]/50 shadow-inner" 
                : "border-gray-200 bg-white hover:border-[#C9A84C]"
              }
            `}
          >
            <span className={`text-xs font-semibold mb-1 ${vendors[categoryKey] === "none" ? 'text-[#2C1E14]' : 'text-gray-600'}`}>
              No Selection
            </span>
            <span className="text-[9px] text-[#A67C52] font-bold tracking-wider">
              LKR 0
            </span>
          </div>

          {vendorList.map((opt) => {
            const isSelected = vendors[categoryKey] === opt.id;
            return (
              <div 
                key={opt.id}
                onClick={() => updateVendor(categoryKey, opt.id)}
                className={`
                  p-3 border rounded-sm cursor-pointer transition-all flex items-center gap-3 hover-lift btn-interactive
                  ${isSelected 
                    ? "border-[#C9A84C] bg-[#F0E6D0]/50 shadow-inner" 
                    : "border-gray-200 bg-white hover:border-[#C9A84C]"
                  }
                `}
              >
                <div className="w-12 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                  <img src={opt.image} alt={opt.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#2C1E14]' : 'text-gray-800'}`}>
                    {opt.name}
                  </span>
                  <span className="text-[9px] text-gray-500 mt-0.5 uppercase tracking-wider">
                    {opt.rating} ⭐ • {opt.priceLevelLabel}
                  </span>
                  <span className="text-[10px] text-[#A67C52] font-bold mt-1">
                    {opt.startingPrice}
                  </span>
                  
                  <a 
                    href={`/customer/vendorProfile/${opt.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[9px] uppercase tracking-widest text-blue-600 hover:text-blue-800 font-bold mt-2 flex items-center gap-1"
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
    <div className="space-y-6 hover-glow p-4 rounded-sm transition-all duration-300 bg-white border border-[#D4C9A8]">
      <label className="block text-[10px] uppercase tracking-widest text-[#A67C52] font-bold flex items-center gap-1.5 border-b border-[#D4C9A8] pb-3 mb-4">
        <Sparkles className="w-4 h-4 text-[#C9A84C]" /> Step 2: Preliminary Vendors
      </label>

      <div className="space-y-8">
        {renderCategory("Decorator", <Palette className="w-4 h-4 text-[#C9A84C]" />, "decorator", decorators)}
        {renderCategory("DJ & Music", <Music className="w-4 h-4 text-[#C9A84C]" />, "dj", djs)}
        {renderCategory("Photography & Video", <Video className="w-4 h-4 text-[#C9A84C]" />, "videographer", videographers)}
      </div>
      
      <p className="text-[10px] text-gray-500 font-light mt-4 italic text-center">
        View full portfolios and reviews in the dedicated Vendors portal.
      </p>
    </div>
  );
}
