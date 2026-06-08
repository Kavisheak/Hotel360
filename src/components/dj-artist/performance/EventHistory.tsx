import React from "react";

type EventItem = {
  name: string;
  date: string;
  status: "completed" | "upcoming";
  rating: string;
};

const events: EventItem[] = [
  { name: "Claridge's Wedding", date: "Apr 12, 2024", status: "completed", rating: "5.0" },
  { name: "Ritz Gala", date: "Mar 02, 2024", status: "completed", rating: "4.9" },
  { name: "Savoy Penthouse", date: "Feb 21, 2024", status: "completed", rating: "4.8" },
  { name: "Summer Residency", date: "Jun 18, 2024", status: "upcoming", rating: "—" },
];

export default function EventHistory() {
  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <h2 className="mb-6 text-[28px] font-serif text-gray-800">Event History</h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.name} className="flex items-center justify-between gap-4 border-b border-[#E0D8C3] pb-4 last:border-b-0">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-800">
                {event.name}
              </p>
              <p className="mt-1 text-[12px] text-gray-500">{event.date}</p>
            </div>

            <div className="text-right">
              <span className={`inline-flex border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${event.status === "completed" ? "border-[#D7ECD8] bg-[#E6F4EA] text-[#2E7A3E]" : "border-[#F2E4C9] bg-[#FFF4E6] text-[#C27D2C]"}`}>
                {event.status}
              </span>
              <p className="mt-2 text-[12px] text-gray-500">Rating: {event.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}