"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { isSameCalendarDay, normalizeCalendarDate, parseBookingDate } from '@/lib/vendorUtils';

interface EventTimelineProps {
  bookings?: any[];
  selectedDate?: Date;
}

const EventTimeline = ({ bookings = [], selectedDate = new Date() }: EventTimelineProps) => {
  const normalizedSelected = normalizeCalendarDate(selectedDate);

  const dayBookings = bookings.filter((b) =>
    isSameCalendarDay(parseBookingDate(b.date), normalizedSelected)
  );

  const today = normalizeCalendarDate(new Date());
  const upcomingBookings = bookings
    .filter((b) => parseBookingDate(b.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-[#F2EBE1] border border-[#E0D8C3] flex flex-col min-h-full">
      {/* Selected Date Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight mb-1">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
          {dayBookings.length} {dayBookings.length === 1 ? 'SHOOT' : 'SHOOTS'} SCHEDULED
        </p>
      </div>

      {/* Selected Day Events List */}
      <div className="px-6 sm:px-8 py-5 border-b border-[#E0D8C3]/50">
        <div className="space-y-4">
          {dayBookings.length === 0 ? (
            <p className="text-gray-500 text-xs italic py-2">No shoots scheduled for this date.</p>
          ) : (
            dayBookings.map((b, idx) => {
              const status = b.vendors?.videographer?.status?.toUpperCase();
              let dotColor = "bg-[#B08D2C]";
              if (status === 'COMPLETED') dotColor = "bg-[#5A87C7]";
              else if (status === 'PENDING') dotColor = "bg-[#C4BCAB]";

              const clientName = b.clientName || (b.customerId ? `${b.customerId.firstName} ${b.customerId.lastName}` : "Client");

              return (
                <div key={b._id || idx} className="bg-white border border-[#E0D8C3] p-4 shadow-sm relative pl-8">
                  <div className={`absolute left-3 top-5 w-2.5 h-2.5 rounded-full ${dotColor} border-2 border-white`} />
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold text-[#7C6A2E] tracking-wider">
                      {b.timeslot || "10:00 AM"}
                    </span>
                    <span className="bg-[#EBE5D9] text-gray-600 px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase">
                      {status || "PENDING"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 font-serif">
                    {b.eventType} for {clientName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3 italic">
                    {b.vendors?.videographer?.packageName || "Custom Video Package"}
                  </p>
                  <div className="flex items-center space-x-1.5 text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                    <MapPin size={10} className="text-[#A6955C] shrink-0" />
                    <span>{b.location || "Venue TBD"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="flex-1 px-6 sm:px-8 py-6 relative">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">
          UPCOMING EVENTS
        </h3>
        
        <div className="absolute left-[27px] sm:left-[35px] top-14 bottom-6 w-px bg-[#E0D8C3]" />

        <div className="space-y-5 relative">
          {upcomingBookings.length === 0 ? (
            <div className="text-xs text-gray-500 italic py-6 text-center">No upcoming events scheduled.</div>
          ) : (
            upcomingBookings.map((b, idx) => {
              const eventDate = new Date(b.date);
              const status = b.vendors?.videographer?.status?.toUpperCase() || 'PENDING';
              const dotColor = idx === 0 ? 'bg-[#B08D2C]' : idx === 1 ? 'bg-[#5A87C7]' : 'bg-[#C4BCAB]';
              const clientName = b.clientName || (b.customerId ? `${b.customerId.firstName} ${b.customerId.lastName}` : "Client");

              return (
                <div key={b._id || idx} className="relative pl-8 sm:pl-10">
                  <div className={`absolute top-3.5 w-3 h-3 rounded-full ${dotColor} z-10 shrink-0 border-2 border-[#F2EBE1]`} style={{ left: '-3.5px' }} />
                  <div className="bg-white border border-[#E0D8C3] p-4 shadow-sm">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <span className="text-[10px] font-bold text-[#7C6A2E] tracking-wider">
                        {eventDate.toLocaleDateString()}
                      </span>
                      <span className="bg-[#EBE5D9] text-gray-600 px-2 py-0.5 text-[8px] font-bold tracking-widest uppercase">
                        {status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1 font-serif">
                      {clientName} - {b.eventType}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-serif leading-relaxed">
                      {b.vendors?.videographer?.checklist?.filter((c: any) => !c.isCompleted).length || 0} tasks remaining for preparation.
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 sm:p-8 pt-4 border-t border-[#E0D8C3] flex space-x-3 mt-auto">
        <Link href="/videographer/events-bookings" className="flex-1 bg-[#EBE5D9] hover:bg-[#E0D8C3] text-gray-700 py-3 font-semibold text-xs tracking-[0.15em] transition-colors text-center cursor-pointer">
          VIEW ALL
        </Link>

        <Link href="/videographer/upcoming-events" className="flex-1 bg-[#685724] hover:bg-[#4A463B] text-white py-3 font-semibold text-xs tracking-[0.15em] transition-colors shadow-md text-center">
          VIEW ASSIGNED
        </Link>
      </div>
    </div>
  );
};

export default EventTimeline;
