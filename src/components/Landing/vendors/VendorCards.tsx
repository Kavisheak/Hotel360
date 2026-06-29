import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Award, Info, ArrowRight, Heart, CalendarPlus } from "lucide-react";
import { Vendor } from "./types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useState } from "react";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";

interface VendorCardsProps {
  filteredVendors: Vendor[];
  onClearFilters: () => void;
  isGuest?: boolean;
}

export default function VendorCards({
  filteredVendors,
  onClearFilters,
  isGuest = true
}: VendorCardsProps) {
  const router = useRouter();
  const { favoriteVendors, toggleFavoriteVendor, toggleVendorInEventPlan, isVendorInEventPlan } = useVendorCartStore();
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");

  const handleRestrictedAction = (message: string, action: () => void) => {
    if (isGuest) {
      setLoginModalMessage(message);
      setLoginModalOpen(true);
    } else {
      action();
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {filteredVendors.length === 0 ? (
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#382B14] dark:via-[#1A1610] dark:to-[#0D0B08] border border-[#D4C9A8] dark:border-[#C9A84C]/40 py-16 px-6 text-center space-y-4 rounded-sm shadow-xl dark:shadow-[#C9A84C]/5 section-reveal">
          <Info className="w-12 h-12 mx-auto text-[#C9A84C]" />
          <h3 className="text-xl font-serif text-[#2C1E14] dark:text-white">No Partners Found</h3>
          <p className="max-w-md mx-auto text-gray-600 dark:text-gray-500 text-sm">
            We couldn&apos;t find any partners matching your current combination of keywords, filters, or tiers. Try clearing your search query or selecting &quot;All Ratings&quot;.
          </p>
          <button 
            onClick={onClearFilters}
            className="btn-interactive bg-[#C9A84C] text-[#2C1E14] dark:text-[#1A1A1A] px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B89238] dark:hover:bg-white transition-colors rounded-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor, index) => {
            const isFavorite = favoriteVendors?.includes(vendor.id) || false;
            const isInEventPlan = isVendorInEventPlan(vendor.id, vendor.category as any);
            
            return (
              <div 
                key={vendor.id} 
              className={`bg-white dark:bg-[#111111] border border-[#D4C9A8]/30 dark:border-[#C9A84C]/50 flex flex-col justify-between shadow-xl dark:shadow-lg dark:shadow-[#C9A84C]/5 hover:shadow-2xl hover:shadow-[#D4AF37]/20 dark:hover:shadow-[#C9A84C]/30 transition-all duration-300 hover-lift hover-glow rounded-sm overflow-hidden group card-entrance stagger-${index + 1}`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E14]/50 via-transparent to-transparent pointer-events-none" />
                
                {/* Category Label */}
                <span className="absolute top-4 left-4 bg-[#2C1E14] text-white dark:text-[#C9A84C] text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 border border-[#2C1E14] dark:border-[#C9A84C]/30 shadow-md">
                  {vendor.categoryLabel}
                </span>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button 
                    onClick={() => handleRestrictedAction("Please log in to add vendors to your event plan.", () => toggleVendorInEventPlan(vendor.id, vendor.category as any))} 
                    className={`p-2 rounded-full shadow-md transition-colors btn-interactive ${isInEventPlan ? 'bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#1A1A1A]' : 'bg-white/95 dark:bg-[#1A1A1A]/95 text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#C9A84C]'}`}
                    title={isInEventPlan ? "Remove from Event Plan" : "Add to Event Plan"}
                  >
                    <CalendarPlus className={`w-4 h-4 ${isInEventPlan ? 'text-white dark:text-[#1A1A1A]' : ''}`} />
                  </button>
                  <button 
                    onClick={() => handleRestrictedAction("Please log in to add vendors to your favorites list.", () => toggleFavoriteVendor(vendor.id))} 
                    className={`p-2 rounded-full shadow-md transition-colors btn-interactive ${isFavorite ? 'bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#1A1A1A]' : 'bg-white/95 dark:bg-[#1A1A1A]/95 text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#C9A84C]'}`}
                    title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white dark:fill-[#1A1A1A]' : ''}`} />
                  </button>
                </div>
                
                {/* Rating Tag */}
                <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-[#1A1A1A]/95 text-[#2C1E14] dark:text-white px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold shadow-md rounded-sm">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] dark:text-[#C9A84C] fill-[#D4AF37] dark:fill-[#C9A84C]" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              {/* Card Content Description Block */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-transparent">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#D4AF37] dark:text-[#C9A84C] font-semibold">
                    <span>{vendor.priceLevelLabel}</span>
                    <span className="font-extrabold text-[#D4AF37] dark:text-[#C9A84C]">{vendor.startingPrice} starting</span>
                  </div>

                  <h3 className="text-xl font-serif text-[#2C1E14] dark:text-white leading-tight">
                    {vendor.name}
                  </h3>

                  <p className="text-xs text-gray-700 dark:text-gray-400 font-light line-clamp-3 leading-relaxed">
                    {vendor.description}
                  </p>
                </div>

                {/* Specialty Tags */}
                <div className="pt-4 flex flex-wrap gap-1.5 border-t border-[#C9A84C]/40 dark:border-[#C9A84C]/20">
                  {vendor.specialties.slice(0, 3).map((spec, i) => (
                    <span 
                      key={i} 
                      className="bg-white dark:bg-transparent text-gray-600 dark:text-[#C9A84C] text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 border border-[#D4C9A8]/50 dark:border-[#C9A84C]/50"
                    >
                      {spec}
                    </span>
                  ))}
                  {vendor.specialties.length > 3 && (
                    <span className="bg-white/50 dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 text-[9px] uppercase tracking-wider px-1.5 py-1">
                      +{vendor.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Trigger Button */}
              <div className="px-6 pb-6 pt-2 bg-transparent">
                <button 
                  onClick={() => handleRestrictedAction("Please log in to view detailed vendor profiles and packages.", () => router.push(`/customer/vendorProfile/${vendor.id}`))}
                  className="btn-interactive w-full text-center border border-[#D4C9A8] dark:border-[#C9A84C] text-[#805D3A] dark:text-[#C9A84C] py-2.5 hover:bg-[#D4AF37] dark:hover:bg-[#C9A84C] hover:border-[#D4AF37] hover:text-white dark:hover:text-[#1A1A1A] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 group-hover:border-[#D4AF37] dark:group-hover:border-[#C9A84C]"
                >
                  View Details & Packages
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              </div>
            );
          })}
        </div>
      )}

      <LoginRequiredModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        message={loginModalMessage} 
      />
    </section>
  );
}
