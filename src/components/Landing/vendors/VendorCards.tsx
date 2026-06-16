import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Award, Info, ArrowRight, Heart, ShoppingCart } from "lucide-react";
import { Vendor } from "./types";
import { useVendorCartStore } from "@/store/vendorCartStore";

interface VendorCardsProps {
  filteredVendors: Vendor[];
  onClearFilters: () => void;
}

export default function VendorCards({
  filteredVendors,
  onClearFilters
}: VendorCardsProps) {
  const router = useRouter();
  const { cartVendors, favoriteVendors, toggleCartVendor, toggleFavoriteVendor } = useVendorCartStore();
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      {filteredVendors.length === 0 ? (
        <div className="bg-white border border-[#D4C9A8] py-16 px-6 text-center space-y-4 rounded-sm shadow-md section-reveal">
          <Info className="w-12 h-12 mx-auto text-[#C9A84C]" />
          <h3 className="text-xl font-serif text-[#2C1E14]">No Partners Found</h3>
          <p className="max-w-md mx-auto text-gray-500 text-sm">
            We couldn&apos;t find any partners matching your current combination of keywords, filters, or tiers. Try clearing your search query or selecting &quot;All Ratings&quot;.
          </p>
          <button 
            onClick={onClearFilters}
            className="btn-interactive bg-[#2C1E14] text-white px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#C9A84C] hover:text-[#2C1E14] transition-colors rounded-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor, index) => {
            const inCart = cartVendors?.includes(vendor.id) || false;
            const isFavorite = favoriteVendors?.includes(vendor.id) || false;
            
            return (
              <div 
                key={vendor.id} 
              className={`bg-white border border-[#D4C9A8] flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-300 hover-lift hover-glow rounded-sm overflow-hidden group card-entrance stagger-${index + 1}`}
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
                <span className="absolute top-4 left-4 bg-[#2C1E14]/85 text-[#C9A84C] text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 border border-[#C9A84C]/30 shadow-md">
                  {vendor.categoryLabel}
                </span>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button 
                    onClick={() => toggleFavoriteVendor(vendor.id)} 
                    className={`p-2 rounded-full shadow-md transition-colors btn-interactive ${isFavorite ? 'bg-[#C9A84C] text-white' : 'bg-white/95 text-gray-400 hover:text-[#C9A84C]'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                  </button>
                  <button 
                    onClick={() => toggleCartVendor(vendor.id)} 
                    className={`p-2 rounded-full shadow-md transition-colors btn-interactive ${inCart ? 'bg-[#C9A84C] text-white' : 'bg-white/95 text-gray-400 hover:text-[#C9A84C]'}`}
                  >
                    <ShoppingCart className={`w-4 h-4 ${inCart ? 'fill-white' : ''}`} />
                  </button>
                </div>
                
                {/* Rating Tag */}
                <div className="absolute bottom-4 right-4 bg-white/95 text-[#2C1E14] px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold shadow-md rounded-sm">
                  <Star className="w-3.5 h-3.5 text-[#C9A84C] fill-[#C9A84C]" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              {/* Card Content Description Block */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#A67C52] font-semibold">
                    <span>{vendor.priceLevelLabel}</span>
                    <span className="font-extrabold text-[#8A6542]">{vendor.startingPrice} starting</span>
                  </div>

                  <h3 className="text-xl font-serif text-[#2C1E14] leading-tight">
                    {vendor.name}
                  </h3>

                  <p className="text-xs text-gray-500 font-light line-clamp-3 leading-relaxed">
                    {vendor.description}
                  </p>
                </div>

                {/* Specialty Tags */}
                <div className="pt-4 flex flex-wrap gap-1.5 border-t border-[#F0E6D0]">
                  {vendor.specialties.slice(0, 3).map((spec, i) => (
                    <span 
                      key={i} 
                      className="bg-[#F0E6D0]/50 text-[#A67C52] text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 border border-[#D4C9A8]"
                    >
                      {spec}
                    </span>
                  ))}
                  {vendor.specialties.length > 3 && (
                    <span className="bg-[#F0E6D0]/50 text-gray-400 text-[9px] uppercase tracking-wider px-1.5 py-1">
                      +{vendor.specialties.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Trigger Button */}
              <div className="px-6 pb-6 pt-2 bg-white">
                <button 
                  onClick={() => router.push(`/customer/vendorProfile/${vendor.id}`)}
                  className="btn-interactive w-full text-center border border-[#2C1E14] text-[#2C1E14] py-2.5 hover:bg-[#2C1E14] hover:text-[#C9A84C] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 group-hover:border-[#C9A84C]"
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
    </section>
  );
}
