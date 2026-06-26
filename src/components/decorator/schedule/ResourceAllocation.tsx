import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ResourceAllocationProps {
  bookings?: any[];
}

const ResourceAllocation = ({ bookings = [] }: ResourceAllocationProps) => {
  const activeProjects = bookings.filter(b => 
    b.vendors?.decorator?.status === 'ACCEPTED' || 
    b.vendors?.decorator?.status === 'PENDING'
  ).length;

  const incompleteTasks = bookings.reduce((sum, b) => {
    return sum + (b.vendors?.decorator?.checklist?.filter((c:any) => !c.isCompleted).length || 0);
  }, 0);
  return (
    <div className="mt-8 sm:mt-12">
      <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 font-bold tracking-tight mb-6">
        Weekly Resource Allocation
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">

        {/* Active Projects */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">ACTIVE PROJECTS</p>
          <div className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">{activeProjects > 0 ? activeProjects.toString().padStart(2, '0') : '00'}</div>
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mt-4">
            <TrendingUp size={13} />
            <span>+2 VS LAST WEEK</span>
          </div>
        </div>

        {/* Staff on Duty */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">STAFF ON DUTY</p>
          <div className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">24</div>
          <div className="mt-4">
            <div className="w-full bg-[#E0D8C3] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#7C6A2E] h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">PENDING TASKS</p>
          <div className="text-4xl sm:text-5xl font-serif text-[#C75A5A] font-bold tracking-tight">{incompleteTasks > 0 ? incompleteTasks.toString().padStart(2, '0') : '00'}</div>
          <div className="mt-4 flex items-center space-x-2">
            <AlertCircle size={13} className="text-[#C75A5A]" />
            <span className="text-[10px] font-bold tracking-widest text-gray-800 uppercase border-b-2 border-gray-800 pb-0.5">
              ACTION REQUIRED
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceAllocation;
