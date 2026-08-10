"use client";

import React, { useState } from "react";
import { AlertTriangle, HelpCircle, Loader2, X } from "lucide-react";
import { customerBookingAPI } from "@/lib/api";

interface RefundRequestModalProps {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RefundRequestModal({ booking, onClose, onSuccess }: RefundRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  // Refund tier estimate calculations in frontend
  const eventDate = new Date(booking.date);
  const diffTime = eventDate.getTime() - Date.now();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let tierLabel = "";
  let hallRefundPct = 100;
  let vendorRefundPct = 100;

  if (diffDays > 30) {
    tierLabel = "Tier 1 (> 30 days before event)";
    hallRefundPct = 50;
    vendorRefundPct = 50;
  } else {
    tierLabel = "Tier 2 (<= 30 days before event)";
    hallRefundPct = 0;
    vendorRefundPct = 0;
  }

  const handleCancel = async () => {
    try {
      setIsSubmitting(true);
      const { ok, data } = await customerBookingAPI.cancelBooking(booking._id || booking.id);
      if (ok) {
        alert(data.message || "Booking cancelled and refund processed.");
        onSuccess();
        onClose();
      } else {
        alert(data.message || "Failed to cancel booking.");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred while processing cancellation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111111] border border-red-200 dark:border-zinc-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-4 bg-red-50 dark:bg-red-950/20 border-b border-red-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-serif font-bold text-base">Cancel Event & Request Refund</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-red-100 rounded transition-colors text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-light">
            You are requesting a cancellation for booking <strong className="text-gray-800 dark:text-white">{booking.bookingRef}</strong> scheduled on {new Date(booking.date).toLocaleDateString()}.
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-100 dark:border-zinc-850 space-y-2 text-xs">
            <h4 className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px]">Cancellation Refund Tier Analysis</h4>
            <div className="flex justify-between">
              <span className="text-gray-500">Proximity to Event:</span>
              <span className="font-semibold text-gray-800 dark:text-white">{diffDays} days away</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Tier:</span>
              <span className="font-semibold text-[#C9A84C]">{tierLabel}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-gray-200 dark:border-zinc-800 pt-2">
              <span className="text-gray-500">Hall Advance Refund %:</span>
              <span className="font-bold text-gray-800 dark:text-white">{hallRefundPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vendor Advance Refund %:</span>
              <span className="font-bold text-gray-800 dark:text-white">{vendorRefundPct}%</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            Note: Processing this request will instantly release the hall reservation and notify all assigned service partners. Payouts for non-refundable components will be split accordingly.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
          >
            Keep Reservation
          </button>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Cancellation"}
          </button>
        </div>

      </div>
    </div>
  );
}
