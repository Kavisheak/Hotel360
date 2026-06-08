"use client";

import React from "react";
import { Sparkles, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

export default function FoodMenuHero() {
  return (
    <section className="relative w-full pt-12 pb-14 text-center overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-[0.03] pointer-events-none flex items-center justify-center">
        <UtensilsCrossed className="w-96 h-96 text-[#2C1E14]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        {/* Decorative top line */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="block w-16 h-px bg-linear-to-r from-transparent via-[#C9A84C] to-transparent opacity-60" />
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
          </motion.div>
          <span className="block w-16 h-px bg-linear-to-l from-transparent via-[#C9A84C] to-transparent opacity-60" />
        </div>

        <p className="text-[#C9A84C] text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold mb-4">
          Curate Your Feast
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C1E14] leading-tight mb-6">
          A Celebration of{" "}
          <span className="italic text-[#C9A84C] relative inline-block">
            Sri Lankan
            <span className="absolute -bottom-2 left-0 w-full h-px bg-[#C9A84C]/30"></span>
          </span>
          <br />
          Culinary Heritage
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-600 font-light leading-relaxed px-4">
          Handpick from an exquisite selection of traditional dishes — customized
          to your spice preference, portion size, and dietary needs. Every dish
          tells a story of the island&apos;s rich flavors.
        </p>

        {/* Decorative bottom line */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <span className="block w-12 h-px bg-[#D4C9A8]" />
          <span className="block w-2 h-2 rounded-full bg-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
          <span className="block w-12 h-px bg-[#D4C9A8]" />
        </div>
      </motion.div>
    </section>
  );
}
