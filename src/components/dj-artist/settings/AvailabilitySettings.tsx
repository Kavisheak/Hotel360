"use client";

import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const AvailabilitySettings = () => {
  const [available, setAvailable] = useState(true);

  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-[#E0D8C3] pb-3 mb-6">
        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-[#B08D2C]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">AVAILABILITY</h3>
        </div>
        <span className="h-2.5 w-2.5 rounded-full bg-[#0A766F]" />
      </div>

      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Toggle your presence for immediate booking inquiries and preferred working hours.
      </p>

      <div className="flex items-center justify-between border border-[#E0D8C3] bg-[#FAF6EE] px-4 py-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase">Available for booking</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-gray-500">Selected hours and dates</p>
        </div>

        <button
          type="button"
          onClick={() => setAvailable((previous) => !previous)}
          className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
            available ? 'bg-[#7C6A2E]' : 'bg-gray-200'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${
              available ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase">Working schedule preference</label>
        <select className="w-full appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer">
          <option>Friday to Sunday</option>
          <option>Weekends only</option>
          <option>All week by request</option>
          <option>Limited private residencies</option>
        </select>
      </div>
    </article>
  );
};

export default AvailabilitySettings;
