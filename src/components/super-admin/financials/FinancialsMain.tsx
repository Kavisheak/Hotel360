"use client";

import React from 'react';
import Sidebar from '@/components/super-admin/dashboard/Sidebar';
import FinancialsHeader from './FinancialsHeader';
import FinancialsStats from './FinancialsStats';
import FinancialsTable from './FinancialsTable';
import FinancialsQueues from './FinancialsQueues';

const FinancialsMain = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col pt-14 lg:pt-0">
        <FinancialsHeader />

        <div className="flex-1 px-4 sm:px-8 lg:px-10 py-8 max-w-[1400px] mx-auto w-full">
          {/* Title Area */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">
                Financial Overview
              </h1>
              <p className="text-sm italic text-[#A48F40] font-serif">
                Precision in every transaction, excellence in every detail.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase px-6 py-2.5 hover:bg-[#FAF6EE] transition-colors">
                Export CSV
              </button>
              <button className="bg-[#A48F40] hover:bg-[#8D7B37] text-white font-bold text-[10px] tracking-widest uppercase px-6 py-2.5 transition-colors shadow-sm">
                Generate Report
              </button>
            </div>
          </div>

          <FinancialsStats />
          <FinancialsTable />
          <FinancialsQueues />
        </div>
      </div>
    </div>
  );
};

export default FinancialsMain;
