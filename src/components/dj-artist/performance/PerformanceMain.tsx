"use client";

import React from 'react';
import Image from 'next/image';
import Footer from '../../videographer/shared/Footer';

const weekDays = [
  { day: 'MON', date: '12', active: false, today: false },
  { day: 'TUE', date: '13', active: true, today: true },
  { day: 'WED', date: '14', active: false, today: false, dot: true },
  { day: 'THU', date: '15', active: false, today: false },
  { day: 'FRI', date: '16', active: false, today: false, dot: true },
  { day: 'SAT', date: '17', active: false, today: false, dot: true },
  { day: 'SUN', date: '18', active: false, today: false },
];

import { useBookingStore } from '@/store/bookingStore';

export default function PerformanceMain() {
  const [isClient, setIsClient] = React.useState(false);
  const globalBookings = useBookingStore(state => state.bookings);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const djBookings = globalBookings.filter(b => b.vendors.dj !== "none");

  return (
    <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-[clamp(2.5rem,4vw,4.8rem)] leading-[0.92] tracking-[-0.05em] text-[#8C6A11]">
            Performance Schedule
          </h1>
          <p className="mt-3 max-w-2xl font-serif text-lg italic text-[#807157] sm:text-[20px]">
            Your upcoming seasonal curations and grand appearances.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8C6A11]">Weekly View</p>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center border border-[#E0D2AD] bg-white text-[#8C6A11] transition hover:bg-[#F3E8CA]">‹</button>
            <button className="grid h-10 w-10 place-items-center border border-[#E0D2AD] bg-white text-[#8C6A11] transition hover:bg-[#F3E8CA]">›</button>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7 lg:gap-0">
          {weekDays.map((item) => (
            <article
              key={item.date}
              className={`relative flex h-40 flex-col items-center justify-center border border-[#E8DABB] bg-[#FBF7EE] text-center ${
                item.active ? 'bg-[#8D7409] text-white shadow-[0_8px_20px_rgba(141,116,9,0.22)]' : 'text-[#706148]'
              }`}
            >
              <span className={`text-[11px] font-semibold tracking-[0.22em] ${item.active ? 'text-white/80' : 'text-[#8C6A11]'}`}>
                {item.day}
              </span>
              <span className="mt-3 font-serif text-[2.2rem] leading-none tracking-[-0.08em]">{item.date}</span>
              {item.today ? <span className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/75">Today</span> : null}
              {item.dot ? <span className={`absolute bottom-5 text-[26px] leading-none ${item.active ? 'text-white/90' : 'text-[#8C6A11]'}`}>·</span> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-5 flex items-end gap-3">
          <h2 className="font-serif text-3xl tracking-[-0.04em] text-[#4E3A16] sm:text-[34px]">Upcoming Engagements</h2>
          <span className="pb-1 text-sm text-[#84735A]">({isClient ? djBookings.length : 0} total)</span>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {isClient && djBookings.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-gray-500 font-light italic">
              No DJ bookings found.
            </div>
          ) : isClient ? (
            djBookings.map((event, idx) => {
              const displayStatus = event.status === 'Pending' ? 'PENDING' : 'CONFIRMED';
              const imgUrl = idx % 2 === 0 ? '/images/01.png' : '/images/02.png';

              return (
                <article key={event.id} className="grid overflow-hidden border border-[#E3D4AB] bg-[#FCF8F0] shadow-[0_8px_24px_rgba(127,103,32,0.06)] md:grid-cols-[220px_1fr]">
                  <div className="relative min-h-[220px] bg-[#eadfc1]">
                    <img src={imgUrl} alt={event.clientName} className="object-cover w-full h-full" />
                    <div className="absolute left-3 top-3 bg-[#D8C28A]/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#6E520E]">
                      {displayStatus}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:p-6">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.24em] text-[#8C6A11]">{event.date}</p>
                      <h3 className="mt-2 max-w-md font-serif text-[1.7rem] leading-[1.05] tracking-[-0.04em] text-[#362612]">
                        {event.clientName} - {event.eventType}
                      </h3>
                      <p className="mt-3 text-sm text-[#665A43]">⌾ {event.guests} Guests</p>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button className="min-w-[126px] bg-[#9A7A10] px-4 py-2.5 text-[11px] font-semibold tracking-[0.22em] text-white transition hover:bg-[#84680E]">
                        VIEW DETAILS
                      </button>
                      {displayStatus === 'PENDING' ? (
                        <button className="grid h-11 w-11 place-items-center border border-[#E0D2AD] text-[#8C6A11] transition hover:bg-[#F3E8CA]">×</button>
                      ) : (
                        <button className="grid h-11 w-11 place-items-center border border-[#E0D2AD] text-[#8C6A11] transition hover:bg-[#F3E8CA]">↗</button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : null}
        </div>
      </section>

      <section className="flex flex-col gap-6 py-6 lg:flex-row lg:items-end lg:justify-between lg:py-10">
        <div className="flex items-start gap-3">
          <span className="mt-2 h-3 w-3 rounded-full bg-[#2DBB4D]" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8C6A11]">Currently available for booking</p>
            <p className="mt-1 text-sm text-[#67593F]">Winter 2024 residencies now open.</p>
          </div>
        </div>

        <button className="self-start border border-[#B08A19] px-7 py-3 text-[11px] font-semibold tracking-[0.26em] text-[#8C6A11] transition hover:bg-[#F3E8CA] lg:self-auto">
          REQUEST TIME OFF
        </button>
      </section>

      <Footer />
    </div>
  );
}