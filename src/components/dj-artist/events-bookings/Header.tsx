import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const Header = () => {
  return (
    <section className="mb-8 mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <div className="mb-3 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A6955C]">
          <span>DJ Artist Dashboard</span>
        </div>

        <h1 className="font-serif text-[clamp(2.8rem,4vw,4.8rem)] leading-[0.92] tracking-[-0.05em] text-[#8C6A11]">
          Event Bookings
        </h1>

        <p className="mt-3 max-w-2xl font-serif text-lg italic text-[#807157] sm:text-[20px]">
          Track assigned performances, manage event schedules, and monitor upcoming bookings.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 lg:pt-2">
        <button className="border border-[#E0D2AD] bg-white px-6 py-3 text-[11px] font-semibold tracking-[0.22em] text-[#8C6A11] transition hover:bg-[#F3E8CA]">
          EXPORT REPORT
        </button>

        <Link
          href="/dj-artist/upcoming-events"
          className="inline-flex items-center gap-2 bg-[#9A7A10] px-6 py-3 text-[11px] font-semibold tracking-[0.22em] text-white transition hover:bg-[#84680E]"
        >
          <Plus size={16} />
          UPCOMING EVENTS
        </Link>
      </div>
    </section>
  );
};

export default Header;