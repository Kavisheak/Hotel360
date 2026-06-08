"use client";

import React, { useState, useMemo } from "react";
import { Plus, Search, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Dish, categories, type Category } from "./menuData";

interface AvailableDishesPanelProps {
  availableDishes: Dish[];
  onAdd: (dishId: string) => void;
}

export default function AvailableDishesPanel({
  availableDishes,
  onAdd,
}: AvailableDishesPanelProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDishes = useMemo(() => {
    return availableDishes.filter((dish) => {
      const matchesCategory =
        activeCategory === "All" || dish.category === activeCategory;
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [availableDishes, activeCategory, searchQuery]);

  return (
    <div className="bg-[#2C1E14] text-white p-6 shadow-xl h-full flex flex-col">
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A84C] mb-1">
          Customize
        </p>
        <h2 className="text-2xl font-serif font-bold text-[#F0E6D0]">
          Available Upgrades
        </h2>
        <p className="text-xs text-gray-400 font-light mt-1 mb-4">
          Enhance your menu with these specialty additions.
        </p>

        {/* Search & Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-sm text-white px-10 py-2.5 focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-gray-600 input-glow"
            />
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  whitespace-nowrap px-4 py-1.5 text-[9px] uppercase tracking-wider font-bold transition-all btn-interactive
                  ${
                    activeCategory === cat
                      ? "bg-[#C9A84C] text-[#2C1E14]"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dish List */}
      <div className="grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center justify-center opacity-50">
            <Info className="w-8 h-8 mb-2" />
            <p className="text-sm">No dishes found.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 p-4 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#C9A84C]/40 transition-colors group rounded-md shadow-lg hover-glow"
              >
                <div
                  className="w-16 h-16 shrink-0 flex items-center justify-center rounded-lg shadow-inner"
                  style={{ background: dish.imageGradient }}
                >
                  <span className="text-3xl select-none group-hover:scale-110 transition-transform duration-300">{dish.emoji}</span>
                </div>
                <div className="grow min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white truncate">
                        {dish.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] uppercase text-gray-500 font-bold block">
                        Add per head
                      </span>
                      <span className="text-xs font-serif font-bold text-[#C9A84C]">
                        +LKR {dish.pricePerHead}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-[8px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        {dish.category}
                      </span>
                    </div>
                    <button
                      onClick={() => onAdd(dish.id)}
                      className="flex items-center gap-1 bg-[#C9A84C]/20 border border-[#C9A84C]/30 hover:bg-[#C9A84C] hover:text-[#2C1E14] text-[#C9A84C] px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold transition-all rounded-sm btn-interactive"
                    >
                      <Plus className="w-3 h-3" />
                      Add to Menu
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(201, 168, 76, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(201, 168, 76, 1);
        }
      `}</style>
    </div>
  );
}
