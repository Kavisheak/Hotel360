"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  bookings?: any[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

const CalendarView = ({ bookings = [], selectedDate = new Date(), onSelectDate }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const dates = [];
  // Prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    dates.push({ date: prevMonthDays - i, isCurrentMonth: false, fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i) });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({ date: i, isCurrentMonth: true, fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), i) });
  }
  // Next month padding to fill 35 or 42 slots
  const totalSlots = dates.length > 35 ? 42 : 35;
  let nextDay = 1;
  while (dates.length < totalSlots) {
    dates.push({ date: nextDay++, isCurrentMonth: false, fullDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, nextDay - 1) });
  }

  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-sm flex flex-col w-full">
      {/* Calendar Header */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-3 text-gray-500">
          <button onClick={prevMonth} className="hover:text-gray-900 transition-colors p-1"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="hover:text-gray-900 transition-colors p-1"><ChevronRight size={20} /></button>
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
        {dates.map((d, i) => {
          const isSelected = d.isCurrentMonth && d.date === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear();
          const dayBookings = bookings.filter(b => {
            const bDate = new Date(b.date);
            return bDate.getDate() === d.date && bDate.getMonth() === d.fullDate.getMonth() && bDate.getFullYear() === d.fullDate.getFullYear();
          });

          return (
            <div
              key={i}
              onClick={() => d.isCurrentMonth && onSelectDate && onSelectDate(d.fullDate)}
              className={`min-h-[60px] sm:min-h-[90px] border-b border-r border-[#E0D8C3] p-1.5 sm:p-3 flex flex-col relative last:border-r-0 
                ${d.isCurrentMonth ? 'cursor-pointer' : ''}
                ${!d.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                ${isSelected ? 'bg-[#FCF6E3] ring-1 ring-inset ring-[#B08D2C]' : d.isCurrentMonth ? 'hover:bg-gray-50' : ''}
              `}
            >
              <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#B08D2C] font-bold' : ''}`}>
                {d.date}
              </span>

              {dayBookings.length > 0 && (
                <div className="mt-auto space-y-0.5">
                  {dayBookings.map((b, idx) => {
                     const status = b.vendors?.videographer?.status?.toUpperCase();
                     let color = "bg-[#7C6A2E]"; // pending
                     if (status === 'COMPLETED') color = "bg-[#5A87C7]";
                     else if (status === 'ACCEPTED' || status === 'CONFIRMED') color = "bg-[#B08D2C]";
                     return <div key={idx} className={`h-0.5 sm:h-1 ${color} w-full rounded-full`} />
                  })}
                  {isSelected && <span className="hidden sm:inline text-[7px] font-bold tracking-widest text-[#B08D2C] uppercase mt-1">SELECTED</span>}
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
