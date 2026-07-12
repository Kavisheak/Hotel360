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
            className="group bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#B08D2C] transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-[#F2EADA]">
              <img
                src={i % 3 === 0 ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe62sX0zuRLnHUa39WCgdqvQvGVNUzpo5EPdlEX6872nA4_BwZeMzvOTjnbUTHalRnaKVBQdcbhMO8d77Lv6IF-sAga9JxWA46lJubSFVe4hsPJaq54aOBAjimFDOsEnFhBBZI9gmePeoC4YO89zhomfvgegKq2Tt-M-lXQwomx6Lmr19zVdG7g0EtTxHwDVLew4vJycd6tQRCRECwpeBeikzo-q6Ta56at0K3RxcGMuQSNU5ZyqZUWl-wwIuTHXYZL0Z30jFS-Ik' : i % 3 === 1 ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWRGWdbhechEPd3ej8TVry8kbEo2Yu8bHeZjIvHgFqPOYPNIB4xtI4RXfXnd0AN9AeGcR_VMNozc-TXXBE4upJXBXdnfn7TgayS3kOVeXgFTx7ZDy71iN-J_4xXtdX9Q642jgrKooS-Y0QglupixYF5gRAy3RS9RaATqEgaA07Ntrb71c750-p3K8kTsUD3--KkE1IlCaxV8406BvD6OYu5S3-HThtuOJay_WsYzqdYft8fVsjMSknpaRBGcYpXvh2N7VMeJwETzk' : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQG_w1jHTHmRpg1w1mTqhSybAW7HEN9uLFXHqR-cIZWQGEmmjuUpxl-I07WydKU3XB90WNAOUUCFhEFOlnfXh0k9Z2zAsTH3Mkg4BLBQPk4SaH9miZKNJYKjDTJqMx_81VJgRTAuHn-aFXKrcbnN2kRsjl3WRV8amL7NSDt2vUF0-YgTEv7Vfjsnz1mBkGPXa4C0gmnP7tf_D5zIbkJOCeRuGIbvXCv62Hhy7sIBK1f-o-8IyKfIihRuQZEE8wgdkTYsaDguxoTF4'}
                alt={booking.clientName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#7C6A2E] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-[#E0D8C3]">
                CONFIRMED
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-serif font-semibold text-gray-800 text-base leading-tight mb-0.5">{booking.clientName}</h4>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{booking.eventType}</p>
                </div>
                <span className="text-[#B08D2C] text-lg">★</span>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <CalendarDays size={12} />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Users size={12} />
                  <span>{booking.guests} Guests</span>
                </div>
              </div>

              <a href={`/hotel-manager/bookings/${booking.id || booking._id}`} className="block text-center w-full border border-[#B08D2C] text-[#7C6A2E] text-[10px] font-bold uppercase tracking-widest py-2 rounded-md group-hover:bg-[#B08D2C] group-hover:text-white transition-all duration-200">
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
