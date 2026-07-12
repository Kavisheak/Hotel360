"use client";

import React, { useState, useEffect } from 'react';
import { decoratorAPI } from '@/lib/api';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function MonthlyPerformance() {
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const { ok, data } = await decoratorAPI.getOverview();
        if (ok && data?.data) {
          setMonthlyData(data.data.monthlyData ?? Array(12).fill(0));
          setCurrentYear(data.data.currentYear ?? new Date().getFullYear());
        }
      } catch (error) {
        console.error('Error fetching decorator monthly performance:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const now = new Date();
  const currentMonthIdx = now.getMonth();

  const sixBars = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (currentMonthIdx - 5 + i + 12) % 12;
    return {
      label: MONTHS[monthIdx],
      count: monthlyData[monthIdx],
      isCurrentMonth: monthIdx === currentMonthIdx,
    };
  });

  const maxBar = Math.max(...sixBars.map((b) => b.count), 1);

  return (
    <article className="min-h-[420px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8">
      <div className="mb-12 flex items-start justify-between gap-4">
        <h2 className="mb-2 text-[28px] font-serif text-gray-800">Monthly Bookings</h2>
        <span className="mt-2 text-[15px] font-serif text-gray-500">
          Annual View ({currentYear})
        </span>
      </div>

      {isLoading ? (
        <div className="flex h-[210px] items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#B08D2C] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex h-[210px] items-end gap-3">
          {sixBars.map(({ label, count, isCurrentMonth }, idx) => {
            const pct = Math.round((count / maxBar) * 100);
            return (
              <div key={label + idx} className="flex flex-1 flex-col items-center group cursor-pointer relative">
                {/* Tooltip */}
                <div className="absolute -top-8 bg-[#7C6A2E] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans font-bold whitespace-nowrap z-30">
                  {count} Setup{count !== 1 ? 's' : ''}
                </div>

                <div className={`relative h-[185px] w-full rounded-t-lg overflow-hidden border shadow-inner transition-colors ${
                  isCurrentMonth
                    ? 'bg-[#FEF9E8] border-[#D4B553]'
                    : 'bg-[#FAF6EE] border-[#E7DDCC]'
                }`}>
                  {pct > 0 && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-700 ease-in-out ${
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
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}