"use client";

import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../../../lib/api';

const EventDistribution = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [legend, setLegend] = useState([
    { label: 'Weddings', value: '0%', color: 'bg-[#7C6A2E]' },
    { label: 'Corporate', value: '0%', color: 'bg-[#E0D8C3]' },
    { label: 'Social Galas', value: '0%', color: 'bg-[#F2EADA]' },
  ]);
  const [gradient, setGradient] = useState('conic-gradient(#7C6A2E 0% 100%)');

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await bookingAPI.getAllBookings();
      if (res.ok) {
        const bookings = res.data.data;
        
        let validEvents = 0;
        let weddings = 0;
        let corporate = 0;
        let social = 0;

        bookings.forEach((b: any) => {
          if (b.status !== "Cancelled" && b.status !== "Rejected") {
            validEvents++;
            const type = (b.eventType || "").toLowerCase();
            if (type.includes("wedding") || type.includes("celebration") || type.includes("gold") || type.includes("diamond")) {
              weddings++;
            } else if (type.includes("corporate") || type.includes("business") || type.includes("conference") || type.includes("gala")) {
              corporate++;
            } else {
              social++;
            }
          }
        });

        setTotalEvents(validEvents);

        if (validEvents > 0) {
          const wedPct = Math.round((weddings / validEvents) * 100);
          const corpPct = Math.round((corporate / validEvents) * 100);
          const socPct = 100 - wedPct - corpPct;

          setLegend([
            { label: 'Weddings', value: `${wedPct}%`, color: 'bg-[#7C6A2E]' },
            { label: 'Corporate', value: `${corpPct}%`, color: 'bg-[#E0D8C3]' },
            { label: 'Social Galas', value: `${socPct}%`, color: 'bg-[#F2EADA]' },
          ]);

          setGradient(`conic-gradient(#7C6A2E 0% ${wedPct}%, #E0D8C3 ${wedPct}% ${wedPct + corpPct}%, #F2EADA ${wedPct + corpPct}% 100%)`);
        } else {
          setGradient('conic-gradient(#E0D8C3 0% 100%)');
        }
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-serif font-semibold text-gray-800 mb-6">Event Distribution</h3>
      
      <div className="flex-1 flex flex-col justify-center">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 lg:w-48 lg:h-48 mx-auto mb-8 rounded-full flex items-center justify-center transition-all duration-1000"
             style={{ background: gradient }}>
          <div className="w-28 h-28 lg:w-36 lg:h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-xl lg:text-2xl font-serif font-bold text-gray-800">{totalEvents}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Events</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {legend.map((l, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-1 h-4 ${l.color}`} />
                <span className="text-xs font-semibold text-gray-700">{l.label}</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{l.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDistribution;
