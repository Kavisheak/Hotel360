"use client";

import React, { useState, useEffect } from 'react';
import { videographerAPI } from '@/lib/api';

export default function MonthlyPerformance() {
  const [bars, setBars] = useState([
    { month: 'JAN', value: '0%', tone: 'light' },
    { month: 'FEB', value: '0%', tone: 'light' },
    { month: 'MAR', value: '0%', tone: 'light' },
    { month: 'APR', value: '0%', tone: 'light' },
    { month: 'MAY', value: '0%', tone: 'light' },
    { month: 'JUN', value: '0%', tone: 'light' },
  ]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const { ok, data } = await videographerAPI.getAssignedBookings();
        if (ok && data.success) {
          const bookings = data.data;
          const monthCounts = new Array(6).fill(0); // Jan to Jun
          let maxCount = 0;

          bookings.forEach((b: any) => {
            const date = new Date(b.date);
            const month = date.getMonth(); // 0 is Jan
            if (month < 6) {
              monthCounts[month]++;
              if (monthCounts[month] > maxCount) maxCount = monthCounts[month];
            }
          });

          const newBars = [
            { month: 'JAN', value: maxCount > 0 ? `${(monthCounts[0] / maxCount) * 100}%` : '0%', tone: monthCounts[0] > 0 ? 'dark' : 'light' },
            { month: 'FEB', value: maxCount > 0 ? `${(monthCounts[1] / maxCount) * 100}%` : '0%', tone: monthCounts[1] > 0 ? 'dark' : 'light' },
            { month: 'MAR', value: maxCount > 0 ? `${(monthCounts[2] / maxCount) * 100}%` : '0%', tone: monthCounts[2] > 0 ? 'dark' : 'light' },
            { month: 'APR', value: maxCount > 0 ? `${(monthCounts[3] / maxCount) * 100}%` : '0%', tone: monthCounts[3] > 0 ? 'dark' : 'light' },
            { month: 'MAY', value: maxCount > 0 ? `${(monthCounts[4] / maxCount) * 100}%` : '0%', tone: monthCounts[4] > 0 ? 'dark' : 'light' },
            { month: 'JUN', value: maxCount > 0 ? `${(monthCounts[5] / maxCount) * 100}%` : '0%', tone: monthCounts[5] > 0 ? 'dark' : 'light' },
          ];
          setBars(newBars);
        }
      } catch (error) {
        console.error("Error fetching performance:", error);
      }
    };
    fetchPerformance();
  }, []);

  return (
    <article className="min-h-[560px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8">
      <div className="mb-12 flex items-start justify-between gap-4">
        <h2 className="mb-2 text-[28px] font-serif text-gray-800">Monthly Projects</h2>
        <button className="mt-2 inline-flex items-center gap-3 text-[15px] font-serif text-gray-800">
          First Half (2026)
          <span aria-hidden="true" className="inline-flex h-5 w-5 items-center justify-center">
            <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      </div>

      <div className="flex h-[210px] items-end gap-5">
        {bars.map((bar) => (
          <div key={bar.month} className="flex flex-1 flex-col items-center gap-3">
            <div className="relative h-[185px] w-full bg-[#DDD6C8]">
              <div
                className={`absolute right-0 bottom-0 left-0 transition-all duration-1000 ${
                  bar.tone === 'dark' ? 'bg-[#6F5B00]' : 'bg-[#E6C340]'
                }`}
                style={{ height: bar.value }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[6px] bg-[#E7E1D4]" />
            </div>
            <span className="text-[34px] leading-none tracking-[0.08em] text-[#181818]">{bar.month}</span>
          </div>
        ))}
      </div>

      <div className="h-28" aria-hidden="true" />
    </article>
  );
}
