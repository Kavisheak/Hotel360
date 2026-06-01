import React from 'react';

const legend = [
  { label: 'Confirmed', color: 'bg-[#B08D2C]' },
  { label: 'Pending',   color: 'bg-[#CBD5E1]' },
  { label: 'Completed', color: 'bg-white border border-[#E0D8C3]' },
];

const CalendarLegend = () => (
  <div className="flex items-center gap-5 mt-4">
    {legend.map((l) => (
      <div key={l.label} className="flex items-center gap-2">
        <span className={`w-3.5 h-3.5 rounded-sm ${l.color}`} />
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{l.label}</span>
      </div>
    ))}
  </div>
);

export default CalendarLegend;
