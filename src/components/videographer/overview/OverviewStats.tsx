import React from 'react';
import { Camera, CalendarDays, CheckCircle2, Star } from 'lucide-react';

const stats = [
  { label: 'TOTAL ASSIGNED EVENTS', value: '18', icon: <Camera size={22} className="text-[#B08D2C]" /> },
  { label: 'UPCOMING EVENTS', value: '06', icon: <CalendarDays size={22} className="text-[#B08D2C]" /> },
  { label: 'COMPLETED EVENTS', value: '12', icon: <CheckCircle2 size={22} className="text-[#B08D2C]" /> },
  { label: 'AVERAGE RATING', value: '4.9', icon: <Star size={22} className="text-[#B08D2C]" /> },
];

const OverviewStats = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#FDF9F1] border border-[#E0D8C3] p-4 sm:p-5 flex flex-col justify-between min-h-[110px] shadow-sm"
        >
          <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-3">
            {stat.label}
          </p>
          <div className="flex items-end justify-between">
            <span className="text-3xl sm:text-4xl font-serif text-[#7C6A2E] font-bold tracking-tight">
              {stat.value}
            </span>
            <span className="opacity-60">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;
