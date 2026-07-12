import React from 'react';
import { TrendingUp } from 'lucide-react';

interface ResourceAllocationProps {
  bookings?: any[];
}

const ResourceAllocation = ({ bookings = [] }: ResourceAllocationProps) => {
  const upcomingProjects = bookings.filter(b => {
    const status = b.vendors?.decorator?.status?.toUpperCase();
    const eventDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (status === 'PENDING' || status === 'ACCEPTED' || status === 'CONFIRMED') && eventDate >= today;
  }).length;

  const alertProjects = bookings.filter(b => {
    const status = b.vendors?.decorator?.status?.toUpperCase();
    const eventDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isUpcoming = (status === 'PENDING' || status === 'ACCEPTED' || status === 'CONFIRMED') && eventDate >= today;
    if (!isUpcoming) return false;

    const checklist = b.vendors?.decorator?.checklist || [];
    if (checklist.length === 0) return true;
    return checklist.some((c: any) => !c.isCompleted);
  }).length;

  const prepHours = upcomingProjects * 8; // 8 prep hours per decoration project

  return (
    <div className="mt-8 sm:mt-12">
      <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 font-bold tracking-tight mb-6">
        Weekly Schedule Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

        {/* Upcoming Projects */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            UPCOMING PROJECTS
          </p>

          <div className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            {upcomingProjects < 10 ? `0${upcomingProjects}` : upcomingProjects}
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mt-4">
            <TrendingUp size={13} />
            <span>+1 VS LAST WEEK</span>
          </div>
        </div>

        {/* Preparation Hours */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            PREPARATION HOURS
          </p>

          <div className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            {prepHours}
          </div>

          <div className="mt-4">
            <div className="w-full bg-[#E0D8C3] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#7C6A2E] h-full rounded-full"
                style={{ width: `${Math.min(100, (prepHours / 40) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Equipment / Inventory Alerts */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
            PENDING PREP CHECKS
          </p>

          <div className="text-4xl sm:text-5xl font-serif text-[#C75A5A] font-bold tracking-tight">
            {alertProjects < 10 ? `0${alertProjects}` : alertProjects}
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-bold tracking-widest text-gray-800 uppercase border-b-2 border-gray-800 pb-0.5">
              {alertProjects > 0 ? "MATERIAL PREP DUE" : "ALL SYSTEMS READY"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceAllocation;
