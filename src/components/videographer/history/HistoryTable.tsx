import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const events = [
  { date: 'Oct 14, 2024', name: 'Siddiqui Royal Nikah', customer: 'Mr. & Mrs. Farhan Siddiqui', package: 'CINEMA GOLD', rating: 5 },
  { date: 'Oct 08, 2024', name: 'Malik Mehndi Gala', customer: 'Zainab Malik', package: 'SIGNATURE FILM', rating: 5 },
  { date: 'Sep 29, 2024', name: 'Khan Valima Reception', customer: 'Bilal Khan', package: 'ELITE COVERAGE', rating: 4 },
  { date: 'Sep 15, 2024', name: 'Ahmed Engagement', customer: 'Sara Ahmed', package: 'SOCIAL REEL', rating: 4 },
];

const RatingStars = ({ count }: { count: number }) => (
  <div className="flex space-x-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={13} className={i <= count ? 'text-[#B08D2C] fill-[#B08D2C]' : 'text-[#D9CDB0]'} />
    ))}
  </div>
);

const HistoryTable = () => {
  return (
    <div className="border border-[#E0D8C3] overflow-hidden mb-8">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#685724] text-white">
              {['DATE', 'EVENT NAME', 'CUSTOMER', 'PACKAGE', 'RATING', 'ACTION'].map((col) => (
                <th key={col} className="px-5 py-4 text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr key={idx} className="border-t border-[#E0D8C3] bg-white hover:bg-[#FDF9F1] transition-colors">
                <td className="px-5 py-5 text-xs text-gray-500 font-medium whitespace-nowrap align-top">{event.date}</td>
                <td className="px-5 py-5 align-top">
                  <span className="text-base font-serif font-bold text-[#7C6A2E] leading-snug">{event.name}</span>
                </td>
                <td className="px-5 py-5 text-sm text-gray-600 align-top whitespace-nowrap">{event.customer}</td>
                <td className="px-5 py-5 align-top">
                  <span className="border border-[#B08D2C] text-[#7C6A2E] px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase whitespace-pre-wrap leading-tight block w-fit">
                    {event.package.replace(' ', '\n')}
                  </span>
                </td>
                <td className="px-5 py-5 align-top">
                  <RatingStars count={event.rating} />
                </td>
                <td className="px-5 py-5 align-top">
                  <button className="text-[10px] font-bold tracking-[0.15em] text-gray-700 hover:text-[#7C6A2E] uppercase transition-colors underline underline-offset-2">
                    VIEW DETAILS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden bg-white divide-y divide-[#E0D8C3]">
        {events.map((event, idx) => (
          <div key={idx} className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-base font-serif font-bold text-[#7C6A2E]">{event.name}</span>
              <span className="text-[9px] border border-[#B08D2C] text-[#7C6A2E] px-2 py-0.5 font-bold tracking-widest uppercase ml-2 shrink-0">
                {event.package}
              </span>
            </div>
            <p className="text-xs text-gray-500">{event.date} &bull; {event.customer}</p>
            <div className="flex items-center justify-between">
              <RatingStars count={event.rating} />
              <button className="text-[10px] font-bold tracking-widest text-gray-700 hover:text-[#7C6A2E] uppercase underline underline-offset-2 transition-colors">
                VIEW DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E0D8C3] bg-white flex items-center justify-between px-5 py-4">
        <p className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">SHOWING 1–4 OF 124 EVENTS</p>
        <div className="flex space-x-2">
          <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">
            <ChevronLeft size={14} />
          </button>
          <button className="border border-[#E0D8C3] p-2 hover:bg-[#F2EADA] transition-colors text-gray-500 hover:text-gray-800">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
