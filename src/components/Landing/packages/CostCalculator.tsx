"use client";

import React, { useState } from "react";
import { Calculator } from "lucide-react";

export default function CostCalculator() {
  const [guests, setGuests] = useState(300);
  const [timeslot, setTimeslot] = useState<"morning" | "evening" | "full">("evening");
  
  // Simple calculation logic for demonstration
  const basePrice = 3400000; // Gold package base
  const extraGuestCost = Math.max(0, guests - 380) * 8500;
  const timeslotPremium = timeslot === "full" ? 500000 : (timeslot === "evening" ? 200000 : 0);
  const total = basePrice + extraGuestCost + timeslotPremium;

  return (
    <section className="bg-white dark:bg-[#0A0A0A] py-16 md:py-24 px-6 border-y border-[#D4C9A8]/30 dark:border-[#C9A84C]/20">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#0A0A0A] border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 p-8 md:p-12 relative overflow-hidden rounded-sm transition-all duration-300 section-reveal">
        {/* Decorative background accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#805D3A] dark:text-[#C9A84C] mb-2">
                <Calculator className="w-4 h-4" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Projection Tool</span>
              </div>
              <h2 className="text-3xl font-serif text-[#2C1E14] dark:text-white leading-tight">
                Estimate Your Investment
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                  Expected Guest Count: <span className="text-[#2C1E14] dark:text-white">{guests}</span>
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="600" 
                  step="10"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full h-1 bg-[#D4C9A8] dark:bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
                />
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  <span>100</span>
                  <span>600 max</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                  Preferred Timeslot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "morning", label: "Morning" },
                    { id: "evening", label: "Evening" },
                    { id: "full", label: "Full Day" }
                  ].map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setTimeslot(slot.id as any)}
                      className={`
                        py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm btn-interactive border
                        ${timeslot === slot.id 
                          ? "bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#0A0A0A] border-[#D4AF37] dark:border-[#C9A84C]" 
                          : "bg-white dark:bg-transparent text-gray-600 dark:text-gray-400 border-[#D4C9A8]/50 dark:border-[#C9A84C]/50 hover:border-[#D4AF37]/50 dark:hover:border-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-white"
                        }
                      `}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111111] p-8 text-[#2C1E14] dark:text-white space-y-6 shadow-[0_0_30px_rgba(201,168,76,0.1)] border border-[#D4C9A8]/50 dark:border-[#C9A84C]/20 relative rounded-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A84C] to-[#D4BD6E]"></div>
            
            <div>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">
                Estimated Total (Gold Base)
              </p>
              <div className="text-4xl font-serif text-[#805D3A] dark:text-[#C9A84C]">
                LKR {(total / 1000000).toFixed(2)}M
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-light text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Base Package (380 pax)</span>
                <span className="text-[#2C1E14] dark:text-white">LKR 3.40M</span>
              </div>
              {extraGuestCost > 0 && (
                <div className="flex justify-between text-[#805D3A] dark:text-[#C9A84C]">
                  <span>Extra Guests ({guests - 380})</span>
                  <span>+ LKR {(extraGuestCost / 1000000).toFixed(2)}M</span>
                </div>
              )}
              {timeslotPremium > 0 && (
                <div className="flex justify-between text-[#805D3A] dark:text-[#C9A84C]">
                  <span>Timeslot Premium</span>
                  <span>+ LKR {(timeslotPremium / 1000000).toFixed(2)}M</span>
                </div>
              )}
            </div>

            <p className="text-[9px] text-gray-500 dark:text-gray-400 italic pt-2">
              * This is a rough estimation. Exact pricing depends on catering selections, vendor choices, and seasonal rates.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
