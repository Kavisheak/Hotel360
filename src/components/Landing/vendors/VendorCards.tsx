import React from "react";
import Image from "next/image";
import { Star, Award, Info, ArrowRight } from "lucide-react";
import { Vendor } from "./types";

interface VendorCardsProps {
  filteredVendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  onClearFilters: () => void;
}

export default function VendorCards({
  filteredVendors,
  onSelectVendor,
  onClearFilters
}: VendorCardsProps) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {filteredVendors.length === 0 ? (
        <div className="bg-white border border-[#E8DFC9] py-16 px-6 text-center space-y-4 rounded-sm shadow-md">
          <Info className="w-12 h-12 mx-auto text-[#A6955C]" />
          <h3 className="text-xl font-serif text-[#1A1512]">No Partners Found</h3>
          <p className="max-w-md mx-auto text-gray-500 text-sm">
            We couldn't find any partners matching your current combination of keywords, filters, or tiers. Try clearing your search query or selecting "All Ratings".
          </p>
          <button 
            onClick={onClearFilters}
            className="bg-black text-white px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C69C6D] hover:text-black transition-colors rounded-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor) => (
            <div 
              key={vendor.id} 
              className="bg-white border border-[#E8DFC9] flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 rounded-sm overflow-hidden group"
            >
              {/* Image Wrap & Category Tag Overlay */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-200">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Category Label */}
                <span className="absolute top-4 left-4 bg-black/85 text-[#C69C6D] text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 border border-[#C69C6D]/30 shadow-md">
                  {vendor.categoryLabel}
                </span>
                
                {/* Rating Tag */}
                <div className="absolute bottom-4 right-4 bg-white/95 text-black px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold shadow-md rounded-sm">
                  <Star className="w-3.5 h-3.5 text-[#C69C6D] fill-[#C69C6D]" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              {/* Card Content Description Block */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#A6955C] font-semibold">
                    <span>{vendor.priceLevelLabel}</span>
                    <span className="font-extrabold text-[#7C6A2E]">{vendor.startingPrice} starting</span>
                  </div>

                  <h3 className="text-xl font-serif text-[#1A1512] leading-tight">
                    {vendor.name}
                  </h3>

                  <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">
                    {vendor.description}
                  </p>
                </div>

                {/* Specialty Tags */}
                <div className="pt-4 flex flex-wrap gap-1.5 border-t border-[#FAF6EE]">
                  {vendor.specialties.slice(0, 3).map((spec, i) => (
                    <span 
                      key={i} 
                      className="bg-[#FAF6EE] text-[#7C6A2E] text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 border border-[#E8DFC9]"
                    >
                      {spec}
                    </span>
                  ))}
                  {vendor.specialties.length > 3 && (
                    <span className="bg-[#FAF6EE] text-gray-400 text-[9px] uppercase tracking-wider px-1.5 py-1">
                      +{vendor.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Trigger Button */}
              <div className="px-6 pb-6 pt-2 bg-white">
                <button 
                  onClick={() => onSelectVendor(vendor)}
                  className="w-full text-center border border-[#1A1512] text-[#1A1512] py-2.5 hover:bg-[#1A1512] hover:text-white transition-all duration-300 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 group-hover:border-[#C69C6D]"
                >
                  View Details & Packages
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
