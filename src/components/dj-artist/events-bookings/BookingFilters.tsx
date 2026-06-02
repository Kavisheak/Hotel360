"use client";

import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const BookingFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <section className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative w-full xl:max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full border border-[#E0D8C3] bg-white py-2.5 pl-10 pr-4 text-xs tracking-wide text-gray-700 placeholder-gray-400 focus:border-[#B08D2C] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
        <div className="relative">
          <select className="w-full appearance-none border border-[#E0D8C3] bg-white px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:border-[#B08D2C] focus:outline-none sm:w-48">
            <option>Date: All</option>
            <option>Upcoming</option>
            <option>Today</option>
            <option>This Week</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <select className="w-full appearance-none border border-[#E0D8C3] bg-white px-4 py-2.5 pr-10 text-xs font-medium text-gray-700 focus:border-[#B08D2C] focus:outline-none sm:w-48">
            <option>Status: All</option>
            <option>Upcoming</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>
    </section>
  );
};

export default BookingFilters;
