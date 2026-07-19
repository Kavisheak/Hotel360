"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/super-admin/dashboard/Sidebar';
import { superAdminAPI } from '@/lib/api';
import FinancialsHeader from './FinancialsHeader';
import FinancialsStats from './FinancialsStats';
import FinancialsTable from './FinancialsTable';
import FinancialsQueues from './FinancialsQueues';

const FinancialsMain = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await superAdminAPI.getFinancials();
      if (res.ok) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch financials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveRefund = async (id: string) => {
    if (confirm("Are you sure you want to approve this refund? This action cannot be undone.")) {
      try {
        const res = await superAdminAPI.approveRefund(id);
        if (res.ok) {
          fetchData(); // Refresh all data to update tables and queues
        } else {
          alert("Failed to approve refund");
        }
      } catch (err) {
        alert("An error occurred");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FDF9F1] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D2C]"></div>
      </div>
    );
  }

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

          <FinancialsStats 
            totalRevenueYTD={data?.totalRevenueYTD} 
            monthlyTargetProgress={data?.monthlyTargetProgress} 
            outstandingBalances={data?.outstandingBalances} 
            outstandingContracts={data?.outstandingContracts} 
          />
          <FinancialsTable transactions={data?.transactionsData || []} />
          <FinancialsQueues 
            refundQueue={data?.refundQueueData || []} 
            revenueCategory={data?.revenueCategoryData || []} 
            onApproveRefund={handleApproveRefund}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialsMain;
