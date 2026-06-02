import React from 'react';
import { Plus } from 'lucide-react';

const MyEventsHeader = () => {
  return (
    <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="max-w-3xl">
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
          <span>PORTAL</span>
          <span className="text-gray-400">›</span>
          <span className="text-[#7C6A2E]">ASSIGNED EVENTS</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
          Assigned Events
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed font-sans">
          Review event details, track shoot status, and confirm venue readiness before the coverage begins.
        </p>
      </div>

      <button className="flex items-center justify-center space-x-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-6 py-3 font-semibold text-xs tracking-widest transition-colors shadow-md shrink-0 self-start md:mt-2">
        <Plus size={16} />
        <span>LOG SESSION</span>
      </button>
    </div>
  );
};

export default MyEventsHeader;
