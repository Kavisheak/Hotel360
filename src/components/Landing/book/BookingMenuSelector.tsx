"use client";

import React from "react";
import { Utensils } from "lucide-react";

interface BookingMenuSelectorProps {
  menu: string;
  onChange: (menu: string) => void;
}

export default function BookingMenuSelector({ menu, onChange }: BookingMenuSelectorProps) {
  
  const options = [
    { 
      id: "signature", 
      title: "Signature EASCC Menu", 
      desc: "Our standard premium curated menu featuring international and local delicacies.",
      price: "Included in Package"
    },
    { 
      id: "custom", 
      title: "Fully Custom Menu", 
      desc: "Work with our Executive Chef to design a completely bespoke culinary experience.",
      price: "+ LKR 200,000"
    }
  ];

  return (
    <div className="space-y-6 hover-glow p-4 rounded-sm transition-all duration-300 bg-white border border-[#D4C9A8]">
      <label className="block text-[10px] uppercase tracking-widest text-[#A67C52] font-bold flex items-center gap-1.5 border-b border-[#D4C9A8] pb-3 mb-4">
        <Utensils className="w-4 h-4 text-[#C9A84C]" /> Step 3: Food Menu Customization
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = menu === opt.id;
          return (
            <div 
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`
                p-5 border rounded-sm cursor-pointer transition-all flex flex-col hover-lift btn-interactive
                ${isSelected 
                  ? "border-[#C9A84C] bg-[#F0E6D0]/30 shadow-inner" 
                  : "border-gray-200 bg-white hover:border-[#C9A84C]"
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`text-sm font-serif font-bold ${isSelected ? 'text-[#2C1E14]' : 'text-gray-800'}`}>
                  {opt.title}
                </h4>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-light mb-4 flex-grow">
                {opt.desc}
              </p>
              <span className="text-[10px] text-[#A67C52] font-bold tracking-widest uppercase">
                {opt.price}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-sm">
        <p className="text-[11px] text-gray-600 font-light leading-relaxed">
          <strong>Note:</strong> You will be able to select individual dishes, live action stations, and dietary requirements in detail through the <em>Interactive Food Menu Builder</em> in your customer dashboard after booking.
        </p>
      </div>
    </div>
  );
}
