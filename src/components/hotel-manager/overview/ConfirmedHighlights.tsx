"use client";

import React, { useEffect, useState } from 'react';
import { CalendarDays, Users, Gem } from 'lucide-react';
import { bookingAPI } from '@/lib/api';

const ConfirmedHighlights = () => {
  const [isClient, setIsClient] = useState(false);
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    const fetchBookings = async () => {
      const res = await bookingAPI.getAllBookings();
      if (res.ok && res.data?.data) {
        setConfirmedBookings(res.data.data.filter((b: any) => b.status === "Confirmed" || b.status === "DepositPaid" || b.status === "BalancePaid").slice(0, 3));
      }
    };
    fetchBookings();
  }, []);

  return (
  <section className="mb-10">
    <h3 className="flex items-center gap-2 text-base lg:text-lg font-serif font-semibold text-[#7C6A2E] mb-4">
      <Gem size={18} className="text-[#B08D2C]" />
      Confirmed Highlights
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isClient && confirmedBookings.length === 0 ? (
        <div className="col-span-full py-12 text-center text-sm text-gray-500 font-light italic">
          No confirmed events yet.
        </div>
      ) : isClient ? (
        confirmedBookings.map((booking, i) => (
          <div
            key={booking._id || booking.id || i}
            className="group flex flex-col bg-white border border-[#E0D8C3]/60 rounded-2xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-gray-100">
              <img
                src={i % 3 === 0 ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe62sX0zuRLnHUa39WCgdqvQvGVNUzpo5EPdlEX6872nA4_BwZeMzvOTjnbUTHalRnaKVBQdcbhMO8d77Lv6IF-sAga9JxWA46lJubSFVe4hsPJaq54aOBAjimFDOsEnFhBBZI9gmePeoC4YO89zhomfvgegKq2Tt-M-lXQwomx6Lmr19zVdG7g0EtTxHwDVLew4vJycd6tQRCRECwpeBeikzo-q6Ta56at0K3RxcGMuQSNU5ZyqZUWl-wwIuTHXYZL0Z30jFS-Ik' : i % 3 === 1 ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWRGWdbhechEPd3ej8TVry8kbEo2Yu8bHeZjIvHgFqPOYPNIB4xtI4RXfXnd0AN9AeGcR_VMNozc-TXXBE4upJXBXdnfn7TgayS3kOVeXgFTx7ZDy71iN-J_4xXtdX9Q642jgrKooS-Y0QglupixYF5gRAy3RS9RaATqEgaA07Ntrb71c750-p3K8kTsUD3--KkE1IlCaxV8406BvD6OYu5S3-HThtuOJay_WsYzqdYft8fVsjMSknpaRBGcYpXvh2N7VMeJwETzk' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQG_w1jHTHmRpg1w1mTqhSybAW7HEN9uLFXHqR-cIZWQGEmmjuUpxl-I07WydKU3XB90WNAOUUCFhEFOlnfXh0k9Z2zAsTH3Mkg4BLBQPk4SaH9miZKNJYKjDTJqMx_81VJgRTAuHn-aFXKrcbnN2kRsjl3WRV8amL7NSDt2vUF0-YgTEv7Vfjsnz1mBkGPXa4C0gmnP7tf_D5zIbkJOCeRuGIbvXCv62Hhy7sIBK1f-o-8IyKfIihRuQZEE8wgdkTYsaDguxoTF4'}
                alt={booking.clientName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/5" />
              <span className="absolute top-4 right-4 bg-white/95 text-[#7C6A2E] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-[#E0D8C3]/50">
                CONFIRMED
              </span>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[9px] font-bold text-[#A6955C] uppercase tracking-[0.2em] mb-1">{booking.eventType}</p>
                  <h4 className="font-serif font-semibold text-gray-900 text-lg leading-tight">{booking.clientName}</h4>
                </div>
                <span className="text-[#B08D2C] text-lg">★</span>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-500 font-light text-xs">
                  <CalendarDays size={14} />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-light text-xs">
                  <Users size={14} />
                  <span>{booking.guests} Guests</span>
                </div>
              </div>

              <a href={`/hotel-manager/bookings/${booking.id || booking._id}`} className="mt-auto block text-center w-full bg-[#FAF6EE] text-[#7C6A2E] text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg group-hover:bg-[#7C6A2E] group-hover:text-white transition-all duration-300">
                Details
              </a>
            </div>
          </div>
        ))
      ) : null}
    </div>
  </section>
  );
};

export default ConfirmedHighlights;
