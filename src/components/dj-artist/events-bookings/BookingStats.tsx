import React from 'react';
import { CalendarDays, CheckCircle2, Clock3, Hourglass } from 'lucide-react';

const stats = [
  { label: 'TOTAL BOOKINGS', value: '42', icon: CalendarDays },
  { label: 'UPCOMING EVENTS', value: '16', icon: Clock3 },
  { label: 'COMPLETED EVENTS', value: '18', icon: CheckCircle2 },
  { label: 'PENDING CONFIRMATIONS', value: '08', icon: Hourglass },
];

const BookingStats = () => {
  return (
    <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article key={stat.label} className="flex min-h-[110px] items-center justify-between border border-[#E0D8C3] bg-[#FDF9F1] p-5 shadow-sm sm:p-6">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                {stat.label}
              </p>
              <span className="font-serif text-4xl font-bold tracking-tight text-[#7C6A2E] sm:text-5xl">
                {stat.value}
              </span>
            </div>

            <Icon size={28} className="shrink-0 text-[#B08D2C] opacity-75" />
          </article>
        );
      })}
    </section>
  );
};

export default BookingStats;
