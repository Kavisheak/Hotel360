import React from "react";
import { Clock } from "lucide-react";

interface DurationSelectorProps {
  durationHours: number;
  onChange: (hours: number) => void;
}

export default function DurationSelector({ durationHours, onChange }: DurationSelectorProps) {
  const extraHours = Math.max(0, durationHours - 6);
  const extraHoursCost = extraHours * 50000;

  return (
    <div className="bg-white dark:bg-[#111111] p-8 border border-[#E8DFC9] dark:border-gray-800 rounded-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-[#FAF6EE] dark:bg-gray-900 rounded-full flex items-center justify-center border border-[#E8DFC9] dark:border-gray-800 shrink-0">
          <Clock className="w-5 h-5 text-[#C69C6D]" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">Event Duration</h3>
          <p className="text-[11px] text-gray-500 font-light mt-1 tracking-wide">
            Base allocation is 6 hours. Extend your celebration at LKR 50,000 per extra hour.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <div className="flex-1 bg-[#FAF6EE] dark:bg-gray-900 p-6 rounded-sm border border-[#E8DFC9] dark:border-gray-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">
              Total Hours
            </div>
            <div className="text-3xl font-serif text-[#1A1512] dark:text-white">
              {durationHours} <span className="text-[16px] text-gray-400 font-sans italic">hrs</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onChange(Math.max(6, durationHours - 1))}
              disabled={durationHours <= 6}
              className="w-10 h-10 rounded-full border border-[#D4C9A8] dark:border-gray-700 flex items-center justify-center text-[#1A1512] dark:text-white hover:bg-[#C69C6D] hover:text-white hover:border-[#C69C6D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              -
            </button>
            <button 
              onClick={() => onChange(Math.min(12, durationHours + 1))}
              disabled={durationHours >= 12}
              className="w-10 h-10 rounded-full border border-[#D4C9A8] dark:border-gray-700 flex items-center justify-center text-[#1A1512] dark:text-white hover:bg-[#C69C6D] hover:text-white hover:border-[#C69C6D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
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
