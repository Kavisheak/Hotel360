"use client";

import React, { useEffect, useState } from 'react';
import Header from './Header';
import OverviewCards from './OverviewCards';
import TopProviders from './TopProviders';
import PackageSplit from './PackageSplit';
import CashPayments from './CashPayments';
import SystemStatus from './SystemStatus';
import Footer from './Footer';
import { superAdminAPI } from '@/lib/api';

const MainContent = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await superAdminAPI.getOverview();
        if (res.ok && res.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch overview", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D2C]"></div>
          </div>
        ) : data ? (
          <>
            {/* Row 1: Revenue + Booking Chart */}
            <OverviewCards 
              totalRevenue={data.totalRevenue} 
              thisMonthRevenue={data.thisMonthRevenue}
              revenueGrowth={data.revenueGrowth} 
              bookingTraffic={data.bookingTraffic} 
              bookingTrafficMonthly={data.bookingTrafficMonthly} 
            />

            {/* Row 2: Top Providers + Package Split + Cash Payments */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <TopProviders providers={data.topProviders} />
              <PackageSplit packages={data.packageSplit} />
              <CashPayments payments={data.pendingCashPayments} />
            </div>

            {/* Row 3: System Status Bar */}
            <SystemStatus status={data.systemStatus} />
          </>
        ) : (
          <div className="text-center text-gray-500 mt-10">Failed to load overview data.</div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MainContent;

