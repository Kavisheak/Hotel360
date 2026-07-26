"use client";

import React, { useState, useEffect } from 'react';
import Header from './Header';
import JobQueue from './JobQueue';
import Footer from './Footer';
import CalendarView from '../performance/CalendarView';
import { djAPI } from '@/lib/api';
import { normalizeCalendarDate } from '@/lib/vendorUtils';
import { RefreshCw } from 'lucide-react';

const MainContent = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(normalizeCalendarDate(new Date()));
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await djAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        setBookings(res.data.data);
      }
    } catch (e) {
      console.error("Error fetching bookings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <Header />
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-[1400px] mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7C6A2E] mb-2 tracking-tight">My Jobs & Schedule</h2>
            <p className="text-gray-500 font-serif italic text-sm sm:text-lg">Overseeing elegance for upcoming celebrations.</p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={isLoading}
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-2 border border-[#E0D8C3] bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 rounded transition-colors shadow-xs"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-[#7C6A2E]" : "text-gray-400"} />
            Refresh Dashboard
          </button>
        </div>
        
        {/* 2-Column Layout */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Left Column: Calendar (Width: 35%) */}
          <div className="w-full xl:w-[35%] flex-shrink-0 flex flex-col gap-6">
            <h2 className="text-xl font-serif font-bold text-gray-900">Artist Calendar</h2>
            <div className="bg-white border border-[#E0D8C3] rounded-lg shadow-xs overflow-hidden p-2">
              <CalendarView 
                bookings={bookings} 
                selectedDate={selectedDate} 
                onSelectDate={(date) => setSelectedDate(normalizeCalendarDate(date))}
                vendorKey="dj"
              />
            </div>
          </div>

          {/* Right Column: JobQueue (Width: 65%) */}
          <div className="w-full xl:w-[65%] flex-1">
             <JobQueue externalBookings={bookings} loadingExternal={isLoading} onRefresh={fetchBookings} />
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainContent;
