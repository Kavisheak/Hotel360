"use client";

import React, { useState, useEffect } from "react";
import UpcomingEventFilters from "./UpcomingEventFilters";
import UpcomingEventList from "./UpcomingEventList";
import Footer from "../shared/Footer";
import CalendarView from "../performance/CalendarView";
import { videographerAPI } from "@/lib/api";
import { normalizeCalendarDate } from "@/lib/vendorUtils";
import { RefreshCw } from "lucide-react";

const UpcomingEventsMain = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(normalizeCalendarDate(new Date()));
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { ok, data } = await videographerAPI.getAssignedBookings();
      if (ok && data.success) {
        setBookings(data.data);
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
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-[1400px] mx-auto w-full">
        {/* Header Section */}
        <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
              <span>VIDEOGRAPHER</span>
              <span className="text-gray-400">›</span>
              <span className="text-[#7C6A2E]">UPCOMING EVENTS & SCHEDULE</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
              My Shoots & Schedule
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              Manage your confirmed event engagements and calendar availability all in one place.
            </p>
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
            <h2 className="text-xl font-serif font-bold text-gray-900">Videographer Calendar</h2>
            <div className="bg-white border border-[#E0D8C3] rounded-lg shadow-xs overflow-hidden p-2">
              <CalendarView 
                bookings={bookings} 
                selectedDate={selectedDate} 
                onSelectDate={(date) => setSelectedDate(normalizeCalendarDate(date))}
                vendorKey="videographer"
              />
            </div>
          </div>

          {/* Right Column: List (Width: 65%) */}
          <div className="w-full xl:w-[65%] flex-1">
            <UpcomingEventFilters
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchChange={setSearchTerm}
              onStatusChange={setStatusFilter}
            />

            <UpcomingEventList 
              searchTerm={searchTerm} 
              statusFilter={statusFilter} 
              externalBookings={bookings}
              loadingExternal={isLoading}
              onRefresh={fetchBookings}
            />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpcomingEventsMain;
