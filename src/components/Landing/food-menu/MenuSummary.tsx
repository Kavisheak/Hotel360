"use client";

import React from "react";
import { Receipt, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { type Dish, BASE_PACKAGE_PRICE, defaultMenuIds } from "./menuData";

interface MenuSummaryProps {
  currentMenu: Dish[];
}

export default function MenuSummary({ currentMenu }: MenuSummaryProps) {
  // Calculate extra cost (only items not in default menu cost extra)
  const extraCostPerHead = currentMenu.reduce((total, dish) => {
    if (!defaultMenuIds.includes(dish.id)) {
      return total + dish.pricePerHead;
    }
    return total;
  }, 0);

  const totalPerHead = BASE_PACKAGE_PRICE + extraCostPerHead;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-[#E8DFC9] p-6 shadow-xl rounded-md sticky top-24"
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8DFC9]">
        <h3 className="text-lg font-serif font-bold text-[#1A1512] flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#C69C6D]" />
          Pricing Summary
        </h3>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest bg-gray-100 px-2 py-1 rounded-sm">
          {currentMenu.length} Items Selected
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600/70" />
            Base Package
          </span>
          <span className="font-semibold">LKR {BASE_PACKAGE_PRICE.toLocaleString()}</span>
        </div>
        
        {extraCostPerHead > 0 && (
          <div className="flex justify-between items-center text-sm text-[#C69C6D] font-medium">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 flex items-center justify-center bg-[#C69C6D]/20 rounded-full text-[10px]">+</span>
              Additional Upgrades
            </span>
            <span>+ LKR {extraCostPerHead.toLocaleString()}</span>
          </div>
        )}

        <div className="pt-4 mt-2 border-t border-dashed border-gray-300 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">
              Estimated Total
            </span>
            <span className="text-[10px] text-gray-400 font-light">Per Head</span>
          </div>
          <motion.span 
            key={totalPerHead}
            initial={{ scale: 1.1, color: "#C69C6D" }}
            animate={{ scale: 1, color: "#1A1512" }}
            className="text-2xl font-serif font-bold"
          >
            LKR {totalPerHead.toLocaleString()}
          </motion.span>
        </div>
      </div>

      <button className="w-full mt-8 bg-[#1A1512] text-white py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C69C6D] hover:shadow-lg hover:shadow-[#C69C6D]/20 transition-all duration-300 rounded-sm flex justify-center items-center gap-2 group">
        Confirm Menu
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>
      <p className="text-[9px] text-gray-400 text-center mt-4 font-light uppercase tracking-wider flex items-center justify-center gap-1">
        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
        Final count determines total cost
        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
      </p>
    </motion.div>
  );
}
