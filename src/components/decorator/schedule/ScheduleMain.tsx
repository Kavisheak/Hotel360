"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Lock, Plus, RefreshCw, Info } from 'lucide-react';
import CalendarView from './CalendarView';
import BlockDateModal from './BlockDateModal';
import Footer from '../my_jobs/Footer';
import { decoratorAPI } from '@/lib/api';

const ScheduleMain: React.FC = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  useEffect(() => {
    fetchSchedule(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const fetchSchedule = async (m: number, y: number) => {
    setIsLoading(true);
    try {
      const res = await decoratorAPI.getSchedule(m, y);
      if (res.ok && res.data?.data) {
        setScheduleItems(res.data.data);
      } else {
        setScheduleItems([]);
      }
    } catch (e) {
      console.error("Failed to fetch decorator schedule:", e);
      setScheduleItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (m: number, y: number) => {
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  const handleBlockSubmit = async (body: { startDate: string; endDate: string; reason: string }) => {
    try {
      const res = await decoratorAPI.createBlock(body);
      return { ok: res.ok, status: res.status, data: res.data };
    } catch (err: any) {
      return { ok: false, status: 500, data: { message: err.message } };
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm("Are you sure you want to remove this availability block?")) {
      try {
        const res = await decoratorAPI.deleteBlock(blockId);
        if (res.ok) {
          fetchSchedule(selectedMonth, selectedYear);
        } else {
          alert(res.data?.message || "Failed to delete block.");
        }
      } catch (e: any) {
        alert(e.message || "Server error while removing block.");
      }
    }
  };

  const bookedCount = scheduleItems.filter((i) => i.type === 'booked').length;
  const blockedCount = scheduleItems.filter((i) => i.type === 'blocked').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1] font-sans">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-serif italic text-[#A6955C]">Availability & Booking Calendar</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 font-bold tracking-tight leading-none mt-1">
              Studio Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-2 max-w-2xl">
              View confirmed job commitments and manage your studio’s manual availability blocks. Confirmed job dates are read-only.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => fetchSchedule(selectedMonth, selectedYear)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E0D8C3] bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 rounded transition-colors shadow-xs"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin text-[#7C6A2E]" : "text-gray-400"} />
              Refresh
            </button>

            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors"
            >
              <Lock size={14} /> Block Dates
            </button>
          </div>
        </div>

        {/* Month Summary Bar */}
        <div className="mb-6 p-4 bg-white border border-[#E0D8C3] rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Confirmed Jobs</span>
              <strong className="text-base font-serif text-gray-900">{bookedCount} Date(s)</strong>
            </div>
            <div className="h-8 w-px bg-[#E0D8C3]"></div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">Manual Blocks</span>
              <strong className="text-base font-serif text-red-600">{blockedCount} Date(s)</strong>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex items-center gap-1.5 bg-[#FAF6EE] px-3 py-1.5 rounded border border-[#E0D8C3]">
            <Info size={14} className="text-[#A6955C]" />
            <span>Public availability endpoint checks both booked & blocked dates automatically.</span>
          </div>
        </div>

        {/* Calendar View */}
        {isLoading ? (
          <div className="py-16 text-center text-sm font-serif italic text-gray-400 bg-white border border-[#E0D8C3] rounded-lg">
            Loading schedule details...
          </div>
        ) : (
          <CalendarView
            scheduleItems={scheduleItems}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
            onDeleteBlock={handleDeleteBlock}
          />
        )}
      </div>

      {/* Block Dates Modal */}
      <BlockDateModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onSuccess={() => fetchSchedule(selectedMonth, selectedYear)}
        onBlockSubmit={handleBlockSubmit}
      />

      <Footer />
    </div>
  );
};

export default ScheduleMain;
