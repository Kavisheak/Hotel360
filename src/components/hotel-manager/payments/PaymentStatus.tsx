"use client";

import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../../../lib/api';

const PaymentStatus = () => {
  const [bars, setBars] = useState([
    { label: 'Fully Paid',       pct: 0, color: 'bg-green-500' },
    { label: 'Deposit Paid',     pct: 0, color: 'bg-[#B08D2C]' },
    { label: 'Unpaid / Overdue', pct: 0, color: 'bg-red-400' },
  ]);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await paymentAPI.getAllPayments();
      if (res.ok) {
        const payments = res.data.data;
        let fullyPaid = 0;
        let depositPaid = 0;
        let unpaid = 0;

        payments.forEach((p: any) => {
          if (p.paymentStatus === "Paid" && p.paymentType === "Balance") {
            fullyPaid += p.amount;
          } else if (p.paymentStatus === "Paid" && p.paymentType === "Deposit") {
            depositPaid += p.amount;
          } else if (p.paymentStatus === "Pending") {
            unpaid += p.amount;
          }
        });

        const total = fullyPaid + depositPaid + unpaid;
        if (total > 0) {
          setBars([
            { label: 'Fully Paid', pct: Math.round((fullyPaid / total) * 100), color: 'bg-green-500' },
            { label: 'Deposit Paid', pct: Math.round((depositPaid / total) * 100), color: 'bg-[#B08D2C]' },
            { label: 'Unpaid / Overdue', pct: Math.round((unpaid / total) * 100), color: 'bg-red-400' },
          ]);
        }
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
    <h3 className="text-sm font-serif font-semibold text-gray-800 mb-5">Payment Status</h3>

    <div className="space-y-4 mb-5">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{b.label}</span>
            <span className="text-[10px] font-bold text-gray-600">{b.pct}%</span>
          </div>
          <div className="w-full bg-[#F2EADA] rounded-full h-2">
            <div
              className={`${b.color} h-2 rounded-full transition-all duration-700`}
              style={{ width: `${b.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Quote */}
    <div className="border-l-4 border-[#B08D2C] pl-3">
      <p className="text-xs italic text-gray-500 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        "Maintaining a 90% collection rate is the benchmark for Elite status."
      </p>
    </div>
    </div>
  );
};

export default PaymentStatus;
