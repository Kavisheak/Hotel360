"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Star,
  Loader2
} from "lucide-react";
import { videographerAPI } from "@/lib/api";

const BookingsStats = () => {
  const [statsData, setStatsData] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { ok, data } = await videographerAPI.getAssignedBookings();
        if (ok && data.success) {
          const bookings = data.data;
          let upcoming = 0;
          let completed = 0;
          let pending = 0;

<<<<<<< Updated upstream
          bookings.forEach((b: any) => {
            const status = b.vendors?.videographer?.status?.toUpperCase() || "PENDING";
            if (status === 'COMPLETED') completed++;
            else if (status === 'PENDING') pending++;
            else if (status === 'ACCEPTED' || status === 'CONFIRMED') upcoming++;
          });
=======
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            bookings.forEach((b: any) => {
              const status = b.vendors?.videographer?.status?.toUpperCase() || "PENDING";
              const eventDate = new Date(b.date);
              
              if (status === 'COMPLETED') {
                completed++;
              }
              
              // Count all pending for the Pending Confirmations card
              if (status === 'PENDING') {
                pending++;
              }
              
              // Count future active jobs for the Upcoming Events card (matches Overview & Schedule logic)
              if (status !== 'DECLINED' && status !== 'NOTREQUIRED' && eventDate >= today) {
                upcoming++;
              }
            });
>>>>>>> Stashed changes

          setStatsData({
            total: bookings.length,
            upcoming,
            completed,
            pending,
          });
        }
      } catch (error) {
        console.error("Error fetching booking stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsList = [
    {
      title: "TOTAL BOOKINGS",
      value: statsData.total.toString(),
      icon: CalendarDays,
    },
    {
      title: "UPCOMING EVENTS",
      value: statsData.upcoming.toString(),
      icon: Clock3,
    },
    {
      title: "COMPLETED EVENTS",
      value: statsData.completed.toString(),
      icon: CheckCircle2,
    },
    {
      title: "PENDING CONFIRMATIONS",
      value: statsData.pending.toString(),
      icon: Star,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statsList.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px] relative"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-[#FDF9F1]/50 flex items-center justify-center z-10">
                <Loader2 className="w-5 h-5 text-[#B08D2C] animate-spin" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-2">
                {item.title}
              </p>

              <span className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
                {item.value}
              </span>
            </div>

            <Icon
              size={28}
              className="text-[#B08D2C] opacity-75 shrink-0"
            />
          </div>
        );
      })}
    </div>
  );
};

export default BookingsStats;
