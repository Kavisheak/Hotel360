"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Users, Package, ArrowRight, Star, Loader2 } from "lucide-react";
import CompletedEventReview from "./CompletedEventReview";
import VendorSwapModal from "./VendorSwapModal";
import BookingDetailsModal from "./BookingDetailsModal";
import { useBookingStore, type Booking } from "@/store/bookingStore";
import { useVendorStore } from "@/store/vendorStore";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: "Confirmed" },
  completed: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "Completed" },
  pending: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
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

  const formatCurrency = (val: number) => "LKR " + val.toLocaleString();

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#C9A84C]/30 rounded-lg shadow-[0_4px_20px_rgba(201,168,76,0.15)] hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/20 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <div>
            <h4 className="text-sm font-serif text-[#2C1E14] dark:text-white">Booking History</h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light">Your past and upcoming events at EASCC.</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] bg-[#F0E6D0]/50 dark:bg-[#1A1A1A] px-2.5 py-1 rounded-sm border border-[#C9A84C] dark:border-[#C9A84C]/30">
          {isClient ? bookings.length : 0} Bookings
        </span>
      </div>

      <div className="divide-y divide-[#D4C9A8] dark:divide-[#C9A84C]/20">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" /></div>
        ) : isClient && bookings.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 italic">No bookings found.</div>
        ) : isClient ? (
          bookings.map((booking, idx) => {
            const statusKey = booking.status ? booking.status.toLowerCase() : "pending";
            const status = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
            return (
              <div
                key={booking._id || booking.id}
                className={`p-5 hover:bg-[#F0E6D0]/50 dark:hover:bg-[#C9A84C]/5 transition-all duration-200 group cursor-pointer stagger-${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded-sm border border-gray-300 dark:border-gray-700">
                        {booking._id ? booking._id.slice(-6) : booking.id}
                      </span>
                      <span className={`text-[8px] uppercase tracking-[0.15em] font-bold px-1.5 py-0.5 rounded-sm ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Event Name */}
                    <h5 className="text-sm font-semibold text-[#2C1E14] dark:text-white group-hover:text-[#C9A84C] transition-colors">
                      {booking.eventType || booking.eventName || "Event"}
                    </h5>

                    {/* Details Row */}
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-600 dark:text-gray-400 font-light">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {booking.menuType || booking.package} menu
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {booking.guests} guests
                      </span>
                    </div>

                    {/* Vendors Status Row */}
                    {booking.vendors && (
                      <div className="mt-4 space-y-2">
                        {["decorator", "dj", "videographer"].map((service) => {
                          const vendor = booking.vendors[service as keyof typeof booking.vendors] as any;
                          
                           // If vendor is not present or NotRequired, and booking status is NOT active (non-completed/non-cancelled), don't show it
                           const hasVendor = vendor && typeof vendor === 'object' && vendor.vendorId && vendor.status !== "NotRequired";
                           const canModifyVendors = booking && !["completed", "cancelled"].includes(booking.status.toLowerCase());
                           
                           if (!hasVendor && !canModifyVendors) return null;
                           
                           const resolvedVendor = globalVendors.find(v => v.userId === vendor?.vendorId || v.id === vendor?.vendorId);
                           const vendorName = resolvedVendor ? resolvedVendor.name : "None (No vendor selected)";
                           
                           const vStatus = vendor?.status || "NotRequired";
                           const isDeclined = vStatus === "Declined";
                           
                           return (
                             <div key={service} className={`flex flex-col sm:flex-row sm:items-center justify-between text-[10px] p-2.5 rounded-sm border ${isDeclined ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-gray-50 border-gray-100 dark:bg-[#1C1C1C] dark:border-gray-800'} gap-2`}>
                               <div className="flex flex-wrap items-center gap-2">
                                 <span className="capitalize font-semibold text-gray-700 dark:text-gray-300">{service}:</span>
                                 <span className="text-gray-600 dark:text-gray-400 font-medium">{vendorName}</span>
                                 {hasVendor && (
                                   <span className={`font-bold ${isDeclined ? 'text-red-600' : vStatus === 'Accepted' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                     ({vStatus})
                                   </span>
                                 )}
                               </div>
                               
                               <div className="flex items-center gap-2 shrink-0">
                                {canModifyVendors && (!hasVendor || ["pending", "declined", "rejected", "notrequired"].includes(vStatus.toLowerCase())) && (
                                  <>
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setSwapModalState({
                                          isOpen: true,
                                          bookingId: booking.id || booking._id,
                                          service: service as "decorator" | "dj" | "videographer",
                                          currentVendorId: vendor?.vendorId || undefined
                                        });
                                      }}
                                      className="text-[8px] tracking-wider uppercase font-bold text-white bg-[#C9A84C] hover:bg-[#B08D2C] px-2.5 py-1 rounded-sm transition-colors"
                                    >
                                      {hasVendor ? "Change" : "Add"}
                                    </button>
                                    
                                    {hasVendor && (
                                      <button 
                                        onClick={async (e) => { 
                                          e.stopPropagation(); 
                                          if (confirm(`Are you sure you want to remove this ${service} vendor?`)) {
                                            const { useBookingStore } = await import("@/store/bookingStore");
                                            await useBookingStore.getState().swapVendor(booking.id || booking._id, service, "none");
                                          }
                                        }}
                                        className="text-[8px] tracking-wider uppercase font-bold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-sm transition-colors"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </>
                                )}
                                 
                                 {!canModifyVendors && isDeclined && (
                                   <button 
                                     onClick={(e) => { 
                                       e.stopPropagation(); 
                                       setSwapModalState({
                                         isOpen: true,
                                         bookingId: booking.id || booking._id,
                                         service: service as "decorator" | "dj" | "videographer",
                                         currentVendorId: vendor?.vendorId || undefined
                                       });
                                     }}
                                     className="text-[8px] tracking-wider uppercase font-bold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-sm transition-colors"
                                   >
                                     Change
                                   </button>
                                 )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
                  <div className="text-right flex-shrink-0 flex flex-col justify-between items-end">
                    <p className="text-sm font-serif font-bold text-[#2C1E14] dark:text-white">{formatCurrency(booking.totalCost)}</p>
                    <div className="flex items-center gap-3 mt-auto pt-4">
                      {statusKey === "completed" && (
                        <button
                          onClick={() => {
                            // Build the list of vendors that were actually used in this booking
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
                              bookingId: booking._id || booking.id,
                              bookingRef: booking.bookingRef || (booking._id ? booking._id.slice(-6) : booking.id),
                              eventName: booking.eventName || booking.eventType || "Event",
                              vendors: usedVendors,
                            });
                          }}
                          className="text-[9px] uppercase tracking-widest font-bold text-white bg-[#C9A84C] hover:bg-[#B08D2C] px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Star className="w-3 h-3 fill-current" />
                          Leave Review
                        </button>
                      )}
                      <button 
                        onClick={() => setDetailsModalBooking(booking)}
                        className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-white transition-colors btn-interactive flex items-center gap-1"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
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
    </div>
  );
}
