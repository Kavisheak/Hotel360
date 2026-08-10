import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CalendarDays, Clock, Users, Package, 
  MapPin, Phone, Mail, User, Receipt,
  CheckCircle2, AlertCircle, CreditCard,
  Music, Camera, Paintbrush, Award
} from "lucide-react";
import type { Booking } from "@/store/bookingStore";
import { customerBookingAPI, accountAPI } from "@/lib/api";
import { startPayHerePayment } from "@/utils/payhere";
import EscrowTracker from "./EscrowTracker";

import ReplacementVendorModal from "../decorator/my_jobs/ReplacementVendorModal";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  confirmed: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  completed: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  pending: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  "pending hall confirmation": { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  "pending confirmation": { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  rejected: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  cancellationrequested: { bg: "bg-orange-50 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
};

export default function BookingDetailsModal({ isOpen, onClose, booking }: BookingDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState<"deposit" | "balance" | null>(null);

  // Credit replacement states
  const [activeCredits, setActiveCredits] = useState<any[]>([]);
  const [vendorAdvances, setVendorAdvances] = useState<any[]>([]);
  const [isRefundingCredit, setIsRefundingCredit] = useState(false);
  const [showReplacementCategory, setShowReplacementCategory] = useState<string | null>(null);

  // Form State for Autofill
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      const { ok, data } = await accountAPI.getPaymentMethods();
      if (ok && data.savedCards && data.savedCards.length > 0) {
        const primaryCard = data.savedCards.find((c: any) => c.isDefault) || data.savedCards[0];
        setCardNumber(primaryCard.cardNumber || "");
        setExpiry(primaryCard.expiry || "");
        setCvv("");
      }
    };

    const fetchCreditsAndAdvances = async () => {
      if (!booking) return;
      const bId = booking._id || booking.id;
      if (!bId) return;
      try {
        const [creditsRes, advancesRes] = await Promise.all([
          customerBookingAPI.getActiveCredits(bId),
          customerBookingAPI.getVendorAdvances(bId)
        ]);
        if (creditsRes.ok && creditsRes.data?.data) {
          setActiveCredits(creditsRes.data.data);
        }
        if (advancesRes.ok && advancesRes.data?.data) {
          setVendorAdvances(advancesRes.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch credits/advances:", e);
      }
    };

    if (isOpen) {
      fetchCards();
      fetchCreditsAndAdvances();
    }
  }, [isOpen, booking]);

  const handleManualCreditRefund = async (creditId: string, amount: number) => {
    if (!booking) return;
    const bId = booking._id || booking.id!;
    if (confirm(`Are you sure you want to request an immediate LKR ${amount.toLocaleString()} refund instead of selecting a replacement vendor?`)) {
      setIsRefundingCredit(true);
      try {
        const res = await customerBookingAPI.refundCreditManual(bId, creditId);
        if (res.ok) {
          alert(`LKR ${amount.toLocaleString()} advance refund processed successfully!`);
          window.location.reload();
        } else {
          alert(res.data?.message || "Failed to process refund.");
        }
      } catch (e: any) {
        alert(e.message || "Server error while processing refund.");
      } finally {
        setIsRefundingCredit(false);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!mounted || !isOpen || !booking) return null;

  const handlePayment = async (type: "deposit" | "balance") => {
    setIsPaying(true);
    await startPayHerePayment({
      bookingId: booking._id || booking.id!,
      paymentType: type,
      onSuccess: () => {
        setIsPaying(false);
        window.location.reload();
      },
      onDismiss: () => setIsPaying(false),
      onError: () => setIsPaying(false),
    });
  };

  const handleVendorAdvancePayment = async (advanceId: string) => {
    setIsPaying(true);
    try {
      const bId = booking._id || booking.id!;
      const res = await customerBookingAPI.payVendorAdvance(bId, advanceId);
      if (res.ok && res.data?.data?.hash) {
        // use payhere window
        const payhere = (window as any).payhere;
        if (!payhere) {
          alert("PayHere is not loaded.");
          setIsPaying(false);
          return;
        }

        payhere.onCompleted = function (orderId: string) {
          console.log("Payment completed. OrderID:" + orderId);
          fetch(`/api/customer/bookings/${bId}/vendor-advances/${advanceId}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
          }).then(() => window.location.reload());
        };

        payhere.onDismissed = function () {
          console.log("Payment dismissed");
          setIsPaying(false);
        };

        payhere.onError = function (error: string) {
          console.log("Error:" + error);
          alert("Payment Failed: " + error);
          setIsPaying(false);
        };

        const paymentData = res.data.data;
        const paymentObject = {
          sandbox: true,
          merchant_id: paymentData.merchant_id,
          return_url: window.location.origin + "/payment-success",
          cancel_url: window.location.origin + "/payment-cancel",
          notify_url: process.env.NEXT_PUBLIC_API_URL + `/api/customer/bookings/${bId}/vendor-advances/${advanceId}/notify`,
          order_id: paymentData.order_id,
          items: paymentData.items,
          amount: paymentData.amount,
          currency: paymentData.currency,
          hash: paymentData.hash,
          first_name: paymentData.first_name,
          last_name: paymentData.last_name,
          email: paymentData.email,
          phone: paymentData.phone,
          address: "EASCC",
          city: "Colombo",
          country: "Sri Lanka",
        };

        payhere.startPayment(paymentObject);
      } else {
        alert("Failed to initiate payment: " + (res.data?.message || "Unknown error"));
        setIsPaying(false);
      }
    } catch (e) {
      console.error(e);
      alert("Error initiating payment.");
      setIsPaying(false);
    }
  };

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();
  const statusKey = booking.status ? booking.status.toLowerCase() : "pending";
  const status = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;

  const createdDate = new Date(booking.createdAt || new Date());
  
  const balanceDue = Math.max(0, (booking.totalCost || 0) - (booking.depositAmount || 0) - (booking.balanceAmount || 0) - (booking.bookingCredit || 0));

  const eventDate = new Date(booking.date);
  // 70% Balance is due 7 days before event date
  const balanceDueDate = new Date(eventDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const balanceDeadlineString = balanceDueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Vendor confirmation & 7-day pre-event window status check
  const vendorCategories = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
  const unacceptedVendors = booking.vendors ? vendorCategories.filter(cat => {
    const v = (booking.vendors as any)[cat];
    return v && v.vendorId && v.status !== "Accepted" && v.status !== "Completed" && v.status !== "NotRequired";
  }) : [];

  const isSevenDaysWindowOpen = new Date().getTime() >= balanceDueDate.getTime();
  const isVenueConfirmed = booking.status === "Confirmed" || booking.status === "Completed";
  const allVendorsAccepted = unacceptedVendors.length === 0;
  const isBalancePaymentEnabled = isVenueConfirmed && allVendorsAccepted && isSevenDaysWindowOpen;

  const isHallConfirmed = booking.status === "Confirmed" || booking.status === "Completed";
  const isHallRejected = booking.status === "Rejected";
  const isHallPending = booking.status === "Pending Hall Confirmation" || booking.status === "Pending Confirmation" || booking.status === "Pending";

  const cancelDeadlineDate = new Date(eventDate);
  cancelDeadlineDate.setDate(cancelDeadlineDate.getDate() - 14);
  const handleCancelClick = async () => {
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      alert("This event has already passed and cannot be cancelled.");
      return;
    }

    let confirmMsg = "";
    if (diffDays < 14) {
      alert("This event is less than 14 days away and cannot be cancelled online. Please contact the hotel directly.");
      return;
    } else if (diffDays >= 14 && diffDays <= 30) {
      confirmMsg = `Your event is ${diffDays} days away. Cancellation requires review and approval by the Hotel Manager. Would you like to submit a cancellation request?`;
    } else {
      confirmMsg = `Your event is ${diffDays} days away. Are you sure you want to cancel this booking? This will cancel all hall and vendor allocations immediately.`;
    }

    if (confirm(confirmMsg)) {
      try {
        const { customerBookingAPI } = await import("@/lib/api");
        const res = await customerBookingAPI.cancelBooking(booking.id || booking._id);
        const data = res.data;
        if (res.ok && data.success) {
          alert(data.message || "Action processed successfully!");
          onClose();
          window.location.reload();
        } else {
          alert(data.message || "Failed to process cancellation request.");
        }
      } catch (e) {
        alert("An error occurred while processing cancellation.");
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#FDFBF7] dark:bg-[#111111] border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 border-b border-[#E8DFC9] dark:border-gray-800 p-6 flex items-start justify-between bg-white dark:bg-[#1A1A1A] z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm border ${status.bg} ${status.text} ${status.border}`}>
                  {booking.status}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-sm">
                  Ref: {booking.bookingRef || (booking._id ? booking._id.slice(-6) : "N/A")}
                </span>
              </div>
              <h2 className="text-2xl font-serif text-[#1A1512] dark:text-white">
                {booking.eventName || booking.eventType || "Event Booking"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Booked on: {createdDate.toLocaleDateString()} at {createdDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FAF6EE] dark:hover:bg-white/5 text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
 
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Left Column (Event Details) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Rejected Hall Banner */}
                {isHallRejected && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-400 dark:border-red-600 rounded-lg shadow-sm flex flex-col gap-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded border border-red-300">
                        ✗ BOOKING REJECTED BY VENUE MANAGER
                      </span>
                    </div>
                    <p className="text-xs text-red-900 dark:text-red-200 leading-relaxed">
                      Your hall reservation request could not be accommodated. <strong>Reason:</strong> "{booking.rejectionReason || "Venue unavailable for requested date"}".
                    </p>
                    <div className="p-2.5 bg-white/80 dark:bg-black/40 border border-red-200 dark:border-red-800 rounded text-[11px] text-red-800 dark:text-red-300 font-medium flex items-center justify-between">
                      <span>💰 <strong>100% Refund Status:</strong> Processed & Issued Back to Customer</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded">Fully Refunded</span>
                    </div>
                  </div>
                )}

                {/* Active Booking Credits Banner */}
                {activeCredits.map((credit: any) => (
                  <div key={credit._id} className="p-4 bg-[#FFFDF7] dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded border border-amber-300">
                          ⚠️ {credit.category.toUpperCase()} DECLINED &bull; REPLACEMENT CREDIT ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 dark:text-amber-200 mt-1.5 leading-relaxed">
                        Your {credit.category} declined. You have <strong className="text-amber-950 dark:text-amber-100 font-bold font-mono">LKR {credit.creditAmount.toLocaleString()}</strong> credit — pick a replacement or request a refund.
                      </p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Expires on: {new Date(credit.expiresAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => setShowReplacementCategory(credit.category)}
                        className="px-3.5 py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-xs transition-colors"
                      >
                        Pick a Replacement
                      </button>
                      <button
                        onClick={() => handleManualCreditRefund(credit._id, credit.creditAmount)}
                        disabled={isRefundingCredit}
                        className="px-3.5 py-2 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-[10px] font-bold uppercase tracking-widest rounded transition-colors disabled:opacity-50"
                      >
                        Request Refund Instead
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pending Vendor Advances */}
                {vendorAdvances.map((adv: any) => {
                  const isPaid = adv.status === "PAID";
                  const vendorTotal = (booking.pricingBreakdown as any)?.[`${adv.vendorRole}Cost`] || 0;
                  const remainingBalance = vendorTotal - adv.requestedAmount;
                  
                  return (
                    <div key={adv._id} className="p-4 bg-[#F8F9FA] dark:bg-gray-900/30 border border-[#E0E0E0] dark:border-gray-800 rounded-lg shadow-sm flex flex-col gap-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          Vendor Advance Payment
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${isPaid ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                          Status: {isPaid ? "PAID" : "Payment Required"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-gray-500 font-bold uppercase text-[9px]">Vendor</p>
                          <p className="font-semibold text-gray-900 dark:text-white capitalize">{adv.vendorRole}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-bold uppercase text-[9px]">Advance Requested</p>
                          <p className="font-mono font-bold text-indigo-700 dark:text-indigo-400">LKR {adv.requestedAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-bold uppercase text-[9px]">Vendor Total</p>
                          <p className="font-mono text-gray-700 dark:text-gray-300">LKR {vendorTotal.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-bold uppercase text-[9px]">Remaining Balance</p>
                          <p className="font-mono text-gray-700 dark:text-gray-300">LKR {remainingBalance.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          {isPaid ? (
                            <>
                              <Receipt size={14} /> 
                              <span>Transaction ID: <strong className="font-mono">{adv.paymentId?.transactionId || "N/A"}</strong></span>
                              <span className="ml-2 px-1 text-gray-300">|</span>
                              <span className="ml-2">Payment Date: {new Date(adv.paidAt).toLocaleDateString()}</span>
                            </>
                          ) : (
                            <>
                              <CalendarDays size={14} className="text-amber-600" />
                              <span>Payment Deadline: <strong className="text-amber-700 dark:text-amber-400">{new Date(adv.deadline).toLocaleDateString()}</strong></span>
                            </>
                          )}
                        </div>

                        {!isPaid ? (
                          <button
                            onClick={() => handleVendorAdvancePayment(adv._id)}
                            disabled={isPaying}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isPaying ? "Processing..." : `Pay LKR ${adv.requestedAmount.toLocaleString()}`}
                          </button>
                        ) : (
                          <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Advance Paid
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Two-Stage Progress Flow */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Booking Approval Progress
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stage 1 Card */}
                    <div className={`p-4 rounded-lg border transition-all ${
                      isHallConfirmed 
                        ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800" 
                        : isHallRejected
                        ? "bg-red-50/60 dark:bg-red-950/20 border-red-300 dark:border-red-800"
                        : "bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 shadow-sm"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Stage 1</span>
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                          isHallConfirmed 
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" 
                            : isHallRejected
                            ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse"
                        }`}>
                          {isHallConfirmed ? "Hall Approved ✓" : isHallRejected ? "Hall Rejected ✗" : "Awaiting Hall Confirmation"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1A1512] dark:text-white uppercase tracking-wider">1. Venue Manager Review</h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {isHallConfirmed 
                          ? "Hall allocation confirmed by Venue Manager." 
                          : isHallRejected
                          ? "Hall allocation rejected. 100% deposit refunded."
                          : "Venue manager is currently reviewing your hall allocation request."}
                      </p>
                    </div>

                    {/* Stage 2 Card */}
                    <div className={`p-4 rounded-lg border transition-all ${
                      !isHallConfirmed 
                        ? "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 opacity-60" 
                        : unacceptedVendors.length > 0
                        ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 shadow-sm"
                        : "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Stage 2</span>
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                          !isHallConfirmed 
                            ? "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            : unacceptedVendors.length > 0
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 animate-pulse"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        }`}>
                          {!isHallConfirmed 
                            ? "Locked (Pending Stage 1)" 
                            : unacceptedVendors.length > 0 
                            ? "Awaiting Vendor Confirmation" 
                            : "Vendors Confirmed ✓"}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#1A1512] dark:text-white uppercase tracking-wider">2. Vendor Responses</h4>
                      <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {!isHallConfirmed 
                          ? "Vendor requests will be activated automatically once hall allocation is approved." 
                          : unacceptedVendors.length > 0
                          ? `Awaiting confirmation from selected service provider(s).`
                          : "All selected service providers have accepted your event."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Info Card */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Event Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Date</p>
                      <p className="font-medium text-[#1A1512] dark:text-white flex items-center gap-2">
                        {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Timeslot</p>
                      <p className="font-medium text-[#1A1512] dark:text-white capitalize">{booking.timeslot}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Duration</p>
                      <p className="font-medium text-[#1A1512] dark:text-white">
                        {booking.durationHours} Hours {booking.extraHours > 0 && <span className="text-[#C9A84C]">(+{booking.extraHours} Extra)</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Guests</p>
                      <p className="font-medium text-[#1A1512] dark:text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" /> {booking.guests}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Venue</p>
                      <p className="font-medium text-[#1A1512] dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" /> Grand Ballroom, EASCC
                      </p>
                    </div>
                  </div>
                </div>
 
                {/* Package & Menu */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Package & Menu
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Package</p>
                      <p className="font-medium text-[#1A1512] dark:text-white">{booking.packageName || booking.package || "Custom"}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Menu Type</p>
                      <p className="font-medium text-[#1A1512] dark:text-white capitalize">{booking.menuType || "Standard"}</p>
                    </div>
                    {booking.customMenuItems && booking.customMenuItems.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Custom Menu Items</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.customMenuItems.map((item, idx) => (
                            <span key={idx} className="bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFC9] dark:border-white/10 px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
 
                {/* Vendors */}
                {booking.vendors && (
                  <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Service Vendors
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: "decorator", icon: Paintbrush, label: "Decorator" },
                        { key: "dj", icon: Music, label: "DJ & Entertainment" },
                        { key: "videographer", icon: Camera, label: "Videography" },
                        { key: "photographer", icon: Camera, label: "Photography" },
                        { key: "cake", icon: Award, label: "Cake & Desserts" },
                        { key: "florist", icon: Paintbrush, label: "Florist" }
                      ].map(({ key, icon: Icon, label }) => {
                        const vendor = booking.vendors[key as keyof typeof booking.vendors] as any;
                        if (!vendor || vendor.status === "NotRequired") return null;
                        
                        const vStatus = vendor.status || "Pending";
                        const isDeclined = vStatus === "Declined" || vStatus === "Expired";
                        const isAccepted = vStatus === "Accepted";
                        const isAwaitingHall = vStatus === "Awaiting Hall Confirmation";
                        
                        return (
                          <div key={key} className={`flex items-center justify-between p-3 rounded-md border ${isDeclined ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30' : isAwaitingHall ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/30' : 'bg-gray-50 border-gray-100 dark:bg-[#222] dark:border-gray-800'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${isDeclined ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-white dark:bg-[#111] shadow-sm text-gray-500'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#1A1512] dark:text-gray-200">{label}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">
                                  {vendor.requestedDesignId ? "Portfolio Design Requested" : (vendor.packageName || "Custom Service")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] uppercase tracking-widest font-bold ${isDeclined ? 'text-red-600' : isAccepted ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {vStatus}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {(!booking.vendors.decorator || booking.vendors.decorator.status === "NotRequired") && 
                       (!booking.vendors.dj || booking.vendors.dj.status === "NotRequired") && 
                       (!booking.vendors.videographer || booking.vendors.videographer.status === "NotRequired") && 
                       (!booking.vendors.photographer || booking.vendors.photographer.status === "NotRequired") && 
                       (!booking.vendors.cake || booking.vendors.cake.status === "NotRequired") && 
                       (!booking.vendors.florist || booking.vendors.florist.status === "NotRequired") && (
                        <p className="text-sm text-gray-500 italic">No external vendors selected for this event.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Real-time Escrow Allocations */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <EscrowTracker bookingId={booking._id || booking.id!} />
                </div>
              </div>
 
              {/* Right Column (Client & Pricing) */}
              <div className="space-y-6">
                
                {/* Client Info */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Contact Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Client Name</p>
                        <p className="font-medium text-[#1A1512] dark:text-gray-200">{booking.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Email</p>
                        <p className="font-medium text-[#1A1512] dark:text-gray-200 break-all">{booking.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Phone</p>
                        <p className="font-medium text-[#1A1512] dark:text-gray-200">{booking.phone}</p>
                        {booking.alternativePhone && <p className="text-xs text-gray-500 mt-0.5">{booking.alternativePhone} (Alt)</p>}
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* Pricing Summary */}
                <div className="bg-[#FAF6EE] dark:bg-[#151515] border border-[#E8DFC9] dark:border-[#C9A84C]/20 rounded-lg p-5 shadow-[0_4px_20px_-4px_rgba(201,168,76,0.1)]">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Pricing Summary
                  </h3>
                  
                  {booking.pricingBreakdown && (
                    <div className="space-y-2.5 text-xs border-b border-[#E8DFC9] dark:border-gray-800 pb-4 mb-4">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Hall Rental</span>
                        <span className="font-medium">{formatCurrency(booking.pricingBreakdown.hallFixedPrice)}</span>
                      </div>
                      {(booking.pricingBreakdown.extraHoursPremium || 0) > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Extra Hours Premium</span>
                          <span className="font-medium">{formatCurrency(booking.pricingBreakdown.extraHoursPremium)}</span>
                        </div>
                      )}
                      {(booking.pricingBreakdown.timeslotPremium || 0) > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Timeslot Premium</span>
                          <span className="font-medium">{formatCurrency(booking.pricingBreakdown.timeslotPremium)}</span>
                        </div>
                      )}
                      {(booking.pricingBreakdown.foodCost || 0) > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Food & Catering</span>
                          <span className="font-medium">{formatCurrency(booking.pricingBreakdown.foodCost)}</span>
                        </div>
                      )}
                      
                      {/* Vendor costs if they exist */}
                      {((booking.pricingBreakdown.decoratorCost || 0) + 
                        (booking.pricingBreakdown.djCost || 0) + 
                        (booking.pricingBreakdown.videographerCost || 0) +
                        (booking.pricingBreakdown.photographerCost || 0) +
                        (booking.pricingBreakdown.cakeCost || 0) +
                        (booking.pricingBreakdown.floristCost || 0)) > 0 && (
                        <div className="pt-2 mt-2 border-t border-dashed border-[#E8DFC9] dark:border-gray-800">
                          {(booking.pricingBreakdown.decoratorCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 font-sans">
                              <span>Decorator</span>
                              <span>{formatCurrency(booking.pricingBreakdown.decoratorCost)}</span>
                            </div>
                          )}
                          {(booking.pricingBreakdown.djCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 mt-1 font-sans">
                              <span>DJ / Entertainment</span>
                              <span>{formatCurrency(booking.pricingBreakdown.djCost)}</span>
                            </div>
                          )}
                          {(booking.pricingBreakdown.videographerCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 mt-1 font-sans">
                              <span>Videography</span>
                              <span>{formatCurrency(booking.pricingBreakdown.videographerCost)}</span>
                            </div>
                          )}
                          {(booking.pricingBreakdown.photographerCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 mt-1 font-sans">
                              <span>Photography</span>
                              <span>{formatCurrency(booking.pricingBreakdown.photographerCost || 0)}</span>
                            </div>
                          )}
                          {(booking.pricingBreakdown.cakeCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 mt-1 font-sans">
                              <span>Cake & Desserts</span>
                              <span>{formatCurrency(booking.pricingBreakdown.cakeCost || 0)}</span>
                            </div>
                          )}
                          {(booking.pricingBreakdown.floristCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 mt-1 font-sans">
                              <span>Florist</span>
                              <span>{formatCurrency(booking.pricingBreakdown.floristCost || 0)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
 
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-[#1A1512] dark:text-white">Total Amount</span>
                      <span className="font-serif font-bold text-[#1A1512] dark:text-white text-base">{formatCurrency(booking.totalCost)}</span>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded border border-[#E8DFC9]/50 dark:border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                          {booking.depositAmount && booking.depositAmount > 0 ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          )} 
                          Deposit Paid
                        </span>
                        <span className={`font-bold ${booking.depositAmount && booking.depositAmount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                          {formatCurrency(booking.depositAmount)}
                        </span>
                      </div>
                      
                      {booking.bookingCredit && booking.bookingCredit > 0 ? (
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-[#E8DFC9] dark:border-white/5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Booking Credit</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(booking.bookingCredit)}</span>
                        </div>
                      ) : null}

                      <div className="flex justify-between items-center text-xs pt-2 border-t border-[#E8DFC9] dark:border-white/5">
                        <span className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">Remaining Balance</span>
                        <span className={`font-bold ${balanceDue > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {balanceDue > 0 ? formatCurrency(balanceDue) : "PAID IN FULL"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {showPaymentForm ? (
                    <div className="mt-6 bg-[#FAF6EE]/50 dark:bg-[#1A1A1A] p-5 rounded-lg border border-[#C9A84C]/50 animate-fadeIn space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#2C1E14] dark:text-white uppercase tracking-widest flex items-center gap-2">
                          <span>🔒</span> PayHere Secure Gateway Checkout
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#C9A84C]/20 text-[#C9A84C] rounded border border-[#C9A84C]/30">
                          {showPaymentForm === "deposit" ? "30% Advance" : "70% Balance"}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        You are about to be redirected to the official <strong>PayHere 256-bit Encrypted Checkout Modal</strong>. PayHere supports Sri Lankan and international credit/debit cards, Frimi, Sampath Vishwa, Genie, and Koko Pay.
                      </p>

                      <div className="grid grid-cols-4 gap-2 py-2">
                        {[
                          { label: "Visa / MC", icon: "💳" },
                          { label: "Frimi / Genie", icon: "📱" },
                          { label: "Vishwa Bank", icon: "🏛️" },
                          { label: "Koko Pay", icon: "🛍️" },
                        ].map((m, idx) => (
                          <div key={idx} className="bg-white dark:bg-black p-2 rounded border border-gray-200 dark:border-zinc-800 text-center">
                            <div className="text-base">{m.icon}</div>
                            <div className="text-[9px] font-bold text-gray-700 dark:text-gray-300 mt-0.5">{m.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => setShowPaymentForm(null)}
                          disabled={isPaying}
                          className="flex-1 py-2.5 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handlePayment(showPaymentForm)}
                          disabled={isPaying}
                          className="flex-1 py-2.5 bg-[#C9A84C] text-[#2C1E14] rounded text-[10px] font-bold uppercase tracking-widest hover:bg-[#B58B5C] transition-colors flex items-center justify-center gap-2 shadow-md"
                        >
                          {isPaying ? 'Connecting Gateway...' : `Launch PayHere Checkout (${showPaymentForm === "deposit" ? formatCurrency((booking.totalCost || 0) * 0.3) : formatCurrency(balanceDue)})`}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(!booking.depositAmount || booking.depositAmount === 0) ? (
                        <button 
                          onClick={() => setShowPaymentForm("deposit")}
                          className="w-full mt-4 bg-[#C9A84C] text-[#2C1E14] py-2.5 rounded text-[10px] uppercase tracking-widest font-bold hover:bg-[#B58B5C] transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CreditCard className="w-4 h-4" /> Pay 30% Advance via PayHere 🇱🇰 ({formatCurrency((booking.totalCost || 0) * 0.3)})
                        </button>
                      ) : booking.depositAmount > 0 && balanceDue > 0 && booking.status !== "Completed" && booking.status !== "Cancelled" ? (
                        <div className="mt-4 space-y-2">
                          <button 
                            onClick={() => setShowPaymentForm("balance")}
                            disabled={!isBalancePaymentEnabled}
                            className={`w-full py-2.5 rounded text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-sm ${
                              isBalancePaymentEnabled 
                                ? "bg-[#C9A84C] hover:bg-[#B58B5C] text-[#2C1E14]" 
                                : "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-300 dark:border-gray-700"
                            }`}
                          >
                            <CreditCard className="w-4 h-4" /> Pay 70% Balance via PayHere 🇱🇰 ({formatCurrency(balanceDue)})
                          </button>
                          <div className="text-center space-y-1">
                            <p className="text-[10px] text-gray-500">
                              Upcoming Balance Due Date: <strong className="text-amber-600 dark:text-amber-400">{balanceDeadlineString}</strong> (7 Days Before Event)
                            </p>
                            {!isVenueConfirmed && (
                              <p className="text-[9px] text-amber-600 font-medium">
                                ⚠️ Balance payment activates once venue manager confirms hall availability.
                              </p>
                            )}
                            {isVenueConfirmed && !allVendorsAccepted && (
                              <p className="text-[9px] text-red-500 font-medium">
                                ⚠️ Balance payment activates once all selected vendors ({unacceptedVendors.join(", ")}) accept participation.
                              </p>
                            )}
                            {isVenueConfirmed && allVendorsAccepted && !isSevenDaysWindowOpen && (
                              <p className="text-[9px] text-amber-600 font-medium">
                                ⏳ Balance payment opens 7 days prior to your event ({balanceDeadlineString}).
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}

                  {booking.status !== "Completed" && booking.status !== "Cancelled" && booking.status !== "CancellationRequested" && (new Date(booking.date) >= new Date(new Date().setHours(0,0,0,0))) && (
                    <button 
                      onClick={handleCancelClick}
                      className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
 
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Replacement Vendor Selection Modal */}
      {showReplacementCategory && (
        <ReplacementVendorModal
          isOpen={!!showReplacementCategory}
          bookingId={booking._id || booking.id!}
          category={showReplacementCategory}
          creditAmount={
            activeCredits.find((c) => c.category === showReplacementCategory)?.creditAmount || 0
          }
          onClose={() => setShowReplacementCategory(null)}
          onSuccess={(msg) => {
            alert(msg);
            window.location.reload();
          }}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
