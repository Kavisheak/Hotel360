"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Utensils, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useVendorCartStore } from "@/store/vendorCartStore";

interface BookingMenuSelectorProps {
  menu: "signature" | "custom";
  onChange: (menu: "signature" | "custom") => void;
}

export default function BookingMenuSelector({ menu, onChange }: BookingMenuSelectorProps) {
  const cartMenu = useVendorCartStore((state) => state.menuSelection);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
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
      <label className="block text-xs uppercase tracking-widest text-[#C9A84C] font-bold flex items-center gap-1.5 border-b border-[#C9A84C]/30 pb-3 mb-4">
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
                <h4 className={`text-base font-serif font-bold ${isSelected ? 'text-[#C9A84C]' : 'text-[#1A1512] dark:text-gray-200'}`}>
                  {opt.title}
                </h4>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-gray-300 dark:border-gray-500'}`}>
                  {isSelected && <div className="w-1.5 h-1.5 bg-[#FDFBF7] dark:bg-[#111111] rounded-full"></div>}
                </div>
              </div>
              <p className={`text-sm font-light mb-4 flex-grow ${isSelected ? 'text-[#2C1E14] dark:text-gray-300' : 'text-gray-600 dark:text-gray-500'}`}>
                {opt.desc}
              </p>
              
              {opt.id === "custom" && isSelected && (
                <div className="mb-4 bg-white/50 dark:bg-black/20 rounded-sm p-3 border border-[#C9A84C]/20 text-xs uppercase font-bold tracking-widest text-[#1A1512] dark:text-white">
                  <div className="text-[#C9A84C] mb-1">Your Customizations:</div>
                  {cartMenu.addedOptionalItems.length > 0 ? (
                    <ul className="list-disc pl-4 mt-2 space-y-1 normal-case tracking-normal font-light text-sm text-gray-700 dark:text-gray-300">
                      {cartMenu.addedOptionalItems.map(item => (
                        <li key={item.id}>{item.name} (+ LKR {item.price.toLocaleString()})</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 text-sm normal-case font-light tracking-normal mt-1">No custom additions yet. Click the Menu Builder to add items.</div>
                  )}
                  {cartMenu.removedDefaultItems.length > 0 && <div className="text-gray-500 text-sm mt-2">- {cartMenu.removedDefaultItems.length} Standard Items Removed</div>}
                </div>
              )}

              <div className="flex justify-between items-center mt-auto pt-4">
                <span className={`text-xs font-bold tracking-widest uppercase ${isSelected ? 'text-[#C9A84C]' : 'text-[#C9A84C]/70'}`}>
                  {opt.price}
                </span>
                
                {opt.id === "signature" && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                    className="px-4 py-2 border border-[#C9A84C] text-[#C9A84C] rounded-sm hover:bg-[#C9A84C] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
                  >
                    View Food List
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-4 bg-white dark:bg-[#0A0A0A] border border-[#C9A84C]/20 rounded-sm flex items-center justify-between shadow-sm">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-[70%]">
          <strong className="text-[#2C1E14] dark:text-white">Note:</strong> You can select individual dishes, live action stations, and dietary requirements in detail through our interactive builder.
        </p>
        <Link 
          href="/customer/menu" 
          className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] hover:text-[#2C1E14] dark:text-white flex items-center gap-1 transition-colors"
        >
          Open Menu Builder <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col border border-[#E8DFC9] dark:border-gray-800 animate-fadeIn">
            <div className="flex items-center justify-between p-5 border-b border-[#E8DFC9] dark:border-gray-800">
              <h3 className="font-serif text-xl text-[#1A1512] dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#C9A84C]" />
                Signature EASCC Menu
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <p className="text-base text-gray-600 dark:text-gray-400 mb-6 font-light">
                Our premium curated menu provides a well-balanced selection of local and international dishes, ensuring a delightful experience for all your guests.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2"></div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1512] dark:text-white">Welcome Drinks & Hors d'oeuvres</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Assorted fruit juices and bite-sized appetizers served upon arrival.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2"></div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1512] dark:text-white">Premium Basmati Rice / Fried Rice</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Flavorful, aromatic rice cooked to perfection.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2"></div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1512] dark:text-white">Signature Roast Chicken</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tender, marinated chicken roasted with our secret blend of spices.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2"></div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1512] dark:text-white">Spicy Fish Ambul Thiyal</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">A classic Sri Lankan dry fish curry, rich and tangy.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2"></div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1512] dark:text-white">Wok-Fried Vegetable Chop Suey</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fresh seasonal vegetables stir-fried in a light savory sauce.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2"></div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1512] dark:text-white">Crispy Potato Baduma</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Golden-fried potato tempered with onions, chilies, and curry leaves.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-2"></div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1512] dark:text-white">Watalappam & Ice Cream Dessert</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Traditional coconut custard pudding served alongside premium vanilla ice cream.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="p-5 border-t border-[#E8DFC9] dark:border-gray-800 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-[#C9A84C] text-white text-xs uppercase font-bold tracking-widest rounded-sm hover:bg-[#B58A59] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
