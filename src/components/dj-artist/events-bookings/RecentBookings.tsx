import React from 'react';
import Image from 'next/image';

const bookings = [
  {
    title: 'Wedding Reception',
    venue: 'EASCCA Wedding Hall',
    status: 'Confirmed',
    image: '/images/01.png',
  },
  {
    title: 'Engagement Ceremony',
    venue: 'EASCCA Wedding Hall',
    status: 'Upcoming',
    image: '/images/02.png',
  },
  {
    title: 'Birthday Celebration',
    venue: 'EASCCA Wedding Hall',
    status: 'Completed',
    image: '/images/03.png',
  },
];
const RecentBookings = () => {
  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-[#E0D8C3] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6A2E]">Recent Assignments</h3>
        <span className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Latest Assignments</span>
      </div>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.title} className="flex gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#E0D8C3] bg-[#eadfc1]">
              <Image src={booking.image} alt={booking.title} fill className="object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-800">{booking.title}</p>
              <p className="mt-1 text-xs text-gray-500">{booking.venue}</p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7C6A2E]">{booking.status}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default RecentBookings;
