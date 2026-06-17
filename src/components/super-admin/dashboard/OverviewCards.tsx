"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const weeklyData = [
  { day: 'Mon', bookings: 14 },
  { day: 'Tue', bookings: 19 },
  { day: 'Wed', bookings: 17 },
  { day: 'Thu', bookings: 28 },
  { day: 'Fri', bookings: 22 },
  { day: 'Sat', bookings: 11 },
  { day: 'Sun', bookings: 16 },
];

const monthlyData = [
  { day: 'W1', bookings: 62 },
  { day: 'W2', bookings: 88 },
  { day: 'W3', bookings: 74 },
  { day: 'W4', bookings: 95 },
];

const RevenueCard = () => {
  const [isClient, setIsClient] = useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalRevenue = isClient ? globalBookings.reduce((acc, curr) => acc + curr.totalCost, 0) : 0;

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
          Total Revenue (All Time)
        </p>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#3D3000] mb-4">
          LKR {totalRevenue.toLocaleString()}
        </h2>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp size={16} />
          <span className="text-sm font-bold">+12.4% vs last month</span>
        </div>
      </div>
      {/* Mini sparkline bar */}
      <div className="mt-6 h-2 bg-[#F2EADA] rounded-full overflow-hidden">
        <div className="h-full w-[72%] bg-gradient-to-r from-[#B08D2C] to-[#E9C340] rounded-full" />
      </div>
    </div>
  );
};

const BookingChart = () => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const data = view === 'weekly' ? weeklyData : monthlyData;
  const maxVal = Math.max(...data.map(d => d.bookings));

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          Booking Traffic Frequency
        </p>
        <div className="flex gap-3">
          {(['weekly', 'monthly'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                view === v
                  ? 'text-[#7C6A2E] border-b border-[#7C6A2E]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end gap-2 sm:gap-3 flex-1 min-h-[120px]">
        {data.map((item, i) => {
          const heightPct = (item.bookings / maxVal) * 100;
          const isMax = item.bookings === maxVal;
          return (
            <div key={i} className="flex flex-col items-center flex-1 gap-1">
              <span className={`text-[9px] font-bold ${isMax ? 'text-[#7C6A2E]' : 'text-transparent'}`}>
                {item.bookings}
              </span>
              <div className="w-full relative" style={{ height: '100px' }}>
                <div
                  className={`absolute bottom-0 w-full rounded-sm transition-all duration-500 ${
                    isMax ? 'bg-[#B08D2C]' : 'bg-[#EBE5D9]'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[9px] font-semibold text-gray-400">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <RevenueCard />
      <BookingChart />
    </div>
  );
};

export default OverviewCards;
