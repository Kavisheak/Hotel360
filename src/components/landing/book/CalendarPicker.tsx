"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { customerBookingAPI } from "@/lib/api";

interface CalendarPickerProps {
  selectedDate: number;
  onSelectDate: (date: number) => void;
}

const FIXED_HOLIDAYS: Record<string, string> = {
  "01-14": "Thai Pongal",
  "02-04": "Independence",
  "03-03": "Medin Poya",
  "04-13": "NY Eve",
  "04-14": "New Year",
  "05-01": "May Day & Vesak",
  "05-31": "Poson Poya",
  "06-29": "Esala Poya",
  "07-28": "Nikini Poya",
  "08-27": "Binara Poya",
  "09-25": "Vap Poya",
  "09-26": "Milad un-Nabi",
  "10-24": "Ill Poya",
  "10-31": "Deepavali",
  "11-23": "Unduvap",
  "12-25": "Christmas"
};

export default function CalendarPicker({ selectedDate, onSelectDate }: CalendarPickerProps) {
  const getSriLankanDate = () => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Colombo', year: 'numeric', month: 'numeric', day: 'numeric' };
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(d);
    let year = d.getFullYear(), month = d.getMonth(), day = d.getDate();
    for (const part of parts) {
      if (part.type === 'year') year = parseInt(part.value, 10);
      if (part.type === 'month') month = parseInt(part.value, 10) - 1;
      if (part.type === 'day') day = parseInt(part.value, 10);
    }
    return new Date(year, month, day);
  };

  const initialToday = getSriLankanDate();
  const [currentMonth, setCurrentMonth] = useState(new Date(initialToday.getFullYear(), initialToday.getMonth(), 1));
  const [bookedDates, setBookedDates] = useState<{ date: string; status: string; reason?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const res = await customerBookingAPI.getAvailability();
        if (res.ok && res.data.success) {
          setBookedDates(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch availability", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0 is Sunday
  
  // Shift so Monday is index 0
  const startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const handlePrevMonth = () => {
    const today = getSriLankanDate();
    // Prevent going to past months
    if (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() <= today.getMonth()) {
      return;
    }
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = useMemo(() => {
    const today = getSriLankanDate();
    today.setHours(0, 0, 0, 0);

    const minBookableDate = new Date(today);
    minBookableDate.setDate(today.getDate() + 7);

    const result = [];
    
    // Add empty padding days for start of month
    for (let i = 0; i < startOffset; i++) {
      result.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

      // Check against backend bookings first so they always show up correctly
      const dateStringMatch = bookedDates.find(b => {
        const bDate = new Date(b.date);
        return bDate.getFullYear() === dateObj.getFullYear() && 
               bDate.getMonth() === dateObj.getMonth() && 
               bDate.getDate() === dateObj.getDate();
      });

      let status = "available";
      let reason = "";
      if (dateStringMatch) {
        if (dateStringMatch.status === "confirmed" || dateStringMatch.status === "completed") {
          status = "reserved";
        } else if (dateStringMatch.status === "pending") {
          status = "pending";
        } else if (dateStringMatch.status === "held") {
          status = "held";
        } else if (dateStringMatch.status === "blocked") {
          status = "blocked";
          reason = dateStringMatch.reason || "Maintenance";
        }
      }

      // If it's not already booked/held/blocked, check if it's in the past or within the 7-day notice period
      if (status === "available" && dateObj <= minBookableDate) {
        status = "past";
      }

      const monthStr = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const dayStr = dateObj.getDate().toString().padStart(2, "0");
      const holidayName = FIXED_HOLIDAYS[`${monthStr}-${dayStr}`];

      result.push({ date: day, timestamp: dateObj.getTime(), status, holidayName, reason });
    }
    return result;
  }, [currentMonth, daysInMonth, startOffset, bookedDates]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-6 relative min-h-[300px]">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
        <CalendarIcon className="w-4 h-4 text-[#A6955C]" /> STEP 1: SELECT EVENT DATE ({monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()})
      </label>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[9px] uppercase tracking-widest font-bold text-gray-500 pb-4 border-b border-[#E8DFC9] dark:border-[#C9A84C]/30">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 block"></span>
          <span>AVAILABLE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-200 block"></span>
          <span>RESERVED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-100 border-2 border-gray-300 block"></span>
          <span>AWAITING APPROVAL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-200 block"></span>
          <span>HOLIDAY</span>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 dark:bg-black/50 rounded backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
        </div>
      )}

      {/* Month Header and Navigation */}
      <div className="flex items-center justify-between text-sm font-serif font-bold text-[#1A1512] dark:text-white px-2">
        <button type="button" onClick={handlePrevMonth} className="text-gray-400 hover:text-[#1A1512] dark:hover:text-white p-1">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-base tracking-wide">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
        <button type="button" onClick={handleNextMonth} className="text-gray-400 hover:text-[#1A1512] dark:hover:text-white p-1">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
          <div key={idx} className="font-bold text-[9px] text-[#A6955C] uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
        
        {days.map((dayObj, idx) => {
          if (!dayObj) {
            return <div key={`empty-${idx}`} className="h-14 w-full"></div>;
          }

          const isSelected = selectedDate === dayObj.timestamp;
          
          let cellStyle = "bg-white dark:bg-[#1A1A1A] text-[#1A1512] dark:text-white border border-[#E8DFC9] dark:border-[#C9A84C]/30 hover:border-[#A6955C] cursor-pointer transition-colors";
          
          if (dayObj.status === "past") {
            cellStyle = "bg-gray-50 dark:bg-gray-900/20 text-gray-400 dark:text-gray-600 border border-transparent cursor-not-allowed opacity-50";
          } else if (dayObj.status === "reserved") {
            cellStyle = "bg-[#FFF0F0] dark:bg-[#2A1111] text-[#D94F4F] border border-[#FFD6D6] dark:border-red-900/50 cursor-not-allowed";
          } else if (dayObj.status === "pending") {
            cellStyle = "bg-[#F3F4F6] dark:bg-gray-800 text-gray-500 border border-gray-300 dark:border-gray-600 cursor-not-allowed";
          } else if (dayObj.status === "held") {
            cellStyle = "bg-amber-50 dark:bg-amber-950/30 text-amber-700 border border-amber-300 dark:border-amber-900 cursor-not-allowed";
          } else if (dayObj.status === "blocked") {
            cellStyle = "bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 cursor-not-allowed";
          }

          if (isSelected && dayObj.status === "available") {
            cellStyle = "bg-[#FAF6EE] border-[#C69C6D] border-2 shadow-sm font-bold scale-[1.02] z-10 relative";
          }

          return (
            <button
              key={dayObj.timestamp}
              type="button"
              disabled={dayObj.status !== "available"}
              onClick={() => onSelectDate(dayObj.timestamp)}
              className={`h-14 w-full flex flex-col justify-center items-center rounded-sm relative ${cellStyle}`}
            >
              <span className={`font-semibold text-sm ${dayObj.status === 'available' ? 'text-[#1A1512] dark:text-white' : ''}`}>
                {dayObj.date}
              </span>
              
              {dayObj.status === "reserved" && (
                <span className="text-[7px] uppercase tracking-widest font-bold mt-0.5 text-[#D94F4F]">BOOKED</span>
              )}
              {dayObj.status === "pending" && (
                <span className="text-[7px] uppercase tracking-widest font-bold mt-0.5 text-gray-500">AWAITING APPROVAL</span>
              )}
              {dayObj.status === "held" && (
                <span className="text-[7px] uppercase tracking-widest font-bold mt-0.5 text-amber-600">HELD</span>
              )}
              {dayObj.status === "blocked" && (
                <>
                  <span className="text-[7px] uppercase tracking-widest font-bold mt-0.5 text-gray-400">BLOCKED</span>
                  {dayObj.reason && (
                    <span className="text-[6px] text-gray-500 uppercase max-w-[90%] truncate px-1 text-center leading-tight mt-0.5" title={dayObj.reason}>
                      {dayObj.reason}
                    </span>
                  )}
                </>
              )}
              {dayObj.holidayName && (
                <span className={`text-[7px] uppercase tracking-widest font-bold mt-0.5 max-w-full truncate px-1 text-center ${dayObj.status === "available" ? "text-green-600 dark:text-green-500" : "text-gray-500 opacity-70"}`} title={dayObj.holidayName}>
                  {dayObj.holidayName}
                </span>
              )}
              {dayObj.status === "available" && isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#C69C6D] rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
