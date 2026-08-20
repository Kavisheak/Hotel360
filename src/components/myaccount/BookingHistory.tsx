"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Users, Package, Star, Loader2, Download, RefreshCw, MessageSquare, X, Trash2 } from "lucide-react";
import CompletedEventReview from "./CompletedEventReview";
import VendorSwapModal from "./VendorSwapModal";
import VendorRemovalModal from "./VendorRemovalModal";
import RefundRequestModal from "./RefundRequestModal";
import BookingDetailView from "../shared/BookingDetailView";
import { useBookingStore, type Booking } from "@/store/bookingStore";
import { useVendorStore } from "@/store/vendorStore";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: "Confirmed" },
  completed: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "Completed" },
  pending: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
  rejected: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Rejected by Hall" },
  cancellationrequested: { bg: "bg-orange-50 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", label: "Cancellation Pending Approval" },
};

export default function BookingHistory() {
  const [isClient, setIsClient] = useState(false);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    bookingRef: string;
    eventName: string;
    vendors: { service: "decorator" | "dj" | "videographer"; vendorId: string; vendorName: string }[];
  }>({
    isOpen: false,
    bookingId: "",
    bookingRef: "",
    eventName: "",
    vendors: [],
  });

  const [detailsModalBooking, setDetailsModalBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean, type: 'single' | 'all', bookingId?: string }>({ isOpen: false, type: 'single' });

  const { bookings, isLoading, clearBookingHistory, deleteBookingHistory } = useBookingStore();
  const { vendors: globalVendors, fetchVendors } = useVendorStore();
  
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);
  
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    bookingId: string;
    service: "decorator" | "dj" | "videographer";
    currentVendorId?: string;
  }>({ isOpen: false, bookingId: "", service: "decorator" });

  const [removalModalState, setRemovalModalState] = useState<{
    isOpen: boolean;
    bookingId: string;
    service: any;
    currentVendorId?: string;
  }>({ isOpen: false, bookingId: "", service: "decorator" });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (detailsModalBooking) {
      const updated = bookings.find(b => (b._id || b.id) === (detailsModalBooking._id || detailsModalBooking.id));
      if (updated) setDetailsModalBooking(updated);
    }
  }, [bookings]);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  const handleDownloadReceipt = async (booking: any) => {
    let vendorAdvances: any[] = [];
    try {
      const { customerBookingAPI } = await import("@/lib/api");
      const res = await customerBookingAPI.getVendorAdvances(booking._id || booking.id);
      if (res.ok && res.data?.data) {
        vendorAdvances = res.data.data;
      }
    } catch (e) {
      console.error("Failed to fetch vendor advances for receipt:", e);
    }
    
    const paidAdvances = vendorAdvances.filter(a => a.status === "PAID");
    const totalVendorAdvancesPaid = paidAdvances.reduce((sum, a) => sum + (a.requestedAmount || 0), 0);
    
    const depositAmount = booking.depositAmount || 0;
    const balanceAmount = booking.balanceAmount || 0;
    const bookingCredit = booking.bookingCredit || 0;
    const totalCost = booking.totalCost || 0;
    
    const totalPaid = depositAmount + balanceAmount + totalVendorAdvancesPaid + bookingCredit;
    const remainingBalance = Math.max(0, totalCost - totalPaid);
    
    const downloadedTime = new Date().toLocaleString();
    const eventDate = new Date(booking.date).toLocaleDateString();

    const receiptWindow = window.open("", "_blank");
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>Payment Summary - ${booking.bookingRef || booking._id?.slice(-6).toUpperCase()}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #C9A84C; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
              .title { font-size: 28px; font-weight: bold; color: #1A1512; margin: 0; }
              .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
              .download-info { text-align: right; font-size: 12px; color: #888; }
              
              .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f9f9f9; padding: 20px; border-radius: 8px; }
              .meta-item { font-size: 14px; }
              .meta-item strong { display: block; font-size: 12px; text-transform: uppercase; color: #888; margin-bottom: 4px; }
              
              .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .table th { text-align: left; padding: 12px; border-bottom: 2px solid #ddd; color: #555; text-transform: uppercase; font-size: 12px; }
              .table td { padding: 12px; border-bottom: 1px solid #eee; }
              .table tr:last-child td { border-bottom: none; }
              
              .totals { width: 50%; float: right; margin-bottom: 40px; }
              .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
              .total-row.grand { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 12px; margin-top: 4px; }
              .total-row.balance { font-size: 20px; font-weight: bold; color: #C9A84C; border-top: 1px solid #ddd; padding-top: 12px; margin-top: 4px; }
              
              .footer { clear: both; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center; margin-top: 50px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h1 class="title">EASCCA</h1>
                <div class="subtitle">Official Payment Summary Receipt</div>
              </div>
              <div class="download-info">
                Downloaded on:<br/>
                <strong>${downloadedTime}</strong>
              </div>
            </div>
            
            <div class="meta-grid">
              <div class="meta-item">
                <strong>Booking Ref</strong>
                ${booking.bookingRef || booking._id?.slice(-6).toUpperCase()}
              </div>
              <div class="meta-item">
                <strong>Event Date</strong>
                ${eventDate}
              </div>
              <div class="meta-item">
                <strong>Client Name</strong>
                ${booking.clientName || 'Customer'}
              </div>
              <div class="meta-item">
                <strong>Status</strong>
                ${booking.status}
              </div>
            </div>

            <h3>Payment Breakdown</h3>
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount (LKR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Booking Cost (Hall & Vendors)</td>
                  <td style="text-align: right;">${totalCost.toLocaleString()}</td>
                </tr>
                ${depositAmount > 0 ? `
                <tr>
                  <td style="color: #2e7d32;">✓ Advanced Payment (Hall)</td>
                  <td style="text-align: right; color: #2e7d32;">- ${depositAmount.toLocaleString()}</td>
                </tr>
                ` : ''}
                ${paidAdvances.map(adv => `
                <tr>
                  <td style="color: #2e7d32;">✓ Vendor Advance (${adv.vendorRole})</td>
                  <td style="text-align: right; color: #2e7d32;">- ${(adv.requestedAmount || 0).toLocaleString()}</td>
                </tr>
                `).join('')}
                ${balanceAmount > 0 ? `
                <tr>
                  <td style="color: #2e7d32;">✓ Balance Payment</td>
                  <td style="text-align: right; color: #2e7d32;">- ${balanceAmount.toLocaleString()}</td>
                </tr>
                ` : ''}
                ${bookingCredit > 0 ? `
                <tr>
                  <td style="color: #ed6c02;">✓ Booking Credit Applied</td>
                  <td style="text-align: right; color: #ed6c02;">- ${bookingCredit.toLocaleString()}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span>Total Cost:</span>
                <span>${totalCost.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Total Paid:</span>
                <span>${totalPaid.toLocaleString()}</span>
              </div>
              <div class="total-row balance">
                <span>Remaining Balance Due:</span>
                <span>${remainingBalance.toLocaleString()}</span>
              </div>
            </div>

            <div class="footer">
              This is a digitally generated payment summary for your records.<br/>
              Thank you for choosing EASCCA Conference Centre.
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    }
  };

  return (
    <div className="space-y-6 text-left">
      {detailsModalBooking ? (
        <BookingDetailView 
          booking={detailsModalBooking} 
          onBack={() => setDetailsModalBooking(null)} 
          onCancelBooking={(bookingId) => {
            setSelectedBookingForCancel(detailsModalBooking);
            setShowCancelModal(true);
          }}
          onAddVendor={(bookingId, serviceKey) => {
            const vendorData = detailsModalBooking.vendors?.[serviceKey as keyof typeof detailsModalBooking.vendors] as any;
            setSwapModalState({
              isOpen: true,
              bookingId,
              service: serviceKey as any,
              currentVendorId: vendorData?.vendorId || undefined
            });
          }}
        />
      ) : (
      <>
      {/* List Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4C9A8] dark:border-zinc-800/80 bg-white dark:bg-[#111] rounded-xl">
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <div>
            <h4 className="text-sm font-serif text-[#2C1E14] dark:text-white">Booking History</h4>
            <p className="text-[10px] text-gray-500 font-light mt-0.5">Manage your active itineraries and cancellations.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isClient && bookings.length > 0 && (
            <button 
              onClick={() => setDeleteConfirmModal({ isOpen: true, type: 'all' })}
              className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
          <span className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#FAF6EE] dark:bg-[#1A1A1A] px-2.5 py-1 rounded-sm border border-[#C9A84C]/30">
            {isClient ? bookings.length : 0} Bookings
          </span>
        </div>
      </div>

      {/* Grid List of Booking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 items-start">
        {isLoading ? (
          <div className="flex justify-center py-10 lg:col-span-full"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>
        ) : isClient && bookings.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 italic bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-850 rounded-xl lg:col-span-full">No bookings found.</div>
        ) : isClient ? (
          bookings.map((booking) => {
            const eventDate = new Date(booking.date);
            const formattedDate = eventDate.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'short' });
            
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
            const actualTotalPaid = actualDepositPaid + (booking.balanceAmount || 0);
            
            return (
              <div 
                key={booking._id || booking.id} 
                className="group relative bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Header Row */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">Booking #{booking.bookingRef || booking._id?.slice(-6).toUpperCase()}</span>
                    <button 
                      onClick={() => setDeleteConfirmModal({ isOpen: true, type: 'single', bookingId: booking._id || booking.id })}
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      booking.status === "Confirmed" || booking.status === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : 
                      booking.status === "Cancelled" || booking.status === "Rejected" ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800" : 
                      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                    }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {booking.status === "CancellationRequested" ? "Cancellation Pending" : 
                     booking.status === "Pending Hall Confirmation" ? "Awaiting Hall" : 
                     booking.status === "DEPOSIT_PAID" ? "Awaiting Manager Approval" : 
                     booking.status}
                  </span>
                </div>

                {/* Event Details */}
                <div className="mb-4">
                  <h3 className="text-xl md:text-2xl font-serif text-[#1A1512] dark:text-white mb-2 leading-tight">
                    {booking.eventType || "Event"}
                  </h3>
                  <div className="space-y-1.5">
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#C9A84C]" /> 
                      {formattedDate} {booking.timeslot && `• ${booking.timeslot}`}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">📍</span> 
                      EASCCA Conference Centre
                    </p>
                  </div>
                </div>

                {/* Declined Vendors Action Required */}
                {(() => {
                  const declinedVendors = [];
                  ["decorator", "dj", "videographer", "photographer", "cake", "florist"].forEach(svc => {
                    const v = booking.vendors?.[svc as keyof typeof booking.vendors] as any;
                    if (v && v.status === "Declined") {
                      declinedVendors.push({ service: svc, ...v });
                    }
                  });

                  if (declinedVendors.length === 0) return null;

                  return (
                    <div className="mb-4">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded border border-red-200">
                        ⚠️ Action Required: Vendor Declined
                      </span>
                    </div>
                  );
                })()}

                {/* Services List */}
                <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-[#A6955C] uppercase tracking-wider mb-1">
                    {(() => {
                      const svcs = ["Hall"];
                      if (booking.vendors?.decorator?.status !== "NotRequired") svcs.push("Decorator");
                      if (booking.vendors?.videographer?.status !== "NotRequired") svcs.push("Videographer");
                      if (booking.vendors?.dj?.status !== "NotRequired") svcs.push("DJ");
                      if (booking.vendors?.photographer?.status !== "NotRequired") svcs.push("Photographer");
                      if (booking.vendors?.cake?.status !== "NotRequired") svcs.push("Cake");
                      if (booking.vendors?.florist?.status !== "NotRequired") svcs.push("Florist");
                      return `${svcs.length} Services`;
                    })()}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                    {(() => {
                      const svcs = ["Hall"];
                      if (booking.vendors?.decorator?.status !== "NotRequired") svcs.push("Decorator");
                      if (booking.vendors?.videographer?.status !== "NotRequired") svcs.push("Videographer");
                      if (booking.vendors?.dj?.status !== "NotRequired") svcs.push("DJ");
                      if (booking.vendors?.photographer?.status !== "NotRequired") svcs.push("Photographer");
                      if (booking.vendors?.cake?.status !== "NotRequired") svcs.push("Cake");
                      if (booking.vendors?.florist?.status !== "NotRequired") svcs.push("Florist");
                      return svcs.join(" • ");
                    })()}
                  </p>
                </div>

                {/* Financials */}
                <div className="space-y-1.5 mb-6 text-xs">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Total</span>
                    <span className="font-medium text-[#1A1512] dark:text-white">LKR {(booking.totalCost || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Total Paid</span>
                    <span className="font-medium text-emerald-600">LKR {actualTotalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400 font-bold border-t border-gray-100 dark:border-zinc-800 pt-3 mt-3">
                    <span className="uppercase tracking-widest text-xs mt-0.5">Balance</span>
                    <span className="text-[#C9A84C] text-base">LKR {Math.max(0, (booking.totalCost || 0) - actualTotalPaid).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setDetailsModalBooking(booking)}
                    className="flex-1 py-3 bg-transparent border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-black rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                  >
                    View Booking
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownloadReceipt(booking)}
                      className="p-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-[#C9A84C] transition-colors"
                      title="Download Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {booking.status.toLowerCase() === "completed" && (
                      <button
                        onClick={() => {
                          const usedVendors: any = [];
                          ["decorator", "dj", "videographer"].forEach((svc) => {
                            const v = booking.vendors?.[svc as keyof typeof booking.vendors] as any;
                            if (v?.vendorId && v.status !== "NotRequired") {
                              const resolved = globalVendors.find(gv => gv.userId === v.vendorId || gv.id === v.vendorId);
                              usedVendors.push({ service: svc, vendorId: v.vendorId, vendorName: resolved?.name || svc });
                            }
                          });
                          setReviewModal({
                            isOpen: true,
                            bookingId: (booking._id || booking.id) as string,
                            bookingRef: (booking.bookingRef || (booking._id ? booking._id.slice(-6) : booking.id)) as string,
                            eventName: booking.eventName || booking.eventType || "Event",
                            vendors: usedVendors,
                          });
                        }}
                        className="p-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                        title="Leave Review"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    )}
                    {!["Completed", "Cancelled", "Rejected"].includes(booking.status) && (
                      <button 
                        onClick={() => {
                          setSelectedBookingForCancel(booking);
                          setShowCancelModal(true);
                        }}
                        className="p-3 border border-red-200 dark:border-red-900/30 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Cancel Booking"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : null}
      </div>
      </>
      )}

      <CompletedEventReview
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        bookingId={reviewModal.bookingId}
        bookingRef={reviewModal.bookingRef}
        eventName={reviewModal.eventName}
        vendors={reviewModal.vendors}
      />

      {swapModalState.isOpen && (
        <VendorSwapModal
          isOpen={swapModalState.isOpen}
          onClose={() => setSwapModalState({ ...swapModalState, isOpen: false })}
          bookingId={swapModalState.bookingId}
          serviceCategory={swapModalState.service}
          currentVendorId={swapModalState.currentVendorId}
        />
      )}

      {removalModalState.isOpen && (
        <VendorRemovalModal
          isOpen={removalModalState.isOpen}
          onClose={() => setRemovalModalState({ ...removalModalState, isOpen: false })}
          bookingId={removalModalState.bookingId}
          serviceCategory={removalModalState.service}
          currentVendorId={removalModalState.currentVendorId}
        />
      )}

      {showCancelModal && selectedBookingForCancel && (
        <RefundRequestModal
          booking={selectedBookingForCancel}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedBookingForCancel(null);
          }}
          onSuccess={() => {
            const { fetchUserBookings } = useBookingStore.getState();
            fetchUserBookings();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmModal({ isOpen: false, type: 'single' })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-3">
                {deleteConfirmModal.type === 'all' ? 'Clear Booking History?' : 'Remove from History?'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
                {deleteConfirmModal.type === 'all' 
                  ? 'Are you sure you want to remove all bookings from your history? This action cannot be undone, but will not cancel any active bookings.' 
                  : 'Are you sure you want to remove this booking from your history? It will no longer be visible here.'}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmModal({ isOpen: false, type: 'single' })}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#1A1512] dark:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (deleteConfirmModal.type === 'all') {
                      await clearBookingHistory();
                    } else if (deleteConfirmModal.bookingId) {
                      await deleteBookingHistory(deleteConfirmModal.bookingId);
                    }
                    setDeleteConfirmModal({ isOpen: false, type: 'single' });
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
