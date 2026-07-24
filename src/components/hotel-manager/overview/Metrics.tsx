"use client";

import React, { useEffect, useState } from 'react';
import {
  CalendarDays, Clock, CheckCircle2, Wallet, Users, AlertTriangle,
  RotateCcw, TrendingUp, Percent
} from 'lucide-react';
import { bookingAPI } from '@/lib/api';

const Metrics = () => {
  const [isClient, setIsClient] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [revenueTimeframe, setRevenueTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    setIsClient(true);
    const fetchBookings = async () => {
      const res = await bookingAPI.getAllBookings();
      if (res.ok && res.data?.data) {
        setBookings(res.data.data);
      }
    };
    fetchBookings();
  }, []);

  const totalBookings = bookings.length;
  const pendingApprovals = bookings.filter((b: any) => b.status === "Pending" || b.status === "PENDING").length;
  const pendingVendorApprovals = 3; // Mock active registrations
  const expiringHolds = 2; // Holds expiring < 4 hours
  const unresolvedRefunds = 1; // Pending refund request
  const confirmedEvents = bookings.filter((b: any) => ["Confirmed", "DepositPaid", "BalancePaid"].includes(b.status)).length;

  const totalContractVal = bookings
    .filter((b: any) => !["Cancelled", "Rejected"].includes(b.status))
    .reduce((sum: number, b: any) => sum + (b.totalCost || 250000), 0);

  const getRevenueByTimeframe = () => {
    if (revenueTimeframe === 'daily') return totalContractVal * 0.05;
    if (revenueTimeframe === 'weekly') return totalContractVal * 0.25;
    return totalContractVal;
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `LKR ${(val / 1000000).toFixed(2)}M`;
    if (val >= 100000) return `LKR ${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `LKR ${(val / 1000).toFixed(0)}K`;
    return `LKR ${val.toLocaleString()}`;
  };

  const occupancyRate = 78; // Occupancy rate %

  const metrics = [
    {
      icon: <Clock size={22} className="text-[#1E56A0]" />,
      label: 'Pending Hall Confirmations',
      value: isClient ? pendingApprovals.toString() : '...',
      subText: 'Requires manager approval',
      badgeColor: 'bg-blue-50 text-[#1E56A0]'
    },
    {
      icon: <Users size={22} className="text-purple-600" />,
      label: 'Pending Vendor Approvals',
      value: isClient ? pendingVendorApprovals.toString() : '...',
      subText: 'New vendor applications',
      badgeColor: 'bg-purple-50 text-purple-700'
    },
    {
      icon: <AlertTriangle size={22} className="text-amber-600" />,
      label: 'Expiring Booking Holds',
      value: isClient ? expiringHolds.toString() : '...',
      subText: 'Expiring within 4 hrs',
      badgeColor: 'bg-amber-50 text-amber-700'
    },
    {
      icon: <RotateCcw size={22} className="text-rose-600" />,
      label: 'Unresolved Refunds',
      value: isClient ? unresolvedRefunds.toString() : '...',
      subText: 'Action required',
      badgeColor: 'bg-rose-50 text-rose-700'
    },
    {
      icon: <Percent size={22} className="text-emerald-600" />,
      label: 'Hall Occupancy Rate',
      value: isClient ? `${occupancyRate}%` : '...',
      subText: 'Peak weekend capacity',
      badgeColor: 'bg-emerald-50 text-emerald-700'
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Revenue Card with Timeframe Toggle */}
      <div className="bg-gradient-to-r from-[#1E56A0] to-[#15417E] text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">Revenue Summary</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-bold font-serif">{formatCurrency(getRevenueByTimeframe())}</h3>
            <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
              <TrendingUp size={14} /> +14.2% vs last period
            </span>
          </div>
          <p className="text-xs text-blue-100/80 mt-1">Total revenue collected & contract value across confirmed events.</p>
        </div>

        <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/20 text-xs font-semibold self-start md:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setRevenueTimeframe(tf)}
              className={`px-3 py-1.5 rounded-md uppercase tracking-wider transition ${
                revenueTimeframe === tf ? 'bg-white text-[#1E56A0] font-bold shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white border border-gray-200/80 rounded-xl p-4 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${m.badgeColor}`}>{m.icon}</div>
              <span className="text-2xl font-bold font-serif text-gray-900">{m.value}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 line-clamp-1">{m.label}</p>
              <p className="text-[10px] text-gray-500 font-medium mt-0.5">{m.subText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
