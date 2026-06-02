import React from 'react';
import { CalendarDays, Clock, TrendingUp } from 'lucide-react';

const PaymentMetrics = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    {/* Monthly Revenue */}
    <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={18} className="text-[#B08D2C]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Revenue</p>
      </div>
      <p className="text-2xl font-serif font-semibold text-gray-800">$42,500.00</p>
      <p className="text-[10px] font-semibold text-green-600 mt-1.5 tracking-wide">+12% vs last month</p>
    </div>

    {/* Pending Cash */}
    <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={18} className="text-[#4258af]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pending Cash</p>
      </div>
      <p className="text-2xl font-serif font-semibold text-gray-800">$8,240.00</p>
      <p className="text-[10px] font-semibold text-gray-400 mt-1.5 tracking-widest uppercase">14 Pending Deposits</p>
    </div>

    {/* Annual Forecast — dark gold card */}
    <div className="relative bg-[#7C6A2E] rounded-xl p-5 shadow-sm overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full bg-white/5" />
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={18} className="text-[#F9DD76]" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#F9DD76]">Annual Forecast</p>
      </div>
      <p className="text-2xl font-serif font-bold text-white relative z-10">$512,000.00</p>
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-white/20 rounded-full h-1.5">
          <div className="bg-[#F9DD76] h-1.5 rounded-full" style={{ width: '65%' }} />
        </div>
        <p className="text-[10px] text-[#F9DD76]/80 mt-1.5 text-right tracking-widest">65% Target</p>
      </div>
    </div>
  </div>
);

export default PaymentMetrics;
