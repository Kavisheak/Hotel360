"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Gem, Music } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const receipts = [
  {
    icon: <User size={18} className="text-[#B08D2C]" />,
    name: 'Julianne & Mark Wedding',
    booking: 'BOOKING #SE-2024-081',
    amountLabel: 'DEPOSIT DUE',
    amount: '$1,500.00',
    status: 'Pending Cash',
    statusColor: 'bg-[#F9DD76] text-[#7C6A2E]',
  },
  {
    icon: <Gem size={18} className="text-[#4258af]" />,
    name: 'Elite Corporate Gala',
    booking: 'BOOKING #SE-2024-079',
    amountLabel: 'FINAL BALANCE',
    amount: '$6,740.00',
    status: 'Partially Paid',
    statusColor: 'bg-blue-100 text-blue-700',
  },
  {
    icon: <Music size={18} className="text-gray-500" />,
    name: 'Smith Family Reunion',
    booking: 'BOOKING #SE-2024-085',
    amountLabel: 'BOOKING DEPOSIT',
    amount: '$500.00',
    status: 'Unpaid',
    statusColor: 'bg-red-50 text-red-500 border border-red-200',
  },
];

const CashReceipts = () => {
  const [confirmed, setConfirmed] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white border border-[#E0D8C3] rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
        <h3 className="text-sm font-serif font-semibold text-gray-800">Cash Receipt Requests</h3>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 cursor-pointer hover:text-[#7C6A2E] transition-colors">
          <span>Filter: All Pending</span>
          <ChevronDown size={12} />
        </div>
      </div>

      {/* Receipt rows */}
      <div className="divide-y divide-[#F2EADA]">
        {isClient && globalBookings.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-gray-500 italic">No receipts pending.</div>
        ) : isClient ? (
          globalBookings.map((r, i) => {
            const icon = i % 3 === 0 ? <User size={18} className="text-[#B08D2C]" /> :
                         i % 3 === 1 ? <Gem size={18} className="text-[#4258af]" /> :
                                       <Music size={18} className="text-gray-500" />;
            const displayStatus = r.status === "Pending" ? "Pending Cash" : "Fully Paid";
            const statusColor = r.status === "Pending" ? 'bg-[#F9DD76] text-[#7C6A2E]' : 'bg-green-100 text-green-700';

            return (
              <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 hover:bg-[#FDF9F1] transition-colors">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-[#F2EADA] flex items-center justify-center shrink-0">
                  {icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-serif font-semibold text-gray-800">{r.clientName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{r.id}</p>
                </div>

                {/* Amount */}
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">TOTAL DUE</p>
                  <p className="text-base font-serif font-bold text-gray-800">LKR {r.totalCost.toLocaleString()}</p>
                </div>

                {/* Status */}
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shrink-0 ${statusColor}`}>
                  {displayStatus}
                </span>

                {/* Action */}
                <button
                  onClick={() => setConfirmed(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])}
                  className={`text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded transition-all shrink-0 ${
                    confirmed.includes(i)
                      ? 'bg-green-600 text-white'
                      : 'bg-[#7C6A2E] hover:bg-[#B08D2C] text-white'
                  }`}
                >
                  {confirmed.includes(i) ? '✓ Confirmed' : 'Confirm Receipt'}
                </button>
              </div>
            );
          })
        ) : null}
      </div>
    </div>
  );
};

export default CashReceipts;
