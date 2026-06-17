import React from "react";
import { Calendar, MapPin } from "lucide-react";

const events = [
  {
    title: "Sterling-Vance Wedding Film",
    type: "Wedding",
    date: "2026-07-24",
    time: "10:00 AM",
    venue: "Rosewood Estate, London",
    status: "Confirmed",
  },
  {
    title: "Okafor Engagement Session",
    type: "Engagement Session",
    date: "2026-08-05",
    time: "05:00 PM",
    venue: "Hyde Park Gardens, London",
    status: "Confirmed",
  },
  {
    title: "Harrison Corporate Highlights",
    type: "Corporate Event",
    date: "2026-08-20",
    time: "06:30 PM",
    venue: "The Shard, London",
    status: "Pending",
  },
  {
    title: "Montague Anniversary Documentary",
    type: "Anniversary",
    date: "2026-09-12",
    time: "03:00 PM",
    venue: "The Savoy, London",
    status: "Confirmed",
  },
  {
    title: "Priya & Rahul Pre-Wedding Shoot",
    type: "Pre-Wedding Shoot",
    date: "2026-09-28",
    time: "08:00 AM",
    venue: "Kew Gardens, London",
    status: "Pending",
  },
];

function statusClass(status: string) {
  if (status === "Confirmed") return "bg-[#EAF4EC] text-[#2E7A3E] border-[#D8EBD9]";
  if (status === "Pending") return "bg-[#FCF6E3] text-[#7C6A2E] border-[#F5EAD2]";
  return "bg-[#EAF0F6] text-[#3F6897] border-[#DCE6EE]";
}

const UpcomingEventList = () => {
  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Upcoming Shoots
      </h2>

      <div className="space-y-4">
        {events.map((event, index) => (
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
                {event.status.toUpperCase()}
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
        ))}
      </div>
    </article>
  );
};

export default UpcomingEventList;
