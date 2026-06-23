"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Star, Phone, Mail, Check, Heart } from "lucide-react";
import { Vendor } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";

interface VendorProfileHeroProps {
  vendor: Vendor;
}

export default function VendorProfileHero({ vendor }: VendorProfileHeroProps) {
  const router = useRouter();
  const { favoriteVendors, toggleFavoriteVendor } = useVendorCartStore();

  const isFavorite = favoriteVendors?.includes(vendor.id) || false;

  return (
    <div className="relative w-full min-h-[500px] bg-white dark:bg-[#0A0A0A] overflow-hidden border-b border-[#E8DFC9] dark:border-[#C9A84C]/20 transition-colors duration-300 pt-16 pb-20">
      
      {/* Dark Theme Background Image */}
      <div className="absolute top-0 left-0 w-full md:w-[60%] lg:w-[55%] h-full z-0 hidden dark:block pointer-events-none">
        <Image src="/crystal_chandelier.png" alt="Dark Background" fill className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/10" />
      </div>
      
      {/* Background Cover Image on Right */}
      <div className="absolute top-0 right-0 w-full md:w-[60%] lg:w-[55%] h-full z-0">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient fade to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:from-[#0A0A0A]/50 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center mt-6">
        <div className="max-w-xl space-y-6">
          
          {/* Profile Details */}
          <div className="flex items-center gap-3 mb-4">
            <span className="border border-[#C69C6D]/30 text-[#C69C6D] px-3 py-1 text-[9px] uppercase font-bold tracking-[0.15em] rounded-sm bg-[#FAF6EE]/50 dark:bg-transparent backdrop-blur-sm">
              {vendor.categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1512] dark:text-white px-3 py-1 border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-sm bg-white/50 dark:bg-transparent backdrop-blur-sm">
              <Star className="w-3 h-3 text-[#C69C6D] fill-[#C69C6D]" />
              {vendor.rating} ({vendor.reviewsCount} Reviews)
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#1A1512] dark:text-white leading-[1.1]">
            {vendor.name}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-lg pb-2">
            {vendor.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-500 dark:text-gray-400 pb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C69C6D]" />
              <span>{((vendor as any).location) || "Colombo 07, Sri Lanka"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C69C6D]" />
              <span>{((vendor as any).contactPhone) || "+94 77 123 4567"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C69C6D]" />
              <span>{((vendor as any).contactEmail) || "contact@vendor.com"}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={() => toggleFavoriteVendor(vendor.id)}
              className={`p-3.5 flex items-center justify-center transition-colors rounded-sm border ${isFavorite ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20" : "border-[#E8DFC9] dark:border-[#C9A84C]/30 text-gray-400 dark:text-gray-300 hover:border-[#C69C6D] hover:text-[#C69C6D]"} bg-white dark:bg-transparent shadow-sm`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
            <button 
              onClick={() => router.push("/customer/saved")}
              className="bg-white dark:bg-transparent border border-[#E8DFC9] dark:border-[#C9A84C]/30 text-[#1A1512] dark:text-white px-8 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-sm shadow-sm"
            >
              View Saved Vendors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
