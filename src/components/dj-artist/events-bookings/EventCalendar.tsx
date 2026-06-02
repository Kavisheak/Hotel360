import React from 'react';

const days = [
  { label: 'MON', date: '12' },
  { label: 'TUE', date: '13' },
  { label: 'WED', date: '14', active: true },
  { label: 'THU', date: '15' },
  { label: 'FRI', date: '16' },
  { label: 'SAT', date: '17' },
  { label: 'SUN', date: '18' },
];

const EventCalendar = () => {
  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-[#E0D8C3] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6A2E]">Upcoming Schedule</h3>
        <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">Week View</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7 lg:gap-0">
        {days.map((day) => (
          <div
            key={`${day.label}-${day.date}`}
            className={`flex h-28 flex-col items-center justify-center border border-[#E8DABB] bg-[#FBF7EE] text-center ${
              day.active ? 'bg-[#8D7409] text-white shadow-[0_8px_20px_rgba(141,116,9,0.22)]' : 'text-[#706148]'
            }`}
          >
            <span className={`text-[11px] font-semibold tracking-[0.22em] ${day.active ? 'text-white/80' : 'text-[#8C6A11]'}`}>
              {day.label}
            </span>
            <span className="mt-2 font-serif text-3xl leading-none tracking-[-0.08em]">{day.date}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-3 text-sm text-gray-600">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="font-semibold text-gray-800">The Sterling-Vance Wedding</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#3F6897]">Confirmed</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <span className="font-semibold text-gray-800">Lumière Annual Gala</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#7C6A2E]">Pending</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">30th Birthday Soirée</span>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#2E7A3E]">Completed</span>
        </div>
      </div>
    </article>
  );
};

export default EventCalendar;
