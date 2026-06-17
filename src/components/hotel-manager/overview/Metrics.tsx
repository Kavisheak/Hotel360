"use client";

import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock, CheckCircle2, Wallet } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const Metrics = () => {
  const [isClient, setIsClient] = useState(false);
  const bookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalBookings = bookings.length;
  const pendingApprovals = bookings.filter(b => b.status === "Pending").length;
  const confirmedEvents = bookings.filter(b => b.status === "Confirmed").length;
  const monthlyRevenue = bookings.filter(b => b.status === "Confirmed").reduce((sum, b) => sum + b.totalCost, 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `LKR ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `LKR ${(val / 1000).toFixed(0)}K`;
    return `LKR ${val}`;
  };

  const metrics = [
    { icon: <CalendarDays size={28} className="text-[#B08D2C]" />, label: 'Total Bookings',    value: isClient ? totalBookings.toString() : '...' },
    { icon: <Clock size={28}        className="text-[#4258af]" />, label: 'Pending Approvals', value: isClient ? pendingApprovals.toString() : '...'  },
    { icon: <CheckCircle2 size={28} className="text-[#7C6A2E]" />, label: 'Confirmed Events',  value: isClient ? confirmedEvents.toString() : '...'  },
    { icon: <Wallet size={28}       className="text-[#735c00]" />, label: 'Confirmed Revenue',   value: isClient ? formatCurrency(monthlyRevenue) : '...' },
  ];

  return (
  <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {metrics.map((m) => (
      <div
        key={m.label}
        className="bg-white border border-[#E0D8C3] rounded-xl p-4 lg:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="mb-3">{m.icon}</div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-1">{m.label}</p>
        <h3 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-800">{m.value}</h3>
      </div>
    ))}
    </section>
  );
};

export default Metrics;
