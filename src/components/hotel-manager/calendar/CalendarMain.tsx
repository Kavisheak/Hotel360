import React from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarLegend from './CalendarLegend';
import UpcomingWeek from './UpcomingWeek';
import ManagerFooter from '../overview/Footer';

const CalendarMain = () => (
  <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
    {/* Page header bar */}
    <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
      <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Calendar</h2>
    </header>

    <main className="flex-1 px-4 lg:px-6 py-6">
      <CalendarHeader />

      {/* Two-column: calendar (left 2/3) + upcoming week (right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar section */}
        <div className="lg:col-span-2">
          <CalendarGrid />
          <CalendarLegend />
        </div>

        {/* Upcoming week panel */}
        <div className="lg:col-span-1">
          <UpcomingWeek />
        </div>
      </div>
    </main>

    <ManagerFooter />
  </div>
);

export default CalendarMain;
