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
      desc: "Perfect for traditional ceremonies with natural sunlight.",
      icon: <Sun className="w-5 h-5 text-current" />
    },
    {
      id: "evening",
      label: "Evening Soiree",
      time: "04:00 PM - 10:00 PM",
      desc: "Our signature timeslot. Golden hour cocktails leading to a grand dinner.",
      icon: <Moon className="w-5 h-5 text-current" />
    },
    {
      id: "full",
      label: "Full Day Exclusive",
      time: "08:00 AM - 11:00 PM",
      desc: "Ultimate flexibility for multi-ceremony events with custom changes.",
      icon: <SunMoon className="w-5 h-5 text-current" />
    }
  ];

  return (
    <div className="space-y-6">
      <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-[#A6955C]" /> STEP 2: CHOOSE TIMESLOT
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const isActive = timeslot === slot.id;
          return (
            <div 
              key={slot.id}
              onClick={() => onSelectTimeslot(slot.id)}
              className={`
                p-5 cursor-pointer transition-all duration-300 relative rounded-sm
                ${isActive 
                  ? "bg-white dark:bg-[#111] border-2 border-[#C69C6D] shadow-sm z-10" 
                  : "bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-gray-800 hover:border-[#A6955C]"
                }
              `}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-[#C69C6D] text-white text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-bl-sm">
                  Selected
                </div>
              )}
              
              <div className="flex flex-col h-full space-y-4">
                <div className={`${isActive ? 'text-[#C69C6D]' : 'text-gray-400'}`}>
                  {slot.icon}
                </div>
                
                <div>
                  <h4 className={`font-serif text-[15px] font-semibold mb-1 ${isActive ? "text-[#1A1512] dark:text-white" : "text-[#1A1512] dark:text-gray-300"}`}>
                    {slot.label}
                  </h4>
                  <span className={`text-[10px] font-bold tracking-widest block ${isActive ? "text-[#A6955C]" : "text-[#A6955C]"}`}>
                    {slot.time}
                  </span>
                </div>
                
                <p className={`text-[10px] leading-relaxed font-light mt-auto pt-2 ${isActive ? "text-gray-600 dark:text-gray-400" : "text-gray-500"}`}>
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
