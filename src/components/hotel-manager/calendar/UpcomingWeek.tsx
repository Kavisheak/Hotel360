"use client";

import React, { useEffect, useState } from 'react';
import { Users, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { bookingAPI } from '@/lib/api';

const UpcomingWeek = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    bookingAPI.getAllBookings().then(res => {
      if (res.ok && res.data?.data) {
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 14); // Look ahead 14 days for more density

        const upcoming = res.data.data
          .filter((b: any) => {
            if (!b.date) return false;
            const d = new Date(b.date);
            return d >= now && d <= nextWeek;
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5) // Show top 5
          .map((b: any) => {
            const d = new Date(b.date);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
            
            let badge = 'Pending';
            let badgeColor = 'bg-[#F2EADA] text-[#7C6A2E] border border-[#E0D8C3]';
            if (b.status === 'Confirmed' || b.status === 'DepositPaid' || b.status === 'BalancePaid') {
              badge = 'Confirmed';
              badgeColor = 'bg-[#B08D2C] text-white';
            }

            return {
              date: dateStr,
              time: b.timeslot === 'morning' ? '10:00 AM' : b.timeslot === 'evening' ? '06:00 PM' : '02:00 PM',
              badge,
              badgeColor,
              title: `${b.clientName.split(' ')[0]} - ${b.eventType}`,
              guests: `${b.guests || 200} GUESTS`,
              detail: b.packageId ? 'PACKAGE ASSIGNED' : null,
            };
          });

        setUpcomingEvents(upcoming);
      }
    });
  }, []);

  return (
  <div className="bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
    {/* Panel header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7C6A2E]">Upcoming Week</h3>
      <SlidersHorizontal size={14} className="text-gray-400" />
    </div>

    {/* Event list */}
    <div className="flex-1 divide-y divide-[#F2EADA]">
      {upcomingEvents.length === 0 ? (
        <div className="p-8 text-center text-gray-400 text-sm italic font-serif">No events scheduled in the upcoming weeks.</div>
      ) : (
        upcomingEvents.map((e, i) => (
          <div key={i} className="p-4 hover:bg-[#FDF9F1] transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-gray-500">
                {e.date} · {e.time}
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${e.badgeColor}`}>
                {e.badge}
              </span>
            </div>
            <p className="font-serif font-semibold text-gray-800 text-sm leading-snug mb-2">{e.title}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
              <Users size={11} />
              <span>{e.guests}</span>
              {e.detail && <><span className="text-gray-300">·</span><span>{e.detail}</span></>}
            </div>
          </div>
        ))
      )}

      {/* Hall Maintenance card with image */}
      <div className="relative h-32 overflow-hidden cursor-pointer group">
        <Image
          src="/crystal_pavilion_venue.png"
          alt="Hall Maintenance"
          fill
          sizes="320px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#F9DD76] mb-0.5">Hall Maintenance</p>
          <p className="font-serif font-semibold text-white text-sm leading-tight">Scheduled Deep Clean</p>
          <p className="text-[10px] text-gray-300 mt-0.5">Dec 14th · 06:00 AM – 12:00 PM</p>
        </div>
      </div>
    </div>

    {/* Footer button */}
    <div className="p-4 border-t border-[#E0D8C3]">
      <button className="w-full py-2.5 border border-[#B08D2C] text-[#7C6A2E] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#B08D2C] hover:text-white transition-all">
        View Full Week
      </button>
    </div>
  </div>
  );
};

export default UpcomingWeek;
