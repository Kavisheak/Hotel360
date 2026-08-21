"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, ChevronUp, X, Sparkles, Trash2, ShoppingBag, ClipboardList } from "lucide-react";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useBookingFormStore } from "@/store/bookingFormStore";
import { Vendor } from "@/components/landing/vendors/types";

export default function FloatingEventCart() {
  const router = useRouter();
  const { vendors: cartVendors, toggleVendorInEventPlan } = useVendorCartStore();
  const { vendors: globalVendors, fetchVendors } = useVendorStore();
  const { setStep } = useBookingFormStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [prevVendorCount, setPrevVendorCount] = useState(0);
  
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Find detailed vendor info based on cart IDs
  const getVendorDetails = (id: string | null): Vendor | null => {
    if (!id || id === "none" || id === "custom_preference") return null;
    return globalVendors.find(v => v.id === id) || null;
  };

  const selectedVendorsList = [
    { type: "Package", vendor: (cartVendors as any).decoratorPackage && (cartVendors as any).decoratorPackage !== "none" ? { id: "pkg", name: (cartVendors as any).decoratorPackage + " Package", image: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?auto=format&fit=crop&q=80&w=200", category: "package" } : null },
    { type: "Decorator", vendor: getVendorDetails(cartVendors.decorator) },
    { type: "DJ", vendor: getVendorDetails(cartVendors.dj) },
    { type: "Videographer", vendor: getVendorDetails(cartVendors.videographer) },
    { type: "Photographer", vendor: getVendorDetails(cartVendors.photographer) },
    { type: "Cake", vendor: getVendorDetails(cartVendors.cake) },
    { type: "Florist", vendor: getVendorDetails(cartVendors.florist) }
  ].filter(v => v.vendor !== null);

  const vendorCount = selectedVendorsList.length;

  useEffect(() => {
    if (vendorCount > prevVendorCount) {
      setIsOpen(true);
      // Auto close after 4 seconds
      const timer = setTimeout(() => setIsOpen(false), 4000);
      return () => clearTimeout(timer);
    }
    setPrevVendorCount(vendorCount);
  }, [vendorCount, prevVendorCount]);

  const pathname = usePathname();

  // If nothing is selected, don't render the FAB
  if (vendorCount === 0) return null;

  // Only show on vendor and package related pages
  if (!pathname.startsWith("/customer/vendors") && !pathname.startsWith("/customer/vendorProfile") && !pathname.startsWith("/customer/packages")) {
    return null;
  }

  const handleProceed = () => {
    setIsOpen(false);
    setStep(1); // Explicitly reset to step 1
    sessionStorage.setItem("importFromCart", "true");
    // Pass fromCart parameter to trigger beautiful toast on the booking page
    router.push("/book?fromCart=true");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[320px] bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_rgba(201,168,76,0.1)] rounded-sm overflow-hidden"
          >
            <div className="bg-[#FAF6EE] dark:bg-[#2A2312] p-4 border-b border-[#E8DFC9] dark:border-[#C9A84C]/20 flex items-center justify-between">
              <h3 className="font-serif text-[#2C1E14] dark:text-[#C9A84C] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A84C]" /> Your Event Plan
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[40vh] overflow-y-auto">
              {selectedVendorsList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] p-2 border border-[#E8DFC9] dark:border-gray-800 rounded-sm relative group">
                  <div className="w-10 h-10 shrink-0 overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800">
                    <img src={item.vendor!.image} alt={item.vendor!.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col overflow-hidden flex-1 pr-6">
                    <span className="text-xs uppercase text-[#C9A84C] tracking-widest font-bold">{item.type}</span>
                    <span className="text-sm font-medium text-[#2C1E14] dark:text-gray-200 truncate">{item.vendor!.name}</span>
                  </div>
                  <button
                    onClick={() => toggleVendorInEventPlan(item.vendor!.id, item.vendor!.category as any)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from Event Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#E8DFC9] dark:border-[#C9A84C]/20 bg-white dark:bg-[#1A1A1A]">
              <button 
                onClick={handleProceed}
                className="w-full py-3 bg-[#C9A84C] hover:bg-[#B89238] text-white dark:text-[#1A1A1A] text-xs uppercase font-bold tracking-widest transition-colors rounded-sm shadow-md flex items-center justify-center gap-2"
              >
                Proceed to Booking <CalendarCheck className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mt-4">
        <motion.button
          id="floating-cart-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-white/90 dark:bg-black/90 backdrop-blur-md text-[#C9A84C] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex items-center justify-center relative border border-[#C9A84C]/30 transition-all z-50 group hover:border-[#C9A84C] hover:shadow-[0_15px_40px_rgba(201,168,76,0.3)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
          <ShoppingBag className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 relative z-10" />
          <Sparkles className="w-3.5 h-3.5 absolute top-3 right-3 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-300 z-10" />
        </motion.button>
        
        <AnimatePresence>
          {vendorCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full z-[60] shadow-md border-2 border-white dark:border-[#1A1A1A]"
            >
              {vendorCount}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
