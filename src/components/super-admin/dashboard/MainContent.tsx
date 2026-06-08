import React from 'react';
import Header from './Header';
import OverviewCards from './OverviewCards';
import TopProviders from './TopProviders';
import PackageSplit from './PackageSplit';
import CashPayments from './CashPayments';
import SystemStatus from './SystemStatus';
import Footer from './Footer';

const MainContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <Header />

      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Page Heading */}
        <div className="mb-2">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#3D3000] tracking-tight">
            Global Overview
          </h1>
          <p className="text-sm font-serif italic text-gray-500 mt-1">
            Meticulous analysis of your luxury ecosystem performance.
          </p>
        </div>

        {/* Row 1: Revenue + Booking Chart */}
        <OverviewCards />

        {/* Row 2: Top Providers + Package Split + Cash Payments */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <TopProviders />
          <PackageSplit />
          <CashPayments />
        </div>

        {/* Row 3: System Status Bar */}
        <SystemStatus />
      </div>

      <Footer />
    </div>
  );
};

export default MainContent;
