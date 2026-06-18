"use client";

import React from "react";
import { Users, Minus, Plus } from "lucide-react";

interface GuestCounterProps {
  count: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}

export default function GuestCounter({ count, onChange, min, max }: GuestCounterProps) {
  
  const handleDecrement = () => {
    if (count > min) onChange(count - 10);
  };

  const handleIncrement = () => {
    if (count < max) onChange(count + 10);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="space-y-6">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5 mb-2">
        <Users className="w-4 h-4 text-[#A6955C]" /> STEP 4: ESTIMATED GUEST COUNT
      </label>

      <div className="flex flex-col md:flex-row items-center justify-between gap-12 border-b border-[#E8DFC9] dark:border-[#C9A84C]/30 pb-10">
        
        {/* Slider Section */}
        <div className="flex-1 w-full pt-4">
          <input 
            type="range" 
            min={min} 
            max={max} 
            step="10"
            value={count}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-black rounded-sm appearance-none cursor-pointer accent-[#C69C6D]"
          />
          <div className="flex justify-between text-[9px] text-[#1A1512] dark:text-gray-400 mt-3 font-bold uppercase tracking-widest">
            <span>{min} MIN</span>
            <span>{max} MAX</span>
          </div>
        </div>

        {/* Number Input Section */}
        <div className="flex items-center text-[#A6955C] border border-[#E8DFC9] dark:border-gray-700 w-40">
          <button 
            onClick={handleDecrement}
            disabled={count <= min}
            className="w-12 h-12 flex items-center justify-center bg-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center border-x border-[#E8DFC9] dark:border-gray-700 py-2">
            <span className="text-2xl font-serif">{count}</span>
          </div>
          <button 
            onClick={handleIncrement}
            disabled={count >= max}
            className="w-12 h-12 flex items-center justify-center bg-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
