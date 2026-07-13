"use client";

import React, { useState, useEffect } from 'react';
import { videographerAPI } from '@/lib/api';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function MonthlyPerformance() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const { ok, data } = await videographerAPI.getAssignedBookings();
        if (ok && data.success) {
          setBookings(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching performance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const now = new Date();
  const currentYear = now.getFullYear();
  const monthCounts = new Array(12).fill(0);
  bookings.forEach((b: any) => {
    const date = new Date(b.date);
    if (date.getFullYear() === currentYear) {
      monthCounts[date.getMonth()]++;
    }
  });
  const currentMonthIdx = now.getMonth();

  const sixBars = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (currentMonthIdx - 5 + i + 12) % 12;
    return { 
      label: MONTHS[monthIdx], 
      count: monthCounts[monthIdx],
      isCurrentMonth: monthIdx === currentMonthIdx
    };
  });

  const maxBar = Math.max(...sixBars.map(b => b.count), 1);

  return (
    <article className="min-h-[420px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8">
      <div className="mb-12 flex items-start justify-between gap-4">
        <h2 className="mb-2 text-[28px] font-serif text-gray-800">Monthly Bookings</h2>
        <span className="mt-2 text-[15px] font-serif text-gray-500">
          Annual View ({now.getFullYear()})
        </span>
      </div>

      <div className="flex h-[210px] items-end gap-3">
        {sixBars.map(({ label, count, isCurrentMonth }, idx) => {
          const pct = Math.round((count / maxBar) * 100);
          return (
            <div key={label + idx} className="flex flex-1 flex-col items-center group cursor-pointer relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 bg-[#7C6A2E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans font-bold whitespace-nowrap z-30">
                {count} Project{count !== 1 ? 's' : ''}
              </div>

              <div className={`relative h-[185px] w-full rounded-t-lg overflow-hidden border shadow-inner group-hover:bg-[#FDF9F1] transition-colors ${
                isCurrentMonth ? 'bg-[#FEF9E8] border-[#D4B553]' : 'bg-[#FAF6EE] border-[#E7DDCC]'
              }`}>
                {pct > 0 && (
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-700 ease-in-out group-hover:opacity-90 ${
                      isCurrentMonth
                        ? 'bg-gradient-to-t from-[#B08D2C] to-[#F0C040]'
                        : pct > 60
                        ? 'bg-gradient-to-t from-[#5E4F20] to-[#7C6A2E]'
                        : 'bg-gradient-to-t from-[#B08D2C] to-[#D4B553]'
                    }`}
                    style={{ height: `${pct}%` }}
                  />
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-widest mt-2 ${
                isCurrentMonth ? 'text-[#B08D2C] underline underline-offset-2' : 'text-[#7C6A2E]'
              }`}>{label}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
