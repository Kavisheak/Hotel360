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
    </div>
  );
};

export default ScheduleHeader;
