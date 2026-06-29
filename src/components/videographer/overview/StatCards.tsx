"use client";

import { useState, useEffect } from "react";
import { videographerAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function StatCards() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcoming: 0,
    completed: 0,
    avgRating: 0 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, ratingsRes] = await Promise.all([
          videographerAPI.getAssignedBookings(),
          videographerAPI.getRatings()
        ]);

        let total = 0;
        let upcoming = 0;
        let completed = 0;
        
        if (bookingsRes.ok && bookingsRes.data.success) {
          const bookings = bookingsRes.data.data;
          total = bookings.length;
          bookings.forEach((b: any) => {
            const status = b.vendors?.videographer?.status?.toUpperCase();
            if (status === 'COMPLETED') completed++;
            else if (status === 'ACCEPTED' || status === 'CONFIRMED' || status === 'PENDING') upcoming++;
          });
        }

        let avgRating = 0;
        if (ratingsRes.ok && ratingsRes.data.success && ratingsRes.data.data.length > 0) {
          const ratings = ratingsRes.data.data;
          const sum = ratings.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
          avgRating = Number((sum / ratings.length).toFixed(1));
        }

        setStats({ totalEvents: total, upcoming, completed, avgRating });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: "TOTAL EVENTS COVERED", value: stats.totalEvents.toString(), sub: "All time bookings", icon: "🎬" },
    { title: "UPCOMING SHOOTS", value: stats.upcoming.toString(), sub: "Pending or Accepted", icon: "📅" },
    { title: "COMPLETED PROJECTS", value: stats.completed.toString(), sub: "Successfully delivered", icon: "✅" },
    { title: "AVERAGE RATING", value: stats.avgRating > 0 ? stats.avgRating.toString() : "N/A", sub: stats.avgRating > 0 ? "★★★★★" : "No ratings yet", icon: "★" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.title} className="border border-[#E0D8C3] bg-[#FDF9F1] p-5 shadow-sm relative">
          {isLoading && (
            <div className="absolute inset-0 bg-[#FDF9F1]/50 flex items-center justify-center z-10">
              <Loader2 className="w-5 h-5 text-[#B08D2C] animate-spin" />
            </div>
          )}
          <div className="flex items-start justify-between">
            <p className="max-w-[130px] text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              {card.title}
            </p>
            <span className="text-sm font-bold text-[#7C6A2E]">{card.icon}</span>
          </div>

          <div className="mt-8">
            <p className="text-4xl leading-none font-serif text-[#7C6A2E]">
              {card.value}
            </p>
            <p className="mt-2 text-[12px] text-gray-600">
              {card.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
