"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";

interface RemoveVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceKey: string;
  vendorName: string;
}

export default function RemoveVendorModal({
  isOpen,
  onClose,
  bookingId,
  serviceKey,
  vendorName,
}: RemoveVendorModalProps) {
  const { removeVendor, fetchUserBookings } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await removeVendor(bookingId, serviceKey);
      await fetchUserBookings(); // Sync the global store so UI updates
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to remove vendor and request refund.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111111] border border-red-200 dark:border-zinc-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="px-6 py-4 bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">
              Remove Vendor & Request Refund
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-red-100 rounded transition-colors text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-light">
            Are you sure you want to remove{" "}
            <strong className="text-gray-900 dark:text-white">
              {vendorName}
            </strong>{" "}
            as your {serviceKey}?
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p>
              By proceeding, this vendor will be removed from your booking itinerary.
            </p>
            <p>
              The full advance payment allocated to this vendor will be returned as
              a refund or credited to your account.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Confirm & Request Refund"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
