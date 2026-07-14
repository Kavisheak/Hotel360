"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar, User, Gem, Music } from 'lucide-react';
import { bookingAPI } from '../../../lib/api';

const CashReceipts = () => {
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    const res = await bookingAPI.getAllBookings();
    if (res.ok) {
      // Filter bookings that owe a balance (DepositPaid or Confirmed)
      const balancesDue = res.data.data.filter(
        (b: any) => b.status === "DepositPaid" || b.status === "Confirmed"
      );
      // Sort by event date (closest first)
      balancesDue.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setUpcoming(balancesDue);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsClient(true);
    fetchBookings();
  }, []);

  return (
    <div className="bg-white border border-[#E0D8C3] rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
        <h3 className="text-sm font-serif font-semibold text-gray-800">Upcoming Balances Due</h3>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer hover:text-[#7C6A2E] transition-colors">
          <span>Sort: Closest Date</span>
          <ChevronDown size={12} />
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#F2EADA]">
        {isLoading ? (
          <div className="px-5 py-8 text-center text-xs text-gray-500 italic">Loading upcoming balances...</div>
        ) : isClient && upcoming.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-gray-500 italic">No outstanding balances at this time.</div>
        ) : isClient ? (
          upcoming.slice(0, 5).map((b, i) => { // show top 5
            const icon = i % 3 === 0 ? <User size={18} className="text-[#B08D2C]" /> :
                         i % 3 === 1 ? <Gem size={18} className="text-[#4258af]" /> :
                                       <Music size={18} className="text-gray-500" />;
            
            const total = b.totalCost || 0;
            const deposit = b.depositAmount || (total * 0.3);
            const balanceDue = total - deposit;

            return (
              <div key={b._id || b.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 hover:bg-[#FDF9F1] transition-colors">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-[#F2EADA] flex items-center justify-center shrink-0">
                  {icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-serif font-semibold text-gray-800">{b.clientName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{b.bookingRef || b._id}</p>
                </div>

                {/* Event Date */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600 font-medium">{new Date(b.date).toLocaleDateString()}</span>
                </div>

                {/* Amount */}
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C]">70% BALANCE DUE</p>
                  <p className="text-base font-serif font-bold text-gray-800">LKR {balanceDue.toLocaleString()}</p>
                </div>

                {/* Action */}
                <a
                  href={`/hotel-manager/bookings/${b.bookingRef || b._id}`}
                  className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded transition-all shrink-0 bg-[#7C6A2E] hover:bg-[#B08D2C] text-white text-center ml-2`}
                >
                  View Job
                </a>
              </div>
            );
          })
        ) : null}
      </div>
    </div>
  );
};

export default CashReceipts;
