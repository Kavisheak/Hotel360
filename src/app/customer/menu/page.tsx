"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { Check, Plus, Utensils, X, ChefHat, Info } from "lucide-react";

// Mock Data for Menu Items
const MENU_CATEGORIES = [
  {
    id: "appetizers",
    name: "Appetizers & Canapés",
    items: [
      { id: "app-1", name: "Smoked Salmon Blinis with Dill Creme Fraiche", price: 1500, dietary: ["pescatarian"] },
      { id: "app-2", name: "Miniature Beef Wellington with Truffle Jus", price: 2200, dietary: [] },
      { id: "app-3", name: "Wild Mushroom Arancini with Garlic Aioli", price: 1200, dietary: ["vegetarian"] },
      { id: "app-4", name: "Chilled Gazpacho Shooters", price: 900, dietary: ["vegan", "gluten-free"] }
    ]
  },
  {
    id: "mains",
    name: "Main Courses",
    items: [
      { id: "main-1", name: "Herb-Crusted Rack of Lamb", price: 4500, dietary: ["gluten-free"] },
      { id: "main-2", name: "Pan-Seared Sea Bass with Lemon Caper Butter", price: 3800, dietary: ["pescatarian", "gluten-free"] },
      { id: "main-3", name: "Truffle & Wild Mushroom Risotto", price: 2800, dietary: ["vegetarian"] },
      { id: "main-4", name: "Roasted Duck Breast with Cherry Reduction", price: 4200, dietary: ["gluten-free"] }
    ]
  },
  {
    id: "live-stations",
    name: "Live Action Stations",
    items: [
      { id: "live-1", name: "Premium Sushi & Sashimi Bar", price: 120000, isStation: true },
      { id: "live-2", name: "Artisanal Pasta & Risotto Wheel", price: 85000, isStation: true },
      { id: "live-3", name: "Wagyu Beef Carving Station", price: 150000, isStation: true }
    ]
  },
  {
    id: "desserts",
    name: "Desserts & Pastries",
    items: [
      { id: "dessert-1", name: "Deconstructed Lemon Meringue Tart", price: 1400, dietary: ["vegetarian"] },
      { id: "dessert-2", name: "Valrhona Chocolate Fondant with Pistachio Gelato", price: 1800, dietary: ["vegetarian"] },
      { id: "dessert-3", name: "Passionfruit Pavlova Nests", price: 1200, dietary: ["vegetarian", "gluten-free"] }
    ]
  }
];

export default function MenuBuilderPage() {
  const { menuSelection, addMenuItem, removeMenuItem } = useVendorCartStore();
  const [activeTab, setActiveTab] = useState(MENU_CATEGORIES[0].id);

  const selectedItemIds = menuSelection.items.map(item => item.id);

  const calculateTotal = () => {
    return menuSelection.items.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col font-sans text-[#2C1E14]">
      <MainNavbar />
      
      {/* Header Section */}
      <section className="relative w-full py-20 bg-[#2C1E14] text-white overflow-hidden border-b border-[#C9A84C]/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#C9A84C]">
            <ChefHat className="w-5 h-5" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-reveal stagger-1">Interactive Kitchen</span>
            <ChefHat className="w-5 h-5" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif leading-tight text-reveal stagger-2">
            Curate Your <span className="italic text-[#C9A84C]">Culinary Journey</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm font-light leading-relaxed text-reveal stagger-3">
            Build a bespoke dining experience for your guests. From delicate canapés to grand live carving stations, our Executive Chefs will execute your vision to perfection.
          </p>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Menu Builder */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#D4C9A8] pb-4">
            {MENU_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm ${
                  activeTab === cat.id
                    ? "bg-[#C9A84C] text-[#2C1E14] shadow-md"
                    : "bg-transparent text-gray-600 hover:bg-[#D4C9A8]/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MENU_CATEGORIES.find(c => c.id === activeTab)?.items.map(item => {
              const isSelected = selectedItemIds.includes(item.id);
              
              return (
                <div 
                  key={item.id}
                  onClick={() => isSelected ? removeMenuItem(item.id) : addMenuItem({ id: item.id, name: item.name, price: item.price })}
                  className={`
                    p-5 border rounded-sm cursor-pointer transition-all flex flex-col justify-between group hover-lift
                    ${isSelected 
                      ? "border-[#C9A84C] bg-white shadow-inner" 
                      : "border-[#D4C9A8] bg-[#F0E6D0]/50 hover:border-[#C9A84C] hover:bg-white"
                    }
                  `}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-sm font-serif font-bold leading-tight ${isSelected ? 'text-[#2C1E14]' : 'text-gray-800'}`}>
                        {item.name}
                      </h4>
                      <div className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-[#C9A84C] bg-[#C9A84C] text-white' : 'border-gray-400 text-transparent'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                    
                    {item.dietary && item.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.dietary.map(d => (
                          <span key={d} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] uppercase tracking-wider rounded-sm border border-gray-200">
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between items-end">
                    <span className="text-[10px] text-[#A67C52] font-bold tracking-widest uppercase">
                      LKR {item.price.toLocaleString()} {item.isStation ? "/ Flat Rate" : "/ Guest"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#D4C9A8] p-6 shadow-xl rounded-sm sticky top-24">
            <h3 className="font-serif text-2xl text-[#2C1E14] mb-6 flex items-center gap-2 border-b border-[#D4C9A8] pb-4">
              <Utensils className="w-5 h-5 text-[#C9A84C]" />
              Your Tasting Menu
            </h3>

            {menuSelection.items.length === 0 ? (
              <div className="py-8 text-center text-gray-500 flex flex-col items-center gap-3">
                <Info className="w-8 h-8 text-gray-300" />
                <p className="text-sm font-light">Your menu is currently empty.<br/>Select items from the left to build your menu.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {menuSelection.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4 p-3 bg-gray-50 rounded-sm border border-gray-100 group">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#2C1E14] leading-tight">{item.name}</p>
                      <p className="text-[10px] text-[#A67C52] font-bold mt-1">LKR {item.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => removeMenuItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-[#D4C9A8]">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Estimated Food Cost</p>
                  <p className="text-[10px] text-gray-400 font-light italic mt-0.5">*Based on single serving/station</p>
                </div>
                <p className="text-2xl font-serif font-bold text-[#2C1E14]">
                  LKR {calculateTotal().toLocaleString()}
                </p>
              </div>

              <button 
                onClick={() => window.location.href = '/book'}
                className="w-full bg-[#C9A84C] text-[#2C1E14] py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#B89238] transition-colors rounded-sm shadow-md"
              >
                Save & Return to Booking
              </button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
