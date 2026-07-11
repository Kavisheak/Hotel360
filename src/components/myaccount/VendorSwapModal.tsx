"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { Vendor } from "@/components/landing/vendors/types";
import { useVendorStore } from "@/store/vendorStore";
interface VendorSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceCategory: "decorator" | "dj" | "videographer";
  currentVendorId?: string;
}

export default function VendorSwapModal({ isOpen, onClose, bookingId, serviceCategory, currentVendorId }: VendorSwapModalProps) {
  const { swapVendor } = useBookingStore();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { vendors, fetchVendors } = useVendorStore();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedVendor(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  // Map service string to VENDORS_DATA category
  const categoryMap: Record<string, string> = {
    decorator: "decorators",
    dj: "djs",
    videographer: "others"
  };
  
  const mappedCategory = categoryMap[serviceCategory] || "decorators";
  const availableVendors = vendors.filter(v => v.category === mappedCategory && v.id !== currentVendorId && v.userId !== currentVendorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;
    
    setIsSubmitting(true);
    await swapVendor(bookingId, serviceCategory, selectedVendor);
    setIsSubmitting(false);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-[#1A1512]/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1A1A1A] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-[#E8DFC9] dark:border-gray-800 animate-slideUp z-10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#E8DFC9] dark:border-gray-800 bg-[#FDFBF7] dark:bg-[#111111] flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white capitalize">Select {serviceCategory}</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C69C6D] font-bold mt-1.5">Booking #{bookingId.split('-')[1] || bookingId}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-[#1A1512] dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
 
          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-serif italic">
                Choose a vendor from our curated list below. Any price differences will be reflected in your booking total.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableVendors.map(vendor => (
                  <div 
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor.id)}
                    className={`bg-white dark:bg-[#1A1A1A] border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 flex flex-col h-full ${selectedVendor === vendor.id ? 'border-[#C69C6D] ring-2 ring-[#C69C6D]/20 shadow-md' : 'border-[#E0D8C3] dark:border-gray-800 hover:border-[#C69C6D] hover:shadow-sm'}`}
                  >
                    <div className="h-48 overflow-hidden relative shrink-0">
                      <img src={vendor.image} alt={vendor.name} className={`w-full h-full object-cover transition-transform duration-500 ${selectedVendor === vendor.id ? 'scale-105' : 'hover:scale-105'}`} />
                      {selectedVendor === vendor.id && (
                        <div className="absolute top-3 right-3 bg-[#C69C6D] text-white p-1.5 rounded-full shadow-sm">
                          <Check size={16} strokeWidth={3} />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-widest px-2 py-1 rounded">
                        {vendor.startingPrice}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[10px] font-bold text-[#C69C6D] tracking-widest uppercase mb-1">{vendor.categoryLabel}</p>
                      <h4 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">{vendor.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{vendor.description}</p>
                      <div className="mt-auto flex flex-wrap gap-1">
                        {vendor.specialties.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="bg-[#FAF6EE] dark:bg-gray-800 border border-[#E8DFC9] dark:border-gray-700 text-gray-600 dark:text-gray-300 text-[9px] px-2 py-1 rounded-sm uppercase tracking-wider">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-[#111111] flex items-center justify-end gap-4 border-t border-[#E8DFC9] dark:border-gray-800 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedVendor || isSubmitting}
                className="px-8 py-3.5 bg-[#C69C6D] text-white text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[#B58A59] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center min-w-[160px]"
              >
                {isSubmitting ? "Confirming..." : "Confirm Replacement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
