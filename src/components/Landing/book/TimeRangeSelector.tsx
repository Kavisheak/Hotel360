"use client";

import React, { useMemo } from "react";
import { Clock } from "lucide-react";

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onChange: (start: string, end: string) => void;
}

export default function TimeRangeSelector({ startTime, endTime, onChange }: TimeRangeSelectorProps) {
  // Generate time options from 08:00 to 23:30 in 30min intervals
  const timeOptions = useMemo(() => {
    const options = [];
    for (let h = 8; h <= 23; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 23 && m > 30) continue;
        const formattedHour = h.toString().padStart(2, "0");
        const formattedMin = m.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMin}`);
      }
    }
    return options;
  }, []);

  // Calculate duration
  const durationHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    
    let hours = endH - startH;
    let mins = endM - startM;
    
    if (mins < 0) {
      hours -= 1;
      mins += 60;
    }
    
    return hours + (mins / 60);
  }, [startTime, endTime]);

  const extraHours = Math.max(0, durationHours - 6);
  const extraHoursCost = extraHours * 50000;

  return (
    <div className="bg-white dark:bg-[#111111] p-8 border border-[#E8DFC9] dark:border-gray-800 rounded-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-[#FAF6EE] dark:bg-gray-900 rounded-full flex items-center justify-center border border-[#E8DFC9] dark:border-gray-800 shrink-0">
          <Clock className="w-5 h-5 text-[#C69C6D]" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">Event Time & Duration</h3>
          <p className="text-[11px] text-gray-500 font-light mt-1 tracking-wide">
            Select your start and end times. Base allocation is 6 hours. Extend at LKR 50,000 per extra hour.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Start Time</label>
          <select 
            value={startTime} 
            onChange={(e) => onChange(e.target.value, endTime)}
            className="w-full bg-[#FAF6EE] dark:bg-gray-900 p-3 rounded-sm border border-[#E8DFC9] dark:border-gray-800 outline-none focus:border-[#C69C6D] transition-colors text-base text-[#1A1512] dark:text-white"
          >
            {timeOptions.map((t) => (
              <option key={`start-${t}`} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">End Time</label>
          <select 
            value={endTime} 
            onChange={(e) => onChange(startTime, e.target.value)}
            className="w-full bg-[#FAF6EE] dark:bg-gray-900 p-3 rounded-sm border border-[#E8DFC9] dark:border-gray-800 outline-none focus:border-[#C69C6D] transition-colors text-base text-[#1A1512] dark:text-white"
          >
            {timeOptions.map((t) => (
              <option key={`end-${t}`} value={t} disabled={t <= startTime}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <div className="flex-1 bg-[#FAF6EE] dark:bg-gray-900 p-6 rounded-sm border border-[#E8DFC9] dark:border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">
              Total Duration
            </div>
            <div className="text-3xl font-serif text-[#1A1512] dark:text-white flex items-baseline gap-1">
              {durationHours > 0 ? durationHours.toFixed(1) : "0"} <span className="text-[16px] text-gray-400 font-sans italic">hrs</span>
            </div>
          </div>
          {durationHours < 6 && durationHours > 0 && (
            <div className="text-sm text-amber-600 dark:text-amber-500">
              Note: Base price covers up to 6 hours.
            </div>
          )}
        </div>

        {extraHours > 0 && (
          <div className="flex-1 p-6 rounded-sm border border-[#C69C6D]/30 bg-[#C69C6D]/5 flex items-center justify-center animate-fadeIn">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#C69C6D] mb-1">
                Extension Premium
              </div>
              <div className="text-lg font-bold text-[#1A1512] dark:text-white">
                + LKR {extraHoursCost.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
