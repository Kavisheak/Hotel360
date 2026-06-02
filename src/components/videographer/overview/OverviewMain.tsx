import React from 'react';
import Footer from '../shared/Footer';
import OverviewHeader from './OverviewHeader';
import OverviewStats from './OverviewStats';
import QuickSummary from './QuickSummary';
import UpcomingEvents from './UpcomingEvents';
import MonthlyPerformance from './MonthlyPerformance';
import RecentActivity from './RecentActivity';
import EquipmentChecklist from './EquipmentChecklist';

const OverviewMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <OverviewHeader />
        <OverviewStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Quick Summary</h3>
              <QuickSummary />
            </div>

            <div>
              <h3 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Upcoming Events</h3>
              <UpcomingEvents />
            </div>

            <MonthlyPerformance />
          </div>

          <div className="space-y-8">
            <EquipmentChecklist />
            <RecentActivity />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OverviewMain;
