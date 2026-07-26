import React from 'react';
import { CalendarDays, ChevronRight } from 'lucide-react';

const BookingsHeader = ({ booking }: { booking: any }) => (
  <div className="mb-6">
    {/* Breadcrumb */}
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
      <span>Bookings</span>
      <ChevronRight size={12} />
      <span className="text-[#B08D2C]">Details</span>
      <ChevronRight size={12} />
      <span className="text-gray-600 font-mono">{booking.id}</span>
    </div>

    {/* Title row */}
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div>
        <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-800 leading-tight">
          {booking.eventName || booking.eventType || 'Wedding'}
        </h2>
        <p className="text-sm italic text-[#A6955C] mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {booking.clientName}
        </p>
      </div>

      {/* Status + Date badges */}
      <div className="flex items-center gap-3 shrink-0">
        <div className={`border px-3 py-2 text-center ${
          booking.status === 'Pending' || booking.status === 'Pending Hall Confirmation' || booking.status === 'Pending Confirmation' ? 'bg-[#F2EADA] border-[#E0D8C3] text-[#7C6A2E]' :
          booking.status === 'Confirmed' ? 'bg-green-50 border-green-200 text-green-700' :
          'bg-white border-gray-200 text-gray-700'
        }`}>
          <p className="text-[9px] font-bold uppercase tracking-widest">{booking.status === 'Pending Hall Confirmation' ? 'Awaiting Hall' : booking.status}</p>
          <p className="text-[9px] font-bold uppercase tracking-widest">Status</p>
        </div>
        <div className="bg-white border border-[#E0D8C3] px-3 py-2 flex items-center gap-2">
          <CalendarDays size={13} className="text-[#B08D2C]" />
          <div>
            <p className="text-[10px] font-semibold text-gray-800 leading-tight">{booking.date}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default BookingsHeader;
