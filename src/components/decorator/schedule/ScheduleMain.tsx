import React from 'react';
import ScheduleHeader from './ScheduleHeader';
import CalendarView from './CalendarView';
import EventTimeline from './EventTimeline';
import ResourceAllocation from './ResourceAllocation';
import Footer from '../my_jobs/Footer';

const ScheduleMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <ScheduleHeader />

        {/* Calendar + Timeline: stack on mobile, side by side on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mt-6">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          <div className="lg:col-span-1">
            <EventTimeline />
          </div>
        </div>

        <ResourceAllocation />
      </div>
      <Footer />
    </div>
  );
};

export default ScheduleMain;
