"use client";

import React from "react";
import { CalendarDays, Users, Package, ArrowRight } from "lucide-react";
import { BOOKING_HISTORY } from "./types";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Confirmed" },
  completed: { bg: "bg-blue-50", text: "text-blue-700", label: "Completed" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", label: "Cancelled" },
};

export default function BookingHistory() {
  return (
    <div className="bg-white border border-[#D4C9A8] rounded-sm shadow-sm hover-glow transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E6D0] bg-[#F0E6D0]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <div>
            <h4 className="text-sm font-serif text-[#2C1E14]">Booking History</h4>
            <p className="text-[10px] text-gray-400 font-light">Your past and upcoming events at EASCC.</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-widest font-bold text-[#A67C52] bg-[#F0E6D0] px-2.5 py-1 rounded-sm border border-[#D4C9A8]">
          {BOOKING_HISTORY.length} Bookings
        </span>
      </div>

      <div className="divide-y divide-[#F0E6D0]">
        {BOOKING_HISTORY.map((booking, idx) => {
          const status = STATUS_STYLES[booking.status];
          return (
            <div
              key={booking.id}
              className={`p-5 hover:bg-[#F0E6D0]/15 transition-all duration-200 group cursor-pointer stagger-${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-sm border border-gray-100">
                      {booking.id}
                    </span>
                    <span className={`text-[8px] uppercase tracking-[0.15em] font-bold px-1.5 py-0.5 rounded-sm ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Event Name */}
                  <h5 className="text-sm font-semibold text-[#2C1E14] group-hover:text-[#C9A84C] transition-colors">
                    {booking.eventName}
                  </h5>

                  {/* Details Row */}
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400 font-light">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {booking.package}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {booking.guests} guests
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-serif font-bold text-[#2C1E14]">{booking.total}</p>
                  <button className="mt-2 text-[9px] uppercase tracking-widest font-bold text-[#C9A84C] hover:text-[#2C1E14] transition-colors btn-interactive flex items-center gap-1 ml-auto">
                    View Details
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
