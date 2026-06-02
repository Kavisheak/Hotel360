import React from 'react';

const BookingDetailsModal = () => {
  return (
    <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-[#E0D8C3] pb-3">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6A2E]">Booking Details</h3>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#3F6897]">Confirmed</span>
      </div>

      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Customer</p>
          <p className="mt-1 font-semibold text-gray-900">Eleanor Vance</p>
          <p className="text-xs text-gray-500">vance.e@example.com</p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Event</p>
          <p className="mt-1 font-semibold text-gray-900">The Sterling-Vance Wedding</p>
          <p className="text-xs text-gray-500">Oct 24, 2024 · 6:00 PM · Estate at Rosewood</p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Assigned Services</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="border border-[#E0D8C3] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7C6A2E]">Diamond Premium</span>
            <span className="border border-[#E0D8C3] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7C6A2E]">Crystal Stage</span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Notes</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Client requested a refined entrance sequence and a late-evening spotlight set.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Booking Status</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C6A2E]">Confirmed</p>
        </div>
      </div>
    </article>
  );
};

export default BookingDetailsModal;
