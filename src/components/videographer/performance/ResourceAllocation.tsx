import React from 'react';
import { TrendingUp } from 'lucide-react';

const ResourceAllocation = () => {
  return (
    <div className="mt-8 sm:mt-12">
      <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 font-bold tracking-tight mb-6">
        Weekly Schedule Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

        {/* Upcoming Shoots */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            UPCOMING SHOOTS
          </p>

          <div className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            09
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mt-4">
            <TrendingUp size={13} />
            <span>+3 VS LAST WEEK</span>
          </div>
        </div>

        {/* Editing Hours */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            EDITING HOURS
          </p>

          <div className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            38
          </div>

          <div className="mt-4">
            <div className="w-full bg-[#E0D8C3] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#7C6A2E] h-full rounded-full"
                style={{ width: '76%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Equipment Alerts */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            EQUIPMENT ALERTS
          </p>

          <div className="text-4xl sm:text-5xl font-serif text-[#C75A5A] font-bold tracking-tight">
            02
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-bold tracking-widest text-gray-800 uppercase border-b-2 border-gray-800 pb-0.5">
              BATTERY RECHARGE DUE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceAllocation;
