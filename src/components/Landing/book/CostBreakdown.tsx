"use client";

import React from "react";
import { Award } from "lucide-react";

interface CostBreakdownProps {
  packageName: string;
  selectedTimeslot: string;
  costBreakdown: {
    basePrice: number;
    extraGuestsCount: number;
    guestSurcharges: number;
    timeslotPremium: number;
    addonsCost: number;
    grandTotal: number;
  };
  formatCurrency: (val: number) => string;
}

export default function CostBreakdown({
  packageName,
  selectedTimeslot,
  costBreakdown,
  formatCurrency
}: CostBreakdownProps) {
  return (
    <div className="bg-[#111111] text-white border border-[#C9A84C]/30 p-6 md:p-8 shadow-[0_0_30px_rgba(201,168,76,0.15)] rounded-sm relative overflow-hidden hover-glow transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A84C] to-[#D4BD6E]"></div>
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#C9A84C]/20 pointer-events-none"></div>
      
      <div className="flex items-center gap-2 text-[#C9A84C] mb-4">
        <Award className="w-4 h-4 animate-pulse" />
        <span className="text-[9px] tracking-[0.2em] uppercase font-bold">Estimated Cost Summary</span>
      </div>

      <h3 className="text-lg font-serif mb-6 pb-4 border-b border-white/10 font-medium">Bespoke Statement</h3>

      <div className="space-y-4 text-xs font-light text-gray-300">
        <div className="flex justify-between items-center">
          <span>{packageName} Base:</span>
          <span className="font-semibold text-white">{formatCurrency(costBreakdown.basePrice)}</span>
        </div>

        {costBreakdown.timeslotPremium > 0 && (
          <div className="flex justify-between items-center">
            <span>Timeslot Premium ({selectedTimeslot.toUpperCase()}):</span>
            <span className="font-semibold text-white">{formatCurrency(costBreakdown.timeslotPremium)}</span>
          </div>
        )}

        {costBreakdown.guestSurcharges > 0 && (
          <div className="flex justify-between items-center text-[#D4BD6E]">
            <span>Additional Attendees ({costBreakdown.extraGuestsCount} guests):</span>
            <span className="font-semibold">{formatCurrency(costBreakdown.guestSurcharges)}</span>
          </div>
        )}

        {costBreakdown.addonsCost > 0 && (
          <div className="flex justify-between items-center text-[#D4BD6E]">
            <span>Vendors & Custom Menu:</span>
            <span className="font-semibold">{formatCurrency(costBreakdown.addonsCost)}</span>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-[10px] tracking-wider uppercase font-bold text-gray-400">Total Price</span>
          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-[#C9A84C]">
              {formatCurrency(costBreakdown.grandTotal)}
            </span>
            <p className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Estimated Total</p>
          </div>
        </div>
      </div>

      <p className="text-[9px] text-gray-500 italic mt-6 leading-normal font-light">
        * Computations are projections. A non-refundable 25% deposit is required within 48 hours to secure this date. Surcharges for decor customization and specific menu swaps will be final in our formal banquet contract.
      </p>
    </div>
  );
}
