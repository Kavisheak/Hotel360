import React from "react";

const events = [
  {
    title: "Wedding Night Performance",
    date: "2026-06-20",
    time: "08:00 PM",
    venue: "Grand Ballroom",
    status: "Confirmed",
  },
  {
    title: "Corporate DJ Night",
    date: "2026-06-25",
    time: "09:30 PM",
    venue: "Skyline Hotel",
    status: "Pending",
  },
];

const UpcomingEventList = () => {
  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Upcoming Events
      </h2>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="border border-[#E0D8C3] p-4 hover:bg-[#FDF9F1]"
          >
            <p className="font-semibold text-gray-800">{event.title}</p>
            <p className="text-xs text-gray-500">
              {event.date} • {event.time}
            </p>
            <p className="text-xs text-gray-500">{event.venue}</p>

            <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-widest text-[#8C6A11]">
              {event.status}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
};

export default UpcomingEventList;