"use client";

import React from "react";
import { Users, Plus, Minus, Info } from "lucide-react";

interface GuestCounterProps {
  guestCount: number;
  baseGuests: number;
  extraGuestFee: number;
  onChangeGuestCount: (count: number) => void;
  formatCurrency: (val: number) => string;
}

export default function GuestCounter({
  guestCount,
  baseGuests,
  extraGuestFee,
  onChangeGuestCount,
  formatCurrency
}: GuestCounterProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#c69c6d]" /> Step 4: Expected Attendance
        </label>
        <span className="text-xs text-gray-400 font-semibold">
          Included in Package: <span className="text-gray-900">{baseGuests} Guests</span>
        </span>
      </div>

      <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-4 flex items-center justify-between rounded-sm max-w-md mx-auto">
        <button 
          type="button"
          onClick={() => onChangeGuestCount(Math.max(50, guestCount - 10))}
          className="w-10 h-10 bg-white border border-[#E0D8C3] hover:border-gray-400 rounded-sm flex items-center justify-center text-gray-600"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="text-center">
          <span className="text-3xl font-serif font-bold text-gray-900">{guestCount}</span>
          <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Guests Selected</span>
        </div>
        <button 
          type="button"
          onClick={() => onChangeGuestCount(Math.min(600, guestCount + 10))}
          className="w-10 h-10 bg-white border border-[#E0D8C3] hover:border-gray-400 rounded-sm flex items-center justify-center text-gray-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {guestCount > baseGuests && (
        <div className="flex gap-2 items-center text-[11px] text-[#7C6A2E] bg-[#C69C6D]/5 border border-[#c69c6d]/20 p-3 rounded-sm leading-relaxed">
          <Info className="w-4 h-4 text-[#c69c6d] shrink-0" />
          <p>
            Guest capacity exceeds baseline by <strong>{guestCount - baseGuests} guests</strong>. Additional catering & tablescapes are billed at <strong>{formatCurrency(extraGuestFee)}</strong> per attendee.
          </p>
        </div>
      )}
    </div>
  );
}
