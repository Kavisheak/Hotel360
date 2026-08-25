"use client";
import React from 'react';
import { Video } from 'lucide-react';

interface DetailBannerProps {
  code: string;
  status: string;
  confirmedDate: string;
  videoPackage: string;
  phone?: string;
}

const DetailBanner = ({ code, status, confirmedDate, videoPackage, phone }: DetailBannerProps) => {
  const handleWhatsApp = () => {
    if (phone) {
      const cleaned = phone.replace(/[^\d]/g, '');
      window.open(`https://wa.me/${cleaned}`, '_blank');
    }
  };
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
      {/* Decorative film reel background */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.03] pointer-events-none hidden md:block">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-[#7C6A2E]">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="30" className="fill-[#FDF9F1]" />
          <circle cx="50" cy="50" r="10" className="fill-[#7C6A2E]" />
        </svg>
      </div>

      <div className="space-y-3">
        {/* Video icon + booking ID */}
        <div className="flex items-center gap-3">
          <Video size={28} className="text-[#B08D2C] shrink-0" />
          <h2 className="text-4xl sm:text-5xl font-serif text-[#7C6A2E] font-bold tracking-tight">
            #{code}
          </h2>
        </div>

        {/* Status + Confirmation date */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-[9px] font-bold tracking-widest px-3 py-1 rounded-sm ${statusStyle}`}>
            {status}
          </span>
          <span className="text-xs font-serif italic text-gray-500">
            Confirmed {confirmedDate}
          </span>
        </div>

        {/* Video Package */}
        <p className="text-xs font-semibold text-gray-500 tracking-wide italic border-l-2 border-[#B08D2C] pl-3">
          {videoPackage}
        </p>
      </div>

      {/* Message Client */}
      <button 
        onClick={handleWhatsApp}
        className="flex items-center space-x-2 text-[11px] font-bold tracking-[0.15em] text-[#25D366] hover:text-[#1ebe5a] uppercase transition-colors shrink-0 self-start sm:self-auto border-b border-[#25D366] pb-0.5 hover:border-[#1ebe5a]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span>MESSAGE CLIENT</span>
      </button>
    </div>
  );
};

export default DetailBanner;
