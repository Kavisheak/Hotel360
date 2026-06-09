"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

const PendingBookings = () => {
  const [isClient, setIsClient] = useState(false);
  const pendingBookings = useBookingStore(state => state.getPendingBookings());
  const updateBookingStatus = useBookingStore(state => state.updateBookingStatus);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
  <section className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="flex items-center gap-2 text-base lg:text-lg font-serif font-semibold text-[#7C6A2E]">
        <BookOpen size={18} className="text-[#B08D2C]" />
        Pending Bookings
      </h3>
      <button className="bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-semibold tracking-widest uppercase px-4 py-2 rounded-md transition-colors whitespace-nowrap ml-4">
        View All Queue
      </button>
    </div>

    <div className="bg-white border border-[#E0D8C3] rounded-xl overflow-hidden shadow-sm">
      {/* Table for desktop */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-left border-collapse">
          <thead className="bg-[#B08D2C] text-white">
            <tr>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest">Client Name</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest">Event Type</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest">Date</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest">Status</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isClient && pendingBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 font-light italic">
                  No pending bookings in the queue.
                </td>
              </tr>
            ) : isClient ? (
              pendingBookings.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-[#F2EADA] hover:bg-[#FDF9F1] transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#FDFAF5]'}`}
                >
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{row.clientName}</td>
                  <td className="px-4 py-3 text-sm italic font-medium text-gray-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{row.eventType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
                  <td className="px-4 py-3">
                    <span className="bg-[#F2EADA] text-[#7C6A2E] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-[#E0D8C3]">
                      Pending
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button 
                      onClick={() => updateBookingStatus(row.id, "Confirmed")}
                      className="text-[#7C6A2E] hover:underline text-[10px] font-bold uppercase tracking-widest"
                    >
                      Approve
                    </button>
                    <span className="text-[#E0D8C3]">|</span>
                    <button 
                      onClick={() => updateBookingStatus(row.id, "Rejected")}
                      className="text-red-500 hover:underline text-[10px] font-bold uppercase tracking-widest"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
      </div>
    </div>
  </section>
  );
};

export default PendingBookings;
