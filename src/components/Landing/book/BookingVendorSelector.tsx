"use client";

import React, { useState } from "react";
import { Sparkles, Palette, Music, Video, Heart } from "lucide-react";
import { type Vendor } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useBookingFormStore } from "@/store/bookingFormStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface VendorsState {
  decorator: string | null;
  decoratorPackage: string;
  dj: string | null;
  djPackage: string;
  videographer: string | null;
  videographerPackage: string;
}

interface BookingVendorSelectorProps {
  vendors: VendorsState;
  onChange: (vendors: VendorsState) => void;
}

export default function BookingVendorSelector({ vendors, onChange }: BookingVendorSelectorProps) {
  const router = useRouter();
  const { vendors: globalVendors, isLoading, fetchVendors } = useVendorStore();
  const { clearForm } = useBookingFormStore();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  React.useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);
  
  const updateVendor = (category: "decorator" | "dj" | "videographer", value: string | null) => {
    onChange({ 
      ...vendors, 
      [category]: value,
      [`${category}Package`]: "none" // reset package when vendor changes
    });
  };

  const updatePackage = (category: "decorator" | "dj" | "videographer", pkgName: string) => {
    onChange({
      ...vendors,
      [`${category}Package`]: pkgName
    });
  };

  const decorators = globalVendors.filter(v => v.category === "decorators");
  const djs = globalVendors.filter(v => v.category === "djs");
  const videographers = globalVendors.filter(v => v.category === "videographers");

  const renderCategory = (
    title: string, 
    icon: React.ReactNode, 
    categoryKey: "decorator" | "dj" | "videographer", 
    vendorList: Vendor[]
  ) => {

    const isSelectedCategory = vendors[categoryKey] !== null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-[#C9A84C]/20 pb-2">
          <h4 className="flex items-center gap-2 text-base font-serif font-semibold text-[#2C1E14] dark:text-gray-200">
            {icon} {title}
          </h4>
          {isSelectedCategory && (
            <button 
              onClick={() => updateVendor(categoryKey, null)}
              className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] hover:text-[#A6955C] transition-colors underline"
            >
              Change Vendor
            </button>
          )}
        </div>

        {!isSelectedCategory ? (
          <div className="space-y-4">
            <h5 className="text-sm font-bold text-[#2C1E14] dark:text-gray-200 mb-3 border-b border-[#E8DFC9] dark:border-gray-800 pb-2 flex items-center justify-between">
              <span>Select a {title}</span>
              <span className="text-[10px] font-normal text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm">Highly Recommended</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorList.slice(0, 3).map(v => (
                <div 
                  key={v.id}
                  onClick={() => updateVendor(categoryKey, v.id)}
                  className="relative cursor-pointer border border-[#E8DFC9] dark:border-[#333] hover:border-[#C9A84C] hover:shadow-md transition-all p-3 rounded-sm flex items-center gap-3 bg-white dark:bg-[#1A1A1A] group"
                >
                  <div className="w-12 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100 dark:bg-[#0A0A0A]">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-grow text-left">
                    <span className="text-sm font-bold text-[#2C1E14] dark:text-gray-200 group-hover:text-[#C9A84C] transition-colors">{v.name}</span>
                    <span className="text-[10px] text-gray-500">{v.categoryLabel}</span>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
                }}
                className="cursor-pointer border border-[#E8DFC9] dark:border-[#333] hover:border-[#C9A84C] hover:bg-[#FFF8E6] dark:hover:bg-[#2A2312]/50 transition-all p-3 rounded-sm flex items-center justify-center gap-2 bg-white dark:bg-[#1A1A1A]"
              >
                <div className="text-center">
                  <span className="block text-sm font-bold text-[#2C1E14] dark:text-gray-200">
                    {expandedCategory === categoryKey ? "Hide Options" : "Browse More"}
                  </span>
                  <span className="block text-[10px] text-gray-500 mt-0.5">
                    {expandedCategory === categoryKey ? "Collapse list" : `View all ${title.toLowerCase()}s`}
                  </span>
                </div>
              </button>
              <div 
                onClick={() => {
                  updateVendor(categoryKey, "custom_preference");
                  updatePackage(categoryKey, "Custom Preferences");
                }}
                className="cursor-pointer border border-dashed border-[#C9A84C]/50 hover:border-[#C9A84C] hover:bg-[#FFF8E6] dark:hover:bg-[#2A2312]/50 transition-all p-3 rounded-sm flex items-center justify-center gap-2 bg-[#FDFBF7] dark:bg-[#2A2312]"
              >
                <div className="text-center">
                  <span className="block text-sm font-bold text-[#805D3A] dark:text-[#C9A84C]">Use My Own</span>
                  <span className="block text-[10px] text-gray-500 mt-0.5">Bring an outside vendor</span>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedCategory === categoryKey && vendorList.length > 3 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {vendorList.slice(3).map(v => (
                      <div 
                        key={v.id}
                        onClick={() => updateVendor(categoryKey, v.id)}
                        className="relative cursor-pointer border border-[#E8DFC9] dark:border-[#333] hover:border-[#C9A84C] hover:shadow-md transition-all p-3 rounded-sm flex items-center gap-3 bg-white dark:bg-[#1A1A1A] group"
                      >
                        <div className="w-12 h-12 shrink-0 rounded-sm overflow-hidden bg-gray-100 dark:bg-[#0A0A0A]">
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col flex-grow text-left">
                          <span className="text-sm font-bold text-[#2C1E14] dark:text-gray-200 group-hover:text-[#C9A84C] transition-colors">{v.name}</span>
                          <span className="text-[10px] text-gray-500">{v.categoryLabel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors[categoryKey] === "custom_preference" ? (
              <div className="p-4 border border-[#C9A84C] bg-gradient-to-br from-[#D4AF37]/10 to-[#8C6D23]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] ring-1 ring-[#C9A84C] rounded-sm">
                <div className="flex flex-col items-center text-center">
                  <span className="text-base font-bold text-[#C9A84C] mb-2">My Own Preference Selected</span>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                    You have opted to use your own {title.toLowerCase()} or discuss a completely customized arrangement. No vendor fees have been added to your current estimate. We will reach out to coordinate logistics.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Show Selected Vendor Card */}
                {vendorList.find(v => v.id === vendors[categoryKey]) && (
                  <div className="p-3 border border-[#C9A84C] bg-gradient-to-br from-[#D4AF37]/10 to-[#8C6D23]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)] ring-1 ring-[#C9A84C] rounded-sm flex items-center gap-4">
                    {(() => {
                      const opt = vendorList.find(v => v.id === vendors[categoryKey])!;
                      return (
                        <>
                          <div className="w-16 h-16 shrink-0 rounded-sm overflow-hidden bg-gray-100 dark:bg-[#0A0A0A] border border-[#C9A84C]/20">
                            <img src={opt.image} alt={opt.name} className="w-full h-full object-cover opacity-80" />
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-base font-bold text-[#C9A84C]">
                              {opt.name}
                            </span>
                            <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                              {opt.description.substring(0, 100)}...
                            </span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}

                {/* Selected Vendor Packages (ONLY FOR DECORATORS) */}
                {categoryKey === "decorator" && (
                  <div className="p-4 border border-[#C9A84C]/20 bg-[#FDFBF7] dark:bg-[#1A1A1A] rounded-sm shadow-inner">
                    <h5 className="text-sm uppercase tracking-widest font-bold text-[#8C6D23] dark:text-[#C9A84C] mb-4">
                      Select a Design / Package
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vendorList.find(v => v.id === vendors[categoryKey])?.packages.map(pkg => {
                      const pkgKey = `${categoryKey}Package` as keyof VendorsState;
                      const isPkgSelected = vendors[pkgKey] === pkg.name;
                      return (
                        <div 
                          key={pkg.name}
                          onClick={() => updatePackage(categoryKey, pkg.name)}
                          className={`border rounded-sm cursor-pointer transition-all hover-glow btn-interactive flex flex-col justify-between overflow-hidden ${
                            isPkgSelected 
                              ? "border-[#C9A84C] bg-[#FFF8E6] dark:bg-[#2A2312] shadow-sm ring-1 ring-[#C9A84C]" 
                              : "border-[#E8DFC9] dark:border-[#333] hover:border-[#C9A84C]/50"
                          }`}
                        >
                          {pkg.image && (
                            <div className="w-full h-32 overflow-hidden border-b border-[#C9A84C]/20 shrink-0">
                              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                          <div className="p-4 flex flex-col justify-between flex-grow">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-bold ${isPkgSelected ? 'text-[#8C6D23] dark:text-[#D4AF37]' : 'text-[#2C1E14] dark:text-white'}`}>{pkg.name}</span>
                                <span className="text-[10px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm shrink-0 ml-2">{pkg.price}</span>
                              </div>
                              <ul className="text-[9.5px] text-gray-600 dark:text-gray-400 list-disc pl-4 space-y-1 mt-3">
                                {pkg.features.map((f, i) => <li key={i}>{f}</li>)}
                              </ul>
                            </div>
                            {isPkgSelected && (
                              <div className="mt-4 text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] flex justify-end shrink-0">
                                Selected ✓
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Custom / Own Preferences Option */}
                    <div 
                      onClick={() => updatePackage(categoryKey, "Custom Preferences")}
                      className={`p-4 border rounded-sm cursor-pointer transition-all hover-glow btn-interactive flex flex-col justify-between ${
                        vendors[`${categoryKey}Package` as keyof VendorsState] === "Custom Preferences"
                          ? "border-[#C9A84C] bg-[#FFF8E6] dark:bg-[#2A2312] shadow-sm ring-1 ring-[#C9A84C]" 
                          : "border-[#E8DFC9] dark:border-[#333] hover:border-[#C9A84C]/50"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-sm font-bold ${vendors[`${categoryKey}Package` as keyof VendorsState] === "Custom Preferences" ? 'text-[#8C6D23] dark:text-[#D4AF37]' : 'text-[#2C1E14] dark:text-white'}`}>Custom Preferences</span>
                          <span className="text-[10px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-sm">Discuss Later</span>
                        </div>
                        <p className="text-[9.5px] text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                          Have a specific vision that goes beyond these packages? Select this option to arrange custom designs and bespoke pricing directly with this vendor.
                        </p>
                      </div>
                      {vendors[`${categoryKey}Package` as keyof VendorsState] === "Custom Preferences" && (
                        <div className="mt-4 text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] flex justify-end">
                          Selected ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 hover-glow p-4 rounded-sm transition-all duration-300 bg-[#FDFBF7] dark:bg-[#111111] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
      <label className="block text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold flex items-center gap-1.5 border-b border-[#C9A84C]/30 pb-3 mb-4">
        <Sparkles className="w-4 h-4 text-[#C9A84C]" /> Step 2: Preliminary Vendors
      </label>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="animate-spin w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {renderCategory("Decorator", <Palette className="w-4 h-4 text-[#C9A84C]" />, "decorator", decorators)}
            {renderCategory("DJ & Music", <Music className="w-4 h-4 text-[#C9A84C]" />, "dj", djs)}
            {renderCategory("Cinematic Videography", <Video className="w-4 h-4 text-[#C9A84C]" />, "videographer", videographers)}
          </div>
          
          <p className="text-[10px] text-gray-600 dark:text-gray-500 font-light mt-4 italic text-center">
            View full portfolios and reviews in the dedicated Vendors portal.
          </p>
        </>
      )}
    </div>
  );
}
