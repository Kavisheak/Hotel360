"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Vendor } from "./types";

interface PortfolioGalleryProps {
  filteredVendors: Vendor[];
}

export default function PortfolioGallery({ filteredVendors }: PortfolioGalleryProps) {
  const router = useRouter();

  // Flatten portfolios
  const portfolioItems = filteredVendors.flatMap(vendor => {
    return (vendor.portfolio || []).map(url => ({
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      url,
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
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {portfolioItems.map((item, index) => {
            const isCloudinary = item.url.includes("cloudinary");
            const fullUrl = isCloudinary ? item.url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${item.url}`;
            // If it's an absolute url starting with http, just use it
            const src = item.url.startsWith("http") ? item.url : fullUrl;

            return (
              <div 
                key={`${item.vendorId}-${index}`} 
                className="relative group overflow-hidden cursor-pointer rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gray-100 dark:bg-gray-800 break-inside-avoid"
                onClick={() => router.push(`/customer/vendorProfile/${item.vendorId}`)}
              >
                <img 
                  src={src} 
                  alt={`Portfolio from ${item.vendorName}`}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded-sm mb-3 backdrop-blur-sm border border-white/20">{item.vendorName}</span>
                  <div className="flex flex-col gap-2 items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const categoryKey = item.category === "decorators" ? "decorator" : 
                                            item.category === "videographers" ? "videographer" : 
                                            item.category === "photographers" ? "photographer" :
                                            item.category === "florists" ? "florist" :
                                            item.category === "djs" ? "dj" : item.category;
                        router.push(`/book?${categoryKey}=${item.vendorId}`);
                      }}
                      className="px-4 py-2 bg-[#C9A84C] hover:bg-[#B58B5C] text-white text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors shadow-md"
                    >
                      Select This Design
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/customer/vendorProfile/${item.vendorId}`);
                      }}
                      className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors shadow-sm"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
