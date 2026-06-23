import React from 'react';
import { FileText, Edit } from 'lucide-react';
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

      {/* Buttons */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button 
          onClick={() => alert("Downloading PDF Brief... (Placeholder)")}
          className="flex items-center space-x-2 border border-[#7C6A2E] text-[#7C6A2E] px-4 py-2.5 text-xs font-bold tracking-[0.15em] hover:bg-[#FDF9F1] transition-colors shrink-0"
        >
          <FileText size={14} />
          <span>DOWNLOAD PDF BRIEF</span>
        </button>
        <button 
          onClick={() => {
            const newProgress = prompt("Enter new setup progress percentage (0-100):");
            if (newProgress !== null) {
              alert(`Progress updated to ${newProgress}%! (Placeholder)`);
            }
          }}
          className="flex items-center space-x-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-5 py-2.5 text-xs font-bold tracking-[0.15em] transition-colors shadow-sm shrink-0"
        >
          <Edit size={14} />
          <span>EDIT PROGRESS</span>
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;
