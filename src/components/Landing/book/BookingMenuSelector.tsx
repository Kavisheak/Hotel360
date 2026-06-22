"use client";

import React from "react";
import { Utensils, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useVendorCartStore } from "@/store/vendorCartStore";

interface BookingMenuSelectorProps {
  menu: "signature" | "custom";
  onChange: (menu: "signature" | "custom") => void;
}

export default function BookingMenuSelector({ menu, onChange }: BookingMenuSelectorProps) {
  const cartMenu = useVendorCartStore((state) => state.menuSelection);
  
  const options = [
    { 
      id: "signature", 
      title: "Signature EASCC Menu", 
      desc: "Our standard premium curated menu featuring international and local delicacies.",
      price: "LKR 3,500 / Guest"
    },
    { 
      id: "custom", 
      title: "Fully Custom Menu", 
      desc: "Work with our Executive Chef to design a completely bespoke culinary experience.",
      price: "LKR 6,500 / Guest + Customization Fee"
    }
  ];

  return (
    <div className="space-y-6 hover-glow p-4 rounded-sm transition-all duration-300 bg-[#FDFBF7] dark:bg-[#111111] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
      <label className="block text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold flex items-center gap-1.5 border-b border-[#C9A84C]/30 pb-3 mb-4">
        <Utensils className="w-4 h-4 text-[#C9A84C]" /> Step 3: Food Menu Customization
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = menu === opt.id;
          return (
            <div 
              key={opt.id}
              onClick={() => onChange(opt.id as any)}
              className={`
                p-5 border rounded-sm cursor-pointer transition-all flex flex-col hover-glow btn-interactive
                ${isSelected 
                  ? "border-[#C9A84C] bg-gradient-to-br from-[#D4AF37]/10 to-[#8C6D23]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                  : "border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A] hover:border-[#C9A84C]/80"
                }
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`text-sm font-serif font-bold ${isSelected ? 'text-[#C9A84C]' : 'text-[#1A1512] dark:text-gray-200'}`}>
                  {opt.title}
                </h4>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-gray-300 dark:border-gray-500'}`}>
                  {isSelected && <div className="w-1.5 h-1.5 bg-[#FDFBF7] dark:bg-[#111111] rounded-full"></div>}
                </div>
              </div>
              <p className={`text-xs font-light mb-4 flex-grow ${isSelected ? 'text-[#2C1E14] dark:text-gray-300' : 'text-gray-600 dark:text-gray-500'}`}>
                {opt.desc}
              </p>
              
              {opt.id === "signature" && isSelected && (
                <div className="mb-4 bg-white/50 dark:bg-black/20 rounded-sm p-3 border border-[#C9A84C]/20 text-[10px] font-bold tracking-widest text-[#1A1512] dark:text-white">
                  <div className="text-[#C9A84C] mb-2 uppercase">Default Menu Includes:</div>
                  <ul className="list-disc pl-4 space-y-1 font-light normal-case tracking-normal text-gray-700 dark:text-gray-300">
                    <li>Welcome Drinks & Hors d'oeuvres</li>
                    <li>Premium Basmati Rice / Fried Rice</li>
                    <li>Signature Roast Chicken</li>
                    <li>Spicy Fish Ambul Thiyal</li>
                    <li>Wok-Fried Vegetable Chop Suey</li>
                    <li>Crispy Potato Baduma</li>
                    <li>Watalappam & Ice Cream Dessert</li>
                  </ul>
                </div>
              )}
              
              {opt.id === "custom" && isSelected && (
                <div className="mb-4 bg-white/50 dark:bg-black/20 rounded-sm p-3 border border-[#C9A84C]/20 text-[10px] uppercase font-bold tracking-widest text-[#1A1512] dark:text-white">
                  <div className="text-[#C9A84C] mb-1">Your Customizations:</div>
                  {cartMenu.addedOptionalItems.length > 0 ? (
                    <ul className="list-disc pl-4 mt-2 space-y-1 normal-case tracking-normal font-light text-gray-700 dark:text-gray-300">
                      {cartMenu.addedOptionalItems.map(item => (
                        <li key={item.id}>{item.name} (+ LKR {item.price.toLocaleString()})</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 normal-case font-light tracking-normal mt-1">No custom additions yet. Click the Menu Builder to add items.</div>
                  )}
                  {cartMenu.removedDefaultItems.length > 0 && <div className="text-gray-500 mt-2">- {cartMenu.removedDefaultItems.length} Standard Items Removed</div>}
                </div>
              )}

              <span className={`text-[10px] font-bold tracking-widest uppercase ${isSelected ? 'text-[#C9A84C]' : 'text-[#C9A84C]/70'}`}>
                {opt.price}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-white dark:bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-sm flex items-center justify-between shadow-sm">
        <p className="text-[11px] text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-[70%]">
          <strong className="text-[#2C1E14] dark:text-white">Note:</strong> You can select individual dishes, live action stations, and dietary requirements in detail through our interactive builder.
        </p>
        <Link 
          href="/customer/menu" 
          className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1E14] dark:text-white flex items-center gap-1 transition-colors"
        >
          Open Menu Builder <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
