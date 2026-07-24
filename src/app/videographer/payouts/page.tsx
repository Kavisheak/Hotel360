import React from 'react';
import Sidebar from '@/components/videographer/shared/Sidebar';
import VendorPayoutDashboard from '@/components/vendor/VendorPayoutDashboard';

const VideographerPayoutsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0 flex flex-col min-h-screen bg-[#FDF9F1]">
        <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
          <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Payouts &amp; Financials</h2>
        </header>
        <main className="flex-1 px-4 lg:px-6 py-6">
          <VendorPayoutDashboard />
        </main>
      </div>
    </div>
  );
};

export default VideographerPayoutsPage;
