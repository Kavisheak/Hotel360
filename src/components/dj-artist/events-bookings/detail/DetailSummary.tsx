import React from 'react';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';

interface DetailSummaryProps {
  date: string;
  guests: string;
  setWindow: string;
  venue: string;
}

const DetailSummary = ({ date, guests, setWindow, venue }: DetailSummaryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
        <Calendar size={18} className="text-[#B08D2C] mb-3" />
        <div>
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-1">EVENT DATE</p>
          <p className="text-lg font-serif font-bold text-gray-900 leading-tight">{date}</p>
        </div>
      </div>
      <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
        <Users size={18} className="text-[#B08D2C] mb-3" />
        <div>
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-1">GUEST COUNT</p>
          <p className="text-lg font-serif font-bold text-gray-900 leading-tight">{guests}</p>
        </div>
      </div>
      <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
        <Clock size={18} className="text-[#B08D2C] mb-3" />
        <div>
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-1">SET WINDOW</p>
          <p className="text-lg font-serif font-bold text-gray-900 leading-tight">{setWindow}</p>
        </div>
      </div>
      <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
        <MapPin size={18} className="text-[#B08D2C] mb-3" />
        <div>
          <p className="text-[9px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-1">VENUE</p>
          <p className="text-lg font-serif font-bold text-gray-900 leading-tight">{venue}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailSummary;
