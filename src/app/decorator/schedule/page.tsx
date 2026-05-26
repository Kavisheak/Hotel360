import React from 'react';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import ScheduleMain from '@/components/decorator/schedule/ScheduleMain';

const DecoratorSchedule = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      {/* On mobile, add top padding so content doesn't overlap the hamburger button */}
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
        <ScheduleMain />
      </div>
    </div>
  );
};

export default DecoratorSchedule;
