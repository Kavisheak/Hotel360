"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, MapPin } from 'lucide-react';

interface EventItem {
  code: string;
  status: 'UPCOMING' | 'IN PROGRESS' | 'COMPLETED';
  title: string;
  date: string;
  customer: string;
  venue: string;
  note: string;
}

const eventsData: EventItem[] = [
  {
    code: '#EV-8842',
    status: 'UPCOMING',
    title: "Zahra & Omar's Nikah",
    date: 'October 24, 2024 · 06:00 PM',
    customer: 'Mr. & Mrs. Farhan Siddiqui',
    venue: 'Grand Majestic Hall',
    note: 'Cinematic ceremony coverage with additional drone establishing shots.',
  },
  {
    code: '#EV-9012',
    status: 'IN PROGRESS',
    title: "Elena & Julian's Gala",
    date: 'October 28, 2024 · 07:30 PM',
    customer: 'Julian Torres',
    venue: 'Royal Garden Pavilion',
    note: 'Low-light reception, on-site audio monitoring, and branded aftermovie cut.',
  },
  {
    code: '#EV-8850',
    status: 'COMPLETED',
    title: "Sana's Boutique Walima",
    date: 'November 02, 2024 · 08:00 PM',
    customer: 'Sana Malik',
    venue: 'Crystal Ballroom B',
    note: 'Delivered teaser reel and clean highlight sequence within 24 hours.',
  },
  {
    code: '#EV-9104',
    status: 'UPCOMING',
    title: 'Executive Annual Banquet',
    date: 'November 05, 2024 · 06:30 PM',
    customer: 'Mariam Ahmed',
    venue: 'Sky Terrace Lounge',
    note: 'Two-camera keynote coverage and evening recap package.',
  },
];

const MyEventsGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by event title or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B08D2C] tracking-wide"
          />
        </div>

        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select className="w-full md:w-48 appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer">
              <option>STATUS: All Events</option>
              <option>Upcoming</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative flex-1 md:flex-none">
            <select className="w-full md:w-48 appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer">
              <option>SORT: Earliest Date</option>
              <option>Latest Date</option>
              <option>Status</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {eventsData
          .filter((event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.customer.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((event) => {
            const statusStyles = {
              UPCOMING: 'bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2]',
              'IN PROGRESS': 'bg-[#EAF0F6] text-[#3F6897] border border-[#DCE6EE]',
              COMPLETED: 'bg-[#EDF6EC] text-[#4C7A4F] border border-[#DCE9D9]',
            } as const;

            return (
              <div key={event.code} className="bg-white border border-[#E0D8C3] overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-300">
                <div className="w-full sm:w-[42%] h-56 sm:h-auto shrink-0 relative overflow-hidden group bg-[#F2EBE1]">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage:
                        'url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80)',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm ${statusStyles[event.status]}`}>
                        {event.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider">{event.code}</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-3">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 mb-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar size={13} className="text-[#A6955C]" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={13} className="text-[#A6955C]" />
                        <span>{event.venue}</span>
                      </div>
                    </div>

                    <p className="text-xs font-serif italic text-gray-500 leading-relaxed border-l-2 border-[#E0D8C3] pl-3 py-0.5 mb-4">
                      {event.note}
                    </p>

                    <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">{event.customer}</p>
                  </div>

                  <button className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase text-center block mt-5">
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex justify-center items-center space-x-2 my-12">
        <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">‹</button>
        <button className="w-9 h-9 border border-[#7C6A2E] bg-[#7C6A2E] text-white flex items-center justify-center font-bold text-xs">1</button>
        <button className="w-9 h-9 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600 flex items-center justify-center font-bold text-xs transition-colors">2</button>
        <button className="w-9 h-9 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600 flex items-center justify-center font-bold text-xs transition-colors">3</button>
        <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">›</button>
      </div>
    </div>
  );
};

export default MyEventsGrid;
