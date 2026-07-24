'use client';

import React, { useState } from 'react';
import ReportsHeader from './ReportsHeader';
import ReportMetrics from './ReportMetrics';
import RevenueTrends from './RevenueTrends';
import EventDistribution from './EventDistribution';
import TopPackages from './TopPackages';
import ProviderPerformance from './ProviderPerformance';
import ManagerFooter from '../overview/Footer';
import { Download, FileSpreadsheet, BarChart3 } from 'lucide-react';

const ReportsMain = () => {
  const [reportType, setReportType] = useState<'all' | 'revenue' | 'halls' | 'vendors'>('all');

  const handleExport = (format: string) => {
    alert(`Exporting ${reportType.toUpperCase()} analytics report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      {/* Page header bar */}
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center justify-between px-4 lg:px-6 h-16 pl-14 lg:pl-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-[#1E56A0]" />
          <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Manager Analytical Reports</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-xs font-semibold shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E56A0] hover:bg-[#15417E] text-white rounded text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF Report
          </button>
        </div>
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
};

export default ReportsMain;
