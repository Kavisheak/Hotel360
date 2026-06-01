import React from 'react';
import ReportsHeader from './ReportsHeader';
import ReportMetrics from './ReportMetrics';
import RevenueTrends from './RevenueTrends';
import EventDistribution from './EventDistribution';
import TopPackages from './TopPackages';
import ProviderPerformance from './ProviderPerformance';
import ManagerFooter from '../overview/Footer';

const ReportsMain = () => (
  <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
    {/* Page header bar */}
    <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
      <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Reports</h2>
    </header>

    <main className="flex-1 px-4 lg:px-6 py-6 lg:py-8 w-full">
      <ReportsHeader />
      <ReportMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueTrends />
        </div>
        <div className="lg:col-span-1">
          <EventDistribution />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPackages />
        <ProviderPerformance />
      </div>
    </main>

    <ManagerFooter />
  </div>
);

export default ReportsMain;
