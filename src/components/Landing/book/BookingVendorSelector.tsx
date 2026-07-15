"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Palette, Music, Video, Camera, Cake, Flower2, Plus, ArrowRight, ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";
import { useVendorStore } from "@/store/vendorStore";
import { useVendorCartStore } from "@/store/vendorCartStore";

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
  const requestedDesigns = useVendorCartStore((state) => state.requestedDesigns);
  const requestedDesignPrices = useVendorCartStore((state) => state.requestedDesignPrices);

  const [activeCategorySelection, setActiveCategorySelection] = useState<string | null>(null);

  const handleExplore = (categoryKey: string) => {
    setActiveCategorySelection(categoryKey);
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
    { key: "dj", label: "DJ Artist", icon: <Music className="w-5 h-5" />, path: "djs" },
    { key: "videographer", label: "Videographer", icon: <Video className="w-5 h-5" />, path: "videographers" },
  ] as const;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  if (activeCategorySelection) {
    const selectedCatConfig = categories.find(c => c.key === activeCategorySelection);
    const categoryVendors = globalVendors.filter(v => v.category === selectedCatConfig?.path);
    const portfolioItems = categoryVendors.flatMap(v => {
      if (v.portfolioItems && v.portfolioItems.length > 0) {
        return v.portfolioItems.map(item => {
          const coverMedia = item.media.find(m => m.isCover) || item.media[0];
          return {
            vendorId: v.id,
            vendorName: v.name,
            vendorRating: v.rating,
            image: coverMedia ? coverMedia.url : "",
            title: item.title,
            portfolioItemId: item.id,
            defaultPackage: v.packages?.[0]?.name || "none",
            price: item.price > 0 ? item.price : (parseInt(v.startingPrice.replace(/[^0-9]/g, "")) || 0)
          };
        });
      }
      return (v.portfolio || []).map((img, idx) => ({
        vendorId: v.id,
        vendorName: v.name,
        vendorRating: v.rating,
        image: img,
        title: `Design #${idx + 1}`,
        portfolioItemId: `legacy-${idx}`,
        defaultPackage: v.packages?.[0]?.name || "none",
        price: parseInt(v.startingPrice.replace(/[^0-9]/g, "")) || 0
      }));
    });

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between border-b border-[#C9A84C]/20 pb-4 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveCategorySelection(null)} className="text-gray-500 hover:text-[#C9A84C] transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">Select {selectedCatConfig?.label} Design</h3>
          </div>
        </div>
        
        {portfolioItems.length === 0 ? (
           <p className="text-gray-500 italic text-center py-10">No portfolio designs available for this category.</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {portfolioItems.map((item, idx) => {
              const imgUrl = item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`;
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    const storeCategory = activeCategorySelection as keyof VendorsState;
                    useVendorCartStore.setState((state) => ({
                      vendors: {
                        ...state.vendors,
                        [storeCategory]: item.vendorId
                      },
                      requestedDesigns: {
                        ...state.requestedDesigns,
                        [storeCategory]: item.portfolioItemId
                      },
                      requestedDesignPrices: {
                        ...state.requestedDesignPrices,
                        [storeCategory]: item.price
                      }
                    }));
                    onChange({
                      ...vendors,
                      [activeCategorySelection]: item.vendorId,
                      [`${activeCategorySelection}Package`]: item.defaultPackage
                    } as any);
                    setActiveCategorySelection(null);
                  }}
                  className="relative break-inside-avoid rounded-sm overflow-hidden group cursor-pointer border border-[#E8DFC9] dark:border-gray-800 mb-4 bg-[#FDF9F1] dark:bg-[#111]"
                >
                  <img src={imgUrl} alt={item.vendorName} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/80 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-4 text-center">
                    <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-sm mb-2 backdrop-blur-sm border border-white/20">{item.vendorName}</span>
                    
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="text-[#C9A84C]">★ {item.vendorRating !== undefined && item.vendorRating !== null ? item.vendorRating : 0}</span>
                    </div>

                    {item.price > 0 && (
                      <span className="text-white font-bold text-sm mb-4">LKR {item.price.toLocaleString()}</span>
                    )}

                    <button className="px-6 py-2 bg-[#C9A84C] hover:bg-[#B58B5C] text-white text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors shadow-lg">
                      Select This Design
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

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

          const selectedDesignId = requestedDesigns[cat.key as "decorator" | "dj" | "videographer"];
          let selectedDesign: { image: string; title: string } | null = null;
          
          if (selectedDesignId && selectedVendor) {
            if (selectedVendor.portfolioItems) {
              const item = selectedVendor.portfolioItems.find(p => 
                p.id === selectedDesignId || 
                (p as any)._id === selectedDesignId ||
                p.id?.toString() === selectedDesignId?.toString() ||
                (p as any)._id?.toString() === selectedDesignId?.toString()
              );
              if (item) {
                const coverMedia = item.media.find(m => m.isCover) || item.media[0];
                const rawUrl = coverMedia ? coverMedia.url : "";
                selectedDesign = {
                  image: rawUrl.startsWith("http") ? rawUrl : `${API_URL}${rawUrl}`,
                  title: item.title
                };
              }
            }
            if (!selectedDesign && selectedVendor.portfolio) {
              const idx = parseInt(selectedDesignId.replace("legacy-", ""), 10);
              if (!isNaN(idx) && selectedVendor.portfolio[idx]) {
                const rawUrl = selectedVendor.portfolio[idx];
                selectedDesign = {
                  image: rawUrl.startsWith("http") ? rawUrl : `${API_URL}${rawUrl}`,
                  title: `Inspiration Design #${idx + 1}`
                };
              }
            }
          }
          if (!isSelected) {
            return (
              <div 
                key={cat.key}
                className="border border-[#E8DFC9] dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 h-full hover:border-[#C9A84C]/50"
              >
                {/* Card Header: not selected */}
                <div className="bg-[#FAF6EE]/30 dark:bg-white/5 px-5 py-4 border-b border-[#E8DFC9]/40 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-[#111] border border-dashed border-gray-300 dark:border-gray-800 flex items-center justify-center text-gray-400">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-serif tracking-wider text-gray-400 dark:text-gray-500 uppercase leading-none">
                      {cat.label}
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold block mt-1.5">
                      Not Selected
                    </span>
                  </div>
                </div>

                {/* Card Content area */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-xs text-gray-400 italic">
                    Explore and select a bespoke {cat.label.toLowerCase()} design to add to your luxury event plan.
                  </p>
                  
                  <button 
                    onClick={() => handleExplore(cat.key)}
                    className="w-full bg-[#1A1512] dark:bg-white text-white dark:text-[#1A1512] py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C9A84C] dark:hover:bg-[#C9A84C] dark:hover:text-white transition-colors rounded-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Select By Design <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={cat.key}
              className="border border-[#E8DFC9] dark:border-gray-800 bg-white dark:bg-[#111111] rounded-lg shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 ring-1 ring-[#C9A84C]/20 shadow-md"
            >
              {/* Card Header: warm cream background */}
              <div className="bg-[#FAF6EE] dark:bg-[#1C1812] px-5 py-4 border-b border-[#E8DFC9]/40 dark:border-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#111] border border-[#E8DFC9] flex items-center justify-center text-[#805D3A] dark:text-[#C9A84C]">
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold font-serif tracking-wider text-[#1A1512] dark:text-white uppercase leading-none">
                    {cat.label === "DJ Artist" ? "DJ Artist" : cat.label.toUpperCase()}
                  </h4>
                  <div className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 px-2 py-0.5 rounded-full mt-1.5">
                    <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-[9px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Selected</span>
                  </div>
                </div>
              </div>

              {/* Card Content area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {selectedVendor ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      {/* Vendor Image */}
                      <img 
                        src={selectedVendor.image.startsWith('http') ? selectedVendor.image : `${API_URL}${selectedVendor.image}`} 
                        alt={selectedVendor.name} 
                        className="w-20 h-20 rounded-lg object-cover border border-[#E8DFC9]/50 dark:border-gray-800" 
                      />
                      {/* Vendor Info Text */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="text-base font-bold text-[#1A1512] dark:text-white leading-tight">
                            {selectedVendor.name}
                          </h5>
                          <p className="text-xs text-gray-500 mt-1 font-medium">
                            {vendors[`${cat.key}Package` as keyof VendorsState] !== "none" ? vendors[`${cat.key}Package` as keyof VendorsState] : "Custom Package"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          {/* Rating */}
                          <div className="flex items-center text-[#C9A84C] font-semibold">
                            <span className="text-sm mr-1">★</span>
                            <span>{selectedVendor.rating !== undefined && selectedVendor.rating !== null ? selectedVendor.rating : 0}</span>
                            <span className="text-gray-400 font-normal ml-1">({selectedVendor.reviewsCount !== undefined && selectedVendor.reviewsCount !== null ? selectedVendor.reviewsCount : 0} reviews)</span>
                          </div>
                          {/* Verified badge */}
                          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase tracking-wide">Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Inspiration Design */}
                    {selectedDesign && (
                      <div className="bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFC9] dark:border-gray-800 p-3 rounded-lg flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={selectedDesign.image} 
                            alt={selectedDesign.title} 
                            className="w-12 h-12 rounded-md object-cover border border-[#E8DFC9]/30" 
                          />
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-[#805D3A] dark:text-[#C9A84C] font-bold block">
                              Selected Inspiration Design
                            </span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">
                              {selectedDesign.title}
                            </span>
                            {requestedDesignPrices && requestedDesignPrices[cat.key as keyof typeof requestedDesignPrices] !== undefined && requestedDesignPrices[cat.key as keyof typeof requestedDesignPrices] !== null ? (
                              <span className="text-xs font-bold text-[#C9A84C] mt-1 block">
                                LKR {(requestedDesignPrices[cat.key as keyof typeof requestedDesignPrices] as number).toLocaleString()}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        
                        {/* View Design button */}
                        <button 
                          onClick={() => {
                            window.open(selectedDesign!.image, "_blank");
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C9A84C] text-[#C9A84C] bg-white dark:bg-transparent rounded-md text-[10px] font-bold tracking-wider hover:bg-[#C9A84C]/10 transition-colors uppercase cursor-pointer"
                        >
                          👁️ View Design
                        </button>
                      </div>
                    )}
                  </div>
                ) : selectedVendorId === "custom_preference" ? (
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-[#FAF6EE] dark:bg-[#1A1A1A] border border-[#C9A84C]/30 flex items-center justify-center text-2xl">
                      👑
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="text-base font-bold text-[#8C6D23] dark:text-[#D4AF37]">
                          Custom Preference
                        </h5>
                        <p className="text-xs text-gray-500 mt-1">
                          Using outside artisan provider
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Card Actions Row */}
                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={() => handleExplore(cat.key)}
                    className="flex-1 border border-[#C9A84C] text-[#C9A84C] bg-white dark:bg-transparent hover:bg-[#C9A84C]/10 py-2.5 text-[10px] uppercase font-bold tracking-widest rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    ✏️ Change
                  </button>
                  <button 
                    onClick={() => handleRemove(cat.key as keyof VendorsState)}
                    className="px-4 py-2.5 border border-red-200 hover:border-red-300 dark:border-red-950/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors rounded-md flex items-center justify-center cursor-pointer"
                    title="Remove Vendor"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
