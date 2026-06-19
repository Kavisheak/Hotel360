"use client";

import React from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { Plus, CheckCircle2, ChefHat, Info } from "lucide-react";
import Image from "next/image";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

const DEFAULT_MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "welcome-drink",
    name: "Welcome Drink",
    items: [
      { id: "wd-1", name: "Fruit Punch", price: 0, image: "https://images.unsplash.com/photo-1506084868230-bb1d9420041f?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "rice-curry",
    name: "Rice & Curry Buffet",
    items: [
      { id: "rc-1", name: "Steamed White Rice", price: 0, image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-2", name: "Yellow Rice", price: 0, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-3", name: "Chicken Curry", price: 0, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-4", name: "Fish Curry", price: 0, image: "https://images.unsplash.com/photo-1599084942896-675e73122f10?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-5", name: "Dhal Curry", price: 0, image: "https://images.unsplash.com/photo-1585937421612-70e008356fbe?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-6", name: "Mixed Vegetable Curry", price: 0, image: "https://images.unsplash.com/photo-1625944227318-bd7dff1b2394?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-7", name: "Potato Curry", price: 0, image: "https://images.unsplash.com/photo-1511690655006-25f05244bd33?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-8", name: "Wambatu Moju", price: 0, image: "https://images.unsplash.com/photo-1565557612140-7e4d8fb5d2b7?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-9", name: "Papadam", price: 0, image: "https://images.unsplash.com/photo-1623428454614-abaf00244e52?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "rc-10", name: "Pol Sambol", price: 0, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "main-sides",
    name: "Main Side Dishes",
    items: [
      { id: "ms-1", name: "Vegetable Fried Rice", price: 0, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "ms-2", name: "Chicken Devilled", price: 0, image: "https://images.unsplash.com/photo-1563379926898-54f982c5f1cd?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "ms-3", name: "Mixed Salad", price: 0, image: "https://images.unsplash.com/photo-1504544750208-dc0358e10f2f?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "dessert",
    name: "Dessert",
    items: [
      { id: "ds-1", name: "Watalappam", price: 0, image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "ds-2", name: "Fruit Salad", price: 0, image: "https://images.unsplash.com/photo-1523920254052-1fca71a62024?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "beverages",
    name: "Beverages",
    items: [
      { id: "bv-1", name: "Soft Drinks", price: 0, image: "https://images.unsplash.com/photo-1527661593350-5b452ae20ace?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "bv-2", name: "Water", price: 0, image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "bv-3", name: "Tea / Coffee", price: 0, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  }
];

const OPTIONAL_MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "opt-meat",
    name: "Premium Meat Options",
    items: [
      { id: "op-m1", name: "Beef Curry", price: 500, image: "https://images.unsplash.com/photo-1504669886280-be36f1c480a4?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-m2", name: "Mutton Curry", price: 800, image: "https://images.unsplash.com/photo-1544025162-81111420d4f9?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-m3", name: "BBQ Chicken", price: 600, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-m4", name: "Roasted Chicken", price: 600, image: "https://images.unsplash.com/photo-1564834724105-9e8b737af98f?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-m5", name: "Chicken Cordon Bleu", price: 900, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "opt-seafood",
    name: "Seafood Upgrade",
    items: [
      { id: "op-s1", name: "Prawn Curry", price: 700, image: "https://images.unsplash.com/photo-1626200419356-9bd90e1fceeb?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-s2", name: "Crab Curry", price: 900, image: "https://images.unsplash.com/photo-1580476262798-b768aa05c6d3?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-s3", name: "Fish Ambul Thiyal", price: 500, image: "https://images.unsplash.com/photo-1599084942896-675e73122f10?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-s4", name: "Fried Calamari", price: 650, image: "https://images.unsplash.com/photo-1605481755913-c36b447432ea?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-s5", name: "Seafood Platter", price: 1500, image: "https://images.unsplash.com/photo-1535400255456-9b56f05041de?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "opt-western",
    name: "Western Food Station",
    items: [
      { id: "op-w1", name: "Chicken Pasta", price: 550, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-w2", name: "Vegetable Pasta", price: 400, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-w3", name: "French Fries", price: 300, image: "https://images.unsplash.com/photo-1603569283847-3295e6904a2b?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-w4", name: "Pizza Station", price: 800, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-w5", name: "Sandwich Platter", price: 500, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "opt-live",
    name: "Sri Lankan Live Stations",
    items: [
      { id: "op-l1", name: "Kottu Station", price: 700, image: "https://images.unsplash.com/photo-1587314168485-69f8563c623c?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-l2", name: "Hopper Station", price: 500, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-l3", name: "String Hopper Station", price: 400, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-l4", name: "BBQ Station", price: 1200, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "opt-dessert",
    name: "Dessert Upgrade",
    items: [
      { id: "op-d1", name: "Chocolate Fountain", price: 800, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-d2", name: "Ice Cream Station", price: 400, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-d3", name: "Cheesecake", price: 600, image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-d4", name: "Chocolate Cake", price: 450, image: "https://images.unsplash.com/photo-1563805042-7684c8a9e9bc?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-d5", name: "Dessert Table", price: 1500, image: "https://images.unsplash.com/photo-1550547660-d1548cbca1f9?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  },
  {
    id: "opt-bev",
    name: "Beverage Upgrade",
    items: [
      { id: "op-b1", name: "Fresh Juice Bar", price: 500, image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-b2", name: "Mocktail Station", price: 700, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=200&h=200" },
      { id: "op-b3", name: "Coffee Bar", price: 400, image: "https://images.unsplash.com/photo-1536935338-722e0514061a?auto=format&fit=crop&q=80&w=200&h=200" },
    ]
  }
];

export default function MenuBuilderPage() {
  const { menuSelection, toggleDefaultItem, toggleOptionalItem } = useVendorCartStore();
  const removedDefaultItems = menuSelection.removedDefaultItems || [];
  const addedOptionalItems = menuSelection.addedOptionalItems || [];

  const calculateOptionalTotal = () => {
    return addedOptionalItems.reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white transition-colors duration-300">
      <MainNavbar />
      
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 bg-white dark:bg-[#111111] text-center border-b border-[#D4C9A8]/30 dark:border-[#C9A84C]/20 transition-colors duration-300">
        {/* Background Image */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/food_menu_hero_bg.png"
            alt="Food Menu Background Light"
            fill
            className="object-cover opacity-100 dark:hidden"
            priority
          />
          <Image
            src="/food_menu_hero_bg.png"
            alt="Food Menu Background Dark"
            fill
            className="object-cover opacity-40 mix-blend-overlay hidden dark:block"
            priority
          />
          {/* Horizontal gradient to wash out the center for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/95 to-transparent dark:via-[#111111]/95"></div>
          {/* Vertical gradient to smoothly blend into the section below */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-[#FAF8F5] dark:from-[#111111]/80 dark:via-[#111111]/70 dark:to-[#0A0A0A]"></div>
        </div>

        {/* Subtle Decorative Background Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-[#A67C52] dark:bg-white"></div>
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-[#A67C52] dark:bg-white"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#A67C52] dark:bg-white"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
          <div className="flex flex-col items-center justify-center gap-2 text-[#C9A84C]">
            <ChefHat className="w-8 h-8 opacity-80" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#A67C52] dark:text-[#C9A84C]">Structured Feast</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-[#2C1E14] dark:text-white">
            Curate Your <span className="italic text-[#C9A84C]">Culinary</span><br/>
            Experience
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Start with our generous Default Signature Menu, remove anything you do not prefer, and elevate your event with our Optional Premium Upgrades.
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COLUMN: Default Menu */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-serif text-[#2C1E14] dark:text-white font-bold">Default Menu</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Included in your base package (LKR 3,500 / Guest)</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-500 uppercase tracking-widest font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Included
            </div>
          </div>

          <div className="space-y-6">
            {DEFAULT_MENU_CATEGORIES.map(category => (
              <div key={category.id} className="bg-white dark:bg-[#1A1A1A] border border-[#D4C9A8]/50 dark:border-[#C9A84C]/20 rounded-sm shadow-sm overflow-hidden p-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.items.map(item => {
                    const isRemoved = removedDefaultItems.includes(item.id);
                    return (
                      <div key={item.id} className="flex items-center justify-between group p-2 hover:bg-[#FAF8F5] dark:hover:bg-[#242424] rounded-sm transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
                        <div className="flex items-center gap-4">
                          <div className={`relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 shadow-sm transition-all ${isRemoved ? 'grayscale opacity-50' : ''}`}>
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <span className={`text-sm font-medium transition-colors ${isRemoved ? 'text-gray-400 line-through' : 'text-[#2C1E14] dark:text-gray-200'}`}>
                            {item.name}
                          </span>
                        </div>
                        <button 
                          onClick={() => toggleDefaultItem(item.id)}
                          className={`text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-sm border transition-all shrink-0 ml-4 ${
                            isRemoved 
                              ? 'border-gray-300 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-[#333]' 
                              : 'border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10'
                          }`}
                        >
                          {isRemoved ? '+ Restore' : '- Remove'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Optional Upgrades */}
        <div className="flex flex-col gap-6">
          <div className="border-b border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-serif text-[#2C1E14] dark:text-white font-bold">Optional Upgrades</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enhance your feast with premium additions</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-0.5">Upgrade Total</span>
              <span className="text-[#A67C52] dark:text-[#C9A84C] font-bold text-lg">+ LKR {calculateOptionalTotal()} / pax</span>
            </div>
          </div>

          <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {OPTIONAL_MENU_CATEGORIES.map(category => (
              <div key={category.id} className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm p-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A67C52] dark:text-gray-400 mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.items.map(item => {
                    const isAdded = addedOptionalItems.some(i => i.id === item.id);
                    return (
                      <div key={item.id} className={`flex items-center justify-between group p-2 rounded-sm transition-colors border ${isAdded ? 'border-[#C9A84C] bg-[#FAF8F5] dark:bg-[#242424]' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-800'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`relative w-12 h-12 rounded-sm overflow-hidden shrink-0 border shadow-sm transition-all ${isAdded ? 'border-[#C9A84C]' : 'border-gray-200 dark:border-gray-800'}`}>
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm ${isAdded ? 'text-[#A67C52] dark:text-[#C9A84C] font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                              {item.name}
                            </span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                              + LKR {item.price}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleOptionalItem({ id: item.id, name: item.name, price: item.price })}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ml-4 ${
                            isAdded 
                              ? 'bg-[#A67C52] border-[#A67C52] text-white' 
                              : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-400 hover:border-[#A67C52] hover:text-[#A67C52]'
                          }`}
                        >
                          {isAdded ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto bg-[#FAF8F5] dark:bg-[#111111] p-6 border border-[#D4C9A8]/50 dark:border-[#C9A84C]/30 rounded-sm shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                Upgrades are calculated on a per-guest basis. Final pricing will be automatically reflected in your Booking Summary.
              </p>
            </div>
            <button 
              onClick={() => window.location.href = '/book'}
              className="bg-[#C9A84C] text-[#2C1E14] dark:text-black px-6 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B89238] transition-colors rounded-sm shadow-md whitespace-nowrap"
            >
              Return to Booking
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
