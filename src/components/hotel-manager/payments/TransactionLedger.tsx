"use client";

import React, { useState, useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';

const TransactionLedger = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm">
    <h3 className="text-sm font-serif font-semibold text-gray-800 px-5 py-4 border-b border-[#E0D8C3] bg-[#FDF9F1]">
      Transaction Ledger
    </h3>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left border-collapse">
        <thead className="bg-[#7C6A2E] text-white">
          <tr>
            {['Date', 'Reference', 'Category', 'Amount', 'Status'].map(h => (
              <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isClient && globalBookings.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-500 italic">No transactions found.</td>
            </tr>
          ) : isClient ? (
            globalBookings.map((b, i) => {
              const displayStatus = b.status === "Pending" ? "Pending" : "Fully Paid";
              const statusColor = b.status === "Pending" ? "text-gray-500 font-semibold" : "text-green-600 font-bold";
              return (
                <tr key={b.id} className={`border-b border-[#F2EADA] hover:bg-[#FDF9F1] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF5]'}`}>
                  <td className="px-4 py-3 text-xs text-gray-600">{b.date}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-700 font-semibold">{b.id}</td>
                  <td className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">{b.eventType}</td>
                  <td className="px-4 py-3 text-sm font-serif font-bold text-[#B08D2C]">LKR {b.totalCost.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest ${statusColor}`}>
                      {displayStatus}
                    </span>
                  </td>
                </tr>
              );
            })
          ) : null}
        </tbody>
      </table>
    </div>

    {/* View full ledger */}
    <div className="px-5 py-3 text-center border-t border-[#F2EADA]">
      <button className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] hover:underline transition-all">
        View Full Ledger
      </button>
    </div>
  </div>
  );
};

export default TransactionLedger;
