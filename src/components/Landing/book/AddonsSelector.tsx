"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface AddonsSelectorProps {
  addons: string[];
  onChange: (selected: string[]) => void;
}

export default function AddonsSelector({ addons, onChange }: AddonsSelectorProps) {
  
  const toggleAddon = (id: string) => {
    if (addons.includes(id)) {
      onChange(addons.filter(a => a !== id));
    } else {
      onChange([...addons, id]);
    }
  };

  const options = [
    { id: "decor", label: "Premium Floral Setup", estimate: "+ LKR 300,000" },
    { id: "band", label: "Live Band & DJ Pairing", estimate: "+ LKR 150,000" },
    { id: "photo", label: "Cinematic Photography", estimate: "+ LKR 200,000" },
  ];

  return (
    <div className="space-y-4 hover-glow p-4 rounded-sm transition-all duration-300">
      <label className="block text-[10px] uppercase tracking-widest text-[#A67C52] font-bold flex items-center gap-1.5 mb-2">
        <Sparkles className="w-4 h-4 text-[#C9A84C]" /> Step 5: Preliminary Vendors (Optional)
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {options.map((opt) => {
          const isSelected = addons.includes(opt.id);
          return (
            <div 
              key={opt.id}
              onClick={() => toggleAddon(opt.id)}
              className={`
                p-4 border rounded-sm cursor-pointer transition-all flex justify-between items-center hover-lift btn-interactive
                ${isSelected 
                  ? "border-[#C9A84C] bg-[#F0E6D0]/50" 
                  : "border-[#D4C9A8] bg-white hover:border-[#C9A84C]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                  isSelected ? "bg-[#C9A84C] border-[#C9A84C]" : "bg-white border-[#D4C9A8]"
                }`}>
                  {isSelected && <svg className="w-3 h-3 text-[#2C1E14]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs font-semibold text-gray-900">{opt.label}</span>
              </div>
              <span className="text-[9px] text-[#A67C52] font-bold tracking-wider">{opt.estimate}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
