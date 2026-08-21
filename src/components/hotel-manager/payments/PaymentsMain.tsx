"use client";

import React from 'react';
import PayoutDashboard from './PayoutDashboard';
import ManagerFooter from '../overview/Footer';

const PaymentsMain = () => {
  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1] dark:bg-[#0A0A0A]">
      {/* Page header bar */}
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#E0D8C3] dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 lg:px-6 py-3 sm:h-16 pl-14 lg:pl-6 gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-serif italic text-[#7C6A2E] dark:text-[#C9A84C] text-xl font-semibold tracking-wide">
            Payout Dashboard
          </h2>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-6 py-6 max-w-7xl mx-auto w-full">
        <PayoutDashboard />
      </main>

      <ManagerFooter />
    </div>
  );
};

export default PaymentsMain;
