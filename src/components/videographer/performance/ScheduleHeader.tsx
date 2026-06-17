import React from "react";

const ScheduleHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 mt-4">
      <div>
        <p className="text-sm font-serif italic text-[#A6955C] mb-1">
          Videographer Dashboard
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none">
          Performance Schedule
        </h1>
      </div>

      <div className="flex space-x-3 shrink-0">
        <button className="border border-[#7C6A2E] text-[#7C6A2E] px-5 py-2.5 font-semibold text-xs tracking-[0.15em] hover:bg-[#FDF9F1] transition-colors">
          EXPORT PDF
        </button>

        <button className="bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-5 py-2.5 font-semibold text-xs tracking-[0.15em] transition-colors shadow-md">
          VIEW TIMELINE
        </button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
