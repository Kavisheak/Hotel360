import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Vendor } from "./types";
import { useVendorCartStore } from "@/store/vendorCartStore";
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
  const { favoriteVendors, toggleFavoriteVendor } = useVendorCartStore();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState("");

  const [compareList, setCompareList] = useState<string[]>([]);

  const handleRestrictedAction = (message: string, action: () => void) => {
    if (isGuest) {
      setLoginModalMessage(message);
      setLoginModalOpen(true);
    } else {
      action();
    }
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Compare Floating Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2C1E14]/95 dark:bg-[#111111]/95 border border-[#C9A84C]/50 px-6 py-4 rounded-sm shadow-2xl backdrop-blur-md flex items-center justify-between gap-8 max-w-2xl w-full animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">Compare Partners</span>
            <span className="text-xs text-gray-300 font-light mt-0.5">{compareList.length} of 3 selected</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCompareList([])}
              className="text-xs text-gray-400 hover:text-white uppercase tracking-wider font-bold transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={() => {
                const ids = compareList.join(",");
                router.push(`/customer/compareVendors?ids=${ids}`);
              }}
              className="bg-[#C9A84C] hover:bg-white text-black font-bold uppercase tracking-widest text-[10px] px-6 py-2.5 transition-colors rounded-sm shadow-md"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {filteredVendors.length === 0 ? (
        <div className="bg-white dark:bg-gradient-to-br dark:from-[#241F17] dark:via-[#13110E] dark:to-[#0D0B08] border border-[#D4C9A8] dark:border-[#C9A84C]/30 py-16 px-6 text-center space-y-4 rounded-sm shadow-xl">
          <HelpCircle className="w-12 h-12 mx-auto text-[#C9A84C]" />
          <h3 className="text-xl font-serif text-[#2C1E14] dark:text-white">No Artworks Found</h3>
          <p className="max-w-md mx-auto text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
            We couldn&apos;t find any portfolio collections matching your search criteria. Try modifying your filters or selecting &quot;All Styles&quot;.
          </p>
          <button 
            onClick={onClearFilters}
            className="bg-[#C9A84C] text-black px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-white transition-colors rounded-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVendors.map((vendor, index) => {
            const isFavorite = favoriteVendors?.includes(vendor.id) || false;
            const isCompareSelected = compareList.includes(vendor.id);
            
            return (
              <div 
                key={vendor.id} 
                className="bg-white dark:bg-[#111111] border border-[#D4C9A8]/30 dark:border-[#C9A84C]/20 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden group relative"
              >
                {/* Main Immersive Portfolio Cover Image */}
                <div className="relative h-72 w-full overflow-hidden bg-gray-100 cursor-pointer" onClick={() => handleRestrictedAction("Please log in to explore this portfolio.", () => router.push(`/customer/vendorProfile/${vendor.id}`))}>
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Category Label */}
                  <span className="absolute top-4 left-4 bg-[#2C1E14]/90 backdrop-blur-sm text-[#C9A84C] text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 border border-[#C9A84C]/30 shadow-md">
                    {vendor.categoryLabel}
                  </span>

                  {/* Badges */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestrictedAction("Please log in to add vendors to your favorites list.", () => toggleFavoriteVendor(vendor.id));
                      }} 
                      className={`p-2 rounded-full shadow-md transition-colors ${isFavorite ? 'bg-[#D4AF37] dark:bg-[#C9A84C] text-white dark:text-[#1A1A1A]' : 'bg-white/90 dark:bg-[#1A1A1A]/90 text-gray-500 hover:text-red-500'}`}
                      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Luxury Partner Status Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />
                        <span className="text-[9px] uppercase tracking-widest text-[#C9A84C] font-semibold">Verified Partner</span>
                      </div>
                      <h3 className="text-xl font-serif text-white tracking-wide leading-tight group-hover:text-[#C9A84C] transition-colors">
                        {vendor.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Sub-Card Details Block */}
                <div className="p-6 bg-white dark:bg-[#111111] space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Tagline */}
                    <p className="text-xs text-gray-700 dark:text-gray-400 font-light italic leading-relaxed text-left border-l border-[#C9A84C] pl-3">
                      {vendor.specialties.join(" • ")}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider font-medium pt-2">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#C9A84C] fill-current" />
                        <strong className="text-gray-700 dark:text-gray-300 font-bold">{vendor.rating}</strong> ({vendor.reviewsCount} Events)
                      </span>
                      <span className="text-[#C9A84C] font-extrabold">{vendor.startingPrice} starting</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex gap-4 items-center justify-between">
                    {/* Compare Button */}
                    <button
                      onClick={() => toggleCompare(vendor.id)}
                      className={`flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold transition-colors ${isCompareSelected ? 'text-[#C9A84C]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isCompareSelected}
                        onChange={() => {}}
                        className="accent-[#C9A84C] h-3 w-3 cursor-pointer"
                      />
                      <span>Compare</span>
                    </button>

                    {/* Explore Portfolio */}
                    <button 
                      onClick={() => handleRestrictedAction("Please log in to view detailed portfolios.", () => router.push(`/customer/vendorProfile/${vendor.id}`))}
                      className="text-[#C9A84C] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 hover:text-[#2C1E14] dark:hover:text-white transition-colors"
                    >
                      Explore Portfolio
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
