"use client";

import React, { useEffect, useState } from 'react';
import { Banknote, Receipt, Star, PieChart } from 'lucide-react';
import { bookingAPI } from '../../../lib/api';

const ReportMetrics = () => {
  const [metrics, setMetrics] = useState([
    {
      title: 'Total Revenue',
      icon: <Banknote size={16} className="text-[#B08D2C]" />,
      value: 'LKR 0',
      trend: '+12.4% vs last year',
      trendColor: 'text-green-600',
    },
    {
      title: 'Avg Booking Value',
      icon: <Receipt size={16} className="text-gray-500" />,
      value: 'LKR 0',
      trend: 'Stable performance',
      trendColor: 'text-gray-500',
    },
    {
      title: 'Customer NPS',
      icon: <Star size={16} className="text-[#B08D2C]" />,
      value: '8.9/10',
      trend: 'Top 5% Industry',
      trendColor: 'text-green-600',
    },
    {
      title: 'Hall Utilization',
      icon: <PieChart size={16} className="text-[#7C6A2E]" />,
      value: '78.4%',
      trend: 'Peak season active',
      trendColor: 'text-gray-800',
    },
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await bookingAPI.getAllBookings();
      if (res.ok) {
        const bookings = res.data.data;
        let totalRevenue = 0;
        let validBookingsCount = 0;

        bookings.forEach((b: any) => {
          if (b.status !== "Cancelled" && b.status !== "Rejected") {
            totalRevenue += b.totalCost || 0;
            validBookingsCount++;
          }
        });

        const avgBooking = validBookingsCount > 0 ? Math.round(totalRevenue / validBookingsCount) : 0;

        setMetrics((prev) => [
          {
            ...prev[0],
            value: `LKR ${totalRevenue.toLocaleString()}`,
          },
          {
            ...prev[1],
            value: `LKR ${avgBooking.toLocaleString()}`,
          },
          ...prev.slice(2),
        ]);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((m) => (
        <div key={m.title} className="bg-white border border-[#E0D8C3] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{m.title}</h3>
            {m.icon}
          </div>
          <p className="text-2xl lg:text-3xl font-serif font-semibold text-gray-800 mb-1">{m.value}</p>
          <p className={`text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 ${m.trendColor}`}>
            {m.trend.includes('+') && <span className="text-[10px]">↗</span>}
            {m.trend}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReportMetrics;
