"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Palette, Music, Video, Camera, Cake, Flower2, Plus, ArrowRight, Trash2, CheckCircle2 } from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";

interface VendorsState {
  decorator: string | null;
  decoratorPackage: string;
  dj: string | null;
  djPackage: string;
  videographer: string | null;
  videographerPackage: string;
  photographer: string | null;
  photographerPackage: string;
  cake: string | null;
  cakePackage: string;
  florist: string | null;
  floristPackage: string;
}

interface BookingVendorSelectorProps {
  vendors: VendorsState;
  onChange: (vendors: VendorsState) => void;
}

export default function BookingVendorSelector({ vendors, onChange }: BookingVendorSelectorProps) {
  const router = useRouter();
  const { vendors: globalVendors } = useVendorStore();

  const handleExplore = (category: string) => {
    // Navigate to vendors marketplace with activeTab query if we want, or just booking flag
    router.push(`/customer/vendors?booking=true&tab=${category}`);
  };

  const handleRemove = (categoryKey: keyof VendorsState) => {
    onChange({
      ...vendors,
      [categoryKey]: "none",
      [`${categoryKey}Package`]: "none"
    } as any);
  };

  const getVendorDetails = (id: string | null) => {
    if (!id || id === "none" || id === "custom_preference") return null;
    return globalVendors.find(v => v.id === id) || null;
  };

  const categories = [
    { key: "decorator", label: "Decorator", icon: <Palette className="w-5 h-5" />, path: "decorators" },
    { key: "videographer", label: "Videographer", icon: <Video className="w-5 h-5" />, path: "videographers" },
    { key: "dj", label: "DJ Artist", icon: <Music className="w-5 h-5" />, path: "djs" },
    { key: "photographer", label: "Photographer", icon: <Camera className="w-5 h-5" />, path: "photographers" },
    { key: "cake", label: "Cake Artisan", icon: <Cake className="w-5 h-5" />, path: "cake" },
    { key: "florist", label: "Florist", icon: <Flower2 className="w-5 h-5" />, path: "florists" },
  ] as const;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between border-b border-[#C9A84C]/20 pb-4 mb-4">
        <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">Curate Your Artistic Team</h3>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1.5 rounded-sm">
          Optional Add-ons
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const selectedVendorId = vendors[cat.key as keyof VendorsState];
          const selectedVendor = getVendorDetails(selectedVendorId);
          const isSelected = selectedVendorId && selectedVendorId !== "none";

          return (
            <div 
              key={cat.key}
              className={`border p-5 rounded-sm transition-all duration-300 flex flex-col justify-between ${
                isSelected 
                  ? "border-[#C9A84C] bg-[#FAF6EE] dark:bg-[#1A1A1A] shadow-md ring-1 ring-[#C9A84C]/30" 
                  : "border-[#E8DFC9] dark:border-gray-800 bg-white dark:bg-[#111111] hover:border-[#C9A84C]/50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    isSelected ? "bg-[#C9A84C]/10 border-[#C9A84C]/30 text-[#C9A84C]" : "bg-gray-50 dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-800 text-gray-400"
                  }`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold uppercase tracking-wider ${isSelected ? 'text-[#1A1512] dark:text-white' : 'text-gray-500'}`}>
                      {cat.label}
                    </h4>
                    {isSelected ? (
                      <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Selected
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 mt-0.5">Not selected</span>
                    )}
                  </div>
                </div>
              </div>

              {isSelected && selectedVendor ? (
                <div className="flex items-center gap-3 bg-white dark:bg-[#0A0A0A] p-2.5 rounded-sm border border-[#E8DFC9] dark:border-gray-800 mb-4">
                  <img src={selectedVendor.image} alt={selectedVendor.name} className="w-12 h-12 rounded-sm object-cover" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#1A1512] dark:text-white truncate">{selectedVendor.name}</span>
                    <span className="text-[10px] text-gray-500 truncate">{vendors[`${cat.key}Package` as keyof VendorsState] !== "none" ? vendors[`${cat.key}Package` as keyof VendorsState] : "Custom Package"}</span>
                  </div>
                </div>
              ) : isSelected && selectedVendorId === "custom_preference" ? (
                <div className="flex items-center gap-3 bg-[#FFF8E6] dark:bg-[#2A2312] p-2.5 rounded-sm border border-[#C9A84C]/30 mb-4">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-[#8C6D23] dark:text-[#D4AF37]">Custom Preference</span>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400">Using outside vendor</span>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center gap-2 mt-auto">
                {isSelected ? (
                  <>
                    <button 
                      onClick={() => handleExplore(cat.path)}
                      className="flex-1 bg-white dark:bg-[#0A0A0A] border border-[#C9A84C] text-[#C9A84C] py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C9A84C] hover:text-white transition-colors rounded-sm text-center"
                    >
                      Change
                    </button>
                    <button 
                      onClick={() => handleRemove(cat.key as keyof VendorsState)}
                      className="px-3 py-2 border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-sm"
                      title="Remove Vendor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleExplore(cat.path)}
                    className="w-full bg-[#1A1512] dark:bg-white text-white dark:text-[#1A1512] py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C9A84C] dark:hover:bg-[#C9A84C] dark:hover:text-white transition-colors rounded-sm flex items-center justify-center gap-2"
                  >
                    Explore Portfolios <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
