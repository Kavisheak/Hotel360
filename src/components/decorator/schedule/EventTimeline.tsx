import React from 'react';
import { MapPin } from 'lucide-react';

interface EventTimelineProps {
  bookings?: any[];
}

const EventTimeline = ({ bookings = [] }: EventTimelineProps) => {
  // Get today's date formatted
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // For demonstration, let's just show up to 3 upcoming bookings 
  const upcomingBookings = bookings
    .filter(b => new Date(b.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-[#F2EBE1] border border-[#E0D8C3] flex flex-col h-full">
      {/* Date Header */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 border-b border-[#E0D8C3]">
        <h2 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold tracking-tight mb-1">
          {dateStr}
        </h2>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">{upcomingBookings.length} EVENTS UPCOMING</p>
      </div>

      {/* Events */}
      <div className="flex-1 px-6 sm:px-8 py-6 relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[27px] sm:left-[35px] top-6 bottom-0 w-px bg-[#E0D8C3]" />

        <div className="space-y-6 relative">

          {upcomingBookings.length === 0 ? (
            <div className="text-sm text-gray-500 italic py-8 text-center">No upcoming events scheduled.</div>
          ) : (
            upcomingBookings.map((b, idx) => {
              const eventDate = new Date(b.date);
              const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              const colors = ['bg-[#B08D2C]', 'bg-[#F3CE5A]', 'bg-[#C4BCAB]'];
              const dotColor = colors[idx % colors.length];

              return (
                <div key={b._id} className="relative pl-8 sm:pl-10">
                  <div className={`absolute left-[-6px] top-3.5 w-3 h-3 rounded-full ${dotColor} z-10 shrink-0 border-2 border-[#F2EBE1]`} />
                  <div className="bg-white border border-[#E0D8C3] p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <span className="text-[11px] font-bold text-[#7C6A2E] tracking-wider">{eventDate.toLocaleDateString()} at {timeStr}</span>
                      <span className="bg-[#EBE5D9] text-gray-600 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">{b.vendors?.decorator?.status || 'PENDING'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 font-serif">{b.clientName} - {b.eventType}</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed font-serif">
                      {b.vendors?.decorator?.checklist?.filter((c:any) => !c.isCompleted).length || 0} tasks remaining for preparation.
                    </p>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 sm:p-8 pt-4 border-t border-[#E0D8C3] flex space-x-3">
        <button className="flex-1 bg-[#EBE5D9] hover:bg-[#E0D8C3] text-gray-700 py-3 font-semibold text-xs tracking-[0.15em] transition-colors">
          VIEW ALL
        </button>
        <button className="flex-1 bg-[#685724] hover:bg-[#4A463B] text-white py-3 font-semibold text-xs tracking-[0.15em] transition-colors shadow-md">
          ADD ENTRY
        </button>
      </div>
    </div>
  );
};

export default EventTimeline;
