"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, ChevronUp, X, Sparkles } from "lucide-react";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useBookingFormStore } from "@/store/bookingFormStore";
import { useToastStore } from "@/store/toastStore";
import { Vendor } from "@/components/landing/vendors/types";

export default function FloatingEventCart() {
  const router = useRouter();
  const { vendors: cartVendors } = useVendorCartStore();
  const { vendors: globalVendors, fetchVendors } = useVendorStore();
  const { setStep } = useBookingFormStore();
  const { addToast } = useToastStore();
  
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Find detailed vendor info based on cart IDs
  const getVendorDetails = (id: string | null): Vendor | null => {
    if (!id || id === "none" || id === "custom_preference") return null;
    return globalVendors.find(v => v.id === id) || null;
  };

  const selectedVendorsList = [
    { type: "Decorator", vendor: getVendorDetails(cartVendors.decorator) },
    { type: "DJ", vendor: getVendorDetails(cartVendors.dj) },
    { type: "Videographer", vendor: getVendorDetails(cartVendors.videographer) }
  ].filter(v => v.vendor !== null);

  const vendorCount = selectedVendorsList.length;

  const pathname = usePathname();

  // If nothing is selected, don't render the FAB
  if (vendorCount === 0) return null;

  // Only show on vendor related pages
  if (!pathname.startsWith("/customer/vendors") && !pathname.startsWith("/customer/vendorProfile")) {
    return null;
  }

  const handleProceed = () => {
    setIsOpen(false);
    addToast({ message: "Selected vendors added to the bookings!", type: "success" });
    setStep(1); // Explicitly reset to step 1
    router.push("/book");
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
                <div key={idx} className="flex items-center gap-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] p-2 border border-[#E8DFC9] dark:border-gray-800 rounded-sm">
                  <div className="w-10 h-10 shrink-0 overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800">
                    <img src={item.vendor!.image} alt={item.vendor!.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs uppercase text-[#C9A84C] tracking-widest font-bold">{item.type}</span>
                    <span className="text-sm font-medium text-[#2C1E14] dark:text-gray-200 truncate">{item.vendor!.name}</span>
                  </div>
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#1A1512] dark:bg-white text-[#C9A84C] dark:text-[#1A1512] rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_30px_rgba(201,168,76,0.3)] flex items-center justify-center relative border border-[#C9A84C]/50 transition-colors z-50 group hover:bg-[#2C1E14] dark:hover:bg-gray-100"
      >
        <CalendarCheck className="w-6 h-6" />
        {vendorCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A84C] text-white dark:text-[#1A1A1A] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#1A1A1A]">
            {vendorCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}
