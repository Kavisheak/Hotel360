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
    <div className="space-y-4 hover-glow p-4 rounded-sm transition-all duration-300 bg-[#111111] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
      <label className="block text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold flex items-center gap-1.5 mb-2">
        <Users className="w-4 h-4 text-[#C9A84C]" /> Step 4: Estimated Guest Count
      </label>

      <div className="bg-[#1A1A1A] border border-[#C9A84C]/30 p-6 rounded-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex-1 w-full">
            <input 
              type="range" 
              min={min} 
              max={max} 
              step="10"
              value={count}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-[#0A0A0A] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-semibold uppercase tracking-wider">
              <span>{min} min</span>
              <span>{max} max</span>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[#111111] p-2 rounded-sm border border-[#C9A84C]/30">
            <button 
              onClick={handleDecrement}
              disabled={count <= min}
              className="w-10 h-10 flex items-center justify-center bg-transparent border border-[#C9A84C]/50 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors btn-interactive"
            >
              <Minus className="w-4 h-4 text-[#C9A84C]" />
            </button>
            <div className="w-16 text-center">
              <span className="text-3xl font-serif text-[#C9A84C]">{count}</span>
            </div>
            <button 
              onClick={handleIncrement}
              disabled={count >= max}
              className="w-10 h-10 flex items-center justify-center bg-transparent border border-[#C9A84C]/50 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors btn-interactive"
            >
              <Plus className="w-4 h-4 text-[#C9A84C]" />
            </button>
          </div>

        </div>

        {extraGuests > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-[#C9A84C] font-semibold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] rounded-full inline-block shadow-[0_0_8px_rgba(212,175,55,0.8)]"></span>
            Note: Your count exceeds the {baseLine}-guest baseline for this package. A per-head surcharge of LKR 8,500 applies to {extraGuests} extra guests.
          </div>
        )}
      </div>
    </div>
  );
}
