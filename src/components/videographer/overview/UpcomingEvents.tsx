"use client";

import React, { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';

interface UpcomingEventProps {
  date: string;
  month: string;
  status: string;
  title: string;
  venue: string;
  details: string;
  progress: number;
  isPending: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}

const UpcomingEvent = ({ date, month, status, title, venue, details, progress, isPending, onAccept, onDecline }: UpcomingEventProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-[#4A463B] text-white w-12 h-14 flex flex-col justify-center items-center">
          <span className="text-lg font-bold font-serif leading-none">{date}</span>
          <span className="text-[8px] font-bold tracking-widest">{month}</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{status}</span>
      </div>

      <div>
        <h3 className="text-2xl font-serif text-gray-800 tracking-tight leading-tight mb-2">{title}</h3>
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">
          <span>{venue}</span>
          <span>·</span>
          <span>{details}</span>
        </div>
      </div>

      <div className="flex space-x-1 mt-auto pt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < progress ? 'bg-[#7C6A2E]' : 'bg-[#E0D8C3]'}`}
          />
        ))}
      </div>

      {isPending && (
        <div className="flex items-center gap-2 mt-6">
          <button 
            className="flex-1 bg-[#1A1A1A] text-white py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-colors"
            onClick={onAccept}
          >
            Accept
          </button>
          <button 
            className="flex-1 border border-red-600 text-red-600 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-red-50 transition-colors"
            onClick={onDecline}
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

const UpcomingEvents = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const videoBookings = globalBookings.filter(b => b.vendors.videographer?.vendorId != null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isClient && videoBookings.length === 0 ? (
        <div className="col-span-full py-12 text-center text-sm text-gray-500 font-light italic border border-[#E0D8C3] bg-white">
          No videography events scheduled yet.
        </div>
      ) : isClient ? (
        videoBookings.slice(0, 2).map((booking, idx) => {
          // Extract day and month from date
          const dateParts = new Date(booking.date);
          const day = isNaN(dateParts.getDate()) ? "22" : dateParts.getDate().toString();
          const month = isNaN(dateParts.getMonth()) ? "SEPT" : dateParts.toLocaleString('default', { month: 'short' }).toUpperCase();
          const videoStatus = booking.vendors.videographer?.status || "Pending";
          const displayStatus = videoStatus === "Pending" ? "ACTION REQUIRED" : videoStatus.toUpperCase();

          return (
            <UpcomingEvent
              key={booking.id}
              date={day}
              month={month}
              status={displayStatus}
              title={`${booking.clientName}'s ${booking.eventType}`}
              venue={booking.menuType + " Menu"}
              details={`${booking.guests} GUESTS`}
              progress={idx === 0 ? 1 : 2}
              isPending={videoStatus === "Pending"}
              onAccept={() => { useBookingStore.getState().vendorRespondBooking(booking.id || booking._id as string, "videographer", "Accepted"); }}
              onDecline={() => { useBookingStore.getState().vendorRespondBooking(booking.id || booking._id as string, "videographer", "Declined"); }}
            />
          );
        })
      ) : null}
    </div>
  );
};

export default UpcomingEvents;
