"use client";

import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock, TrendingUp } from 'lucide-react';
import { paymentAPI, bookingAPI } from '../../../lib/api';

const PaymentMetrics = () => {
  const [metrics, setMetrics] = useState({
    monthlyRevenue: 0,
    outstandingBalance: 0,
    forecast: 0,
    growthStr: "+0% vs last month",
    isPositive: true,
    pctTarget: 0,
  });

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return `${val}`;
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      const [paymentsRes, bookingsRes] = await Promise.all([
        paymentAPI.getAllPayments(),
        bookingAPI.getAllBookings()
      ]);

      if (paymentsRes.ok) {
        const payments = paymentsRes.data.data;
        let revenue = 0;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let currentMonthRevenue = 0;
        let lastMonthRevenue = 0;

        payments.forEach((p: any) => {
          if (p.paymentStatus === "Paid") {
            revenue += p.amount;
            
            const paymentDate = new Date(p.createdAt || p.updatedAt || new Date());
            const month = paymentDate.getMonth();
            const year = paymentDate.getFullYear();
            
            if (month === currentMonth && year === currentYear) {
              currentMonthRevenue += p.amount;
            } else if ((currentMonth === 0 && month === 11 && year === currentYear - 1) || 
                       (month === currentMonth - 1 && year === currentYear)) {
              lastMonthRevenue += p.amount;
            }
          }
        });

        let bookedContractValue = 0;
        if (bookingsRes.ok) {
          const bookings = bookingsRes.data.data;
          bookings.forEach((b: any) => {
            if (b.status !== "Cancelled" && b.status !== "Rejected") {
              bookedContractValue += b.totalCost || 0;
            }
          });
        }

        const outstandingBalance = Math.max(0, bookedContractValue - revenue);

        // Calculate growth
        let growthStr = "+0% vs last month";
        let isPositive = true;
        if (lastMonthRevenue > 0) {
          const diff = currentMonthRevenue - lastMonthRevenue;
          const pct = Math.round((diff / lastMonthRevenue) * 100);
          isPositive = pct >= 0;
          growthStr = `${pct > 0 ? '+' : ''}${pct}% vs last month`;
        } else if (currentMonthRevenue > 0) {
          growthStr = "+100% vs last month";
        }

        const pctTarget = bookedContractValue > 0 ? Math.min(100, Math.round((revenue / bookedContractValue) * 100)) : 0;

        setMetrics({
          monthlyRevenue: revenue,
          outstandingBalance: outstandingBalance,
          forecast: bookedContractValue,
          growthStr,
          isPositive,
          pctTarget,
        });
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    {/* Cash Collected */}
    <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={18} className="text-[#B08D2C]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cash Collected</p>
      </div>
      <p className="text-2xl font-serif font-semibold text-gray-800">{formatCurrency(metrics.monthlyRevenue)}</p>
      <p className={`text-[10px] font-semibold mt-1.5 tracking-wide ${metrics.isPositive ? 'text-green-600' : 'text-red-500'}`}>
        {metrics.growthStr}
      </p>
    </div>

    {/* Outstanding Balance */}
    <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={18} className="text-[#4258af]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Outstanding Balance</p>
      </div>
      <p className="text-2xl font-serif font-semibold text-gray-800">{formatCurrency(metrics.outstandingBalance)}</p>
      <p className="text-[10px] font-semibold text-gray-400 mt-1.5 tracking-widest uppercase">Waiting for payment</p>
    </div>

    {/* Total Contract Value — dark gold card */}
    <div className="relative bg-[#7C6A2E] rounded-xl p-5 shadow-sm overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={18} className="text-[#F9DD76]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F9DD76]">Total Contract Value</p>
      </div>
      <p className="text-2xl font-serif font-bold text-white relative z-10">{formatCurrency(metrics.forecast)}</p>
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-white/20 rounded-full h-1.5">
          <div className="bg-[#F9DD76] h-1.5 rounded-full transition-all duration-700" style={{ width: `${metrics.pctTarget}%` }} />
        </div>
        <p className="text-[10px] text-[#F9DD76]/80 mt-1.5 text-right tracking-widest">{metrics.pctTarget}% Collected</p>
      </div>
    </div>
  </div>
  );
};

export default PaymentMetrics;
