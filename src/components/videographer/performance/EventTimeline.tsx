"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

interface EventTimelineProps {
  bookings?: any[];
  selectedDate?: Date;
}

const EventTimeline = ({ bookings = [], selectedDate = new Date() }: EventTimelineProps) => {
  const dayBookings = bookings.filter(b => {
    const bDate = new Date(b.date);
    return bDate.getDate() === selectedDate.getDate() && 
           bDate.getMonth() === selectedDate.getMonth() && 
           bDate.getFullYear() === selectedDate.getFullYear();
  });

  return (
    <div className="bg-[#F2EBE1] border border-[#E0D8C3] flex flex-col min-h-full">
      {/* Date Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight mb-1">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
          {dayBookings.length} {dayBookings.length === 1 ? 'SHOOT' : 'SHOOTS'} SCHEDULED
        </p>
      </div>

      {/* Events */}
      <div className="flex-1 px-6 sm:px-8 py-6 relative">
        <div className="absolute left-[27px] sm:left-[35px] top-6 bottom-0 w-px bg-[#E0D8C3]" />

        <div className="space-y-6 relative">
          {dayBookings.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No shoots scheduled for this date.</p>
          ) : (
            dayBookings.map((b, idx) => {
              const status = b.vendors?.videographer?.status?.toUpperCase();
              let dotColor = "bg-[#B08D2C]";
              if (status === 'COMPLETED') dotColor = "bg-[#5A87C7]";
              else if (status === 'PENDING') dotColor = "bg-[#C4BCAB]";

              return (
                <div key={b._id || idx} className="relative pl-8 sm:pl-10">
                  <div className={`absolute left-[-6px] top-3.5 w-3 h-3 rounded-full ${dotColor} z-10 shrink-0 border-2 border-[#F2EBE1]`} />

                  <div className="bg-white border border-[#E0D8C3] p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <span className="text-[11px] font-bold text-[#7C6A2E] tracking-wider">
                        {b.time || "TBD"}
                      </span>

                      <span className="bg-[#EBE5D9] text-gray-600 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                        {status || "PENDING"}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 font-serif">
                      {b.eventType} for {b.clientName}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 leading-relaxed font-serif">
                      {b.vendors?.videographer?.packageName || "Custom Package"}
                    </p>

                    <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                      <MapPin size={13} className="text-[#A6955C] shrink-0" />
                      <span>{b.location?.address || b.location?.city || "TBD"}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 sm:p-8 pt-4 border-t border-[#E0D8C3] flex space-x-3 mt-auto">
        <Link href="/videographer/events-bookings" className="flex-1 bg-[#EBE5D9] hover:bg-[#E0D8C3] text-gray-700 py-3 font-semibold text-xs tracking-[0.15em] transition-colors text-center">
          VIEW ALL
        </Link>
      </div>
    </div>
  );
};

export default EventTimeline;
