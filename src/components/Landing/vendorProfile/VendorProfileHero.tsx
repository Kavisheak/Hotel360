"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Star, Phone, Mail, Check, Heart, CalendarPlus } from "lucide-react";
import { Vendor } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useToastStore } from "@/store/toastStore";
import { motion, AnimatePresence } from "framer-motion";

interface VendorProfileHeroProps {
  vendor: Vendor;
}

export default function VendorProfileHero({ vendor }: VendorProfileHeroProps) {
  const router = useRouter();
  const { favoriteVendors, toggleFavoriteVendor, toggleVendorInEventPlan, isVendorInEventPlan, vendors: cartVendors } = useVendorCartStore();
  const { vendors: globalVendors } = useVendorStore();
  const { addToast } = useToastStore();

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [existingVendorName, setExistingVendorName] = useState("");

  const isFavorite = favoriteVendors?.includes(vendor.id) || false;
  const isInEventPlan = isVendorInEventPlan(vendor.id, vendor.category as any);

  const handleAddClick = () => {
    if (isInEventPlan) {
      // Just remove it
      toggleVendorInEventPlan(vendor.id, vendor.category as any);
      addToast({ message: "Vendor removed from Event Plan", type: "info" });
      return;
    }

    let storeCategory: "decorator" | "dj" | "videographer";
    if (vendor.category === "decorators") storeCategory = "decorator";
    else if (vendor.category === "djs") storeCategory = "dj";
    else storeCategory = "videographer";

    const currentSelectedId = cartVendors[storeCategory];
    
    if (currentSelectedId && currentSelectedId !== "none" && currentSelectedId !== "custom_preference") {
      const existing = globalVendors.find(v => v.id === currentSelectedId);
      if (existing) {
        setExistingVendorName(existing.name);
        setShowSwapModal(true);
        return;
      }
    }

    // No conflict, just add
    toggleVendorInEventPlan(vendor.id, vendor.category as any);
    addToast({ message: `${vendor.name} added to Event Plan!`, type: "success" });
  };

  const confirmSwap = () => {
    toggleVendorInEventPlan(vendor.id, vendor.category as any); // The store handles overriding the category
    setShowSwapModal(false);
    addToast({ message: `Swapped to ${vendor.name}!`, type: "success" });
  };

  return (
    <div className="relative w-full min-h-[500px] bg-white dark:bg-[#0A0A0A] overflow-hidden border-b border-[#E8DFC9] dark:border-[#C9A84C]/20 transition-colors duration-300 pt-16 pb-20">
      
      {/* Dark Theme Background Image */}
      <div className="absolute top-0 left-0 w-full md:w-[60%] lg:w-[55%] h-full z-0 hidden dark:block pointer-events-none">
        <Image src="/crystal_chandelier.png" alt="Dark Background" fill className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/10" />
      </div>
      
      {/* Background Cover Image on Right */}
      <div className="absolute top-0 right-0 w-full md:w-[60%] lg:w-[55%] h-full z-0">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient fade to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:from-[#0A0A0A]/50 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center mt-6">
        <div className="max-w-xl space-y-6">
          
          {/* Profile Avatar & Details */}
          <div className="flex items-center gap-4 mb-4">
            {vendor.avatar && (
              <img 
                src={vendor.avatar} 
                alt={`${vendor.name} Profile`} 
                className="w-16 h-16 rounded-full object-cover border-2 border-[#C69C6D] shadow-md"
              />
            )}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="border border-[#C69C6D]/30 text-[#C69C6D] px-3 py-1 text-[9px] uppercase font-bold tracking-[0.15em] rounded-sm bg-[#FAF6EE]/50 dark:bg-transparent backdrop-blur-sm">
                  {vendor.categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1512] dark:text-white px-3 py-1 border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-sm bg-white/50 dark:bg-transparent backdrop-blur-sm">
                  <Star className="w-3 h-3 text-[#C69C6D] fill-[#C69C6D]" />
                  {vendor.rating} ({vendor.reviewsCount} Reviews)
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#1A1512] dark:text-white leading-[1.1]">
            {vendor.name}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-lg pb-2">
            {vendor.description}
          </p>

          {(vendor.location || vendor.contactPhone || vendor.contactEmail) && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-500 dark:text-gray-400 pb-6">
              {vendor.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C69C6D]" />
                  <span>{vendor.location}</span>
                </div>
              )}
              {vendor.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C69C6D]" />
                  <span>{vendor.contactPhone}</span>
                </div>
              )}
              {vendor.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C69C6D]" />
                  <span>{vendor.contactEmail}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={handleAddClick}
              className={`px-8 py-3.5 text-xs uppercase font-bold tracking-widest transition-colors rounded-sm shadow-sm flex items-center gap-2 ${isInEventPlan ? 'bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#1A1A1A]' : 'bg-[#1A1512] dark:bg-white text-white dark:text-[#1A1A1A] hover:bg-[#C69C6D] dark:hover:bg-gray-200'}`}
            >
              {isInEventPlan ? <><Check className="w-4 h-4" /> In Event Plan</> : <><CalendarPlus className="w-4 h-4" /> Add to Event Plan</>}
            </button>
            <button 
              onClick={() => toggleFavoriteVendor(vendor.id)}
              className={`p-3.5 flex items-center justify-center transition-colors rounded-sm border ${isFavorite ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20" : "border-[#E8DFC9] dark:border-[#C9A84C]/30 text-gray-400 dark:text-gray-300 hover:border-[#C69C6D] hover:text-[#C69C6D]"} bg-white dark:bg-transparent shadow-sm`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
            <button 
              onClick={() => router.push("/book")}
              className="bg-transparent border border-[#E8DFC9] dark:border-[#C9A84C]/30 text-[#1A1512] dark:text-white px-8 py-3.5 text-xs uppercase font-bold tracking-widest hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors rounded-sm shadow-sm"
            >
              Return to Booking
            </button>
            <button 
              onClick={() => router.push("/customer/saved")}
              className="text-[#1A1512] dark:text-white text-xs uppercase font-bold tracking-widest hover:text-[#C69C6D] transition-colors underline decoration-[#C69C6D]/30 underline-offset-4 ml-2"
            >
              Saved Vendors
            </button>
          </div>
        </div>
      </div>
      {/* Swap Confirmation Modal */}
      <AnimatePresence>
        {showSwapModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSwapModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#1A1A1A] p-8 max-w-md w-full rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#E8DFC9] dark:border-[#C9A84C]/30 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFF8E6] dark:bg-[#2A2312] border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-6">
                <CalendarPlus className="w-8 h-8 text-[#C9A84C]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C1E14] dark:text-white mb-3">Swap Vendor?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                You already have <strong className="text-[#C9A84C]">{existingVendorName}</strong> selected for this category in your Event Plan. Do you want to replace them with <strong className="text-[#C9A84C]">{vendor.name}</strong>?
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 py-3 border border-[#E8DFC9] dark:border-gray-700 text-[#1A1512] dark:text-gray-300 text-xs uppercase font-bold tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSwap}
                  className="flex-1 py-3 bg-[#C9A84C] text-white dark:text-[#1A1A1A] text-xs uppercase font-bold tracking-widest hover:bg-[#B89238] transition-colors rounded-sm"
                >
                  Yes, Swap
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
