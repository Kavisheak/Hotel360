"use client";

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bookingAPI } from '@/lib/api';

const CalendarHeader = ({ currentDate, setCurrentDate }: { currentDate: Date, setCurrentDate: (d: Date) => void }) => {
  const [confirmedCount, setConfirmedCount] = useState(0);

  useEffect(() => {
    bookingAPI.getAllBookings().then(res => {
      if (res.ok && res.data?.data) {
        let count = 0;
        const targetMonth = currentDate.getMonth();
        const targetYear = currentDate.getFullYear();
        
        res.data.data.forEach((b: any) => {
          if (b.status === 'Confirmed' || b.status === 'DepositPaid' || b.status === 'BalancePaid') {
            if (b.date) {
              const d = new Date(b.date);
              if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
                count++;
              }
            }
          }
        });
        setConfirmedCount(count);
      }
    });
  }, [currentDate]);

  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-[#7C6A2E]">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5 tracking-wide">
          {confirmedCount} confirmed event{confirmedCount !== 1 ? 's' : ''} this month
        </p>
      </div>
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button onClick={handlePrev} className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] rounded hover:bg-[#F2EADA] text-gray-500 hover:text-[#7C6A2E] transition-colors">
          <ChevronLeft size={16} />
        </button>
        <button onClick={handleToday} className="px-4 h-8 border border-[#E0D8C3] rounded text-[10px] font-bold uppercase tracking-widest text-[#7C6A2E] hover:bg-[#F2EADA] transition-colors">
          Today
        </button>
        <button onClick={handleNext} className="w-8 h-8 flex items-center justify-center border border-[#E0D8C3] rounded hover:bg-[#F2EADA] text-gray-500 hover:text-[#7C6A2E] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
  );
};

export default CalendarHeader;
