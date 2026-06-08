import React from 'react';
import { Clock3, PlayCircle, CheckCircle2 } from 'lucide-react';

const MyEventsStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">UPCOMING</p>
          <span className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">08</span>
        </div>
        <Clock3 size={28} className="text-[#B08D2C] opacity-75 shrink-0" />
      </div>

      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">IN PROGRESS</p>
          <span className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">14</span>
        </div>
        <PlayCircle size={28} className="text-[#5A87C7] opacity-75 shrink-0" />
      </div>

      <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">COMPLETED</p>
          <span className="text-4xl sm:text-5xl font-serif text-[#C75A5A] font-bold tracking-tight font-semibold">31</span>
        </div>
        <CheckCircle2 size={28} className="text-[#C75A5A] opacity-75 shrink-0" />
      </div>
    </div>
  );
};

export default MyEventsStats;
