import React from 'react';
import { PlayCircle, Upload, Clock } from 'lucide-react';

const activities = [
  {
    icon: <Upload size={14} className="text-[#7C6A2E]" />,
    title: 'Uploaded ceremony teaser',
    meta: '2 files · 12 min ago',
  },
  {
    icon: <PlayCircle size={14} className="text-[#7C6A2E]" />,
    title: 'Client preview approved',
    meta: 'Zahra & Omar · 1 hour ago',
  },
  {
    icon: <Clock size={14} className="text-[#7C6A2E]" />,
    title: 'Checked in at Grand Imperial Hall',
    meta: 'Location update · Today',
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-3 mb-5">
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">RECENT ACTIVITY</h3>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.title} className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{item.title}</p>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-1">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
