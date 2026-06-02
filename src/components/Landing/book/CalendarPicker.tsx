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
    <div className="space-y-4">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
        <CalendarIcon className="w-4 h-4 text-[#c69c6d]" /> Step 1: Select Event Date (June 2026)
      </label>
      
      {/* Legend */}
      <div className="flex gap-4 text-[9px] uppercase tracking-widest font-semibold text-gray-500 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-white border border-gray-200 block rounded-sm"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-red-50 border border-red-200 block rounded-sm"></span>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-orange-50 border border-orange-200 block rounded-sm"></span>
          <span>Pending Hold</span>
        </div>
      </div>

      {/* Month Header */}
      <div className="text-center py-2 bg-[#FAF6EE] text-xs font-serif font-semibold border-t border-b border-[#E0D8C3]">
        June 2026
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
          <div key={idx} className="font-semibold text-[9px] text-[#A6955C] uppercase tracking-widest py-1">
            {day}
          </div>
        ))}
        
        {JUNE_2026_DAYS.map((day) => {
          const isSelected = selectedDate === day.date;
          
          let cellStyle = "bg-white text-gray-900 border border-gray-200 hover:border-[#c69c6d] cursor-pointer";
          if (day.status === "reserved") {
            cellStyle = "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed line-through";
          } else if (day.status === "pending") {
            cellStyle = "bg-orange-50/70 text-orange-400 border border-orange-100 cursor-not-allowed";
          }

          if (isSelected && day.status === "available") {
            cellStyle = "bg-[#1A1512] text-white border-[#1A1512] shadow-md ring-2 ring-[#c69c6d] ring-offset-2 font-bold scale-[1.03]";
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
                <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-red-400">Booked</span>
              )}
              {day.status === "pending" && (
                <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-orange-400">Pending</span>
              )}
              {day.status === "available" && isSelected && (
                <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-[#c69c6d]">Active</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
