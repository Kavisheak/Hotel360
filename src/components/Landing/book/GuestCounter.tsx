"use client";

import React from "react";
import { Users, Minus, Plus } from "lucide-react";

interface GuestCounterProps {
  count: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  baseLine: number;
}

export default function GuestCounter({ count, onChange, min, max, baseLine }: GuestCounterProps) {
  
  const handleDecrement = () => {
    if (count > min) onChange(count - 10);
  };

  const handleIncrement = () => {
    if (count < max) onChange(count + 10);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const extraGuests = count > baseLine ? count - baseLine : 0;

  return (
    <div className="space-y-4 hover-glow p-4 rounded-sm transition-all duration-300">
      <label className="block text-[10px] uppercase tracking-widest text-[#A67C52] font-bold flex items-center gap-1.5 mb-2">
        <Users className="w-4 h-4 text-[#C9A84C]" /> Step 4: Estimated Guest Count
      </label>

      <div className="bg-white border border-[#D4C9A8] p-6 rounded-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex-1 w-full">
            <input 
              type="range" 
              min={min} 
              max={max} 
              step="10"
              value={count}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-semibold uppercase tracking-wider">
              <span>{min} min</span>
              <span>{max} max</span>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[#F0E6D0]/50 p-2 rounded-sm border border-[#D4C9A8]">
            <button 
              onClick={handleDecrement}
              disabled={count <= min}
              className="w-10 h-10 flex items-center justify-center bg-white border border-[#D4C9A8] hover:border-[#C9A84C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-interactive"
            >
              <Minus className="w-4 h-4 text-[#2C1E14]" />
            </button>
            <div className="w-16 text-center">
              <span className="text-3xl font-serif text-[#2C1E14]">{count}</span>
            </div>
            <button 
              onClick={handleIncrement}
              disabled={count >= max}
              className="w-10 h-10 flex items-center justify-center bg-white border border-[#D4C9A8] hover:border-[#C9A84C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-interactive"
            >
              <Plus className="w-4 h-4 text-[#2C1E14]" />
            </button>
          </div>

        </div>

        {extraGuests > 0 && (
          <div className="mt-4 pt-4 border-t border-[#F0E6D0] text-[10px] text-[#A67C52] font-semibold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-[#C9A84C] rounded-full inline-block"></span>
            Note: Your count exceeds the {baseLine}-guest baseline for this package. A per-head surcharge of LKR 8,500 applies to {extraGuests} extra guests.
          </div>
        )}
      </div>
    </div>
  );
}
