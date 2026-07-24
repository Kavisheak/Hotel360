"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Users, Package, Star, Loader2, Download, RefreshCw, MessageSquare, X } from "lucide-react";
import CompletedEventReview from "./CompletedEventReview";
import VendorSwapModal from "./VendorSwapModal";
import BookingDetailsModal from "./BookingDetailsModal";
import RefundRequestModal from "./RefundRequestModal";
import { useBookingStore, type Booking } from "@/store/bookingStore";
import { useVendorStore } from "@/store/vendorStore";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: "Confirmed" },
  completed: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "Completed" },
  pending: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
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

  const { bookings, isLoading } = useBookingStore();
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  const handleDownloadReceipt = (booking: any) => {
    const receiptWindow = window.open("", "_blank");
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>EASCCA Conference Centre - Invoice</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              .header { border-bottom: 2px solid #C9A84C; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; color: #1A1512; }
              .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
              .amount { font-size: 32px; font-weight: bold; color: #C9A84C; margin: 30px 0; }
              .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center; margin-top: 50px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">EASCCA Conference Centre</div>
              <p>Official Booking Invoice</p>
            </div>
            <div class="meta">
              <div>
                <strong>Booking Ref:</strong> ${booking.bookingRef || booking._id?.slice(-6).toUpperCase()}<br/>
                <strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}<br/>
                <strong>Event:</strong> ${booking.eventName || booking.eventType}
              </div>
              <div>
                <strong>Status:</strong> ${booking.status}
              </div>
            </div>
            <hr/>
            <div>
              <h3>Pricing Summary</h3>
              <p>Guests: ${booking.guests}</p>
              <p>Timeslot: ${booking.timeslot}</p>
            </div>
            <div class="amount">
              LKR ${(booking.totalCost || 0).toLocaleString()}
            </div>
            <div class="footer">
              Thank you for choosing EASCCA Conference Centre for your luxury event.
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    }
  };

  return (
    <div className="space-y-6 text-left">
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
        <span className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#FAF6EE] dark:bg-[#1A1A1A] px-2.5 py-1 rounded-sm border border-[#C9A84C]/30">
          {isClient ? bookings.length : 0} Bookings
        </span>
      </div>

      {/* Grid List of Booking Cards */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>
        ) : isClient && bookings.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 italic bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-850 rounded-xl">No bookings found.</div>
        ) : isClient ? (
          bookings.map((booking) => {
            const eventDate = new Date(booking.date);
            const formattedDate = eventDate.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'short' });
            
            return (
              <div 
                key={booking._id || booking.id} 
                className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-5 text-left transition-all duration-300 hover:shadow-md"
              >
                
                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight font-sans">
                    {booking.eventName || booking.eventType || "Grand Ballroom"} — {formattedDate}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Booking #{booking.bookingRef || booking._id?.slice(-6).toUpperCase()}</p>
                </div>

                {/* Grid of Items (Hall + Active Vendors) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  {/* Hall Item */}
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 px-4 py-3 rounded-lg flex justify-between items-center border border-gray-100 dark:border-zinc-850">
                    <span className="text-gray-500 font-medium text-xs font-sans">Hall</span>
                    <span className={`text-xs font-bold ${
                      booking.status === "Confirmed" ? "text-emerald-600" : 
                      booking.status === "Cancelled" ? "text-red-500" : 
                      "text-amber-500"
                    }`}>
                      {booking.status === "CancellationRequested" ? "Cancellation Pending" : booking.status}
                    </span>
                  </div>

                  {/* Vendors Items */}
                  {booking.vendors && ["decorator", "dj", "videographer", "photographer", "cake", "florist"].map((service) => {
                    const vendor = booking.vendors[service as keyof typeof booking.vendors] as any;
                    if (!vendor || vendor.status === "NotRequired") return null;

                    const vStatus = vendor.status || "Pending";
                    const isAccepted = vStatus === "Accepted";
                    const isDeclined = vStatus === "Declined";

                    const labels: Record<string, string> = {
                      decorator: "Decorator",
                      dj: "DJ",
                      videographer: "Videographer",
                      photographer: "Photographer",
                      cake: "Cake",
                      florist: "Florist"
                    };

                    let statusText = vStatus;
                    let textColorClass = "text-gray-600 dark:text-gray-400";
                    
                    if (isAccepted) {
                      statusText = "Confirmed";
                      textColorClass = "text-emerald-600";
                    } else if (isDeclined) {
                      const pricingBreakdown: any = booking.pricingBreakdown || {};
                      const cost = pricingBreakdown[`${service}Cost`] || 0;
                      const creditVal = Math.round(cost * 1.08 * 0.3);
                      statusText = `Credit — LKR ${creditVal.toLocaleString()}`;
                      textColorClass = "text-amber-600";
                    } else if (vStatus === "Pending") {
                      statusText = "Pending";
                      textColorClass = "text-gray-500";
                    }

                    return (
                      <div key={service} className="bg-zinc-50 dark:bg-zinc-900/40 px-4 py-3 rounded-lg flex justify-between items-center border border-gray-100 dark:border-zinc-850">
                        <span className="text-gray-500 font-medium text-xs font-sans">{labels[service]}</span>
                        <span className={`text-xs font-bold ${textColorClass}`}>{statusText}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Invoice */}
                  <button 
                    onClick={() => handleDownloadReceipt(booking)}
                    className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 font-sans"
                  >
                    <Download className="w-3.5 h-3.5" /> Invoice
                  </button>

                  {/* Replace vendor */}
                  {!["Completed", "Cancelled"].includes(booking.status) && (
                    <button 
                      onClick={() => {
                        setSwapModalState({
                          isOpen: true,
                          bookingId: (booking._id || booking.id || "") as string,
                          service: "decorator"
                        });
                      }}
                      className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 font-sans"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Replace vendor
                    </button>
                  )}

                  {/* Message hotel */}
                  <button 
                    onClick={() => alert("Hotel concierge desk: concierge@eascc.lk | +94 11 234 5678")}
                    className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 font-sans"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Message hotel
                  </button>

                  {/* View Details */}
                  <button 
                    onClick={() => setDetailsModalBooking(booking)}
                    className="px-4 py-2 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-black rounded-lg text-xs font-bold transition-colors font-sans"
                  >
                    View details
                  </button>

                  {/* Leave review for completed bookings */}
                  {booking.status.toLowerCase() === "completed" && (
                    <button
                      onClick={() => {
                        const usedVendors: { service: "decorator" | "dj" | "videographer"; vendorId: string; vendorName: string }[] = [];
                        ["decorator", "dj", "videographer"].forEach((svc) => {
                          const v = booking.vendors?.[svc as keyof typeof booking.vendors] as any;
                          if (v?.vendorId && v.status !== "NotRequired") {
                            const resolved = globalVendors.find(gv => gv.userId === v.vendorId || gv.id === v.vendorId);
                            usedVendors.push({
                              service: svc as "decorator" | "dj" | "videographer",
                              vendorId: v.vendorId,
                              vendorName: resolved?.name || svc.charAt(0).toUpperCase() + svc.slice(1),
                            });
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
                      className="px-4 py-2 bg-[#C9A84C] text-[#2C1E14] dark:text-[#1A1A1A] font-bold text-xs rounded-lg hover:bg-[#B89238] transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Leave Review
                    </button>
                  )}

                  {/* Cancel Booking */}
                  {!["Completed", "Cancelled", "Rejected"].includes(booking.status) && (
                    <button 
                      onClick={() => {
                        setSelectedBookingForCancel(booking);
                        setShowCancelModal(true);
                      }}
                      className="px-4 py-2 border border-red-200 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors flex items-center gap-1.5 font-sans ml-auto"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel booking
                    </button>
                  )}
                </div>

              </div>
            );
          })
        ) : null}
      </div>

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

      <BookingDetailsModal 
        isOpen={!!detailsModalBooking}
        onClose={() => setDetailsModalBooking(null)}
        booking={detailsModalBooking}
      />

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

    </div>
  );
}
