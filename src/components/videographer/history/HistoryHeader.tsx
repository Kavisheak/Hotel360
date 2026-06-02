import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const HistoryHeader = () => {
  return (
    <div className="mt-4 mb-8">
      <p className="text-sm font-serif italic text-[#A6955C] mb-1">Archive of Frames</p>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Event History
          </h1>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            Review completed shoots, ratings received, and the archive of delivered event media.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, clients..."
              className="pl-9 pr-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B08D2C] w-56 tracking-wide"
            />
          </div>
          <button className="flex items-center space-x-2 border border-[#7C6A2E] text-[#7C6A2E] px-4 py-2.5 text-xs font-bold tracking-[0.15em] hover:bg-[#FDF9F1] transition-colors shrink-0">
            <SlidersHorizontal size={13} />
            <span>FILTER</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryHeader;
