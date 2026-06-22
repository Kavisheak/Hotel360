"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Users, Package, ArrowRight, Star, Loader2 } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useBookingStore } from "@/store/bookingStore";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", label: "Confirmed" },
  completed: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", label: "Completed" },
  pending: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", label: "Pending" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", label: "Cancelled" },
};

export default function BookingHistory() {
  const [isClient, setIsClient] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { bookings, isLoading } = useBookingStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatCurrency = (val: number) => "LKR " + val.toLocaleString();

  return (
    <div className="bg-[#FDFBF7] dark:bg-gradient-to-br dark:from-[#382B14] dark:via-[#1A1610] dark:to-[#0D0B08] border border-[#D4C9A8] dark:border-[#C9A84C]/40 rounded-sm shadow-md dark:shadow-[#C9A84C]/5 hover-glow transition-all duration-300 overflow-hidden">
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
                  </div>

                  {/* Price & Action */}
                  <div className="text-right flex-shrink-0 flex flex-col justify-between items-end">
                    <p className="text-sm font-serif font-bold text-[#2C1E14] dark:text-white">{formatCurrency(booking.totalCost)}</p>
                    <div className="flex items-center gap-3 mt-auto pt-4">
                      {statusKey === "completed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBookingId(booking._id || booking.id);
                            setIsFeedbackOpen(true);
                          }}
                          className="text-[9px] uppercase tracking-widest font-bold text-white bg-[#C69C6D] hover:bg-[#B58A59] px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Star className="w-3 h-3 fill-current" />
                          Leave Review
                        </button>
                      )}
                      <button className="text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-white transition-colors btn-interactive flex items-center gap-1">
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

      {selectedBookingId && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => {
            setIsFeedbackOpen(false);
            setTimeout(() => setSelectedBookingId(null), 300); // allow animation to finish
          }}
          bookingId={selectedBookingId}
        />
      )}
    </div>
  );
}
