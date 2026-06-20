"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Gem, Music } from 'lucide-react';
import { paymentAPI } from '../../../lib/api';

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
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    const res = await paymentAPI.getAllPayments();
    if (res.ok) {
      setPayments(res.data.data.filter((p: any) => p.paymentStatus === "Pending"));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsClient(true);
    fetchPayments();
  }, []);

  const handlePayment = async (id: string) => {
    const res = await paymentAPI.confirmPayment(id);
    if (res.ok) {
      // Re-fetch or update local state
      fetchPayments();
    } else {
      alert("Failed to process payment: " + res.data.message);
    }
  };

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
        {isLoading ? (
          <div className="px-5 py-8 text-center text-xs text-gray-500 italic">Loading receipts...</div>
        ) : isClient && payments.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-gray-500 italic">No receipts pending.</div>
        ) : isClient ? (
          payments.map((p, i) => {
            const icon = i % 3 === 0 ? <User size={18} className="text-[#B08D2C]" /> :
                         i % 3 === 1 ? <Gem size={18} className="text-[#4258af]" /> :
                                       <Music size={18} className="text-gray-500" />;
            const isDeposit = p.paymentType === "Deposit";
            const amountDue = p.amount;
            const amountLabel = isDeposit ? "30% DEPOSIT DUE" : "70% BALANCE DUE";
            const displayStatus = isDeposit ? "Pending Deposit" : "Pending Balance";
            const statusColor = isDeposit ? 'bg-[#F9DD76] text-[#7C6A2E]' : 'bg-blue-100 text-blue-700';

            return (
              <div key={p._id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-5 py-4 hover:bg-[#FDF9F1] transition-colors">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-[#F2EADA] flex items-center justify-center shrink-0">
                  {icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-serif font-semibold text-gray-800">{p.clientName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.bookingRef || p._id}</p>
                </div>

                {/* Amount */}
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C]">{amountLabel}</p>
                  <p className="text-base font-serif font-bold text-gray-800">LKR {amountDue.toLocaleString()}</p>
                </div>

                {/* Status */}
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shrink-0 ${statusColor}`}>
                  {displayStatus}
                </span>

                {/* Action */}
                <button
                  onClick={() => handlePayment(p._id)}
                  className={`text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded transition-all shrink-0 bg-[#7C6A2E] hover:bg-[#B08D2C] text-white`}
                >
                  Confirm Receipt
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
