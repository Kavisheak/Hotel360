"use client";

import React, { useEffect, useState } from 'react';
import {
  CalendarDays, Clock, CheckCircle2, Wallet, Users, AlertTriangle,
  RotateCcw, TrendingUp, Percent, Star
} from 'lucide-react';
import { hotelManagerAPI } from '@/lib/api';

const Metrics = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metricsData, setMetricsData] = useState({
    pendingBookings: 0,
    totalBookings: 0,
    totalMonthlyIncome: 0,
    averageRating: 0,
  });

  useEffect(() => {
    setIsClient(true);
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await hotelManagerAPI.getOverview();
        if (res.ok && res.data?.data) {
          setMetricsData({
            pendingBookings: res.data.data.pendingBookings || 0,
            totalBookings: res.data.data.totalBookings || 0,
            totalMonthlyIncome: res.data.data.totalMonthlyIncome || 0,
            averageRating: res.data.data.averageRating || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch manager metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `LKR ${(val / 1000000).toFixed(2)}M`;
    if (val >= 100000) return `LKR ${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `LKR ${(val / 1000).toFixed(0)}K`;
    return `LKR ${val.toLocaleString()}`;
  };

  const metrics = [
    {
      icon: <Clock size={22} className="text-[#1E56A0]" />,
      label: 'Pending Bookings',
      value: isClient && !loading ? metricsData.pendingBookings.toString() : '...',
      subText: 'Awaiting action/confirmation',
      badgeColor: 'bg-blue-50 text-[#1E56A0]'
    },
    {
      icon: <CheckCircle2 size={22} className="text-emerald-600" />,
      label: 'Total Bookings',
      value: isClient && !loading ? metricsData.totalBookings.toString() : '...',
      subText: 'All valid platform bookings',
      badgeColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      icon: <Wallet size={22} className="text-amber-600" />,
      label: 'Total Monthly Income',
      value: isClient && !loading ? formatCurrency(metricsData.totalMonthlyIncome) : '...',
      subText: 'Hall & vendor payments received this month',
      badgeColor: 'bg-amber-50 text-amber-700'
    },
    {
      icon: <Star size={22} className="text-purple-600" />,
      label: 'Average Rating',
      value: isClient && !loading ? `${metricsData.averageRating} / 5` : '...',
      subText: 'Overall platform rating',
      badgeColor: 'bg-purple-50 text-purple-700'
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="group relative bg-white border border-[#E0D8C3]/60 rounded-2xl p-6 flex flex-col justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E0D8C3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${m.badgeColor.replace('bg-', 'bg-').replace('text-', 'text-')}`}>{m.icon}</div>
              <span className="text-3xl font-serif font-semibold text-gray-900 tracking-tight group-hover:text-[#7C6A2E] transition-colors">{m.value}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 tracking-wide">{m.label}</p>
              <p className="text-xs text-gray-400 font-light mt-1">{m.subText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Metrics;
