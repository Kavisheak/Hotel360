"use client";

import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const EstimateSection = () => {
  const [guests, setGuests] = useState<number>(350);
  
  // Simple calculation logic for demonstration
  const venueRental = 3400000; // Using Gold as base for estimate
  const foodCostPerGuest = 3500;
  const foodTotal = guests * foodCostPerGuest;
  const tax = (venueRental + foodTotal) * 0.15;
  const total = venueRental + foodTotal + tax;

  const formatLKR = (amount: number) => {
    return `LKR ${(amount / 1000000).toFixed(2)}M`;
  };

  return (
    <section className="w-full bg-white dark:bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-20 flex justify-center section-reveal transition-colors duration-300">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Column - Controls */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-[1px] bg-[#805D3A]/60 dark:bg-[#C9A84C]/60"></div>
            <p className="text-[#805D3A] dark:text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">
              Transparent Pricing
            </p>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[#2C1E14] dark:text-white mb-6 text-reveal stagger-2">
            Estimate your <span className="italic text-[#805D3A] dark:text-[#C9A84C] font-light">celebration</span>
          </h2>
          
          <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base leading-relaxed font-light mb-12 text-reveal stagger-3">
            Use our interactive calculator to receive an immediate projection of your investment. Final pricing is subject to seasonal variation and bespoke requirements.
          </p>

          <div className="space-y-10 text-reveal stagger-4">
            {/* Guest Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#2C1E14] dark:text-white font-serif tracking-wide">Guest Count</span>
                <span className="text-[#805D3A] dark:text-[#C9A84C] font-serif text-lg">{guests}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="800" 
                step="50"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full h-1 bg-[#D4C9A8] dark:bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer accent-[#805D3A] dark:accent-[#C9A84C]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                <span>50</span>
                <span>800+</span>
              </div>
            </div>

            {/* Date Picker (Visual only for landing) */}
            <div className="space-y-4">
              <span className="text-[#2C1E14] dark:text-white font-serif tracking-wide text-sm block">Select Date</span>
              <button className="w-full md:w-2/3 flex items-center justify-between border-b border-[#D4C9A8] dark:border-[#C9A84C]/30 pb-3 text-gray-600 dark:text-gray-400 hover:border-[#805D3A] dark:hover:border-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-white transition-all">
                <span className="text-sm font-light">Preferred Month / Year</span>
                <Calendar size={16} className="text-[#805D3A] dark:text-[#C9A84C]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Estimate Card */}
        <div className="flex flex-col bg-[#FDFBF7] dark:bg-[#111111] border border-[#D4C9A8] dark:border-[#C9A84C]/30 shadow-[0_0_40px_rgba(128,93,58,0.1)] dark:shadow-[0_0_40px_rgba(201,168,76,0.1)] p-8 md:p-12 text-reveal stagger-4 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#805D3A] dark:via-[#C9A84C] to-transparent"></div>
          
          <h3 className="text-xl font-serif text-[#2C1E14] dark:text-white mb-8 flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-[#805D3A] dark:bg-[#C9A84C] animate-pulse"></span>
            Your Estimate
          </h3>

          <div className="space-y-6 mb-10">
            <div className="flex justify-between items-center border-b border-[#D4C9A8] dark:border-white/10 pb-4">
              <span className="text-gray-700 dark:text-gray-400 text-sm font-light">Gold Package Base</span>
              <span className="text-[#2C1E14] dark:text-white font-serif">{formatLKR(venueRental)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#D4C9A8] dark:border-white/10 pb-4">
              <span className="text-gray-700 dark:text-gray-400 text-sm font-light">Food & Catering ({guests} pax)</span>
              <span className="text-[#2C1E14] dark:text-white font-serif">{formatLKR(foodTotal)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#D4C9A8] dark:border-white/10 pb-4">
              <span className="text-gray-700 dark:text-gray-400 text-sm font-light">Taxes & Fees (15%)</span>
              <span className="text-[#2C1E14] dark:text-white font-serif">{formatLKR(tax)}</span>
            </div>
          </div>

          <div className="mt-auto">
            <p className="text-[#805D3A] dark:text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-bold mb-2">
              Estimated Total
            </p>
            <p className="text-4xl md:text-5xl font-serif text-[#2C1E14] dark:text-white mb-8 tracking-tight">
              {formatLKR(total)}
            </p>

            <button 
              onClick={() => window.location.href = '/book'}
              className="w-full bg-[#D4AF37] dark:bg-[#C9A84C] text-black py-4 flex items-center justify-center gap-3 text-[11px] tracking-widest uppercase font-bold hover:bg-[#C9A84C] dark:hover:bg-[#B5953F] transition-all"
            >
              Book This Date
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default EstimateSection;
