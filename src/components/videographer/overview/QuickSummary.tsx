"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Film } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const QuickSummary = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const videoBookings = globalBookings.filter(b => b.vendors.videographer !== "none");
  const upcomingBooking = videoBookings.find(b => b.status === "Pending");

  if (isClient && !upcomingBooking) {
    return (
      <div className="bg-white border border-[#E0D8C3] p-8 text-center text-sm text-gray-500 italic shadow-sm">
        No upcoming events to summarize.
      </div>
    );
  }

  // Fallback for SSR or if client hasn't loaded yet
  const displayTitle = isClient && upcomingBooking ? `${upcomingBooking.clientName}'s ${upcomingBooking.eventType}` : "Zahra & Omar's Wedding Film";
  const displayPackage = isClient && upcomingBooking ? upcomingBooking.package : "GOLD PACKAGE";
  const displayVenue = isClient && upcomingBooking ? "GRAND IMPERIAL HALL" : "GRAND IMPERIAL HALL";
  const displayGuests = isClient && upcomingBooking ? `${upcomingBooking.guests} GUESTS` : "350 GUESTS";

  let day = "14";
  let month = "SEPT";
  if (isClient && upcomingBooking) {
    const d = new Date(upcomingBooking.date);
    if (!isNaN(d.getDate())) {
      day = d.getDate().toString();
      month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    }
  }

  return (
    <div className="bg-white border border-[#E0D8C3] flex overflow-hidden shadow-sm relative">
      <div className="bg-[#4A463B] text-white w-32 flex flex-col justify-center items-center py-8 shrink-0">
        <span className="text-5xl font-bold font-serif mb-1 tracking-tight">{day}</span>
        <span className="text-xs font-bold tracking-widest text-gray-300">{month}</span>
      </div>

      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-4xl font-serif text-gray-800 tracking-tight leading-none mb-4">
            {displayTitle}
          </h2>
          <div className="bg-[#F9DD76] px-4 py-2 border border-[#E0D8C3]">
            <p className="text-[10px] font-bold tracking-widest text-[#7C6A2E] leading-tight text-center uppercase">{displayPackage}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold tracking-widest text-gray-500 mb-6 uppercase">
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-[#A6955C]" />
            <span>{displayVenue}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={14} className="text-[#A6955C]" />
            <span>{displayGuests}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Film size={14} className="text-[#A6955C]" />
            <span>EVENT COVERAGE PROGRESS</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="bg-[#F2EADA] text-[#7C6A2E] px-3 py-1 text-[10px] font-bold tracking-widest uppercase">CEREMONY</span>
          <span className="bg-[#F2EADA] text-[#7C6A2E] px-3 py-1 text-[10px] font-bold tracking-widest uppercase">DRONE SHOTS</span>
          <span className="bg-[#F2EADA] text-[#7C6A2E] px-3 py-1 text-[10px] font-bold tracking-widest uppercase">RECEPTION CUT</span>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">
            <span>EVENT COVERAGE PROGRESS</span>
            <span className="text-[#7C6A2E]">65%</span>
          </div>
          <div className="w-full bg-[#E0D8C3] h-1">
            <div className="bg-[#7C6A2E] h-1" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSummary;
