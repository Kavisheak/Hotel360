"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const PendingBookings = () => {
  const [isClient, setIsClient] = useState(false);
  const bookings = useBookingStore(state => state.bookings);
  const updateBookingStatus = useBookingStore(state => state.updateBookingStatus);

  const pendingBookings = React.useMemo(() => 
    bookings.filter(b => b.status === "Pending"),
    [bookings]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
  <section className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="flex items-center gap-2 text-base lg:text-lg font-serif font-semibold text-[#7C6A2E]">
        <BookOpen size={18} className="text-[#B08D2C]" />
        Pending Bookings
      </h3>
      <a href="/hotel-manager/bookings" className="bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-semibold tracking-widest uppercase px-4 py-2 rounded-md transition-colors whitespace-nowrap ml-4">
        View All Queue
      </a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isClient && pendingBookings.length === 0 ? (
        <div className="col-span-full py-16 text-center bg-white border border-[#E0D8C3] rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 font-light italic">No pending bookings in the queue.</p>
        </div>
      ) : isClient ? (
        pendingBookings.map((row, i) => {
          // Provide some high-quality distinct images based on index
          const images = [
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505368581691-382a52efc674?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1530103862676-de88b43e67bc?auto=format&fit=crop&w=800&q=80',
          ];
          const bgImg = images[i % images.length];

          return (
            <div
              key={row.id}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#E0D8C3]"
            >
              {/* Background Image with Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${bgImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <span className="bg-white/90 backdrop-blur-md text-[#7C6A2E] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                  Pending
                </span>
                <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-mono tracking-wider px-2 py-1 rounded">
                  {row.id.split('-')[1] || row.id}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-500">
                <p className="text-[10px] font-bold text-amber-200 uppercase tracking-[0.2em] mb-1">
                  {row.eventType}
                </p>
                <h4 className="text-2xl font-serif text-white leading-tight mb-2 group-hover:text-amber-100 transition-colors">
                  {row.clientName}
                </h4>
                
                <div className="flex items-center gap-3 text-xs text-gray-300 font-light mb-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {row.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {row.guests} Guests
                  </span>
                </div>

                {/* Actions (Slide up on hover) */}
                <div className="flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <a 
                    href={`/hotel-manager/bookings/${row.id}`}
                    className="flex-1 text-center bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors"
                  >
                    Review Request
                  </a>
                </div>
              </div>
            </div>
          );
        })
      ) : null}
    </div>
  </section>
  );
};

export default PendingBookings;
