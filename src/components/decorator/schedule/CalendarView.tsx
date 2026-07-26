"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ScheduleItem {
  date: string; // YYYY-MM-DD
  type: 'booked' | 'blocked';
  bookingId?: string;
  blockId?: string;
  bookingRef?: string;
  eventName?: string;
  reason?: string;
  readOnly?: boolean;
}

interface CalendarViewProps {
  scheduleItems?: ScheduleItem[];
  selectedMonth?: number; // 1-12
  selectedYear?: number;
  onMonthChange?: (month: number, year: number) => void;
  onDeleteBlock?: (blockId: string) => Promise<void>;
}

const formatDateKey = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CalendarView: React.FC<CalendarViewProps> = ({
  scheduleItems = [],
  selectedMonth,
  selectedYear,
  onMonthChange,
  onDeleteBlock,
}) => {
  const router = useRouter();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const now = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(selectedYear || now.getFullYear(), (selectedMonth || now.getMonth() + 1) - 1, 1)
  );

  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    const prev = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(prev);
    if (onMonthChange) onMonthChange(prev.getMonth() + 1, prev.getFullYear());
  };

  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(next);
    if (onMonthChange) onMonthChange(next.getMonth() + 1, next.getFullYear());
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

  // Create lookup map for schedule items
  const itemMap = new Map<string, ScheduleItem>();
  scheduleItems.forEach((item) => {
    itemMap.set(item.date, item);
  });

  return (
    <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-xs rounded-lg overflow-hidden flex flex-col w-full font-sans">
      {/* Month Navigation Header */}
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 border-b border-[#E0D8C3] bg-white">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 border border-emerald-600"></span>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#B08D2C] border border-[#8C6D1F]"></span>
            <span className="text-gray-600">Confirmed Job (Read-Only)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-red-500 border border-red-600"></span>
            <span className="text-gray-600">Blocked (Editable)</span>
          </div>
        </div>

        <div className="flex space-x-2 text-gray-600">
          <button type="button" onClick={handlePrevMonth} className="hover:text-gray-900 p-1.5 border border-[#E0D8C3] rounded hover:bg-gray-50">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={handleNextMonth} className="hover:text-gray-900 p-1.5 border border-[#E0D8C3] rounded hover:bg-gray-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-[#E0D8C3] bg-[#FAF6EE]">
        {days.map((day) => (
          <div
            key={day}
            className="text-center py-2.5 text-[9px] sm:text-[10px] font-bold tracking-widest text-gray-500 uppercase border-r border-[#E0D8C3] last:border-r-0"
          >
            <span className="sm:hidden">{day.charAt(0)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 bg-white flex-1">
        {dates.map((d, i) => {
          const dateKey = formatDateKey(d.fullDate);
          const scheduleItem = itemMap.get(dateKey);

          const isBooked = scheduleItem?.type === 'booked';
          const isBlocked = scheduleItem?.type === 'blocked';

          return (
            <div
              key={i}
              className={`min-h-[75px] sm:min-h-[100px] border-b border-r border-[#E0D8C3] p-2 flex flex-col justify-between relative text-left transition-colors ${
                !d.currentMonth ? 'text-gray-300 bg-gray-50/50' : 'text-gray-700'
              } ${isBooked ? 'bg-[#FEFBF2]' : isBlocked ? 'bg-red-50/40' : ''}`}
            >
              <span className={`text-xs font-bold ${!d.currentMonth ? 'text-gray-300' : 'text-gray-700'}`}>
                {d.date}
              </span>

              {/* Status Badges */}
              {d.currentMonth && scheduleItem && (
                <div className="mt-1 flex flex-col gap-1">
                  {/* Booked State (Read-only click -> deep-link to My Jobs) */}
                  {isBooked && (
                    <button
                      type="button"
                      onClick={() => router.push(`/decorator/my-jobs?bookingId=${scheduleItem.bookingId}`)}
                      className="bg-[#B08D2C] hover:bg-[#967723] text-white text-[9px] font-bold px-2 py-1 rounded-sm shadow-xs flex items-center justify-between w-full truncate transition-colors cursor-pointer"
                      title="Confirmed Job (Click to view details)"
                    >
                      <span className="truncate">{scheduleItem.eventName || "Confirmed Job"}</span>
                      <CheckCircle2 size={11} className="shrink-0 ml-1" />
                    </button>
                  )}

                  {/* Blocked State (Editable with Delete "x" button) */}
                  {isBlocked && (
                    <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-sm flex items-center justify-between w-full shadow-xs">
                      <span className="truncate uppercase flex items-center gap-1">
                        <Lock size={10} className="shrink-0" />
                        {scheduleItem.reason || "Blocked"}
                      </span>
                      {onDeleteBlock && scheduleItem.blockId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteBlock(scheduleItem.blockId!);
                          }}
                          className="hover:bg-red-700 p-0.5 rounded text-white transition-colors ml-1"
                          title="Remove block"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  )}
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