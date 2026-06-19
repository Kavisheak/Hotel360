import React, { useState, useEffect } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, FileOutput } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const PremiumCardIcon = () => (
  <svg width="20" height="14" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-sm">
    <rect width="24" height="16" rx="3" fill="url(#goldGradient)" />
    <path d="M3 5H6V9H3V5Z" fill="#FFF3CD" fillOpacity="0.9" />
    <circle cx="15" cy="8" r="3" fill="#FFF" fillOpacity="0.4" />
    <circle cx="19" cy="8" r="3" fill="#FFF" fillOpacity="0.4" />
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D4C9A8" />
        <stop offset="0.5" stopColor="#B08D2C" />
        <stop offset="1" stopColor="#7C6A2E" />
      </linearGradient>
    </defs>
  </svg>
);

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'DEPOSIT PAID':
      return 'border-yellow-600 text-yellow-800 bg-yellow-50';
    case 'BALANCE PAID':
      return 'border-green-600 text-green-800 bg-green-50';
    case 'REFUND ISSUED':
      return 'border-red-600 text-red-800 bg-red-50';
    case 'PENDING':
      return 'border-gray-400 text-gray-600 bg-gray-50';
    default:
      return 'border-gray-200 text-gray-800';
  }
};

const FinancialsTable = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalRevenue = isClient ? globalBookings.reduce((acc, curr) => acc + curr.totalCost, 0) : 0;

  return (
    <div className="bg-white border border-[#E0D8C3] shadow-sm mb-8">
      {/* Filters & Pagination */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#E0D8C3]">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-40">
            <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Status</label>
            <select className="w-full border border-[#E0D8C3] text-xs py-2 px-3 text-gray-700 bg-transparent focus:outline-none">
              <option>All Statuses</option>
              <option>Deposit Paid</option>
              <option>Balance Paid</option>
              <option>Refund Issued</option>
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Method</label>
            <select className="w-full border border-[#E0D8C3] text-xs py-2 px-3 text-gray-700 bg-transparent focus:outline-none">
              <option>All Methods</option>
              <option>Card</option>
              <option>Transfer</option>
              <option>Cash</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Showing 1-10 of 142 entries</span>
          <div className="flex border border-[#E0D8C3] rounded-sm">
            <button className="p-1 border-r border-[#E0D8C3] hover:bg-[#FAF6EE]"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-[#FAF6EE]"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-[#A48F40] text-white text-[10px] uppercase tracking-widest">
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Transaction ID</th>
              <th className="px-6 py-4 font-bold">Client / Event</th>
              <th className="px-6 py-4 font-bold">Method</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Amount</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0D8C3]">
            {isClient && globalBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 italic">No financial transactions found.</td>
              </tr>
            ) : isClient ? (
              globalBookings.map((booking, idx) => {
                const displayStatus = booking.status === "Pending" ? "PENDING" : "BALANCE PAID";
                return (
                  <tr key={booking.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE]'}>
                    <td className="px-6 py-4 text-gray-500 text-xs">{booking.date}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-700">{booking.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 text-sm">{booking.clientName}</p>
                      <p className="text-[10px] text-gray-500">{booking.eventType}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-700 flex items-center gap-2 mt-2">
                      <PremiumCardIcon /> Card
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(displayStatus)}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      LKR {booking.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-[#7C6A2E]"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                );
              })
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-[#FDF9F1] p-6 border-t border-[#E0D8C3] flex flex-col sm:flex-row justify-end items-end gap-8 sm:gap-16">
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Subtotal (Page)</p>
          <p className="text-xl font-serif text-gray-800">LKR {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Adjustments/Refunds</p>
          <p className="text-xl font-serif text-red-600">(LKR 0.00)</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-1">Net Revenue</p>
          <p className="text-2xl font-serif font-bold text-[#7C6A2E]">LKR {totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTable;
