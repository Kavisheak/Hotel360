"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Star, Phone, Mail, Check, Heart, CalendarPlus } from "lucide-react";
import { Vendor } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useToastStore } from "@/store/toastStore";
import VendorFavoriteModal from "@/components/landing/shared/VendorFavoriteModal";
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

  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [pendingFavoriteVendor, setPendingFavoriteVendor] = useState<{ id: string; name: string; isRemoving: boolean } | null>(null);

  const isFavorite = favoriteVendors?.includes(vendor.id) || false;
  const isInEventPlan = isVendorInEventPlan(vendor.id, vendor.category as any);

  const handleFavoriteClick = () => {
    const skipConfirmation = useVendorCartStore.getState().skipFavoriteConfirmation;

    if (skipConfirmation) {
      toggleFavoriteVendor(vendor.id);
    } else {
      setPendingFavoriteVendor({ id: vendor.id, name: vendor.name, isRemoving: isFavorite });
      setFavoriteModalOpen(true);
    }
  };

  const confirmFavorite = (dontAskAgain: boolean) => {
    if (pendingFavoriteVendor) {
      if (dontAskAgain) {
        useVendorCartStore.getState().setSkipFavoriteConfirmation(true);
      }
      toggleFavoriteVendor(pendingFavoriteVendor.id);
      setFavoriteModalOpen(false);
      setPendingFavoriteVendor(null);
    }
  };

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
      
      {/* Background Cover Image */}
      <div className="absolute top-0 right-0 w-full h-[200px] md:h-full md:w-[60%] lg:w-[55%] z-0">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient fade to blend into background - Desktop only */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 pointer-events-none" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent dark:from-[#0A0A0A]/50 pointer-events-none" />
        
        {/* Mobile bottom fade (optional, but let's keep it sharp for fb style) */}
        <div className="md:hidden absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 h-full flex flex-col justify-center mt-[120px] md:mt-6">
        <div className="max-w-xl space-y-3 md:space-y-6">
          
          {/* Profile Avatar & Details */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2 md:mb-4">
            {vendor.avatar && (
              <div className="w-28 h-28 md:w-16 md:h-16 rounded-full border-4 border-white dark:border-[#0A0A0A] md:border-2 md:border-[#C69C6D] shadow-md overflow-hidden bg-white dark:bg-[#0A0A0A] z-20 relative">
                <img 
                  src={vendor.avatar} 
                  alt={`${vendor.name} Profile`} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-col gap-2 mt-1 md:mt-0">
              {/* Mobile Title */}
              <h1 className="text-3xl font-bold text-[#1A1512] dark:text-white leading-tight md:hidden">
                {vendor.name}
              </h1>
              
              <div className="flex items-center gap-3">
                <span className="border border-[#E8DFC9] dark:border-white/10 md:border-[#C69C6D]/30 text-[#1A1512] md:text-[#C69C6D] dark:text-gray-300 px-3 py-1 text-[9px] uppercase font-bold tracking-[0.15em] rounded-full md:rounded-sm bg-gray-100 dark:bg-white/5 md:bg-[#FAF6EE]/50 md:dark:bg-transparent backdrop-blur-sm">
                  {vendor.categoryLabel}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1512] dark:text-white px-3 py-1 border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-full md:rounded-sm bg-white md:bg-white/50 dark:bg-transparent backdrop-blur-sm shadow-sm md:shadow-none">
                  <Star className="w-3 h-3 text-[#C69C6D] fill-[#C69C6D]" />
                  {vendor.rating} <span className="hidden md:inline">({vendor.reviewsCount} Reviews)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Title */}
          <h1 className="hidden md:block text-5xl md:text-6xl lg:text-7xl font-serif text-[#1A1512] dark:text-white leading-[1.1]">
            {vendor.name}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-[13px] md:text-base leading-relaxed max-w-lg pb-1 md:pb-2">
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
          <div className="flex flex-row flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 pt-1 md:pt-2 w-full">
            <button 
              onClick={handleAddClick}
              className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3.5 text-xs uppercase font-bold tracking-widest transition-colors rounded-md md:rounded-sm shadow-sm flex items-center justify-center gap-2 ${isInEventPlan ? 'bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#1A1A1A]' : 'bg-[#1A1512] dark:bg-white text-white dark:text-[#1A1A1A] hover:bg-[#C69C6D] dark:hover:bg-gray-200'}`}
            >
              {isInEventPlan ? <><Check className="w-4 h-4" /> In Plan</> : <><CalendarPlus className="w-4 h-4" /> Add <span className="hidden md:inline">to Event Plan</span></>}
            </button>
            <button 
              onClick={handleFavoriteClick}
              className={`flex-none md:flex-none p-2.5 md:p-3.5 flex items-center justify-center transition-colors rounded-md md:rounded-sm border ${isFavorite ? "border-red-500 text-red-500 bg-red-50 dark:bg-red-900/20" : "border-[#E8DFC9] dark:border-[#C9A84C]/30 text-gray-500 dark:text-gray-300 hover:border-[#C69C6D] hover:text-[#C69C6D]"} bg-gray-100 md:bg-white dark:bg-white/5 md:dark:bg-transparent shadow-sm`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
            <button 
              onClick={() => router.push("/book")}
              className="flex-1 md:flex-none bg-gray-100 md:bg-transparent border border-[#E8DFC9] dark:border-white/10 md:dark:border-[#C9A84C]/30 text-[#1A1512] dark:text-white px-4 md:px-8 py-2.5 md:py-3.5 text-[10px] md:text-xs uppercase font-bold tracking-widest hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors rounded-md md:rounded-sm shadow-sm whitespace-nowrap"
            >
              Return <span className="hidden md:inline">to Booking</span>
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
      
      {/* Vendor Favorite Confirmation Modal */}
      {favoriteModalOpen && pendingFavoriteVendor && (
        <VendorFavoriteModal
          isOpen={favoriteModalOpen}
          onClose={() => {
            setFavoriteModalOpen(false);
            setPendingFavoriteVendor(null);
          }}
          onConfirm={confirmFavorite}
          vendorName={pendingFavoriteVendor.name}
          isRemoving={pendingFavoriteVendor.isRemoving}
        />
      )}
    </div>
  );
}
