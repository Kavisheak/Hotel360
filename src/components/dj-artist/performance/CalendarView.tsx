"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { isSameCalendarDay, normalizeCalendarDate, parseBookingDate } from '@/lib/vendorUtils';

interface CalendarViewProps {
  bookings?: any[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  vendorKey?: 'dj' | 'decorator' | 'videographer';
}

const CalendarView = ({
  bookings = [],
  selectedDate = new Date(),
  onSelectDate,
  vendorKey = 'dj',
}: CalendarViewProps) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const normalizedSelected = normalizeCalendarDate(selectedDate);

  const [currentDate, setCurrentDate] = useState(
    new Date(normalizedSelected.getFullYear(), normalizedSelected.getMonth(), 1)
  );

  useEffect(() => {
    setCurrentDate(
      new Date(normalizedSelected.getFullYear(), normalizedSelected.getMonth(), 1)
    );
  }, [normalizedSelected.getFullYear(), normalizedSelected.getMonth()]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const dates: { date: number; currentMonth: boolean; fullDate: Date }[] = [];

  const prevDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({
      date: prevDays - i,
      currentMonth: false,
      fullDate: new Date(currentYear, currentMonth - 1, prevDays - i),
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      date: i,
      currentMonth: true,
      fullDate: new Date(currentYear, currentMonth, i),
    });
  }

  let nextDay = 1;
  while (dates.length < 42) {
    dates.push({
      date: nextDay,
      currentMonth: false,
      fullDate: new Date(currentYear, currentMonth + 1, nextDay),
    });
    nextDay++;
  }

  const handleSelectDay = (fullDate: Date, inCurrentMonth: boolean) => {
    if (!onSelectDate) return;
    onSelectDate(normalizeCalendarDate(fullDate));
    if (!inCurrentMonth) {
      setCurrentDate(new Date(fullDate.getFullYear(), fullDate.getMonth(), 1));
    }
  };

  const statusKey = vendorKey === 'dj' ? 'dj' : vendorKey === 'decorator' ? 'decorator' : 'videographer';

  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-sm flex flex-col w-full">
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-3 text-gray-500">
          <button type="button" onClick={handlePrevMonth} className="hover:text-gray-900 transition-colors p-1">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={handleNextMonth} className="hover:text-gray-900 transition-colors p-1">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-7 bg-white flex-1">
        {dates.map((d, i) => {
          const isSelected = isSameCalendarDay(d.fullDate, normalizedSelected);

          const dayBookings = bookings.filter((b) =>
            isSameCalendarDay(parseBookingDate(b.date), d.fullDate)
          );

          return (
            <button
              type="button"
              key={i}
              onClick={() => handleSelectDay(d.fullDate, d.currentMonth)}
              className={`min-h-[60px] sm:min-h-[90px] border-b border-r border-[#E0D8C3] p-1.5 sm:p-3 flex flex-col relative last:border-r-0 text-left cursor-pointer transition-colors
                ${!d.currentMonth ? 'text-gray-400 bg-gray-50/50' : 'text-gray-700'}
                ${isSelected ? 'bg-[#FCF6E3] ring-2 ring-inset ring-[#B08D2C] z-[1]' : d.currentMonth ? 'hover:bg-gray-50' : 'hover:bg-[#FAF6EE]'}
              `}
            >
              <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#B08D2C] font-bold' : ''}`}>
                {d.date}
              </span>

              {dayBookings.length > 0 && (
                <div className="mt-auto flex flex-col gap-1 w-full overflow-hidden pointer-events-none">
                  {dayBookings.map((b, idx) => {
                    const status = b.vendors?.[statusKey]?.status?.toUpperCase();
                    let color = 'bg-[#7C6A2E]';
                    if (status === 'COMPLETED') color = 'bg-[#5A87C7]';
                    else if (status === 'ACCEPTED' || status === 'CONFIRMED') color = 'bg-[#B08D2C]';

                    return (
                      <div
                        key={idx}
                        className={`${color} text-white text-[8px] sm:text-[9px] px-1 py-0.5 rounded-sm truncate leading-none w-full`}
                        title={`${b.eventType} - ${b.clientName || ''}`}
                      >
                        {b.eventType || b.clientName || 'Event'}
                      </div>
                    );
                  })}
                  {isSelected && (
                    <span className="hidden sm:inline text-[7px] font-bold tracking-widest text-[#B08D2C] uppercase mt-1">
                      SELECTED
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
