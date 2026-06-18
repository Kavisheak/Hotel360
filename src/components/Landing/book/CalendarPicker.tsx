"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

interface CalendarDay {
  date: number;
  dayName: string;
  status: "available" | "reserved" | "pending";
}

const JUNE_2026_DAYS: CalendarDay[] = [
  { date: 1, dayName: "Mon", status: "available" },
  { date: 2, dayName: "Tue", status: "available" },
  { date: 3, dayName: "Wed", status: "reserved" },
  { date: 4, dayName: "Thu", status: "available" },
  { date: 5, dayName: "Fri", status: "pending" },
  { date: 6, dayName: "Sat", status: "reserved" },
  { date: 7, dayName: "Sun", status: "reserved" },
  { date: 8, dayName: "Mon", status: "available" },
  { date: 9, dayName: "Tue", status: "available" },
  { date: 10, dayName: "Wed", status: "available" },
  { date: 11, dayName: "Thu", status: "available" },
  { date: 12, dayName: "Fri", status: "reserved" },
  { date: 13, dayName: "Sat", status: "reserved" },
  { date: 14, dayName: "Sun", status: "available" },
  { date: 15, dayName: "Mon", status: "available" },
  { date: 16, dayName: "Tue", status: "available" },
  { date: 17, dayName: "Wed", status: "pending" },
  { date: 18, dayName: "Thu", status: "available" },
  { date: 19, dayName: "Fri", status: "available" },
  { date: 20, dayName: "Sat", status: "reserved" },
  { date: 21, dayName: "Sun", status: "reserved" },
  { date: 22, dayName: "Mon", status: "available" },
  { date: 23, dayName: "Tue", status: "available" },
  { date: 24, dayName: "Wed", status: "available" },
  { date: 25, dayName: "Thu", status: "available" },
  { date: 26, dayName: "Fri", status: "available" },
  { date: 27, dayName: "Sat", status: "reserved" },
  { date: 28, dayName: "Sun", status: "reserved" },
  { date: 29, dayName: "Mon", status: "available" },
  { date: 30, dayName: "Tue", status: "available" }
];

interface CalendarPickerProps {
  selectedDate: number;
  onSelectDate: (date: number) => void;
}

export default function CalendarPicker({ selectedDate, onSelectDate }: CalendarPickerProps) {
  return (
    <div className="space-y-6">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
        <CalendarIcon className="w-4 h-4 text-[#A6955C]" /> STEP 1: SELECT EVENT DATE (JUNE 2026)
      </label>
      
      {/* Legend */}
      <div className="flex gap-6 text-[9px] uppercase tracking-widest font-bold text-gray-500 pb-4 border-b border-[#E8DFC9] dark:border-[#C9A84C]/30">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 block"></span>
          <span>AVAILABLE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-200 block"></span>
          <span>RESERVED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-100 border-2 border-orange-200 block"></span>
          <span>PENDING HOLD</span>
        </div>
      </div>

      {/* Month Header and Navigation */}
      <div className="flex items-center justify-between text-xs font-serif font-bold text-[#1A1512] dark:text-white px-2">
        <button className="text-gray-400 hover:text-[#1A1512]">&lt;</button>
        <span>June 2026</span>
        <button className="text-gray-400 hover:text-[#1A1512]">&gt;</button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
          <div key={idx} className="font-bold text-[9px] text-[#A6955C] uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
        
        {JUNE_2026_DAYS.map((day) => {
          const isSelected = selectedDate === day.date;
          
          let cellStyle = "bg-white dark:bg-[#1A1A1A] text-[#1A1512] dark:text-white border border-[#E8DFC9] dark:border-[#C9A84C]/30 hover:border-[#A6955C] cursor-pointer transition-colors";
          if (day.status === "reserved") {
            cellStyle = "bg-[#FFF0F0] dark:bg-[#2A1111] text-[#D94F4F] border border-[#FFD6D6] dark:border-red-900/50 cursor-not-allowed";
          } else if (day.status === "pending") {
            cellStyle = "bg-[#FFF8E6] dark:bg-[#2A1A00] text-[#D49B35] border border-[#FFE8B3] dark:border-orange-900/50 cursor-not-allowed";
          }

          if (isSelected && day.status === "available") {
            cellStyle = "bg-[#FAF6EE] border-[#C69C6D] border-2 shadow-sm font-bold scale-[1.02] z-10 relative";
          }

          return (
            <button
              key={day.date}
              type="button"
              disabled={day.status !== "available"}
              onClick={() => onSelectDate(day.date)}
              className={`h-14 w-full flex flex-col justify-center items-center rounded-sm relative ${cellStyle}`}
            >
              <span className={`font-semibold text-xs ${day.status === 'available' ? 'text-[#1A1512]' : ''}`}>{day.date}</span>
              {day.status === "reserved" && (
                <span className="text-[7px] uppercase tracking-widest font-bold mt-0.5 text-[#D94F4F]">BOOKED</span>
              )}
              {day.status === "pending" && (
                <span className="text-[7px] uppercase tracking-widest font-bold mt-0.5 text-[#D49B35]">PENDING</span>
              )}
              {day.status === "available" && isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#C69C6D] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
