import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ResourceAllocationProps {
  bookings?: any[];
}

const ResourceAllocation = ({ bookings = [] }: ResourceAllocationProps) => {
  const upcomingShoots = bookings.filter(b => {
    const status = b.vendors?.videographer?.status?.toUpperCase();
    const eventDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (status === 'PENDING' || status === 'ACCEPTED') && eventDate >= today;
  }).length;
  const alertShoots = bookings.filter(b => {
    const status = b.vendors?.videographer?.status?.toUpperCase();
    const eventDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isUpcoming = (status === 'PENDING' || status === 'ACCEPTED' || status === 'CONFIRMED') && eventDate >= today;
    if (!isUpcoming) return false;
    
    const checklist = b.vendors?.videographer?.checklist || [];
    if (checklist.length === 0) return true;
    return checklist.some((c: any) => !c.isCompleted);
  }).length;
  const editingHours = upcomingShoots * 6;

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
            {upcomingShoots < 10 ? `0${upcomingShoots}` : upcomingShoots}
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mt-4">
            <TrendingUp size={13} />
            <span>+1 VS LAST WEEK</span>
          </div>
        </div>

        {/* Editing Hours */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            EDITING HOURS
          </p>

          <div className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            {editingHours}
          </div>

          <div className="mt-4">
            <div className="w-full bg-[#E0D8C3] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#7C6A2E] h-full rounded-full"
                style={{ width: `${Math.min(100, (editingHours / 40) * 100)}%` }}
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
            {alertShoots < 10 ? `0${alertShoots}` : alertShoots}
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-bold tracking-widest text-gray-800 uppercase border-b-2 border-gray-800 pb-0.5">
              {alertShoots > 0 ? "BATTERY RECHARGE DUE" : "ALL SYSTEMS READY"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceAllocation;
