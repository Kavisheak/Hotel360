import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = () => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const dates: { date: number; currentMonth: boolean }[] = [];
  for (let i = 26; i <= 30; i++) dates.push({ date: i, currentMonth: false });
  for (let i = 1; i <= 31; i++) dates.push({ date: i, currentMonth: true });
  for (let i = 1; i <= 4; i++) dates.push({ date: i, currentMonth: false });

  const displayDates = dates.slice(0, 35);

  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-sm flex flex-col w-full">
      {/* Calendar Header */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight">December 2026</h2>
        <div className="flex space-x-3 text-gray-500">
          <button className="hover:text-gray-900 transition-colors p-1"><ChevronLeft size={20} /></button>
          <button className="hover:text-gray-900 transition-colors p-1"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-[#E0D8C3]">
        {days.map((day) => (
          <div
            key={day}
            className="text-center py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.2em] text-gray-500 uppercase border-r border-[#E0D8C3] last:border-r-0"
          >
            <span className="sm:hidden">{day.charAt(0)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar dates grid */}
      <div className="grid grid-cols-7 bg-white flex-1">
        {displayDates.map((d, i) => {
          const isSelected = d.date === 12 && d.currentMonth;

          return (
            <div
              key={i}
              className={`min-h-[60px] sm:min-h-[90px] border-b border-r border-[#E0D8C3] p-1.5 sm:p-3 flex flex-col relative last:border-r-0 cursor-pointer
                ${!d.currentMonth ? 'text-gray-300' : 'text-gray-700'}
                ${isSelected ? 'bg-[#FCF6E3] ring-1 ring-inset ring-[#B08D2C]' : 'hover:bg-gray-50'}
              `}
            >
              <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#B08D2C] font-bold' : ''}`}>
                {d.date}
              </span>

              {d.date === 5 && d.currentMonth && (
                <div className="mt-auto space-y-0.5">
                  <div className="h-0.5 sm:h-1 bg-[#4A463B] w-full rounded-full" />
                  <div className="h-0.5 sm:h-1 bg-[#5A87C7] w-2/3 rounded-full" />
                </div>
              )}
              {d.date === 12 && d.currentMonth && (
                <div className="mt-auto">
                  <div className="h-0.5 sm:h-1 bg-[#B08D2C] w-full mb-1 rounded-full" />
                  <span className="hidden sm:inline text-[7px] font-bold tracking-widest text-[#B08D2C] uppercase">SELECTED</span>
                </div>
              )}
              {d.date === 18 && d.currentMonth && (
                <div className="mt-auto">
                  <div className="h-0.5 sm:h-1 bg-[#7C6A2E] w-full rounded-full" />
                </div>
              )}
              {d.date === 22 && d.currentMonth && (
                <div className="mt-auto">
                  <div className="h-0.5 sm:h-1 bg-[#C75A5A] w-1/2 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
