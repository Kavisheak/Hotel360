import React from 'react';

const legend = [
  { label: 'Weddings', value: '65%', color: 'bg-[#7C6A2E]' },
  { label: 'Corporate', value: '25%', color: 'bg-[#E0D8C3]' },
  { label: 'Social Galas', value: '10%', color: 'bg-[#F2EADA]' },
];

const EventDistribution = () => (
  <div className="bg-white border border-[#E0D8C3] p-5 shadow-sm h-full flex flex-col">
    <h3 className="text-lg font-serif font-semibold text-gray-800 mb-6">Event Distribution</h3>
    
    <div className="flex-1 flex flex-col justify-center">
      {/* Donut Chart */}
      <div className="relative w-40 h-40 lg:w-48 lg:h-48 mx-auto mb-8 rounded-full flex items-center justify-center"
           style={{ background: 'conic-gradient(#7C6A2E 0% 65%, #E0D8C3 65% 90%, #F2EADA 90% 100%)' }}>
        <div className="w-28 h-28 lg:w-36 lg:h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span className="text-xl lg:text-2xl font-serif font-bold text-gray-800">142</span>
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

export default EventDistribution;
