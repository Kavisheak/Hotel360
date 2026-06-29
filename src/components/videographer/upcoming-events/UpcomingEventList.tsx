"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import { videographerAPI } from "@/lib/api";

function statusClass(status: string) {
  if (status.includes("CONFIRMED") || status.includes("ACCEPTED")) return "bg-[#EAF4EC] text-[#2E7A3E] border-[#D8EBD9]";
  if (status.includes("PENDING")) return "bg-[#FCF6E3] text-[#7C6A2E] border-[#F5EAD2]";
  return "bg-[#EAF0F6] text-[#3F6897] border-[#DCE6EE]";
}

const UpcomingEventList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const { ok, data } = await videographerAPI.getAssignedBookings();
        if (ok && data.success) {
          const mapped = data.data
            .filter((b: any) => {
              const status = b.vendors?.videographer?.status?.toUpperCase();
              return status !== 'COMPLETED'; // Only upcoming
            })
            .map((b: any) => ({
              title: (`${b.eventType} for ${b.clientName}`).toUpperCase(),
              type: b.vendors?.videographer?.packageName || "Custom Package",
              date: new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
              time: b.time || "TBD",
              venue: b.location?.address || b.location?.city || "TBD",
              status: b.vendors?.videographer?.status?.toUpperCase() || "PENDING",
            }));
          setEvents(mapped);
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm relative min-h-[200px]">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 text-[#B08D2C] animate-spin" />
        </div>
      )}
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Upcoming Shoots
      </h2>

      <div className="space-y-4">
        {events.length === 0 && !isLoading ? (
          <p className="text-gray-500 text-sm">No upcoming shoots.</p>
        ) : (
          events.map((event, index) => (
            <div
              key={index}
              className="border border-[#E0D8C3] p-4 hover:bg-[#FDF9F1] transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-serif font-bold text-gray-900 text-sm">{event.title}</p>
                  <p className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase mt-0.5">{event.type}</p>
                </div>
                <span className={`text-[9px] font-bold tracking-widest px-2 py-1 border shrink-0 ${statusClass(event.status)}`}>
                  {event.status}
                </span>
              </div>

              <div className="space-y-1 mt-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} className="text-[#A6955C] shrink-0" />
                  <span>{event.date} · {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={12} className="text-[#A6955C] shrink-0" />
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

export default UpcomingEventList;
