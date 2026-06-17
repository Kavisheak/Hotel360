"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const UpcomingEventFilters = () => {
  const [search, setSearch] = useState("");

  return (
    <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* SEARCH */}
      <div className="relative w-full lg:max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search upcoming shoots..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[#E0D8C3] bg-white pl-9 pr-4 py-3 text-sm focus:border-[#B08D2C] outline-none"
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <div className="relative">
          <select className="border border-[#E0D8C3] bg-white px-4 py-2.5 pr-8 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C] appearance-none">
            <option>All Dates</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Next Month</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select className="border border-[#E0D8C3] bg-white px-4 py-2.5 pr-8 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C] appearance-none">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventFilters;
