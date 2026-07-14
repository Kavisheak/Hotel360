"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { paymentAPI } from '../../../lib/api';

const TransactionLedger = () => {
  const [isClient, setIsClient] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const fetchPayments = async () => {
      const res = await paymentAPI.getAllPayments();
      if (res.ok) {
        setPayments(res.data.data);
      }
      setIsLoading(false);
    };
    fetchPayments();
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
          {isLoading ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-500 italic">Loading ledger data...</td>
            </tr>
          ) : isClient && payments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-500 italic">No transactions found.</td>
            </tr>
          ) : isClient ? (
            payments.map((p, i) => {
              const displayStatus = p.paymentStatus === "Paid" ? (p.paymentType === "Deposit" ? "Deposit Paid" : "Fully Paid") : "Pending";
              const statusColor = p.paymentStatus === "Paid" ? "text-green-600 font-bold" : "text-gray-500 font-semibold";

              return (
                <tr key={p._id} className={`border-b border-[#F2EADA] hover:bg-[#FDF9F1] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF5]'}`}>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-700 font-semibold">{p.bookingRef || p._id.substring(0, 8)}</td>
                  <td className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">{p.eventType}</td>
                  <td className="px-4 py-3 text-sm font-serif font-bold text-[#B08D2C]">LKR {p.amount?.toLocaleString()}</td>
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
      <Link href="/hotel-manager/reports" className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] hover:underline transition-all inline-block">
        View Full Ledger
      </Link>
    </div>
  </div>
  );
};

export default TransactionLedger;
