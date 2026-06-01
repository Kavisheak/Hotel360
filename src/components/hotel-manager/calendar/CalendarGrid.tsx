"use client";

import React from 'react';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// December 2024 starts on Sunday
// prev month tail: 26-30 Nov (5 days)
// Dec 1-31
// next month head: 1-4 Jan
const buildDates = () => {
  const dates: { date: number; currentMonth: boolean; events: { label: string; type: 'confirmed' | 'pending' | 'overdue' | 'today' | 'other' }[] }[] = [];
  for (let i = 26; i <= 30; i++) dates.push({ date: i, currentMonth: false, events: [] });
  for (let i = 1; i <= 31; i++) dates.push({ date: i, currentMonth: true, events: [] });
  while (dates.length % 7 !== 0) dates.push({ date: dates.length - 35, currentMonth: false, events: [] });

  // Inject events
  const eventMap: Record<number, { label: string; type: 'confirmed' | 'pending' | 'overdue' | 'today' | 'other' }[]> = {
    6:  [{ label: 'WEDDING: SARAH & ALI', type: 'confirmed' }, { label: 'PENDING: CORPORATE', type: 'pending' }],
    8:  [{ label: "TODAY'S EVENT", type: 'today' }],
    9:  [{ label: 'OVERDUE PMT', type: 'overdue' }],
    10: [{ label: 'CONFIRMED: GALA', type: 'confirmed' }],
    // date 9 in grid is position 13 (5 from Nov + 9 = 14, 0-indexed 13)
    14: [{ label: 'GRAND OPENING', type: 'confirmed' }],
    20: [{ label: 'CHARITY BALL', type: 'confirmed' }],
    22: [{ label: 'CORP DINNER', type: 'pending' }],
    28: [{ label: 'NEW YEAR EVE GALA', type: 'confirmed' }],
  };

  dates.forEach(d => {
    if (d.currentMonth && eventMap[d.date]) {
      d.events = eventMap[d.date];
    }
  });

  return dates.slice(0, 35);
};

const eventStyles = {
  confirmed: 'bg-[#B08D2C] text-white',
  pending:   'bg-[#CBD5E1] text-gray-700',
  overdue:   'bg-red-100 text-red-600 border border-red-300',
  today:     'bg-[#7C6A2E] text-white',
  other:     'bg-[#F2EADA] text-gray-600',
};

const CalendarGrid = () => {
  const dates = buildDates();
  const todayDate = 8; // December 8

  return (
    <div className="bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#E0D8C3] bg-[#FDF9F1]">
        {days.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-[9px] sm:text-[10px] font-bold tracking-widest text-gray-400 uppercase border-r border-[#E0D8C3] last:border-r-0"
          >
            <span className="sm:hidden">{day[0]}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {dates.map((d, i) => {
          const isToday = d.date === todayDate && d.currentMonth;
          return (
            <div
              key={i}
              className={`min-h-[64px] sm:min-h-[90px] border-b border-r border-[#E0D8C3] last:border-r-0 p-1 sm:p-2 flex flex-col cursor-pointer transition-colors
                ${!d.currentMonth ? 'bg-[#FAFAFA]' : 'hover:bg-[#FDF9F1]'}
                ${isToday ? 'ring-2 ring-inset ring-[#B08D2C] bg-[#FFFBF0]' : ''}
              `}
            >
              <span className={`text-xs sm:text-sm font-medium mb-1
                ${!d.currentMonth ? 'text-gray-300' : 'text-gray-700'}
                ${isToday ? 'text-[#B08D2C] font-bold' : ''}
              `}>
                {d.date}
              </span>
              {/* Event chips — hidden on very small screens */}
              <div className="hidden sm:flex flex-col gap-0.5 overflow-hidden">
                {d.events.map((e, j) => (
                  <span
                    key={j}
                    className={`text-[8px] font-bold uppercase tracking-wide px-1 py-0.5 rounded truncate leading-tight ${eventStyles[e.type]}`}
                  >
                    {e.label}
                  </span>
                ))}
              </div>
              {/* Dot indicators for mobile */}
              {d.events.length > 0 && (
                <div className="sm:hidden flex gap-0.5 mt-auto">
                  {d.events.slice(0, 3).map((e, j) => (
                    <span key={j} className={`w-1.5 h-1.5 rounded-full ${
                      e.type === 'confirmed' ? 'bg-[#B08D2C]' :
                      e.type === 'pending' ? 'bg-gray-400' :
                      e.type === 'overdue' ? 'bg-red-500' :
                      e.type === 'today' ? 'bg-[#7C6A2E]' : 'bg-gray-300'
                    }`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
