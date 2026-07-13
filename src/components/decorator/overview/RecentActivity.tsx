import React from "react";
import { Calendar, CreditCard, FileText, Star } from "lucide-react";

<<<<<<< Updated upstream
const activities = [
  {
    title: "CLARIDGE'S WEDDING",
    status: "CONFIRMED",
    note: "6-Hour Evening Performance",
    date: "APR 12, 2024",
    icon: <Calendar size={16} />,
  },
  {
    title: "THE RITZ GALA",
    status: "DEPOSIT PAID",
    note: "Private Corporate Booking",
    date: "MAR 02, 2024",
    icon: <CreditCard size={16} />,
  },
  {
    title: "SAVOY PENTHOUSE",
    status: "PENDING",
    note: "Rider Review Required",
    date: "FEB 21, 2024",
    icon: <FileText size={16} />,
  },
  {
    title: "NEW REVIEW",
    status: "5.0 STAR",
    note: "From: The Montgomery Wedding",
    date: "FEB 08, 2024",
    icon: <Star size={16} />,
  },
];
=======
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { decoratorAPI } from '@/lib/api';
import { getClientFullName } from '@/lib/vendorUtils';
>>>>>>> Stashed changes

function statusClass(status: string) {
  if (status.includes("CONFIRMED")) return "bg-[#E6F4EA] text-[#2E7A3E] border-[#D7ECD8]";
  if (status.includes("DEPOSIT")) return "bg-[#F7EBD6] text-[#7C6A2E] border-[#EDE3C8]";
  if (status.includes("PENDING")) return "bg-[#FFF4E6] text-[#C27D2C] border-[#F2E4C9]";
  return "bg-[#EAF3F0] text-[#2E7A3E] border-[#DCEEE6]";
}

export default function RecentActivity() {
<<<<<<< Updated upstream
=======
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { ok, data } = await decoratorAPI.getAssignedBookings();
        if (ok && data?.data) {
          const mapped = data.data.slice(0, 4).map((b: any) => ({
            title: (`${b.eventType} for ${getClientFullName(b)}`).toUpperCase(),
            status: (b.vendors?.decorator?.status || 'PENDING').toUpperCase(),
            note: b.vendors?.decorator?.packageName || 'Custom Decoration Package',
            date: new Date(b.date).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            }).toUpperCase(),
          }));
          setActivities(mapped);
        }
      } catch (error) {
        console.error('Error fetching decorator recent activity:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

>>>>>>> Stashed changes
  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <h2 className="mb-2 text-[28px] font-serif text-gray-800">Recent Activity</h2>

      <div className="mt-5 space-y-4">
        {activities.map((activity) => (
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
        ))}
      </div>

      <Link href="/decorator/bookings" className="mt-5 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#7C6A2E]">
        View all activity
      </Link>
    </article>
  );
}
