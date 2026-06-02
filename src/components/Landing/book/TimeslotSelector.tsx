"use client";

import React from "react";
import { Clock } from "lucide-react";

interface TimeslotSelectorProps {
  selectedTimeslot: "morning" | "evening" | "full-day";
  onSelectTimeslot: (timeslot: "morning" | "evening" | "full-day") => void;
}

export default function TimeslotSelector({ selectedTimeslot, onSelectTimeslot }: TimeslotSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-[#c69c6d]" /> Step 2: Choose Event Timeslot
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morning slot */}
        <button
          type="button"
          onClick={() => onSelectTimeslot("morning")}
          className={`p-4 border text-left rounded-sm transition-all duration-300 flex flex-col justify-between ${
            selectedTimeslot === "morning"
              ? "border-[#c69c6d] bg-[#C69C6D]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div>
            <span className="text-[8px] uppercase tracking-widest text-[#A6955C] font-bold">8:00 AM - 2:00 PM</span>
            <h4 className="text-sm font-serif font-bold text-gray-900 mt-1">Morning Gala</h4>
          </div>
          <span className="text-[10px] text-gray-500 mt-3 font-semibold">Standard Pricing</span>
        </button>

        {/* Evening slot */}
        <button
          type="button"
          onClick={() => onSelectTimeslot("evening")}
          className={`p-4 border text-left rounded-sm transition-all duration-300 flex flex-col justify-between relative ${
            selectedTimeslot === "evening"
              ? "border-[#c69c6d] bg-[#C69C6D]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className="absolute top-2 right-2 bg-[#c69c6d] text-white text-[7px] uppercase tracking-wider px-1.5 py-0.5 font-bold">Premium</span>
          <div>
            <span className="text-[8px] uppercase tracking-widest text-[#A6955C] font-bold">4:00 PM - 10:00 PM</span>
            <h4 className="text-sm font-serif font-bold text-gray-900 mt-1">Evening Soiree</h4>
          </div>
          <span className="text-[10px] text-[#7C6A2E] mt-3 font-semibold">+ LKR 100,000</span>
        </button>

        {/* Full day slot */}
        <button
          type="button"
          onClick={() => onSelectTimeslot("full-day")}
          className={`p-4 border text-left rounded-sm transition-all duration-300 flex flex-col justify-between ${
            selectedTimeslot === "full-day"
              ? "border-[#c69c6d] bg-[#C69C6D]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div>
            <span className="text-[8px] uppercase tracking-widest text-[#A6955C] font-bold">9:00 AM - Midnight</span>
            <h4 className="text-sm font-serif font-bold text-gray-900 mt-1">Full-Day Grandeur</h4>
          </div>
          <span className="text-[10px] text-[#7C6A2E] mt-3 font-semibold">+ LKR 300,000</span>
        </button>
      </div>
    </div>
  );
}
