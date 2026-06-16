"use client";

import React, { useState, useEffect } from 'react';
import { Camera, CalendarDays, CheckCircle2, Star } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const OverviewStats = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const videoBookings = globalBookings.filter(b => b.vendors.videographer !== "none");
  const upcomingCount = videoBookings.filter(b => b.status === "Pending").length;
  const completedCount = videoBookings.filter(b => b.status === "Confirmed").length;

  const stats = [
    { label: 'TOTAL ASSIGNED EVENTS', value: isClient ? videoBookings.length.toString().padStart(2, '0') : '00', icon: <Camera size={22} className="text-[#B08D2C]" /> },
    { label: 'UPCOMING EVENTS', value: isClient ? upcomingCount.toString().padStart(2, '0') : '00', icon: <CalendarDays size={22} className="text-[#B08D2C]" /> },
    { label: 'COMPLETED EVENTS', value: isClient ? completedCount.toString().padStart(2, '0') : '00', icon: <CheckCircle2 size={22} className="text-[#B08D2C]" /> },
    { label: 'AVERAGE RATING', value: '4.9', icon: <Star size={22} className="text-[#B08D2C]" /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#FDF9F1] border border-[#E0D8C3] p-4 sm:p-5 flex flex-col justify-between min-h-[110px] shadow-sm"
        >
          <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-3">
            {stat.label}
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl sm:text-4xl font-serif text-[#7C6A2E] font-bold tracking-tight">
              {stat.value}
            </span>
            <span className="opacity-60">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
