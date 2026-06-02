import React from 'react';
import { Users, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';

const upcomingEvents = [
  {
    date: 'DEC 08',
    time: '06:00 PM',
    badge: 'Confirmed',
    badgeColor: 'bg-[#B08D2C] text-white',
    title: 'Johnson Wedding Reception',
    guests: '250 GUESTS',
    detail: 'FULL SERVICE CATERING',
    img: null,
  },
  {
    date: 'DEC 10',
    time: '10:00 AM',
    badge: 'Pending Deposit',
    badgeColor: 'bg-[#F2EADA] text-[#7C6A2E] border border-[#E0D8C3]',
    title: 'Tech Summit 2024',
    guests: '100 GUESTS',
    detail: null,
    img: null,
  },
  {
    date: 'DEC 12',
    time: '07:00 PM',
    badge: 'Confirmed',
    badgeColor: 'bg-[#B08D2C] text-white',
    title: 'Elite Annual Charity Gala',
    guests: '400 GUESTS',
    detail: null,
    img: null,
  },
];

const UpcomingWeek = () => (
  <div className="bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
    {/* Panel header */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#7C6A2E]">Upcoming Week</h3>
      <SlidersHorizontal size={14} className="text-gray-400" />
    </div>

    {/* Event list */}
    <div className="flex-1 divide-y divide-[#F2EADA]">
      {upcomingEvents.map((e, i) => (
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
      ))}

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

export default UpcomingWeek;
