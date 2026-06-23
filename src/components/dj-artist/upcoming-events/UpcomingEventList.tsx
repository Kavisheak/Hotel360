"use client";

import React, { useEffect, useState } from "react";
import { useBookingStore } from "@/store/bookingStore";

const UpcomingEventList = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const djBookings = globalBookings.filter(b => b.vendors.dj?.vendorId != null);

  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Upcoming Events
      </h2>

      <div className="space-y-4">
        {isClient && djBookings.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 italic">No upcoming performances found.</div>
        ) : isClient ? (
          djBookings.map((event) => (
            <div
              key={event.id}
              className={`border p-4 hover:bg-[#FDF9F1] ${event.vendors.dj?.status === 'Pending' ? 'border-[#C69C6D] bg-[#FCF6E3]' : event.vendors.dj?.status === 'Declined' ? 'border-red-200 bg-red-50' : 'border-[#E0D8C3]'}`}
            >
              <p className="font-semibold text-gray-800">{event.clientName} - {event.eventType}</p>
              <p className="text-xs text-gray-500">
                {event.date}
              </p>
              <p className="text-xs text-gray-500">{event.guests} Guests</p>

              <span className={`mt-2 inline-block text-[10px] font-bold uppercase tracking-widest ${event.vendors.dj?.status === 'Pending' ? 'text-[#8C6A11]' : event.vendors.dj?.status === 'Declined' ? 'text-red-600' : 'text-emerald-600'}`}>
                {event.vendors.dj?.status === 'Pending' ? 'ACTION REQUIRED' : event.vendors.dj?.status || 'UNKNOWN'}
              </span>

              {event.vendors.dj?.status === 'Pending' && (
                <div className="flex items-center gap-2 mt-4">
                  <button 
                    className="flex-1 bg-[#1A1A1A] text-white py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-colors"
                    onClick={() => { useBookingStore.getState().vendorRespondBooking(event.id || event._id as string, "dj", "Accepted"); }}
                  >
                    Accept
                  </button>
                  <button 
                    className="flex-1 border border-red-600 text-red-600 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-red-50 transition-colors"
                    onClick={() => { useBookingStore.getState().vendorRespondBooking(event.id || event._id as string, "dj", "Declined"); }}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        ) : null}
      </div>
    </article>
  );
};

export default UpcomingEventList;