"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Calculator } from 'lucide-react';

export default function EstimateInvestment() {
  const [guests, setGuests] = useState(300);
  const [timeSlot, setTimeSlot] = useState<"MORNING" | "EVENING" | "FULL DAY">("EVENING");

  const baseGoldPrice = 3400000;
  const foodCostPerGuest = 3500;
  const foodTotal = guests * foodCostPerGuest;
  
  const timeSlotPremium = timeSlot === "MORNING" ? 0 : timeSlot === "EVENING" ? 200000 : 800000;

  const totalBase = baseGoldPrice + foodTotal;
  const totalCost = totalBase + timeSlotPremium;

  return (
    <section className="w-full bg-[#FDFBF7] dark:bg-[#0A0A0A] py-20 border-t border-[#F0E6D0] dark:border-[#1A1A1A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Controls Side */}
        <div className="lg:col-span-5">
          <p className="flex items-center gap-2 text-[#805D3A] dark:text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-bold mb-3">
            <Calculator size={14} /> Projection Tool
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C1E14] dark:text-white mb-10">
            Estimate Your Investment
          </h2>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#2C1E14] dark:text-white">
                Expected Guest Count: {guests}
              </label>
            </div>
            <input 
              type="range" 
              min="100" 
              max="500" 
              step="10"
              value={guests} 
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full h-1.5 bg-[#D4C9A8] dark:bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#805D3A] dark:accent-[#C9A84C]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-2">
              <span>100</span>
              <span>500 max</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#2C1E14] dark:text-white mb-4">
              Preferred Time Slot
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["MORNING", "EVENING", "FULL DAY"].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot as any)}
                  className={`py-3 text-[9px] font-bold uppercase tracking-widest transition-all rounded-sm ${
                    timeSlot === slot 
                      ? 'bg-[#805D3A] dark:bg-[#C9A84C] text-[#FDFBF7] dark:text-[#2C1E14]' 
                      : 'bg-white dark:bg-[#111111] border border-[#D4C9A8] dark:border-[#C9A84C]/30 text-gray-500 hover:border-[#805D3A] dark:hover:border-[#C9A84C]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown Side */}
        <div className="lg:col-span-4 bg-[#2C1E14] dark:bg-[#111111] text-[#FDFBF7] dark:text-white p-8 md:p-10 rounded-sm shadow-xl flex flex-col justify-between h-full border border-transparent dark:border-[#C9A84C]/30">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 dark:text-gray-400 mb-2">
              Estimated Total (Gold Basis)
            </p>
            <p className="text-4xl md:text-5xl font-serif text-[#C9A84C] mb-8">
              LKR {totalCost.toLocaleString()}
            </p>

            <div className="space-y-3 text-sm text-gray-200 dark:text-gray-300 font-light border-t border-[#F0E6D0]/20 dark:border-white/10 pt-6">
              <div className="flex justify-between">
                <span>Base Package</span>
                <span>LKR {baseGoldPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Food & Catering ({guests} pax)</span>
                <span>LKR {foodTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#D4BD6E] dark:text-[#C9A84C]">
                <span>Time Slot Premium</span>
                <span>+ LKR {timeSlotPremium.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-gray-500 mt-10 leading-relaxed">
            * Prices vary depending on date, seating, thematic customization and premium vendor selections.
          </p>
        </div>

        {/* Image Side */}
        <div className="lg:col-span-3 hidden lg:block relative h-full min-h-[300px] rounded-sm overflow-hidden shadow-md">
          <Image 
            src="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Lounge area"
            fill
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}
