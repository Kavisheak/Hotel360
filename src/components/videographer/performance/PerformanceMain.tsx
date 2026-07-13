"use client";

import React, { useState, useEffect } from "react";
import ScheduleHeader from "./ScheduleHeader";
import CalendarView from "./CalendarView";
import EventTimeline from "./EventTimeline";
import ResourceAllocation from "./ResourceAllocation";
import Footer from "../shared/Footer";
import { videographerAPI } from "@/lib/api";
import { normalizeCalendarDate } from "@/lib/vendorUtils";

const PerformanceMain = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(normalizeCalendarDate(new Date()));
  
  useEffect(() => {
    const fetchBookings = async () => {
      const { ok, data } = await videographerAPI.getAssignedBookings();
      if (ok && data.success) {
        setBookings(data.data);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <ScheduleHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mt-6">
          <div className="lg:col-span-2">
            <CalendarView 
              bookings={bookings} 
              selectedDate={selectedDate} 
              onSelectDate={(date) => setSelectedDate(normalizeCalendarDate(date))}
              vendorKey="videographer"
            />
          </div>

          <div className="lg:col-span-1">
            <EventTimeline 
              bookings={bookings} 
              selectedDate={selectedDate} 
            />
          </div>
        </div>

        <ResourceAllocation bookings={bookings} />
      </div>

      <Footer />
    </div>
  );
};

export default PerformanceMain;
