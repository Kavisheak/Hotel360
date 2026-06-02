import React from 'react';

const NewEventHeader = () => {
  return (
    <div className="mb-8 mt-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
        <span>HOME</span>
        <span className="text-gray-400">›</span>
        <span>BOOKINGS</span>
        <span className="text-gray-400">›</span>
        <span className="text-[#7C6A2E]">NEW EVENT</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
        CREATE NEW EVENT
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 leading-relaxed font-sans">
        Designing unforgettable experiences for the elite.
      </p>
    </div>
  );
};

export default NewEventHeader;
