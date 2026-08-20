"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: "vendor" | "cancellation" | null;
  cancellationTier?: "strict" | "flexible" | "tiered";
}

export default function PolicyModal({
  isOpen,
  onClose,
  policyType,
  cancellationTier = "tiered",
}: PolicyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !policyType) return null;

  const content =
    policyType === "vendor" ? (
      <div className="space-y-6">
        <h3 className="text-xl font-serif text-[#805D3A] dark:text-[#C9A84C]">
          Vendor Request & Substitution Policy
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          When booking through EASCCA, selecting third-party vendors (such as decorators, videographers, and DJs) constitutes a <strong>formal request</strong>. These selections are subject to vendor availability and approval.
        </p>
        <h4 className="font-bold text-[#1A1512] dark:text-white">1. Approval Process</h4>
        <p className="text-gray-600 dark:text-gray-300">
          Once your primary hall booking is confirmed and the advance payment is received, your selected vendors will be notified of your request. Vendors typically respond within 24-48 hours.
        </p>
        <h4 className="font-bold text-[#1A1512] dark:text-white">2. Vendor Acceptance</h4>
        <p className="text-gray-600 dark:text-gray-300">
          If the vendor accepts, they will be officially bound to your event. You will be able to communicate directly with them regarding your special requirements.
        </p>
        <h4 className="font-bold text-[#1A1512] dark:text-white">3. Vendor Declination or Unavailability</h4>
        <p className="text-gray-600 dark:text-gray-300">
          In the event a requested vendor is unavailable or declines the booking, the core hall booking remains active. You are entitled to:
        </p>
        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
          <li><strong>Replace Vendor:</strong> Select an alternative vendor from our curated portfolio. You will only pay or be refunded the difference in the required advance.</li>
          <li><strong>Remove Vendor:</strong> Opt out of the service entirely and receive a <strong>100% refund</strong> of the specific advance allocation for that vendor. No cancellation penalty applies here.</li>
        </ul>
        <h4 className="font-bold text-[#1A1512] dark:text-white mt-4">4. Balance Payment Lock</h4>
        <p className="text-gray-600 dark:text-gray-300">
          The remaining 70% balance for your booking will remain locked until exactly <strong>7 calendar days before the event</strong>. This payment window will only open if the Venue Manager and <strong>all</strong> selected vendors have confirmed their participation.
        </p>
        <p className="text-sm italic text-gray-500 mt-4">
          By proceeding, you acknowledge that EASCCA acts solely as a booking facilitator for third-party vendors and cannot guarantee their availability prior to final confirmation.
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        <h3 className="text-xl font-serif text-[#805D3A] dark:text-[#C9A84C]">
          Platform-Wide Cancellation & Refund Policy
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          EASCCA operates under a unified, time-based cancellation policy that applies equally to <strong>both the venue and all third-party vendors</strong>. Please review the tiers below.
        </p>

        {cancellationTier === "strict" && (
          <>
            <h4 className="font-bold text-[#1A1512] dark:text-white">Manager Rejection</h4>
            <p className="text-gray-600 dark:text-gray-300">
              If the venue manager rejects your booking request for any reason (e.g., scheduling conflict), your booking is immediately cancelled and you will receive a <strong>100% full refund</strong>. No penalties apply.
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white mt-4">After Booking Confirmation</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Once the manager has approved and confirmed your event dates, <strong>all payments become strictly non-refundable</strong>. Cancellations made after confirmation will forfeit the entire advance deposit.
            </p>
          </>
        )}

        {cancellationTier === "flexible" && (
          <>
            <h4 className="font-bold text-[#1A1512] dark:text-white">More than 14 Days Notice</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Cancellations requested at least 14 days prior to the scheduled event date are eligible for a <strong>full refund</strong>, minus a nominal administrative processing fee (if applicable).
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white">Within 14 Days Notice</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Cancellations made within 14 days of the event date will be subject to a <strong>50% partial refund</strong> of the total booking amount. The remaining 50% is retained by the venue to cover lost opportunity costs.
            </p>
          </>
        )}

        {cancellationTier === "tiered" && (
          <>
            <h4 className="font-bold text-[#1A1512] dark:text-white">Manager Rejection (Full Refund)</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              If the venue manager rejects your booking request (e.g. double booking), you will receive a <strong>100% refund</strong>. No cancellation penalties apply.
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white mt-4">Customer Cancellation</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              If you initiate a cancellation after the booking has been confirmed, the following tiered policy applies based on the calendar days remaining until your event:
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white">Tier 1: 30+ Days Notice</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Cancellations requested 30 days or more before the event have a <strong>0% cancellation fee</strong> (Full Refund).
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white mt-4">Tier 2: 15 to 29 Days Notice</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Cancellations requested between 15 and 29 days prior to the event are subject to a <strong>10% cancellation fee</strong>.
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white mt-4">Tier 3: 7 to 14 Days Notice</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Cancellations requested between 7 and 14 days prior to the event are subject to a <strong>25% cancellation fee</strong>.
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white mt-4">Tier 4: 3 to 6 Days Notice</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Cancellations requested between 3 and 6 days prior to the event are subject to a <strong>50% cancellation fee</strong>.
            </p>
            <h4 className="font-bold text-[#1A1512] dark:text-white mt-4">Tier 5: 0 to 2 Days Notice</h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Cancellations requested within 2 days of the event are subject to a <strong>100% cancellation fee</strong> (No Refund).
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded border border-blue-200 dark:border-blue-800">
              <strong>Note:</strong> The cancellation fee percentage is calculated based on the total cost of each booking item (hall or vendor). This fee is deducted from the advance amount you have already paid.
            </div>
          </>
        )}

        <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-md border border-gray-100 dark:border-gray-800 mt-6">
          <h4 className="font-bold text-sm text-[#1A1512] dark:text-white mb-2">How to Request a Refund</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You can initiate a cancellation and refund request directly from your <strong>Booking History</strong> dashboard. Refunds take 5-7 business days to reflect in your account.
          </p>
        </div>
      </div>
    );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md border-b border-[#E8DFC9] dark:border-gray-800 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Policy Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 md:p-8">
          {content}
        </div>
        
        <div className="sticky bottom-0 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md border-t border-[#E8DFC9] dark:border-gray-800 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1A1512] hover:bg-[#2C241E] dark:bg-white dark:hover:bg-gray-200 dark:text-[#1A1512] text-white font-bold uppercase tracking-widest text-[11px] rounded-sm transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
