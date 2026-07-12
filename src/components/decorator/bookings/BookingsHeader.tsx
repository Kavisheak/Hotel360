import React from 'react';

const BookingsHeader = () => {
  return (
    <div className="mb-8 mt-4">
      <div className="max-w-3xl">
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
          <span>PORTAL</span>
          <span className="text-gray-400">›</span>
          <span className="text-[#7C6A2E]">ASSIGNED BOOKINGS</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
          Assigned Bookings
        </h1>
        
        <p className="text-sm text-gray-500 leading-relaxed font-sans">
          Jobs assigned to you by the manager or from customer bookings. Review requirements and mark as ready once preparations are finalized.
        </p>
      </div>
    </div>
  );
};

export default BookingsHeader;
