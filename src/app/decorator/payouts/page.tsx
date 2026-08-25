"use client";

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import { vendorPaymentAPI } from '@/lib/api';
import { Loader2, DollarSign, RefreshCw, Receipt } from 'lucide-react';

export default function DecoratorPayoutsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayoutData = async () => {
    try {
      setIsLoading(true);
      const res = await vendorPaymentAPI.getExpectedPayouts();
      if (res.ok && res.data?.data) {
        setData(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load vendor payouts:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0 flex flex-col min-h-screen bg-[#FDF9F1]">
        <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
          <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Income &amp; Payouts</h2>
        </header>
        
        <main className="flex-1 px-4 lg:px-6 py-6 flex flex-col h-full">
          {isLoading ? (
            <div className="flex flex-1 justify-center items-center py-12 bg-white rounded-xl border border-[#E0D8C3] h-full">
              <Loader2 className="w-8 h-8 animate-spin text-[#B08D2C]" />
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Total Income Metric */}
              <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#7C6A2E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[12px] uppercase font-bold tracking-wider text-gray-500">Total Income (Completed Payouts)</span>
                  <DollarSign className="w-6 h-6 text-[#B08D2C]" />
                </div>
                <p className="text-4xl font-bold font-serif text-[#7C6A2E] mt-2">{formatCurrency(data?.totalPayoutsReleased)}</p>
                <p className="text-[11px] text-gray-400 mt-2 font-medium">All completed event payouts transferred to your bank account</p>
              </div>

              {/* Income History Table (Full Page) */}
              <div className="bg-white border border-[#E0D8C3] rounded-xl p-6 shadow-sm flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-serif text-xl text-gray-900">Event Income History</h3>
                    <p className="text-sm text-gray-500 font-light mt-1">Detailed log of all your income from completed events.</p>
                  </div>
                  <button onClick={fetchPayoutData} className="p-2 hover:bg-gray-50 rounded text-gray-400 hover:text-gray-600 transition-colors flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Refresh</span>
                  </button>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-[#E0D8C3] text-gray-400 font-bold uppercase tracking-wider text-xs">
                        <th className="py-3 px-2">Payout Date</th>
                        <th className="py-3 px-2">Booking Ref</th>
                        <th className="py-3 px-2">Event Name</th>
                        <th className="py-3 px-2">Gross Amount</th>
                        <th className="py-3 px-2">Commission (10%)</th>
                        <th className="py-3 px-2">Net Income</th>
                        <th className="py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data?.payoutHistory?.map((payout: any) => {
                        const commission = payout.grossAmount - payout.netPayout;
                        return (
                          <tr key={payout._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-2 text-gray-500">{new Date(payout.payoutDate || payout.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td className="py-4 px-2 font-bold text-gray-800">{payout.bookingId?.bookingRef || "N/A"}</td>
                            <td className="py-4 px-2 capitalize font-medium text-gray-600">{payout.bookingId?.eventType || "Event"}</td>
                            <td className="py-4 px-2 font-medium text-gray-500">{formatCurrency(payout.grossAmount)}</td>
                            <td className="py-4 px-2 font-medium text-red-500">-{formatCurrency(commission)}</td>
                            <td className="py-4 px-2 font-bold text-emerald-600 text-base">{formatCurrency(payout.netPayout)}</td>
                            <td className="py-4 px-2">
                              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                                {payout.payoutStatus || 'Completed'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {(!data?.payoutHistory || data.payoutHistory.length === 0) && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <Receipt className="w-12 h-12 text-gray-200" />
                              <p className="text-gray-400 italic">No income from events yet.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
