"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Dish, categories, type Category } from "./menuData";

interface CurrentMenuPanelProps {
  currentMenu: Dish[];
  onRemove: (dishId: string) => void;
  isGuest?: boolean;
}

export default function CurrentMenuPanel({ currentMenu, onRemove, isGuest = false }: CurrentMenuPanelProps) {
  // Group dishes by category
  const groupedDishes = categories.reduce((acc, category) => {
    const dishesInCategory = currentMenu.filter((d) => d.category === category);
    if (dishesInCategory.length > 0) {
      acc[category] = dishesInCategory;
    }
    return acc;
  }, {} as Record<Category, Dish[]>);

  return (
    <div className="bg-[#FDFBF7] dark:bg-gradient-to-br dark:from-[#382B14] dark:via-[#1A1610] dark:to-[#0D0B08] border border-[#D4C9A8] dark:border-[#C9A84C]/40 p-6 shadow-sm rounded-sm shadow-md dark:shadow-[#C9A84C]/5 transition-colors duration-300">
      <div className="mb-6 pb-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/30">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A84C] mb-1">
          Your Selection
        </p>
        <h2 className="text-2xl font-serif font-bold text-[#2C1E14] dark:text-white">
          Wedding Banquet Menu
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Your curated selection of dishes for the big day.
        </p>
      </div>

      {Object.entries(groupedDishes).length === 0 ? (
        <div className="text-center py-10">
          <p className="text-sm text-gray-400 font-light">Your menu is currently empty.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDishes).map(([category, dishes]) => (
            <div key={category}>
              <h3 className="text-sm font-bold text-[#2C1E14] dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                {category}
                <span className="text-[10px] text-white dark:text-[#1A1A1A] font-bold bg-[#A67C52] dark:bg-[#C9A84C] px-2 py-0.5 rounded-full">
                  {dishes.length}
                </span>
              </h3>
              <div className={`grid gap-4 ${isGuest ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                <AnimatePresence>
                  {dishes.map((dish) => (
                    <motion.div
                      key={dish.id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-3 border border-[#D4C9A8] dark:border-[#C9A84C]/20 hover:border-[#C9A84C] dark:hover:border-[#C9A84C]/60 transition-colors bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40 group cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_12px_rgba(201,168,76,0.15)] rounded-md hover-glow"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 flex items-center justify-center shrink-0 rounded-full shadow-inner"
                          style={{ background: dish.imageGradient }}
                        >
                          <span className="text-xl select-none">{dish.emoji}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#C9A84C] font-bold block mb-0.5">
                            {dish.sinhalaName}
                          </span>
                          <h4 className="text-sm font-bold text-[#2C1E14] dark:text-white leading-tight">{dish.name}</h4>
                          {dish.dietaryTags.length > 0 && (
                            <div className="flex gap-1.5 mt-1.5">
                              {dish.dietaryTags.map((tag) => (
                                <span key={tag} className="text-[8px] text-gray-600 dark:text-gray-300 bg-[#A67C52]/10 dark:bg-white/5 border border-[#A67C52]/20 dark:border-white/10 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {!isGuest && (
                        <button
                          onClick={() => onRemove(dish.id)}
                          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 rounded-full btn-interactive"
                          title="Remove from menu"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
