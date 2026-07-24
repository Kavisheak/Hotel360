"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Star, Heart, ArrowRight, Trash2, ShieldCheck } from "lucide-react";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import type { Vendor } from "@/store/vendorStore";

export default function SavedVendors() {
  const { favoriteVendors, toggleFavoriteVendor } = useVendorCartStore();
  const { vendors, fetchVendors } = useVendorStore();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Filter vendors that are in the user's favorite list
  const savedList = vendors.filter((v: Vendor) => favoriteVendors?.includes(v.id));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {savedList.length === 0 ? (
        <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-zinc-800/80 py-16 px-6 text-center space-y-4 rounded-xl shadow-sm">
          <Heart className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-700" />
          <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">No Saved Partners</h3>
          <p className="max-w-md mx-auto text-gray-500 text-xs font-light leading-relaxed">
            You haven&apos;t saved any service partners yet. Explore our marketplace to bookmark decorators, DJs, videographers, and other event experts.
          </p>
          <Link
            href="/customer/vendors"
            className="inline-block bg-[#C69C6D] text-white px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B58B5C] transition-colors rounded-sm shadow-md"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedList.map((vendor: Vendor) => (
            <div 
              key={vendor.id} 
              className="bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-800/80 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Cover Photo */}
              <div className="relative h-44 w-full bg-gray-100">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                
                {/* Category Label */}
                <span className="absolute top-4 left-4 bg-black/80 text-[#C9A84C] text-[8px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 border border-[#C9A84C]/30 shadow-md">
                  {vendor.categoryLabel}
                </span>

                <button 
                  onClick={() => toggleFavoriteVendor(vendor.id)} 
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/90 text-red-500 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  title="Remove from Saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="text-left">
                    <div className="flex items-center gap-1 mb-1 text-[#C9A84C]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="text-[8px] uppercase tracking-widest font-semibold">Verified Partner</span>
                    </div>
                    <h4 className="text-base font-serif text-white font-bold leading-tight">
                      {vendor.name}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Description & Cost Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-2">
                    {vendor.specialties.join(" • ")}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed text-left line-clamp-2">
                    {vendor.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-50 dark:border-zinc-800/30">
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase">
                    <Star className="w-3.5 h-3.5 text-[#C9A84C] fill-current" />
                    <strong>{vendor.rating}</strong> ({vendor.reviewsCount} events)
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Starting from</span>
                    <span className="font-bold text-[#C9A84C] text-[11px]">{vendor.startingPrice}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href={`/customer/vendorProfile/${vendor.id}`}
                    className="w-full text-center flex items-center justify-center gap-1.5 py-2 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#FAF6EE] dark:hover:bg-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest rounded transition-all"
                  >
                    Explore Portfolio
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
