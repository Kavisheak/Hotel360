"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useVendorStore } from "@/store/vendorStore";

interface VendorRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceCategory: "decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist";
  currentVendorId?: string;
}

export default function VendorRemovalModal({ isOpen, onClose, bookingId, serviceCategory, currentVendorId }: VendorRemovalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [financialChoice, setFinancialChoice] = useState<"apply_balance" | "refund" | null>(null);

  const { vendors, fetchVendors } = useVendorStore();
  const { bookings, removeVendor } = useBookingStore();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const bookingContext = bookings.find(b => (b._id || b.id) === bookingId);
  if (!bookingContext) return null;

  // Find current vendor details
  const oldVendor = bookingContext.vendors?.[serviceCategory] as any;
  const oldCost = bookingContext.pricingBreakdown?.[`${serviceCategory}Cost` as keyof typeof bookingContext.pricingBreakdown] || 0;
  
  const resolvedOldVendor = (() => {
    const effectiveId = currentVendorId || oldVendor?.vendorId;
    if (!effectiveId) return undefined;
    return vendors.find(v => v.id === effectiveId || v.userId === effectiveId);
  })();
  const oldAdvancePercentage = resolvedOldVendor?.advancePaymentPercentage || 0;
  const originalAdvance = Math.round(oldCost * (oldAdvancePercentage / 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!financialChoice && originalAdvance > 0) return;
    
    if (step === 1) {
      if (financialChoice === 'apply_balance') {
        // Submit immediately for apply_balance
        setIsSubmitting(true);
        await removeVendor(bookingId, serviceCategory, financialChoice);
        setIsSubmitting(false);
        setStep(2); // Success screen for balance
      } else if (financialChoice === 'refund') {
        setStep(2); // Refund confirmation screen
      } else {
        // No advance payment
        setIsSubmitting(true);
        await removeVendor(bookingId, serviceCategory, 'refund'); // backend handles 'refund' with 0 amount nicely
        setIsSubmitting(false);
        onClose();
      }
      return;
    }

    if (step === 2) {
      if (financialChoice === 'refund') {
        // Submit refund request
        setIsSubmitting(true);
        await removeVendor(bookingId, serviceCategory, financialChoice);
        setIsSubmitting(false);
        setStep(3); // Refund success screen
      } else {
        // Acknowledge success for apply balance and close
        onClose();
      }
      return;
    }

    if (step === 3) {
      onClose();
    }
  };

  // Calculations for Success Screen
  let refundedAmount = 0;
  const vendorCategories = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
  vendorCategories.forEach(cat => {
    const v = bookingContext.vendors?.[cat as keyof typeof bookingContext.vendors] as any;
    if (v && v.status === "Refunded") {
      refundedAmount += v.refundRequestedAmount || 0;
    }
  });

  const totalPaid = (bookingContext.depositAmount || 0) + (bookingContext.balanceAmount || 0) + (bookingContext.bookingCredit || 0);
  const netPaid = totalPaid - refundedAmount;

  const newBookingTotal = bookingContext.totalCost - oldCost;
  const newRemainingBalance = newBookingTotal - netPaid;
  
  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-[#1A1512]/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1A1A1A] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-[#E8DFC9] dark:border-gray-800 animate-slideUp z-10 flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#E8DFC9] dark:border-gray-800 bg-[#FDFBF7] dark:bg-[#111111] flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white capitalize">Remove {serviceCategory}</h3>
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
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6">
              {step === 1 ? (
                <>
                  <div className="p-5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="font-bold text-[#1A1512] dark:text-white mb-1">{resolvedOldVendor?.shopName || resolvedOldVendor?.name || currentVendorId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{oldVendor?.packageName}</p>
                    
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Advance Paid</p>
                    <p className="text-lg font-bold text-[#C69C6D] font-mono">LKR {originalAdvance.toLocaleString()}</p>
                  </div>

                  <div className="py-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      The {serviceCategory} will be removed from your booking.
                    </p>
                  </div>

                  {originalAdvance > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-sm font-bold text-[#1A1512] dark:text-white mb-6 leading-relaxed">
                        What would you like to do with the LKR {originalAdvance.toLocaleString()}<br/>
                        already allocated to this service?
                      </p>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${financialChoice === 'refund' ? 'border-[#C69C6D]' : 'border-gray-300'}`}>
                            {financialChoice === 'refund' && <div className="w-2 h-2 rounded-full bg-[#C69C6D]" />}
                          </div>
                          <input type="radio" name="financialChoice" className="hidden" checked={financialChoice === 'refund'} onChange={() => setFinancialChoice('refund')} />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">Request Refund</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${financialChoice === 'apply_balance' ? 'border-[#C69C6D]' : 'border-gray-300'}`}>
                            {financialChoice === 'apply_balance' && <div className="w-2 h-2 rounded-full bg-[#C69C6D]" />}
                          </div>
                          <input type="radio" name="financialChoice" className="hidden" checked={financialChoice === 'apply_balance'} onChange={() => setFinancialChoice('apply_balance')} />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">Apply to Booking Balance</span>
                        </label>
                      </div>
                    </div>
                  )}
                </>
              ) : step === 2 && financialChoice === 'apply_balance' ? (
                <div className="space-y-8 animate-fadeIn">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={32} strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-2">Vendor Removed</h3>
                    <p className="text-gray-600 dark:text-gray-400 capitalize">{serviceCategory} Removed from booking</p>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-5 rounded-lg text-center">
                    <p className="text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                      LKR {originalAdvance.toLocaleString()}
                    </p>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300">retained as booking credit</p>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-6 text-center">Your remaining balance has been recalculated.</p>
                    
                    <div className="bg-gray-50 dark:bg-[#1A1A1A] p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4 font-mono text-sm">
                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>New Booking Total:</span>
                        <span>LKR {newBookingTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>Amount Already Paid:</span>
                        <span>LKR {netPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 font-bold text-[#1A1512] dark:text-white text-base">
                        <span>Remaining Balance:</span>
                        <span className="text-[#C69C6D]">LKR {newRemainingBalance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : step === 2 && financialChoice === 'refund' ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-2">Refund Request</h3>
                  </div>

                  <div className="bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 p-5 rounded-lg space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-widest capitalize">{serviceCategory}</p>
                      <p className="font-bold text-[#1A1512] dark:text-white">{resolvedOldVendor?.shopName || resolvedOldVendor?.name || currentVendorId}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-widest">Refundable Amount</p>
                      <p className="text-lg font-bold text-[#C69C6D] font-mono">LKR {originalAdvance.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-widest">Reason</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {oldVendor?.status === "Declined" ? "Vendor declined the booking." : "Customer initiated vendor removal."}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg text-center">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      The refund will be reviewed and processed<br/>through the original payment method.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-8 text-center animate-fadeIn">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1512] dark:text-white">
                    Refund request submitted.<br/>Awaiting manager review.
                  </h3>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-[#111111] flex items-center justify-end gap-4 border-t border-[#E8DFC9] dark:border-gray-800 shrink-0">
              {step === 1 ? (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={(originalAdvance > 0 && !financialChoice) || isSubmitting}
                    className="px-8 py-3.5 bg-red-600 text-white text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center min-w-[160px]"
                  >
                    {isSubmitting ? "Confirming..." : "Confirm Removal"}
                  </button>
                </>
              ) : step === 2 && financialChoice === 'refund' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-[#C69C6D] text-white text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[#B58A59] transition-colors shadow-md flex items-center justify-center min-w-[160px]"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Refund Request"}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#C69C6D] text-white text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[#B58A59] transition-colors shadow-md flex items-center justify-center w-full sm:w-auto min-w-[160px]"
                >
                  Done
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
