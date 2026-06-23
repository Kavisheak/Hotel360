import React from 'react';
import { Mail } from 'lucide-react';

interface DetailBannerProps {
  code: string;
  status: string;
  confirmedDate: string;
  clientEmail: string;
}

const DetailBanner = ({ code, status, confirmedDate, clientEmail }: DetailBannerProps) => {
  return (
    <div className="relative overflow-hidden bg-[#FAF6EE] border border-[#E0D8C3] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
      {/* Decorative Star background (simulated using CSS SVG shapes for absolute premium luxury feel) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.03] pointer-events-none hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#7C6A2E]">
          <path d="M50 0 L63 37 L100 50 L63 63 L50 100 L37 63 L0 50 L37 37 Z" />
        </svg>
      </div>

      <div className="space-y-3">
        {/* Event ID */}
        <h2 className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
          {code}
        </h2>
        
        {/* Status & Confirmation date */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[9px] font-bold tracking-widest bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2] px-3 py-1 rounded-sm">
            {status}
          </span>
          <span className="text-xs font-serif italic text-gray-500">
            Confirmed {confirmedDate}
          </span>
        </div>
      </div>

      {/* Message Client Link */}
      <a href={`mailto:${clientEmail}`} className="flex items-center space-x-2 text-[11px] font-bold tracking-[0.15em] text-[#7C6A2E] hover:text-[#9B7A20] uppercase transition-colors shrink-0 self-start sm:self-auto border-b border-[#7C6A2E] pb-0.5 hover:border-[#9B7A20]">
        <Mail size={14} />
        <span>MESSAGE CLIENT</span>
      </a>
    </div>
  );
};

export default DetailBanner;
