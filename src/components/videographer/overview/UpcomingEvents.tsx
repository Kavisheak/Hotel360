import React from 'react';

interface UpcomingEventProps {
  date: string;
  month: string;
  status: string;
  title: string;
  venue: string;
  details: string;
  progress: number;
}

const UpcomingEvent = ({ date, month, status, title, venue, details, progress }: UpcomingEventProps) => {
  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-[#4A463B] text-white w-12 h-14 flex flex-col justify-center items-center">
          <span className="text-lg font-bold font-serif leading-none">{date}</span>
          <span className="text-[8px] font-bold tracking-widest">{month}</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{status}</span>
      </div>

      <div>
        <h3 className="text-2xl font-serif text-gray-800 tracking-tight leading-tight mb-2">{title}</h3>
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">
          <span>{venue}</span>
          <span>·</span>
          <span>{details}</span>
        </div>
      </div>

      <div className="flex space-x-1 mt-auto pt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < progress ? 'bg-[#7C6A2E]' : 'bg-[#E0D8C3]'}`}
          />
        ))}
      </div>
    </div>
  );
};

const UpcomingEvents = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UpcomingEvent
        date="18"
        month="SEPT"
        status="BRIEFING SENT"
        title="Fatima's Engagement Reel"
        venue="ELITE BALLROOM"
        details="120 GUESTS"
        progress={1}
      />
      <UpcomingEvent
        date="22"
        month="SEPT"
        status="ON SITE"
        title="Corporate Gala 2024"
        venue="ROOFTOP GARDEN"
        details="200 GUESTS"
        progress={2}
      />
    </div>
  );
};

export default UpcomingEvents;
