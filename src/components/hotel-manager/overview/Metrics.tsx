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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
