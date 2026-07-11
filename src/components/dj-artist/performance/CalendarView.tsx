"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  bookings?: any[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

const CalendarView = ({ bookings = [], selectedDate = new Date(), onSelectDate }: CalendarViewProps) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

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
    dates.push({ date: prevDays - i, currentMonth: false, fullDate: new Date(currentYear, currentMonth - 1, prevDays - i) });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({ date: i, currentMonth: true, fullDate: new Date(currentYear, currentMonth, i) });
  }
  
  let nextDay = 1;
  while (dates.length < 35) {
    dates.push({ date: nextDay, currentMonth: false, fullDate: new Date(currentYear, currentMonth + 1, nextDay) });
    nextDay++;
  }

  const displayDates = dates;

  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-sm flex flex-col w-full">
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex space-x-3 text-gray-500">
          <button onClick={handlePrevMonth} className="hover:text-gray-900 transition-colors p-1"><ChevronLeft size={20} /></button>
          <button onClick={handleNextMonth} className="hover:text-gray-900 transition-colors p-1"><ChevronRight size={20} /></button>
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
        {displayDates.map((d, i) => {
          const isSelected = d.currentMonth && d.date === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear();
          
          const dayBookings = bookings.filter(b => {
            const bDate = new Date(b.date);
            return bDate.getDate() === d.date && 
                   bDate.getMonth() === d.fullDate.getMonth() && 
                   bDate.getFullYear() === d.fullDate.getFullYear();
          });

          return (
            <div
              key={i}
              onClick={() => d.currentMonth && onSelectDate && onSelectDate(d.fullDate)}
              className={`min-h-[60px] sm:min-h-[90px] border-b border-r border-[#E0D8C3] p-1.5 sm:p-3 flex flex-col relative last:border-r-0 
                ${d.currentMonth ? 'cursor-pointer' : ''}
                ${!d.currentMonth ? 'text-gray-300' : 'text-gray-700'}
                ${isSelected ? 'bg-[#FCF6E3] ring-1 ring-inset ring-[#B08D2C]' : d.currentMonth ? 'hover:bg-gray-50' : ''}
              `}
            >
              <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#B08D2C] font-bold' : ''}`}>
                {d.date}
              </span>

              {dayBookings.length > 0 && d.currentMonth && (
                <div className="mt-auto flex flex-col gap-1 w-full overflow-hidden">
                  {dayBookings.map((b, idx) => {
                    const status = b.vendors?.dj?.status?.toUpperCase();
                    let color = "bg-[#7C6A2E]"; // pending
                    if (status === 'COMPLETED') color = "bg-[#5A87C7]";
                    else if (status === 'ACCEPTED' || status === 'CONFIRMED') color = "bg-[#B08D2C]";

                    return (
                      <div 
                        key={idx} 
                        className={`${color} text-white text-[8px] sm:text-[9px] px-1 py-0.5 rounded-sm truncate leading-none w-full`} 
                        title={`${b.eventType} - ${b.clientName}`}
                      >
                        {b.eventType || b.clientName || "Event"}
                      </div>
                    );
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
