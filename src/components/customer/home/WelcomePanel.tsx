"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomePanel() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Target date is June 4, 2026
    const targetDate = new Date("2026-06-04T16:00:00").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown({ days: d, hours: h, minutes: m });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4C9A8] dark:border-white/10 transition-colors duration-300"
    >
      <div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C] flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-4 h-4 text-[#C9A84C] animate-pulse" /> Welcome back, Farhan &amp; Zainab
        </span>
        <h2 className="text-3xl font-serif text-gray-900 dark:text-white leading-tight">
          Your Forever <span className="italic text-[#C9A84C]">Begins Soon</span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-light mt-1">
          Orchestrating your dream gala at EASCC Grand Ballroom.
        </p>
      </div>

      {/* Real-time Ticker Countdown Card */}
      <div className="pulse-glow bg-[#2C1E14] text-white px-5 py-3 rounded-sm border border-[#C9A84C]/25 shadow-md flex items-center gap-6">
        <div className="text-center">
          <span className="block text-2xl font-serif font-bold text-[#C9A84C]">{countdown.days}</span>
          <span className="text-[8px] uppercase tracking-wider text-gray-400">Days</span>
        </div>
        <span className="text-gray-600 font-light text-xl">:</span>
        <div className="text-center">
          <span className="block text-2xl font-serif font-bold text-[#C9A84C]">{countdown.hours}</span>
          <span className="text-[8px] uppercase tracking-wider text-gray-400">Hrs</span>
        </div>
        <span className="text-gray-600 font-light text-xl">:</span>
        <div className="text-center">
          <span className="block text-2xl font-serif font-bold text-[#C9A84C]">{countdown.minutes}</span>
          <span className="text-[8px] uppercase tracking-wider text-gray-400">Mins</span>
        </div>
        <div className="border-l border-white/10 pl-4 text-xs font-light text-gray-400 max-w-[90px] leading-tight">
          Until Auspicious Ceremony
        </div>
      </div>
    </motion.div>
  );
}
