"use client";

import React from "react";
import { Clock, Sun, Moon, SunMoon } from "lucide-react";

interface TimeslotSelectorProps {
  timeslot: string;
  onSelectTimeslot: (t: string) => void;
}

export default function TimeslotSelector({ timeslot, onSelectTimeslot }: TimeslotSelectorProps) {
  const slots = [
    {
      id: "morning",
      label: "Morning Ceremony",
      time: "08:00 AM - 02:00 PM",
      desc: "Perfect for traditional poruwa ceremonies with natural sunlight.",
      icon: <Sun className="w-5 h-5 text-[#C9A84C]" />
    },
    {
      id: "evening",
      label: "Evening Soiree",
      time: "04:00 PM - 10:00 PM",
      desc: "Our signature timeslot. Golden hour cocktails leading to a grand dinner.",
      icon: <Moon className="w-5 h-5 text-[#C9A84C]" />
    },
    {
      id: "full",
      label: "Full Day Exclusive",
      time: "08:00 AM - 11:00 PM",
      desc: "Ultimate flexibility for multi-ceremony events with outfit changes.",
      icon: <SunMoon className="w-5 h-5 text-[#C9A84C]" />
    }
  ];

  return (
    <div className="space-y-4 hover-glow p-4 rounded-sm transition-all duration-300">
      <label className="block text-[10px] uppercase tracking-widest text-[#A67C52] font-bold flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-[#C9A84C]" /> Step 2: Choose Timeslot
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {slots.map((slot) => {
          const isActive = timeslot === slot.id;
          return (
            <div 
              key={slot.id}
              onClick={() => onSelectTimeslot(slot.id)}
              className={`
                p-5 cursor-pointer transition-all duration-300 relative rounded-sm hover-lift
                ${isActive 
                  ? "bg-[#2C1E14] border-[#2C1E14] text-white shadow-lg ring-2 ring-[#C9A84C] ring-offset-2 ring-offset-[#F0E6D0]" 
                  : "bg-white border border-[#D4C9A8] text-gray-900 hover:border-[#C9A84C]"
                }
              `}
            >
              <div className="flex flex-col h-full space-y-3">
                <div className="flex items-center justify-between">
                  {slot.icon}
                  {isActive && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#C9A84C]">Selected</span>
                  )}
                </div>
                <div>
                  <h4 className={`font-serif text-sm font-semibold ${isActive ? "text-white" : "text-gray-900"}`}>
                    {slot.label}
                  </h4>
                  <span className={`text-[10px] font-bold tracking-wider mt-1 block ${isActive ? "text-[#C9A84C]" : "text-[#A67C52]"}`}>
                    {slot.time}
                  </span>
                </div>
                <p className={`text-[10px] leading-relaxed font-light mt-auto pt-2 ${isActive ? "text-gray-400" : "text-gray-500"}`}>
                  {slot.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
