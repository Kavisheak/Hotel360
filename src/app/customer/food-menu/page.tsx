"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import FoodMenuHero from "@/components/landing/food-menu/FoodMenuHero";
import CurrentMenuPanel from "@/components/landing/food-menu/CurrentMenuPanel";
import AvailableDishesPanel from "@/components/landing/food-menu/AvailableDishesPanel";
import {
  dishes as allDishes,
  defaultMenuIds,
} from "@/components/landing/food-menu/menuData";

export default function FoodMenuPage() {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(true);

  // Check login state
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === "customer") {
      setIsGuest(false);
    }
  }, []);

  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  // Load from local storage or use default
  useEffect(() => {
    const savedMenu = localStorage.getItem("eascc_menu");
    if (savedMenu) {
      setSelectedDishIds(JSON.parse(savedMenu));
    } else {
      setSelectedDishIds(defaultMenuIds);
    }
  }, []);

  const handleAddDish = (id: string) => {
    if (!selectedDishIds.includes(id)) {
      setSelectedDishIds((prev) => [...prev, id]);
      setSaved(false);
    }
  };

  const handleRemoveDish = (id: string) => {
    setSelectedDishIds((prev) => prev.filter((dishId) => dishId !== id));
    setSaved(false);
  };

  const handleSaveMenu = () => {
    localStorage.setItem("eascc_menu", JSON.stringify(selectedDishIds));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentMenu = useMemo(() => {
    return selectedDishIds
      .map((id) => allDishes.find((d) => d.id === id))
      .filter((d): d is NonNullable<typeof d> => d !== undefined);
  }, [selectedDishIds]);

  const availableDishes = useMemo(() => {
    return allDishes.filter((d) => !selectedDishIds.includes(d.id));
  }, [selectedDishIds]);

  return (
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col">
      <MainNavbar />

      <div className="flex-grow">
        <FoodMenuHero />

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Current Menu & Summary */}
            <div className={isGuest ? "lg:col-span-12 max-w-5xl mx-auto w-full space-y-6" : "lg:col-span-7 space-y-6"}>
              <CurrentMenuPanel 
                currentMenu={currentMenu} 
                onRemove={handleRemoveDish}
                isGuest={isGuest}
              />
              
              {!isGuest && (
                <div className="bg-white border border-[#D4C9A8] p-6 shadow-sm flex items-center justify-between card-entrance">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-gray-900">Total Selection: {currentMenu.length} items</h3>
                    <p className="text-[10px] text-gray-400 mt-1">Changes are not final until saved.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {saved && (
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest animate-fadeIn">
                        ✓ Menu Saved
                      </span>
                    )}
                    <button 
                      onClick={handleSaveMenu}
                      className="btn-interactive bg-[#C9A84C] text-[#2C1E14] px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#B89238] transition-all"
                    >
                      Finalize Menu
                    </button>
                  </div>
                </div>
              )}

              {isGuest && (
                <div className="text-center mt-6 p-6 bg-white border border-[#D4C9A8]">
                  <p className="text-sm text-gray-500 mb-4">Want to customize this menu with premium upgrades?</p>
                  <button 
                    onClick={() => router.push("/login")}
                    className="btn-interactive bg-[#C9A84C] text-[#2C1E14] px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#B89238] transition-all"
                  >
                    Log In to Customize
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Available Extras */}
            {!isGuest && (
              <div className="lg:col-span-5 h-[800px] sticky top-6">
                <AvailableDishesPanel 
                  availableDishes={availableDishes} 
                  onAdd={handleAddDish} 
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
