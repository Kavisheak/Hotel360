"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, DollarSign, Star, Check, Sparkles } from 'lucide-react';
import { vendorAPI, customerBookingAPI } from '@/lib/api';

interface ReplacementVendorModalProps {
  isOpen: boolean;
  bookingId: string;
  category: string;
  creditAmount: number;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const ReplacementVendorModal: React.FC<ReplacementVendorModalProps> = ({
  isOpen,
  bookingId,
  category,
  creditAmount,
  onClose,
  onSuccess,
}) => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableVendors();
    }
  }, [isOpen, category]);

  const fetchAvailableVendors = async () => {
    setIsLoading(true);
    try {
      const res = await vendorAPI.getAllVendors();
      if (res.ok && res.data?.data) {
        // Filter vendors matching this category
        const categoryPluralMap: Record<string, string> = {
          decorator: "decorators",
          dj: "djs",
          videographer: "videographers",
        };
        const targetCategory = categoryPluralMap[category] || category;
        const filtered = res.data.data.filter((v: any) => v.category === targetCategory || v.category === category);
        setVendors(filtered.length > 0 ? filtered : res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch replacement vendors:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVendor = async (vId: string) => {
    setIsSubmitting(true);
    try {
      const res = await customerBookingAPI.replaceVendorWithCredit(bookingId, {
        vendorCategory: category,
        newVendorId: vId,
      });

      if (res.ok) {
        onSuccess(res.data?.message || "Replacement vendor assigned successfully.");
        onClose();
      } else {
        alert(res.data?.message || "Failed to assign replacement vendor.");
      }
    } catch (e: any) {
      alert(e.message || "Server error while assigning replacement vendor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto font-sans">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E0D8C3] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#7C6A2E] uppercase tracking-widest bg-[#FEF9E8] px-2 py-0.5 rounded border border-[#D4B553]">
                LKR {creditAmount.toLocaleString()} Credit Active
              </span>
              <span className="text-xs font-serif italic text-gray-500">• {category.toUpperCase()} REPLACEMENT</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mt-1">
              Select Replacement {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-[#E0D8C3]">
            Your 30% advance credit of <strong className="text-emerald-700">LKR {creditAmount.toLocaleString()}</strong> will be applied automatically toward your new vendor choice. The vendor will have a 24-hour window to respond.
          </p>

          {isLoading ? (
            <div className="py-12 text-center text-sm font-serif italic text-gray-400">
              Loading available replacement vendors...
            </div>
          ) : vendors.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500 font-serif italic">
              No matching vendors found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((vendor) => {
                const priceNum = parseInt((vendor.startingPrice || "100000").replace(/[^0-9]/g, ""), 10) || 100000;
                const advanceReq = Math.round(priceNum * 0.3);
                const advanceDelta = advanceReq - creditAmount;

                const isCovered = advanceDelta <= 0;

                return (
                  <div
                    key={vendor._id || vendor.vendorId}
                    className="border border-[#E0D8C3] bg-white rounded-lg p-4 shadow-xs hover:border-[#B08D2C] hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-serif font-bold text-gray-900 text-base">{vendor.shopName || vendor.name}</h4>
                        <div className="flex items-center text-amber-500 text-xs font-bold shrink-0">
                          <Star size={13} className="fill-amber-400 text-amber-400 mr-1" />
                          {vendor.rating || "5.0"}
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{vendor.description || "Premium service provider."}</p>

                      <div className="text-xs text-gray-700 space-y-1 mb-3 bg-[#FAF6EE] p-2.5 rounded border border-[#E0D8C3]">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Service Price:</span>
                          <span className="font-bold">LKR {priceNum.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">30% Advance Required:</span>
                          <span className="font-bold font-mono">LKR {advanceReq.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F2EADA] flex flex-col gap-2">
                      {/* Credit Coverage Badge */}
                      {isCovered ? (
                        <div className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider text-center">
                          ✓ Covered by Credit (LKR {creditAmount.toLocaleString()})
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-wider text-center">
                          + LKR {advanceDelta.toLocaleString()} Additional Delta
                        </div>
                      )}

                      <button
                        onClick={() => handleSelectVendor(vendor.vendorId || vendor._id)}
                        disabled={isSubmitting}
                        className="w-full py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? "Assigning..." : "Select Replacement"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E0D8C3] bg-white flex justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 border border-[#E0D8C3] text-gray-600 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplacementVendorModal;
