import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const EventLogistics = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Calendar size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
          EVENT LOGISTICS
        </h3>
      </div>

      <div className="space-y-5">
        {/* Event Date */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            EVENT DATE
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>
        </div>

        {/* Venue Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            VENUE SELECTION
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-[#E0D8C3] px-4 py-3 pr-10 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer">
              <option>Grand Majestic Hall</option>
              <option>Royal Garden Pavilion</option>
              <option>Crystal Ballroom B</option>
              <option>Sky Terrace Lounge</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Stacking Guest Count & Setup Window vertically */}
        <div className="space-y-5">
          {/* Guest Count */}
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
              GUEST COUNT
            </label>
            <input
              type="number"
              placeholder="500"
              className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          {/* Setup Window - Stacking vertically on mobile screens (flex-col) and aligning side-by-side on tablet/desktop (sm:flex-row) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
              SETUP WINDOW
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="relative flex-1 w-full">
                <input
                  type="time"
                  className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                />
              </div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider shrink-0 text-center py-0.5 sm:px-1">to</span>
              <div className="relative flex-1 w-full">
                <input
                  type="time"
                  className="w-full px-4 py-3 text-sm border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLogistics;
