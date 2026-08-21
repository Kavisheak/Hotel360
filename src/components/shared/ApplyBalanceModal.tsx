"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { customerBookingAPI } from "@/lib/api";

interface ApplyBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceKey: string;
  amount: number;
  creditId?: string;
}

export default function ApplyBalanceModal({
  isOpen,
  onClose,
  bookingId,
  serviceKey,
  amount,
  creditId
}: ApplyBalanceModalProps) {
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
      if (creditId) {
        // New workflow using BookingCredit
        const res = await customerBookingAPI.applyCreditToBalance(bookingId, creditId);
        if (res.ok) {
          alert(`LKR ${amount.toLocaleString()} credit applied to your balance successfully!`);
          window.location.reload();
        } else {
          alert(res.data?.message || "Failed to apply credit.");
        }
      } else {
        // Fallback workflow using legacy removeVendor with action flag
        await removeVendor(bookingId, serviceKey, 'apply_to_balance');
        await fetchUserBookings();
        alert(`LKR ${amount.toLocaleString()} credit applied to your balance successfully!`);
        window.location.reload();
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to apply credit to balance.");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111111] border border-emerald-200 dark:border-zinc-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">
              Apply to Remaining Balance
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-emerald-100 rounded transition-colors text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-light">
            Are you sure you want to apply your <strong className="text-gray-900 dark:text-white">LKR {amount.toLocaleString()}</strong> advance as a credit towards your remaining balance?
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-800 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <p>
              By proceeding, this vendor category (<strong className="capitalize">{serviceKey}</strong>) will be removed from your itinerary and you will not get a replacement.
            </p>
            <p>
              Your total remaining balance for this booking will immediately be reduced by LKR {amount.toLocaleString()}.
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
            className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Confirm & Apply Credit"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
