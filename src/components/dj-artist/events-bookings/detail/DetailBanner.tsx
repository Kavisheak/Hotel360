import React from 'react';
import { Mail, Music } from 'lucide-react';

interface DetailBannerProps {
  code: string;
  status: string;
  confirmedDate: string;
  djPackage: string;
}

const DetailBanner = ({ code, status, confirmedDate, djPackage }: DetailBannerProps) => {
  const statusStyle =
    status === 'Accepted'
      ? 'bg-[#EAF0F6] text-[#3F6897] border border-[#DCE6EE]'
      : status === 'Completed'
      ? 'bg-[#EAF4EC] text-[#2E7A3E] border border-[#D8EBD9]'
      : status === 'Declined'
      ? 'bg-[#FDE8E8] text-[#9B3434] border border-[#F5D4D4]'
      : 'bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2]';

  return (
    <div className="relative overflow-hidden bg-[#FAF6EE] border border-[#E0D8C3] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-sm">
      {/* Decorative vinyl record silhouette */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.04] pointer-events-none hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#7C6A2E]">
          <circle cx="50" cy="50" r="48" />
          <circle cx="50" cy="50" r="28" className="fill-[#FDF9F1]" />
          <circle cx="50" cy="50" r="8" className="fill-[#7C6A2E]" />
        </svg>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Music size={28} className="text-[#B08D2C] shrink-0" />
          <h2 className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">#{code}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded-sm ${statusStyle}`}>{status}</span>
          <span className="text-xs font-serif italic text-gray-500">Confirmed {confirmedDate}</span>
        </div>
        <p className="text-xs font-semibold text-gray-500 tracking-wide italic border-l-2 border-[#B08D2C] pl-3">{djPackage}</p>
      </div>

      <button className="flex items-center space-x-2 text-[11px] font-bold tracking-[0.15em] text-[#7C6A2E] hover:text-[#9B7A20] uppercase transition-colors shrink-0 self-start sm:self-auto border-b border-[#7C6A2E] pb-0.5 hover:border-[#9B7A20]">
        <Mail size={14} />
        <span>MESSAGE CLIENT</span>
      </button>
    </div>
  );
};

export default DetailBanner;
