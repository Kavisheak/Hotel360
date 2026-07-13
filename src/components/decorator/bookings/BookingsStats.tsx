"use client";

import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, CheckCircle2, Star } from "lucide-react";
import { getVendorStatus } from "@/lib/vendorUtils";
import { decoratorAPI } from "@/lib/api";

interface BookingsStatsProps {
  bookings?: any[];
}

const BookingsStats = ({ bookings = [] }: BookingsStatsProps) => {
  const [avgRating, setAvgRating] = useState<string>("—");

  useEffect(() => {
    decoratorAPI.getRatings().then((res) => {
      if (res.ok && res.data?.data?.stats?.averageRating) {
        setAvgRating(res.data.data.stats.averageRating.toFixed(1));
      }
    });
  }, []);

  const totalEvents = bookings.length;
  const upcomingEvents = bookings.filter((b) => {
    const s = getVendorStatus(b, "decorator");
    const eventDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Preserved the updated logic: counts all future events except Declined/NotRequired
    return s !== "Declined" && s !== "NotRequired" && eventDate >= today;
  }).length;
  const completedEvents = bookings.filter((b) => getVendorStatus(b, "decorator") === "Completed").length;

  const dynamicStats = [
    { title: "TOTAL EVENTS", value: totalEvents.toString(), icon: CalendarDays },
    { title: "UPCOMING EVENTS", value: upcomingEvents.toString(), icon: Clock3 },
    { title: "COMPLETED EVENTS", value: completedEvents.toString(), icon: CheckCircle2 },
    { title: "AVERAGE RATING", value: avgRating, icon: Star },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {dynamicStats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]">
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">{item.title}</p>
              <span className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">{item.value}</span>
            </div>
            <Icon size={28} className="text-[#B08D2C] opacity-75 shrink-0" />
          </div>
        );
      })}
    </div>
  );
};

export default BookingsStats;
