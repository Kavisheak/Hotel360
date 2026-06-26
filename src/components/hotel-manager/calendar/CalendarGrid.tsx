"use client";

import React, { useEffect, useState } from 'react';
import { bookingAPI } from '@/lib/api';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CalendarGrid = ({ currentDate }: { currentDate: Date }) => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    bookingAPI.getAllBookings().then(res => {
      if (res.ok && res.data?.data) {
        setBookings(res.data.data);
      }
    });
  }, []);

  const buildDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const dates: { date: number; currentMonth: boolean; events: { label: string; type: 'confirmed' | 'pending' | 'overdue' | 'today' | 'other' }[] }[] = [];
    
    // Previous month tail
    for (let i = firstDay - 1; i >= 0; i--) {
      dates.push({ date: daysInPrevMonth - i, currentMonth: false, events: [] });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ date: i, currentMonth: true, events: [] });
    }
    
    // Next month head
    while (dates.length % 7 !== 0) {
      dates.push({ date: dates.length - (firstDay + daysInMonth) + 1, currentMonth: false, events: [] });
    }

    // Inject real events
    const eventMap: Record<number, { label: string; type: 'confirmed' | 'pending' | 'overdue' | 'today' | 'other' }[]> = {};
    
    bookings.forEach(b => {
      if (b.date) {
        const d = new Date(b.date);
        if (d.getMonth() === month && d.getFullYear() === year) {
          const dateNum = d.getDate();
          if (!eventMap[dateNum]) eventMap[dateNum] = [];
          
          let type: any = 'other';
          if (b.status === 'Confirmed' || b.status === 'DepositPaid' || b.status === 'BalancePaid') type = 'confirmed';
          if (b.status === 'Pending') type = 'pending';
          
          eventMap[dateNum].push({
            label: `${b.clientName.split(' ')[0]} - ${b.eventType}`,
            type
          });
        }
      }
    });

    dates.forEach(d => {
      if (d.currentMonth && eventMap[d.date]) {
        d.events = eventMap[d.date];
      }
    });

    return dates;
  };

  const dates = buildDates();
  const todayDate = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

  const eventStyles = {
    confirmed: 'bg-[#B08D2C] text-white',
    pending:   'bg-[#CBD5E1] text-gray-700',
    overdue:   'bg-red-100 text-red-600 border border-red-300',
    today:     'bg-[#7C6A2E] text-white',
    other:     'bg-[#F2EADA] text-gray-600',
  };

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
          const isToday = d.date === todayDate && d.currentMonth && isCurrentMonth;
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
                {d.events.map((e: any, j: number) => (
                  <span
                    key={j}
                    className={`text-[8px] font-bold uppercase tracking-wide px-1 py-0.5 rounded truncate leading-tight ${(eventStyles as any)[e.type]}`}
                  >
                    {e.label}
                  </span>
                ))}
              </div>
              {/* Dot indicators for mobile */}
              {d.events.length > 0 && (
                <div className="sm:hidden flex gap-0.5 mt-auto">
                  {d.events.slice(0, 3).map((e: any, j: number) => (
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
