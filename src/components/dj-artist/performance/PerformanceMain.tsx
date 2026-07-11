"use client";

import React, { useState, useEffect } from "react";
import ScheduleHeader from "./ScheduleHeader";
import CalendarView from "./CalendarView";
import EventTimeline from "./EventTimeline";
import ResourceAllocation from "./ResourceAllocation";
import Footer from "../overview/Footer";
import { djAPI } from "@/lib/api";

const PerformanceMain = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await djAPI.getAssignedBookings();
        if (res.ok && res.data?.data) {
          setBookings(res.data.data);
        }
      } catch (e) {
        console.error("Error fetching bookings:", e);
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
              onSelectDate={setSelectedDate} 
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