"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";

interface UpcomingEventFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const UpcomingEventFilters = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: UpcomingEventFiltersProps) => {
  return (
    <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search assigned shoots..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full border border-[#E0D8C3] bg-white pl-9 pr-4 py-3 text-sm focus:border-[#B08D2C] outline-none"
        />
      </div>

      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border border-[#E0D8C3] bg-white px-4 py-2.5 pr-8 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#B08D2C] appearance-none"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </section>
  );
};

export default UpcomingEventFilters;
