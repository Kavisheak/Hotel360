"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Vendor } from "./types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useToastStore } from "@/store/toastStore";

const PortfolioCard = ({ portfolio, router }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { item, vendorId, vendorName, category } = portfolio;
  
  // Hook into the stores for reactivity
  const cartVendors = useVendorCartStore((state) => state.vendors);
  const toggleVendorInEventPlan = useVendorCartStore((state) => state.toggleVendorInEventPlan);
  const addToast = useToastStore((state) => state.addToast);
  
  let storeCategory: keyof typeof cartVendors = "decorator";
  const catLower = (category || "").toLowerCase();
  if (catLower.includes("decorator")) storeCategory = "decorator";
  else if (catLower.includes("dj")) storeCategory = "dj";
  else if (catLower.includes("videograph")) storeCategory = "videographer";
  else if (catLower.includes("photograph")) storeCategory = "photographer";
  else if (catLower.includes("cake")) storeCategory = "cake";
  else if (catLower.includes("florist")) storeCategory = "florist";

  const isSelected = cartVendors[storeCategory] === vendorId;
  const currentVendorInSlot = cartVendors[storeCategory];
  
  // A helper to know if a slot actually has a real vendor selected
  const hasVendorInSlot = currentVendorInSlot && 
    currentVendorInSlot !== "none" && 
    currentVendorInSlot !== "null" && 
    currentVendorInSlot !== "custom_preference";

  // Get formatted URLs for all media
  const mediaList = item.media.map((m: any) => {
    const isCloudinary = m.url.includes("cloudinary");
    return isCloudinary ? m.url : (m.url.startsWith("http") ? m.url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${m.url}`);
  });

  useEffect(() => {
    if (mediaList.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % mediaList.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [mediaList.length]);

  return (
    <div 
      className="relative group overflow-hidden cursor-pointer rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-100 dark:bg-gray-800 break-inside-avoid"
      onClick={() => router.push(`/customer/vendorProfile/${vendorId}`)}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-[400px] overflow-hidden rounded-sm bg-black">
        {mediaList.length === 1 ? (
          <div className="w-full h-full relative">
            <img 
              src={mediaList[0]} 
              alt={`Portfolio from ${vendorName}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Display the design type label if available */}
            {item.media[0]?.designType && item.media[0].designType !== 'general' && (
               <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg z-20">
                 {item.media[0].designType} Design
               </div>
            )}
          </div>
        ) : (
          <>
            {mediaList.map((src: string, i: number) => (
              <div 
                key={i} 
                className="absolute top-0 left-0 w-full h-full transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(${(i - currentIndex) * 100}%)` }}
              >
                 <img 
                  src={src} 
                  alt={`Portfolio from ${vendorName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Display the design type label if available */}
                {item.media[i]?.designType && item.media[i].designType !== 'general' && (
                   <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg z-20">
                     {item.media[i].designType} Design
                   </div>
                )}
              </div>
            ))}
          </>
        )}
        
        {/* Pagination Dots */}
        {mediaList.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-20">
            {mediaList.map((_: any, idx: number) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-[#C9A84C]' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 z-30">
        <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-sm mb-1 backdrop-blur-sm border border-white/20">{vendorName}</span>
        <span className="text-[#C9A84C] font-serif italic text-sm mb-4 text-center px-4">{item.title}</span>
        
        <div className="flex flex-col gap-2 items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              
              if (!isSelected && hasVendorInSlot && currentVendorInSlot !== vendorId) {
                const proceed = window.confirm(`You already have a ${storeCategory} in your event plan. Do you want to replace them with ${vendorName}?`);
                if (!proceed) return;
              }

              toggleVendorInEventPlan(vendorId, category as any, item._id || item.id);
              
              if (!isSelected) {
                // Add a small delay to allow the cart state to update before showing toast
                setTimeout(() => {
                  addToast({
                    type: "success",
                    message: `${vendorName} added to your event plan!`
                  });
                }, 100);
              }
            }}
            className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors shadow-md ${
              isSelected 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-[#C9A84C] hover:bg-[#B58B5C] text-white"
            }`}
          >
            {isSelected ? "Remove from Plan" : "Add to Event Plan"}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/customer/vendorProfile/${vendorId}`);
            }}
            className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors shadow-sm"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

interface PortfolioGalleryProps {
  filteredVendors: Vendor[];
}

export default function PortfolioGallery({ filteredVendors }: PortfolioGalleryProps) {
  const router = useRouter();

  // Flatten portfolios
  const portfolioItems = filteredVendors.flatMap(vendor => {
    if (vendor.portfolioItems && vendor.portfolioItems.length > 0) {
      return vendor.portfolioItems.map((item: any) => ({
        vendorId: vendor.id,
        vendorName: vendor.name,
        category: vendor.category,
        item: item
      }));
    }
    // Fallback for mock data or legacy items
    return (vendor.portfolio || []).map((url, idx) => ({
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      item: { 
        id: `legacy-${idx}`, 
        title: "Portfolio Image", 
        description: "", 
        price: 0, 
        media: [{url, isCover: true, designType: 'general'}] 
      }
    }));
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A84C] block mb-2">Visual Portfolio</span>
        <h2 className="text-4xl font-serif text-[#2C1E14] dark:text-white mb-4">Browse by <span className="italic text-[#C9A84C]">Work Quality</span></h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light max-w-xl leading-relaxed">
            Explore curated work from all our verified partners. Click any image to discover the vendor behind it.
          </p>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 border border-gray-200 dark:border-gray-800 px-3 py-1 rounded-sm">
            {portfolioItems.length} Portfolio Images
          </span>
        </div>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/10 dark:bg-[#1A1A1A]/30">
          <p className="text-gray-500 font-serif italic">No backend added portfolio images found for the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {portfolioItems.map((portfolio, index) => (
            <PortfolioCard key={`${portfolio.vendorId}-${portfolio.item.id || index}`} portfolio={portfolio} router={router} />
          ))}
        </div>
      )}
    </section>
  );
}
