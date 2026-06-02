import React from 'react';
import { Star } from 'lucide-react';

const RatingsStats = () => {
  const distribution = [
    { stars: 5, count: 126, percentage: 85 },
    { stars: 4, count: 15, percentage: 10 },
    { stars: 3, count: 4, percentage: 3 },
    { stars: 2, count: 2, percentage: 1.5 },
    { stars: 1, count: 1, percentage: 0.5 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      {/* Overall Rating Card (1/3 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          OVERALL RATING
        </p>
        
        {/* Rating Score */}
        <h2 className="text-6xl font-serif text-[#7C6A2E] font-bold tracking-tight mb-2">
          4.9
        </h2>

        {/* 5 Stars */}
        <div className="flex space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} className="text-[#B08D2C] fill-[#B08D2C]" />
          ))}
        </div>

        {/* Total verified count */}
        <p className="text-xs text-gray-500 font-medium italic">
          Based on 148 verified client reviews
        </p>
      </div>

      {/* Rating Distribution Card (2/3 width on desktop) */}
      <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm lg:col-span-2">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 border-b border-gray-50 pb-2">
          Rating Distribution
        </h3>

        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center text-xs font-semibold text-gray-600">
              {/* Star Label */}
              <span className="w-12 shrink-0">{item.stars} Star</span>

              {/* Progress Bar Container */}
              <div className="flex-1 h-2 bg-[#FAF6EE] border border-[#E0D8C3] mx-4 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-[#B08D2C]"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Count */}
              <span className="w-8 text-right text-gray-800">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsStats;
