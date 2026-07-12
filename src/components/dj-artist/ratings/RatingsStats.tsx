import React from 'react';
import { Star } from 'lucide-react';

const RatingsStats = ({ stats, loading }: { stats?: any; loading?: boolean }) => {
  const totalReviews = stats?.totalReviews ?? 0;
  const averageRating = stats?.averageRating ?? 0;
  const dist = stats?.distribution ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = dist[stars] || 0;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  const filledStars = Math.round(averageRating);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
      <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          OVERALL RATING
        </p>
        <h2 className="text-6xl font-serif text-[#7C6A2E] font-bold tracking-tight mb-2">
          {loading ? "—" : averageRating > 0 ? averageRating.toFixed(1) : "—"}
        </h2>
        <div className="flex space-x-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={16}
              className={i <= filledStars ? "text-[#B08D2C] fill-[#B08D2C]" : "text-[#E0D8C3]"}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 font-medium italic">
          {loading
            ? "Loading reviews..."
            : totalReviews > 0
            ? `Based on ${totalReviews} verified client review${totalReviews !== 1 ? "s" : ""}`
            : "No reviews yet"}
        </p>
      </div>

      <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm lg:col-span-2">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 border-b border-gray-50 pb-2">
          Rating Distribution
        </h3>
        <div className="space-y-4">
          {distribution.map((item) => (
            <div key={item.stars} className="flex items-center text-xs font-semibold text-gray-600">
              <span className="w-12 shrink-0">{item.stars} Star</span>
              <div className="flex-1 h-2 bg-[#FAF6EE] border border-[#E0D8C3] mx-4 rounded-sm overflow-hidden">
                <div className="h-full bg-[#B08D2C]" style={{ width: `${item.percentage}%` }} />
              </div>
              <span className="w-8 text-right text-gray-800">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsStats;
