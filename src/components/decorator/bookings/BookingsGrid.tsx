"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  code: string;
  status: 'PENDING PREP' | 'READY FOR SETUP';
  title: string;
  date: string;
  location: string;
  quote: string;
  image: string;
}

const bookingsData: Booking[] = [
  {
    code: '#BK-8842',
    status: 'PENDING PREP',
    title: "Zahra & Omar's Nikah",
    date: 'October 24, 2024 · 06:00 PM',
    location: 'Grand Majestic Hall',
    quote: '“Gold Package - Floral Excellence with crystal centerpiece upgrade.”',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    code: '#BK-9012',
    status: 'READY FOR SETUP',
    title: "Elena & Julian's Gala",
    date: 'October 28, 2024 · 07:30 PM',
    location: 'Royal Garden Pavilion',
    quote: '“Elite Minimalist Theme - Silk drapings and warm-tone LED array.”',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    code: '#BK-8850',
    status: 'PENDING PREP',
    title: "Sana's Boutique Walima",
    date: 'November 02, 2024 · 08:00 PM',
    location: 'Crystal Ballroom B',
    quote: '“The Royal Heritage Suite - Traditional velvet textures and gold filigree.”',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    code: '#BK-9104',
    status: 'READY FOR SETUP',
    title: 'Executive Annual Banquet',
    date: 'November 05, 2024 · 06:30 PM',
    location: 'Sky Terrace Lounge',
    quote: '“Modern Corporate Chic - Geometric metalwork and orchid accents.”',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
  }
];

const BookingsGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
        {bookingsData
          .filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.location.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((booking) => {
            const isPendingPrep = booking.status === 'PENDING PREP';
            return (
              <div 
                key={booking.code} 
                className="bg-white border border-[#E0D8C3] overflow-hidden shadow-sm flex flex-col sm:flex-row hover:shadow-md transition-shadow duration-300"
              >
                {/* Left Side: Image */}
                <div className="w-full sm:w-[42%] h-56 sm:h-auto shrink-0 relative overflow-hidden group">
                  <img 
                    src={booking.image} 
                    alt={booking.title} 
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
                        isPendingPrep 
                          ? 'bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2]' 
                          : 'bg-[#EAF0F6] text-[#3F6897] border border-[#DCE6EE]'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                        {booking.code}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-serif font-bold text-gray-900 leading-snug mb-3">
                      {booking.title}
                    </h3>

                    {/* Details list */}
                    <div className="space-y-1.5 mb-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar size={13} className="text-[#A6955C]" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={13} className="text-[#A6955C]" />
                        <span>{booking.location}</span>
                      </div>
                    </div>

                    {/* Quote box */}
                    <p className="text-xs font-serif italic text-gray-500 leading-relaxed border-l-2 border-[#E0D8C3] pl-3 py-0.5 mb-4">
                      {booking.quote}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <Link 
                    href={`/decorator/bookings/${booking.code.substring(1)}`}
                    className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase text-center block"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            );
        })}
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
