"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, HelpCircle, Loader2, X, ExternalLink } from "lucide-react";
import { customerBookingAPI } from "@/lib/api";
import PolicyModal from "../landing/book/PolicyModal";

interface RefundRequestModalProps {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RefundRequestModal({ booking, onClose, onSuccess }: RefundRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  // Refund tier estimate calculations in frontend
  // Use EASCCA booking timezone (Asia/Colombo) for calendar day calculation
  const getColomboDateStr = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  
  const today = new Date();
  const eventDate = new Date(booking.date);
  
  const todayStr = getColomboDateStr(today);
  const eventDateStr = getColomboDateStr(eventDate);
  
  const dToday = new Date(todayStr + 'T00:00:00Z');
  const dEvent = new Date(eventDateStr + 'T00:00:00Z');
  
  const diffTime = dEvent.getTime() - dToday.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let tierLabel = "";
  let penaltyPct = 0;

  if (booking.status === "Confirmed") {
    if (diffDays >= 30) {
      tierLabel = "Tier 1 (30+ days before event)";
      penaltyPct = 0;
    } else if (diffDays >= 15) {
      tierLabel = "Tier 2 (15-29 days before event)";
      penaltyPct = 10;
    } else if (diffDays >= 7) {
      tierLabel = "Tier 3 (7-14 days before event)";
      penaltyPct = 25;
    } else if (diffDays >= 3) {
      tierLabel = "Tier 4 (3-6 days before event)";
      penaltyPct = 50;
    } else {
      tierLabel = "Tier 5 (0-2 days before event)";
      penaltyPct = 100;
    }
  } else {
    tierLabel = "Pending Confirmation";
    penaltyPct = 0;
  }
  const handleCancel = async () => {
    try {
      setIsSubmitting(true);
      const { ok, data } = await customerBookingAPI.cancelBooking(booking._id || booking.id);
      if (ok) {
        setSuccessMessage(data.message || "Booking cancelled successfully.");
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

  const hasPaid = (booking.depositAmount || 0) > 0;

  if (successMessage) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-zinc-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-center p-8">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-3">Cancellation Successful</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">{successMessage}</p>
          <button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="w-full py-3 bg-[#C9A84C] hover:bg-[#B58B5C] text-[#2C1E14] rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px]">Cancellation Analysis</h4>
              <button 
                onClick={() => setShowPolicyModal(true)}
                className="text-[#C9A84C] hover:text-[#A6955C] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                View Full Policy <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Proximity to Event:</span>
              <span className="font-semibold text-gray-800 dark:text-white">{diffDays} days away</span>
            </div>
            
            {hasPaid ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Tier:</span>
                  <span className="font-semibold text-[#C9A84C]">{tierLabel}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-200 dark:border-zinc-800 pt-2">
                  <span className="text-gray-500">Platform Cancellation Fee:</span>
                  <span className="font-bold text-gray-800 dark:text-white">{penaltyPct}% of item total cost</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Refund Eligibility:</span>
                  <span className="font-bold text-gray-800 dark:text-white">Amount paid minus cancellation fee</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between border-t border-dashed border-gray-200 dark:border-zinc-800 pt-2">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-bold text-gray-800 dark:text-white">No payments made yet</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed">
            Note: Processing this request will instantly release the hall reservation and notify all assigned service partners. Payment allocations for non-refundable components will be distributed accordingly.
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
      
      <PolicyModal 
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        policyType="cancellation"
        cancellationTier="strict"
      />
    </div>
  );

  return createPortal(modalContent, document.body);
}
