"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useBookingStore } from '@/store/bookingStore';

const BookingsGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const decoratorBookings = globalBookings.filter(b => b.vendors.decorator?.vendorId != null);

  return (
    <div>
      {/* Search & Filters Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by event title or hall..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B08D2C] tracking-wide"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-row items-center gap-3 w-full md:w-auto">
          {/* Status Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <select className="w-full md:w-48 appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer">
              <option>STATUS: All Pending</option>
              <option>Awaiting Prep</option>
              <option>Ready for Setup</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
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

      {/* Grid of Booking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {isClient && decoratorBookings.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-gray-500 font-light italic">
            No decorator bookings found.
          </div>
        ) : isClient ? (
          decoratorBookings
            .filter(b => b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || b.eventType.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((booking, idx) => {
              const decoratorVendor = booking.vendors.decorator;
              const isPending = decoratorVendor?.status === 'Pending';
              const displayStatus = isPending ? 'PENDING RESPONSE' : decoratorVendor?.status?.toUpperCase() || 'UNKNOWN';
              // Just alternate images for visual mock since we don't store an image per booking
              const imgUrl = idx % 2 === 0 
                ? 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' 
                : 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80';

              return (
                <div 
                  key={booking.id} 
                  className="bg-white border border-[#E0D8C3] overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-300"
                >
                  {/* Left Side: Image */}
                  <div className="w-full sm:w-[42%] h-56 sm:h-auto shrink-0 relative overflow-hidden group">
                    <img 
                      src={imgUrl} 
                      alt={booking.clientName} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5"></div>
                  </div>

                  {/* Right Side: Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Badge & Event Code */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm ${
                          isPending 
                            ? 'bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2]' 
                            : decoratorVendor?.status === 'Declined'
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-[#EAF0F6] text-[#3F6897] border border-[#DCE6EE]'
                        }`}>
                          {displayStatus}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                          {booking.id}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-3">
                        {booking.clientName}
                      </h3>

                      {/* Details list */}
                      <div className="space-y-1.5 mb-4 text-xs text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar size={13} className="text-[#A6955C]" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={13} className="text-[#A6955C]" />
                          <span>{booking.eventType}</span>
                        </div>
                      </div>

                      {/* Quote box */}
                      <p className="text-xs font-serif italic text-gray-500 leading-relaxed border-l-2 border-[#E0D8C3] pl-3 py-0.5 mb-4">
                        “{booking.menuType} menu with {booking.guests} guests.”
                      </p>
                    </div>

                    {isPending ? (
                      <div className="flex items-center gap-2 mt-4">
                        <button 
                          className="flex-1 border border-[#2C1E14] bg-[#2C1E14] text-white py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
                          onClick={() => {
                            useBookingStore.getState().vendorRespondBooking(booking.id || booking._id as string, "decorator", "Accepted");
                          }}
                        >
                          Accept
                        </button>
                        <button 
                          className="flex-1 border border-red-600 text-red-600 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-red-50 transition-colors"
                          onClick={() => {
                            useBookingStore.getState().vendorRespondBooking(booking.id || booking._id as string, "decorator", "Declined");
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <Link 
                        href={`/decorator/bookings/${booking.id}`}
                        className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-[10px] font-bold tracking-widest transition-colors uppercase text-center block mt-4"
                      >
                        VIEW DETAILS
                      </Link>
                    )}
                  </div>
                </div>
              );
          })
        ) : null}
      </div>

      {/* Pagination Row */}
      <div className="flex justify-center items-center space-x-2 my-12">
        <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">
          <ChevronLeft size={14} />
        </button>
        <button className="w-9 h-9 border border-[#7C6A2E] bg-[#7C6A2E] text-white flex items-center justify-center font-bold text-xs">
          1
        </button>
        <button className="w-9 h-9 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600 flex items-center justify-center font-bold text-xs transition-colors">
          2
        </button>
        <button className="w-9 h-9 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-600 flex items-center justify-center font-bold text-xs transition-colors">
          3
        </button>
        <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default BookingsGrid;
