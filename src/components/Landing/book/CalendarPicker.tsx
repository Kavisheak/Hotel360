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
    <div className="space-y-4 hover-glow p-4 rounded-sm transition-all duration-300 bg-[#111111] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
      <label className="block text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold flex items-center gap-1.5">
        <CalendarIcon className="w-4 h-4 text-[#C9A84C]" /> Step 1: Select Event Date (June 2026)
      </label>
      
      {/* Legend */}
      <div className="flex gap-4 text-[9px] uppercase tracking-widest font-semibold text-gray-500 pb-2 border-b border-[#C9A84C]/30">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#1A1A1A] border border-[#C9A84C]/30 block rounded-sm"></span>
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#2A1111] border border-red-900/50 block rounded-sm"></span>
          <span className="text-gray-400">Reserved</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-[#2A1A00] border border-orange-900/50 block rounded-sm"></span>
          <span className="text-gray-400">Pending Hold</span>
        </div>
      </div>

      {/* Month Header */}
      <div className="text-center py-2 bg-[#1A1A1A] text-xs text-white font-serif font-semibold border-t border-b border-[#C9A84C]/30">
        June 2026
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
          <div key={idx} className="font-semibold text-[9px] text-[#C9A84C] uppercase tracking-widest py-1">
            {day}
          </div>
        ))}
        
        {JUNE_2026_DAYS.map((day) => {
          const isSelected = selectedDate === day.date;
          
          let cellStyle = "bg-[#1A1A1A] text-white border border-[#C9A84C]/30 hover:border-[#C9A84C] cursor-pointer hover-glow";
          if (day.status === "reserved") {
            cellStyle = "bg-[#2A1111] text-red-500/50 border border-red-900/50 cursor-not-allowed line-through";
          } else if (day.status === "pending") {
            cellStyle = "bg-[#2A1A00] text-orange-500/60 border border-orange-900/50 cursor-not-allowed";
          }

          if (isSelected && day.status === "available") {
            cellStyle = "bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] text-black border-[#C9A84C] shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold scale-[1.05] z-10 relative";
          }

          return (
            <button
              key={day.date}
              type="button"
              disabled={day.status !== "available"}
              onClick={() => onSelectDate(day.date)}
              className={`h-12 w-full flex flex-col justify-center items-center rounded-sm transition-all duration-200 relative ${cellStyle}`}
            >
              <span className="font-medium text-xs">{day.date}</span>
              {day.status === "reserved" && (
                <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-red-500/70">Booked</span>
              )}
              {day.status === "pending" && (
                <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-orange-500/70">Pending</span>
              )}
              {day.status === "available" && isSelected && (
                <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-extrabold text-black">Active</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
