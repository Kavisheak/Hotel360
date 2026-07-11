import React from 'react';
import Link from 'next/link';

const DetailHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-4">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase">
        <Link href="/decorator" className="hover:text-[#7C6A2E] hover:underline transition-colors cursor-pointer">MY JOBS</Link>
        <span className="text-gray-400">›</span>
        <span className="text-[#7C6A2E]">BOOKING DETAILS</span>
      </div>
    </div>
  );
};

export default DetailHeader;
