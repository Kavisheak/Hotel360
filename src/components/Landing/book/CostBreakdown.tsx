"use client";

import React from "react";
import { Award } from "lucide-react";

interface CostBreakdownProps {
  packageName: string;
  selectedTimeslot: string;
  costBreakdown: {
    basePrice: number;
    extraHoursPremium: number;
    foodCost: number;
    guestCount: number;
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
    <div className="bg-white dark:bg-[#1A1A1A] text-[#1A1512] dark:text-white border border-[#E8DFC9] dark:border-gray-800 p-8 shadow-sm rounded-sm relative overflow-hidden">
      
      <div className="flex items-center gap-2 text-[#A6955C] mb-8">
        <Award className="w-4 h-4" />
        <span className="text-[9px] tracking-[0.2em] uppercase font-bold">ESTIMATED COST SUMMARY</span>
      </div>

      <h3 className="text-[22px] font-serif mb-10 text-[#1A1512] dark:text-white">Bespoke Statement</h3>

      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex justify-between items-center border-b border-[#E8DFC9] dark:border-gray-800 pb-4">
          <span>{packageName} Base:</span>
          <span className="font-bold text-[#1A1512] dark:text-white">{formatCurrency(costBreakdown.basePrice)}</span>
        </div>

        {costBreakdown.extraHoursPremium > 0 && (
          <div className="flex justify-between items-center border-b border-[#E8DFC9] dark:border-gray-800 pb-4">
            <span>Extra Hours Premium:</span>
            <span className="font-bold text-[#1A1512] dark:text-white">{formatCurrency(costBreakdown.extraHoursPremium)}</span>
          </div>
        )}

        {costBreakdown.timeslotPremium > 0 && (
          <div className="flex justify-between items-center border-b border-[#E8DFC9] dark:border-gray-800 pb-4">
            <span>Timeslot Premium ({selectedTimeslot.toUpperCase()}):</span>
            <span className="font-bold text-[#1A1512] dark:text-white">{formatCurrency(costBreakdown.timeslotPremium)}</span>
          </div>
        )}

        {costBreakdown.foodCost > 0 && (
          <div className="flex justify-between items-center border-b border-[#E8DFC9] dark:border-gray-800 pb-4">
            <span>Food & Catering ({costBreakdown.guestCount} guests):</span>
            <span className="font-bold text-[#1A1512] dark:text-white">{formatCurrency(costBreakdown.foodCost)}</span>
          </div>
        )}

        {costBreakdown.addonsCost > 0 && (
          <div className="flex justify-between items-center border-b border-[#E8DFC9] dark:border-gray-800 pb-4">
            <span>Vendors:</span>
            <span className="font-bold text-[#1A1512] dark:text-white">{formatCurrency(costBreakdown.addonsCost)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-[#E8DFC9] dark:border-gray-800 flex justify-between items-center">
          <span className="text-[10px] tracking-widest uppercase font-bold text-[#1A1512] dark:text-white">ESTIMATED TOTAL</span>
          <span className="text-xl font-serif text-gray-700 dark:text-gray-300">
            {formatCurrency(costBreakdown.grandTotal)}
          </span>
        </div>

        <div className="pt-3 border-t border-[#E8DFC9] dark:border-gray-800 flex justify-between items-center bg-amber-500/5 p-2 rounded-sm">
          <span className="text-[10px] tracking-widest uppercase font-bold text-amber-600">30% DEPOSIT DUE NOW</span>
          <div className="text-right">
            <span className="text-xl font-serif text-amber-600 font-bold">
              {formatCurrency(costBreakdown.grandTotal * 0.3)}
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <span className="text-[10px] tracking-widest uppercase font-bold text-gray-500">70% BALANCE DUE LATER</span>
          <span className="text-base font-serif text-gray-500">
            {formatCurrency(costBreakdown.grandTotal * 0.7)}
          </span>
        </div>
      </div>

      <p className="text-[9px] text-gray-500 italic mt-8 leading-relaxed">
        * A 30% deposit is required to confirm and secure your booking. The remaining 70% balance is calculated dynamically and due prior to the event date. Pricing is subject to adjustments in case of vendor replacements.
      </p>
    </div>
  );
}
