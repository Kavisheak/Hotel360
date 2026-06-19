"use client";

import React, { useEffect, useState } from "react";
import { useBookingStore } from "@/store/bookingStore";

const UpcomingEventList = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const djBookings = globalBookings.filter(b => b.vendors.dj !== "none");

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
              className="border border-[#E0D8C3] p-4 hover:bg-[#FDF9F1]"
            >
              <p className="font-semibold text-gray-800">{event.clientName} - {event.eventType}</p>
              <p className="text-xs text-gray-500">
                {event.date}
              </p>
              <p className="text-xs text-gray-500">{event.guests} Guests</p>

              <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-[#8C6A11]">
                {event.status}
              </span>
            </div>
          ))
        ) : null}
      </div>
    </article>
  );
};

export default UpcomingEventList;