"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Star, Phone, Mail, Award, Clock, Check, Heart, ShoppingCart } from "lucide-react";
import { Vendor } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";

interface VendorProfileHeroProps {
  vendor: Vendor;
}

export default function VendorProfileHero({ vendor }: VendorProfileHeroProps) {
  const router = useRouter();
  const { cartVendors, favoriteVendors, toggleCartVendor, toggleFavoriteVendor } = useVendorCartStore();
  const [added, setAdded] = useState(false);

  const inCart = cartVendors?.includes(vendor.id) || false;
  const isFavorite = favoriteVendors?.includes(vendor.id) || false;

  const handleToggleCart = () => {
    toggleCartVendor(vendor.id);
    if (!inCart) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="relative w-full min-h-[500px] bg-white dark:bg-[#0A0A0A] overflow-hidden border-b border-[#E8DFC9] dark:border-[#C9A84C]/20 transition-colors duration-300 pt-8 pb-16">
      
      {/* Background Cover Image on Right */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 lg:w-1/2 h-full z-0">
        <Image
          src={vendor.image}
          alt={vendor.name}
          fill
          className="object-cover"
        />
        {/* Gradient fade to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#0A0A0A] pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center mt-12">
        <div className="max-w-xl space-y-6">
          
          {/* Profile Details */}
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#FAF6EE] dark:bg-[#C9A84C]/20 text-[#A6955C] dark:text-[#C9A84C] px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-sm">
              {vendor.categoryLabel}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#1A1512] dark:text-white px-3 py-1.5 border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-sm">
              <Star className="w-3.5 h-3.5 text-[#C69C6D] fill-[#C69C6D]" />
              {vendor.rating} ({vendor.reviewsCount} Reviews)
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif text-[#1A1512] dark:text-white leading-tight">
            {vendor.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 pb-4">
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
          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => toggleFavoriteVendor(vendor.id)}
              className={`p-3.5 flex items-center justify-center transition-colors rounded-sm border ${isFavorite ? "border-red-500 text-red-500 bg-red-50" : "border-[#E8DFC9] dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#C69C6D]"} bg-white dark:bg-[#1A1A1A]`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
            <button 
              onClick={handleToggleCart}
              className={`px-8 py-3.5 text-xs uppercase font-bold tracking-widest transition-colors rounded-sm flex items-center justify-center gap-2 ${inCart ? "bg-red-900 text-white hover:bg-red-800" : added ? "bg-green-600 text-white" : "bg-[#C69C6D] text-white hover:bg-[#B58B5C]"}`}
            >
              {inCart ? "Remove from Cart" : added ? <><Check className="w-4 h-4"/> Added</> : <><ShoppingCart className="w-4 h-4"/> Add to Cart</>}
            </button>
            <button 
              onClick={() => router.push("/customer/saved")}
              className="bg-white dark:bg-transparent border border-[#E8DFC9] dark:border-gray-700 text-[#1A1512] dark:text-white px-8 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-sm"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
