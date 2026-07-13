"use client";

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { decoratorAPI } from '@/lib/api';
import { getClientFullName } from '@/lib/vendorUtils';

function statusClass(status: string = '') {
  const s = status.toUpperCase();
  if (s === 'ACCEPTED' || s === 'CONFIRMED') return 'bg-[#E6F4EA] text-[#2E7A3E] border-[#D7ECD8]';
  if (s === 'COMPLETED') return 'bg-[#EAF0F6] text-[#3F6897] border-[#DCE6EE]';
  if (s === 'PENDING') return 'bg-[#FFF4E6] text-[#C27D2C] border-[#F2E4C9]';
  if (s === 'DECLINED') return 'bg-[#FDE8E8] text-[#9B3434] border-[#F5D4D4]';
  return 'bg-[#EAF3F0] text-[#2E7A3E] border-[#DCEEE6]';
}

export default function RecentActivity() {
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

  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <h2 className="mb-2 text-[28px] font-serif text-gray-800">Recent Activity</h2>

      <div className="mt-5 space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 border-b border-[#E0D8C3] pb-4 animate-pulse">
              <div className="h-10 w-10 shrink-0 bg-[#F2EADA] border border-[#E0D8C3]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[#E0D8C3] rounded w-3/4" />
                <div className="h-2 bg-[#E0D8C3] rounded w-1/2" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-500 italic py-4">No recent bookings found.</p>
        ) : (
          activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 border-b border-[#E0D8C3] pb-4 last:border-b-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[#E0D8C3] bg-[#F2EADA] text-[#7C6A2E]">
                <Calendar size={16} />
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

      <Link href="/decorator/bookings" className="mt-5 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#7C6A2E]">
        View all activity
      </Link>
    </article>
  );
}
