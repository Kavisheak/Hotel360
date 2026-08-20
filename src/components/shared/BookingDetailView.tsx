import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronRight, Download, Mail, Phone, MapPin, XCircle, Clock, AlertCircle, CreditCard, Loader2, Ban } from 'lucide-react';
import { Booking, useBookingStore } from '@/store/bookingStore';
import { useVendorStore } from '@/store/vendorStore';
import PolicyModal from "../landing/book/PolicyModal";
import VendorSwapModal from "../myaccount/VendorSwapModal";
import VendorRemovalModal from "../myaccount/VendorRemovalModal";
import ApplyBalanceModal from "./ApplyBalanceModal";
import { customerBookingAPI } from '@/lib/api';
import { startPayHerePayment } from "@/utils/payhere";
import { useEffect } from 'react';

interface BookingDetailViewProps {
  booking: Booking;
  onBack: () => void;
  onCancelBooking: (bookingId: string) => void;
  onAddVendor: (bookingId: string, serviceKey: string) => void;
}

export default function BookingDetailView({ booking, onBack, onCancelBooking, onAddVendor }: BookingDetailViewProps) {
  const eventDate = new Date(booking.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  const bId = booking._id || booking.id || '';
  const { vendors: globalVendors } = useVendorStore();
  const { removeVendor } = useBookingStore();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [activeCredits, setActiveCredits] = useState<any[]>([]);
  const [isRefundingCredit, setIsRefundingCredit] = useState(false);
  const [swapModalState, setVendorSwapModalState] = useState<{
    isOpen: boolean;
    serviceCategory: "decorator" | "dj" | "videographer";
    currentVendorId?: string;
  }>({ isOpen: false, serviceCategory: "decorator" });
  const [removalModalState, setVendorRemovalModalState] = useState<{
    isOpen: boolean;
    serviceCategory: any;
    currentVendorId?: string;
  }>({ isOpen: false, serviceCategory: "decorator" });
  const [applyBalanceModalState, setApplyBalanceModalState] = useState<{
    isOpen: boolean;
    serviceKey: string;
    amount: number;
    creditId?: string;
  }>({ isOpen: false, serviceKey: "", amount: 0 });

  const [locallyRemovedVendors, setLocallyRemovedVendors] = useState<string[]>([]);
  
  // Calculate refund sums based on vendor statuses
  let refundRequestedAmount = 0;
  let refundedAmount = 0;
  const vendorCats = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
  
  vendorCats.forEach(cat => {
    const v = (booking.vendors as any)?.[cat];
    if (v) {
      if (v.status === "Refund Pending") {
        refundRequestedAmount += v.refundRequestedAmount || 0;
      } else if (v.status === "Refunded") {
        refundedAmount += v.refundRequestedAmount || 0;
      }
    }
  });

  // Calculate actual advance required
  const pricing = booking.pricingBreakdown || {};
  const hallPrice = (pricing.hallFixedPrice || 0) + (pricing.extraHoursPremium || 0) + (pricing.foodCost || 0) + (pricing.timeslotPremium || 0) + (pricing.customMenuSurcharge || 0);
  
  const getVendorAdvanceInfoLocal = (category: string) => {
    const cost = (pricing as any)[`${category}Cost`] || 0;
    if (cost === 0) return 0;
    const vendorId = booking.vendors?.[category as keyof typeof booking.vendors]?.vendorId;
    if (!vendorId || vendorId === "none" || vendorId === "custom_preference") return 0;
    const v = globalVendors.find(v => v.id === vendorId || (v as any)._id === vendorId || v.userId === vendorId);
    if (!v) return 0;
    const percentage = v.advancePaymentPercentage || 0;
    return Math.round(cost * (percentage / 100));
  };

  const calculatedAdvance = Math.round(hallPrice * 0.30) 
    + getVendorAdvanceInfoLocal("decorator")
    + getVendorAdvanceInfoLocal("dj")
    + getVendorAdvanceInfoLocal("videographer")
    + getVendorAdvanceInfoLocal("photographer")
    + getVendorAdvanceInfoLocal("cake")
    + getVendorAdvanceInfoLocal("florist");

  const actualDepositPaid = (booking.depositAmount || 0) > 0 ? calculatedAdvance : 0;
  const advanceRequired = calculatedAdvance;

  const totalPaid = actualDepositPaid + (booking.balanceAmount || 0);
  const netPaid = totalPaid - refundedAmount;
  
  useEffect(() => {
    const fetchCredits = async () => {
      if (!booking) return;
      const id = booking._id || booking.id;
      if (!id) return;
      try {
        const res = await customerBookingAPI.getActiveCredits(id);
        if (res.ok && res.data?.data) {
          setActiveCredits(res.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch credits:", e);
      }
    };
    fetchCredits();
  }, [booking]);

  const handleManualCreditRefund = async (creditId: string, amount: number) => {
    if (!booking) return;
    const id = booking._id || booking.id!;
    if (confirm(`Are you sure you want to request a refund for the LKR ${amount.toLocaleString()} advance instead of selecting a replacement vendor? Your request will be sent to the manager for review.`)) {
      setIsRefundingCredit(true);
      try {
        const res = await customerBookingAPI.refundCreditManual(id, creditId);
        if (res.ok) {
          alert(`Refund request for LKR ${amount.toLocaleString()} submitted successfully!`);
          window.location.reload();
        } else {
          alert(res.data?.message || "Failed to process refund request.");
        }
      } catch (e: any) {
        alert(e.message || "Server error while processing refund request.");
      } finally {
        setIsRefundingCredit(false);
      }
    }
  };

  const handleApplyCreditToBalance = async (creditId: string, amount: number, serviceKey: string) => {
    setApplyBalanceModalState({
      isOpen: true,
      serviceKey,
      amount,
      creditId
    });
  };

  const [isPaying, setIsPaying] = useState(false);

  const handlePayBalance = async () => {
    if (!booking) return;
    const bId = booking._id || booking.id!;
    setIsPaying(true);

    try {
      const vendorCategories = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
      let modified = false;

      // Automatically apply credits for declined vendors
      for (const cat of vendorCategories) {
        const v = booking.vendors?.[cat as keyof typeof booking.vendors];
        if (v && v.status === "Declined") {
          const credit = activeCredits.find(c => c.category === cat && c.status === "Active");
          if (credit) {
            await customerBookingAPI.applyCreditToBalance(bId, credit._id);
            modified = true;
          } else {
            // Fallback application
            await removeVendor(bId, cat, 'apply_to_balance');
            modified = true;
          }
        }
      }

      // If we applied credits, we must wait a tiny bit or let the store sync,
      // but actually getPayhereHash fetches straight from DB, so as long as the await finished we're good.
      await startPayHerePayment({
        bookingId: bId,
        paymentType: "balance",
        onSuccess: () => {
          setIsPaying(false);
          alert("Balance payment successful!");
          window.location.reload();
        },
        onDismiss: () => setIsPaying(false),
        onError: () => setIsPaying(false),
      });

    } catch (err: any) {
      alert("Error preparing payment: " + err.message);
      setIsPaying(false);
    }
  };

  // Calculate Timeline status
  const statuses = [
    { label: "Booking Created", active: true, done: true },
    { label: "Advance Paid", active: true, done: ["DEPOSIT_PAID", "Pending Hall Confirmation", "Confirmed", "Completed"].includes(booking.status) },
    { label: "Manager Confirmation", active: ["Pending Hall Confirmation", "Confirmed", "Completed"].includes(booking.status), done: ["Confirmed", "Completed"].includes(booking.status) },
    { label: "Vendor Confirmation", active: ["Confirmed", "Completed"].includes(booking.status), done: ["Confirmed", "Completed"].includes(booking.status) && (booking.vendors?.decorator?.status === "Accepted" || booking.vendors?.dj?.status === "Accepted") },
    { label: "Booking Confirmed", active: booking.status === "Confirmed" || booking.status === "Completed", done: booking.status === "Confirmed" || booking.status === "Completed" },
    { label: "Event Completed", active: booking.status === "Completed", done: booking.status === "Completed" }
  ];

  const getVendorStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return 'text-emerald-600';
      case 'pending':
      case 'awaiting hall confirmation':
        return 'text-amber-600';
      case 'declined':
      case 'expired':
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getVendorStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'pending':
      case 'awaiting hall confirmation':
        return <span className="w-2 h-2 rounded-full bg-amber-600 inline-block mr-1" />;
      case 'declined':
      case 'expired':
      case 'cancelled':
        return <span className="font-bold text-red-600 mr-1">✕</span>;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getVendorStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return 'Accepted ✓';
      case 'pending':
      case 'awaiting hall confirmation':
        return 'Awaiting Vendor Response';
      case 'declined':
      case 'expired':
        return 'Vendor Declined';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#111] rounded-xl border border-[#E8DFC9] dark:border-zinc-800 shadow-sm overflow-hidden animate-fadeIn text-left">
      {/* Top Header with Back Button */}
      <div className="bg-[#FAF6EE] dark:bg-[#1A1A1A] p-4 md:p-6 border-b border-[#E8DFC9] dark:border-zinc-800 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#C9A84C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </button>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
          booking.status === "Confirmed" || booking.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
          booking.status === "Cancelled" || booking.status === "Rejected" ? "bg-red-100 text-red-700" :
          "bg-amber-100 text-amber-700"
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="p-4 md:p-8 space-y-12 text-[#1A1512] dark:text-gray-200">
        
        {/* 1. Header Information */}
        <section>
          <p className="text-[#C9A84C] font-bold tracking-widest uppercase text-xs mb-2">Booking #{booking.bookingRef || bId.slice(-6).toUpperCase()}</p>
          <h1 className="text-3xl md:text-4xl font-serif mb-4 text-[#1A1512] dark:text-white">{booking.eventType || "Event"}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {formattedDate} {booking.timeslot ? `• ${booking.timeslot}` : ""}</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> EASCCA Conference Centre</span>
          </div>
        </section>

        {/* 2. Timeline */}
        <section className="bg-gray-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Booking Progress</h3>
          <div className="flex flex-col md:flex-row justify-between gap-4 relative">
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-2.5 left-6 right-6 h-0.5 bg-gray-200 dark:bg-zinc-700 z-0"></div>
            
            {statuses.map((step, idx) => (
              <div key={idx} className="relative z-10 flex md:flex-col items-center md:items-start gap-4 md:gap-2 flex-1">
                {/* Vertical line for mobile */}
                {idx < statuses.length - 1 && (
                  <div className="md:hidden absolute left-2.5 top-6 bottom-[-24px] w-0.5 bg-gray-200 dark:bg-zinc-700 z-0"></div>
                )}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 border-2 transition-colors ${
                  step.done ? "bg-emerald-500 border-emerald-500 text-white" : 
                  step.active ? "bg-white dark:bg-zinc-800 border-[#C9A84C]" : "bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600"
                }`}>
                  {step.done ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className={`w-2 h-2 rounded-full ${step.active ? "bg-[#C9A84C]" : "bg-gray-300"}`} />}
                </div>
                <p className={`text-xs md:text-[10px] font-bold uppercase tracking-wider ${step.active ? "text-[#1A1512] dark:text-white" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Payment Section */}
        <section>
          <h2 className="text-xl font-serif text-[#1A1512] dark:text-white mb-6 border-b border-[#E8DFC9] dark:border-zinc-800 pb-2">Financial Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Summary Box */}
            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-xl border border-[#E8DFC9] dark:border-gray-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C69C6D]/5 rounded-bl-[100px] -z-10" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C69C6D]" /> Financial Overview
              </h3>

              <div className="space-y-4">
                {/* Hall Breakdown */}
                <div className="bg-gray-50 dark:bg-[#151515] p-4 rounded-lg border border-[#E8DFC9] dark:border-gray-800 space-y-2">
                  <p className="font-bold text-[10px] uppercase tracking-widest text-[#C69C6D] mb-2 border-b border-[#E8DFC9] dark:border-gray-800 pb-2">Hall & Catering</p>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Total Cost</span>
                    <span className="font-semibold text-gray-900 dark:text-white">LKR {hallPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Advance Paid</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">LKR {Math.round(hallPrice * 0.3).toLocaleString()}</span>
                  </div>
                  {(booking.bookingCredit || 0) > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Unused Vendor Credit Applied</span>
                      <span>LKR {(booking.bookingCredit || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold pt-2 border-t border-[#E8DFC9] dark:border-gray-800 text-gray-900 dark:text-white">
                    <span>Hall Remaining Balance</span>
                    <span>LKR {Math.max(0, hallPrice - Math.round(hallPrice * 0.3) - (booking.bookingCredit || 0)).toLocaleString()}</span>
                  </div>
                </div>

                {/* Vendors Breakdown */}
                {vendorCats.map(cat => {
                   const cost = (pricing as any)[`${cat}Cost`] || 0;
                   const vendor = (booking.vendors as any)?.[cat];
                   if (!vendor || cost === 0 || vendor.status === "Declined" || vendor.status === "Cancelled" || vendor.status === "Removed" || vendor.status === "NotRequired" || vendor.status === "Refund Pending" || vendor.status === "Refunded") return null;
                   
                   const advance = getVendorAdvanceInfoLocal(cat);
                   const remaining = cost - advance;
                   const isPaid = actualDepositPaid > 0;

                   return (
                     <div key={cat} className="bg-gray-50 dark:bg-[#151515] p-4 rounded-lg border border-[#E8DFC9] dark:border-gray-800 space-y-2">
                        <p className="font-bold text-[10px] uppercase tracking-widest text-[#C69C6D] mb-2 border-b border-[#E8DFC9] dark:border-gray-800 pb-2">{cat}</p>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>Total Cost</span>
                          <span className="font-semibold text-gray-900 dark:text-white">LKR {cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>{isPaid ? "Advance Paid" : "Advance Required"}</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">LKR {advance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold pt-2 border-t border-[#E8DFC9] dark:border-gray-800 text-gray-900 dark:text-white">
                          <span>{cat.charAt(0).toUpperCase() + cat.slice(1)} Remaining Balance</span>
                          <span>LKR {remaining.toLocaleString()}</span>
                        </div>
                     </div>
                   );
                })}

                <div className="pt-2 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#E8DFC9] dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400 text-sm font-bold">Total Booking Cost</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">LKR {(booking.totalCost || 0).toLocaleString()}</span>
                  </div>
                  
                  {refundedAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-[#E8DFC9] dark:border-gray-800 text-sm text-red-600">
                      <span>Refunded</span>
                      <span className="font-semibold">- LKR {refundedAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 dark:text-white font-serif font-bold text-lg">Total Remaining Balance</span>
                    <div className="text-right">
                      <span className="font-bold text-2xl text-[#C69C6D]">LKR {Math.max(0, (booking.totalCost || 0) - netPaid).toLocaleString()}</span>
                      {Math.max(0, (booking.totalCost || 0) - netPaid) <= 0 && <p className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold mt-1">Fully Paid</p>}
                    </div>
                  </div>

                  {booking.status === "Confirmed" && Math.max(0, (booking.totalCost || 0) - netPaid) > 0 && (
                    <div className="pt-4 mt-2 border-t border-[#E8DFC9] dark:border-gray-800">
                      <button
                        onClick={handlePayBalance}
                        disabled={isPaying}
                        className="w-full py-3 bg-[#C69C6D] text-white font-bold text-xs uppercase tracking-widest rounded hover:bg-[#B58A59] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                      >
                        {isPaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                        {isPaying ? "Processing..." : "Pay Remaining Balance"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* History List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">Payment History</h3>
              <div className="space-y-4">
                {booking.paymentHistory && booking.paymentHistory.length > 0 ? (
                  booking.paymentHistory.map((ph: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-zinc-800 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-[#1A1512] dark:text-white">{ph.paymentType}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(ph.timestamp).toLocaleDateString()} • Paid via {ph.method}</p>
                          </div>
                          <span className="font-bold text-emerald-600">LKR {(ph.amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex gap-4 p-4 border border-gray-100 dark:border-zinc-800 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-[#1A1512] dark:text-white">Booking Advance</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(booking.date).toLocaleDateString()} • System Default</p>
                          </div>
                          <span className="font-bold text-emerald-600">LKR {actualDepositPaid.toLocaleString()}</span>
                        </div>
                      </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Vendors Section */}
        <section>
          <h2 className="text-xl font-serif text-[#1A1512] dark:text-white mb-6 border-b border-[#E8DFC9] dark:border-zinc-800 pb-2">Service Providers</h2>
          <div className="space-y-4">
            {['decorator', 'videographer', 'dj', 'photographer', 'cake', 'florist'].map(serviceKey => {
              const vendor = booking.vendors?.[serviceKey as keyof typeof booking.vendors];
              if (!vendor) return null;
              
              const isHistoricallyRemoved = booking.vendorHistory?.some((history: any) => history.service === serviceKey);
              
              if (vendor.status === "Refund Pending" || vendor.status === "Refunded" || locallyRemovedVendors.includes(serviceKey) || (vendor.status === "NotRequired" && isHistoricallyRemoved)) {
                return (
                  <div key={serviceKey} className="border border-gray-200 dark:border-zinc-800 rounded-xl p-5 md:p-6 bg-gray-50/50 dark:bg-zinc-900/20 opacity-80">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                           <Ban className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{serviceKey}</p>
                          <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300">Vendor Removed</h4>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                         <div className="inline-flex px-3 py-1 bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded">
                           {vendor.status === "Refund Pending" ? "Refund Pending" : vendor.status === "Refunded" ? "Refunded" : "Removed"}
                         </div>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 font-medium">You have chosen to proceed without a vendor for this service. {vendor.status === "Refund Pending" && "A refund for your advance payment is currently being processed by the manager."} {vendor.status === "Refunded" && "A refund for your advance payment has been successfully processed."} {vendor.status === "NotRequired" && "Any applicable advance was applied as credit to your total balance."}</p>
                  </div>
                );
              }
              
              if (vendor.status === "NotRequired") return null;
              
              const isDeclined = ["declined", "expired"].includes(vendor.status?.toLowerCase());
              const costKey = `${serviceKey}Cost`;
              const totalCost = booking.pricingBreakdown?.[costKey as keyof typeof booking.pricingBreakdown] || 0;
              const advance = getVendorAdvanceInfoLocal(serviceKey);
              const resolvedVendor = globalVendors.find(gv => gv.userId === vendor.vendorId || gv.id === vendor.vendorId);
              const vendorName = resolvedVendor?.name || vendor.vendorId || `Assigned ${serviceKey}`;
              const remainingBalance = Math.max(0, (booking.totalCost || 0) - netPaid);
              
              return (
                <div key={serviceKey} className={`border rounded-xl p-5 md:p-6 transition-colors ${
                  isDeclined ? "border-red-200 bg-red-50/30 dark:border-red-900/30 dark:bg-red-900/10" : "border-[#E8DFC9] bg-white dark:border-zinc-800 dark:bg-[#151515]"
                }`}>
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{serviceKey}</p>
                      <h4 className="text-lg font-bold text-[#1A1512] dark:text-white mb-1 flex items-center gap-2">
                        {vendorName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Package: {vendor.packageName || "Standard"}
                      </p>
                      {vendor.requirements && Object.keys(vendor.requirements).length > 0 && (
                        <div className="mt-3 bg-gray-50 dark:bg-zinc-900/50 p-3 rounded text-xs text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-zinc-800">
                          <span className="font-bold block mb-1">Customer Notes:</span>
                          {JSON.stringify(vendor.requirements)}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-left md:text-right">
                      <p className="text-lg font-bold mb-2">LKR {totalCost.toLocaleString()}</p>
                      <div className="flex items-center md:justify-end gap-1 mb-3">
                        {getVendorStatusIcon(vendor.status)}
                        <span className={`text-xs font-bold uppercase tracking-wider ${getVendorStatusColor(vendor.status)}`}>
                          {getVendorStatusText(vendor.status)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p className="flex items-center md:justify-end gap-1.5">
                          Advance: LKR {advance.toLocaleString()}
                          {vendor.advanceReceiptConfirmed && (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400" title="Vendor has confirmed receipt of the advance payment">
                              <CheckCircle2 size={14} />
                            </span>
                          )}
                        </p>
                        <p>Balance: LKR {(totalCost - advance).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {isDeclined && !locallyRemovedVendors.includes(serviceKey) && (
                    <div className="mt-4 pt-4 border-t border-red-100 dark:border-red-900/30">
                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        ⚠️ Action Required: Vendor Declined
                      </p>
                      
                      <div className="bg-red-50 dark:bg-red-900/10 rounded p-3 mb-4 text-xs text-red-800 dark:text-red-300">
                        <p className="mb-2">Your hall booking remains <strong>active and confirmed</strong>. Please choose how to proceed for this service.</p>
                        {vendor.rejectionReason && (
                          <p className="mb-1"><span className="font-semibold">Reason:</span> "{vendor.rejectionReason}"</p>
                        )}
                        {vendor.rejectedAt && (
                          <p><span className="font-semibold">Date:</span> {new Date(vendor.rejectedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => onAddVendor(booking._id || booking.id || '', serviceKey)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm transition-colors"
                        >
                          Change Vendor
                        </button>
                        <button 
                          onClick={() => setVendorRemovalModalState({ isOpen: true, serviceCategory: serviceKey as any, currentVendorId: vendor.vendorId })}
                          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                        >
                          Continue Without {serviceKey}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Rejection & Cancellation */}
        {(booking.status === "Rejected" || booking.status === "Cancelled") ? (
          <section className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6">
            <h3 className="text-red-700 dark:text-red-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5" /> Booking {booking.status}
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mb-6">
              {booking.status === "Cancelled" 
                ? "This booking has been cancelled by the user." 
                : (booking.rejectionReason || "Unfortunately, this booking has been rejected.")}
            </p>
            
            <div className="bg-white dark:bg-zinc-900 rounded p-4 border border-red-100 dark:border-red-900/30 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Advance Paid</p>
                <p className="font-bold text-[#1A1512] dark:text-white">LKR {actualDepositPaid.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-amber-600 mb-1 font-bold">Refund Status</p>
                <p className="font-bold text-[#1A1512] dark:text-white">Refund Processing</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-6 border border-gray-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#1A1512] dark:text-white mb-2">Cancellation Policy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Your current cancellation eligibility: <strong className="text-amber-600">
                {booking.status === "Confirmed" ? "25% Hall Penalty, Full Vendor Refund" : "Full refund"}
              </strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setShowPolicyModal(true)}
                className="px-6 py-3 border border-[#C9A84C] text-[#C9A84C] font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#C9A84C] hover:text-white transition-colors"
              >
                View Policy
              </button>
              <button 
                onClick={() => onCancelBooking(bId)}
                className="px-6 py-3 border border-red-200 text-red-600 font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </section>
        )}

      </div>

      <PolicyModal 
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        policyType="cancellation"
        cancellationTier="strict"
      />

      <VendorSwapModal
        isOpen={swapModalState.isOpen}
        onClose={() => setVendorSwapModalState({ ...swapModalState, isOpen: false })}
        bookingId={bId}
        serviceCategory={swapModalState.serviceCategory}
        currentVendorId={swapModalState.currentVendorId}
      />

      <VendorRemovalModal
        isOpen={removalModalState.isOpen}
        onClose={() => {
          setVendorRemovalModalState({ ...removalModalState, isOpen: false });
          // If the modal closes and the vendor was successfully removed, the global state will update.
          // To ensure the buttons hide immediately even before the global state propagates, we hide them locally.
          setLocallyRemovedVendors(prev => [...prev, removalModalState.serviceCategory]);
        }}
        bookingId={bId}
        serviceCategory={removalModalState.serviceCategory}
        currentVendorId={removalModalState.currentVendorId}
      />

      <ApplyBalanceModal
        isOpen={applyBalanceModalState.isOpen}
        onClose={() => setApplyBalanceModalState({ ...applyBalanceModalState, isOpen: false })}
        bookingId={bId}
        serviceKey={applyBalanceModalState.serviceKey}
        amount={applyBalanceModalState.amount}
        creditId={applyBalanceModalState.creditId}
      />
    </div>
  );
}
