import React from "react";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "TOTAL BOOKINGS",
    value: "38",
    icon: CalendarDays,
  },
  {
    title: "UPCOMING EVENTS",
    value: "11",
    icon: Clock3,
  },
  {
    title: "COMPLETED EVENTS",
    value: "24",
    icon: CheckCircle2,
  },
  {
    title: "PENDING CONFIRMATIONS",
    value: "03",
    icon: Star,
  },
];

const BookingsStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-[#FDF9F1] border border-[#E0D8C3] p-5 sm:p-6 shadow-sm flex items-center justify-between min-h-[110px]"
          >
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
