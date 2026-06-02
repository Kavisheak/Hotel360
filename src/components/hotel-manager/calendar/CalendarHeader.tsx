"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarHeader = () => (
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-[#7C6A2E]">
          December 2024
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 tracking-wide">
          24 confirmed events this month
        </p>
      </div>
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] rounded hover:bg-[#F2EADA] text-gray-500 hover:text-[#7C6A2E] transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button className="px-4 h-8 border border-[#E0D8C3] rounded text-[10px] font-bold uppercase tracking-widest text-[#7C6A2E] hover:bg-[#F2EADA] transition-colors">
          Today
        </button>
        <button className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] rounded hover:bg-[#F2EADA] text-gray-500 hover:text-[#7C6A2E] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default CalendarHeader;
