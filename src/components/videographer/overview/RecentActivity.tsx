"use client";

import React, { useState, useEffect } from "react";
import { Calendar, CreditCard, FileText, Star } from "lucide-react";
import Link from "next/link";
import { videographerAPI } from "@/lib/api";
import { getClientFullName } from "@/lib/vendorUtils";

const mockActivities = [
  {
    title: "STERLING-VANCE WEDDING",
    status: "CONFIRMED",
    note: "Full-day Cinematic Coverage",
    date: "JUN 24, 2026",
    icon: <Calendar size={16} />,
  },
  {
    title: "CORPORATE GALA SHOOT",
    status: "DEPOSIT PAID",
    note: "Event Highlight Reel",
    date: "JUN 02, 2026",
    icon: <CreditCard size={16} />,
  },
  {
    title: "OKAFOR ENGAGEMENT SESSION",
    status: "PENDING",
    note: "Contract Review Required",
    date: "MAY 28, 2026",
    icon: <FileText size={16} />,
  },
  {
    title: "NEW REVIEW",
    status: "5.0 STAR",
    note: "From: The Hartley Wedding",
    date: "MAY 15, 2026",
    icon: <Star size={16} />,
  },
];

function statusClass(status: string = "") {
  if (!status) return "bg-[#FFF4E6] text-[#C27D2C] border-[#F2E4C9]";
  const upper = status.toUpperCase();
  if (upper.includes("CONFIRMED")) return "bg-[#E6F4EA] text-[#2E7A3E] border-[#D7ECD8]";
  if (upper.includes("DEPOSIT")) return "bg-[#F7EBD6] text-[#7C6A2E] border-[#EDE3C8]";
  if (upper.includes("PENDING")) return "bg-[#FFF4E6] text-[#C27D2C] border-[#F2E4C9]";
  return "bg-[#EAF3F0] text-[#2E7A3E] border-[#DCEEE6]";
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { ok, data } = await videographerAPI.getAssignedBookings();
        if (ok && data.success) {
          const mapped = data.data.slice(0, 4).map((b: any) => ({
            title: (`${b.eventType} for ${getClientFullName(b)}`).toUpperCase(),
            status: b.vendors?.videographer?.status?.toUpperCase() || "PENDING",
            note: b.vendors?.videographer?.packageName || "Custom Package",
            date: new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
            icon: <Calendar size={16} />,
          }));
          setActivities(mapped);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <h2 className="mb-2 text-[28px] font-serif text-gray-800">Recent Activity</h2>

      <div className="mt-5 space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-sm font-serif italic text-gray-400">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-sm font-serif italic text-gray-500">No recent assigned bookings</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.title} className="flex items-start gap-4 border-b border-[#E0D8C3] pb-4 last:border-b-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[#E0D8C3] bg-[#F2EADA] text-[#7C6A2E]">
                {activity.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-800">
                    {activity.title}
                  </p>
                  <span className={`whitespace-nowrap border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${statusClass(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-gray-500">{activity.note}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-gray-400">{activity.date}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/videographer/events-bookings" className="mt-5 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#7C6A2E]">
        View all activity
      </Link>
    </article>
  );
}
