import React from 'react';
import { Star, SlidersHorizontal } from 'lucide-react';
import { getApiImageUrl } from '@/lib/vendorUtils';

const RecentFeedback = ({ reviews, loading }: { reviews?: any[]; loading?: boolean }) => {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-3 mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900">Recent Feedback</h3>
        <button className="flex items-center space-x-1.5 text-[10px] font-bold tracking-widest text-[#7C6A2E] hover:text-[#9B7A20] uppercase transition-colors">
          <SlidersHorizontal size={12} />
          <span>NEWEST FIRST</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-gray-500 animate-pulse">Loading reviews...</div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-500 font-serif italic">
          No client reviews yet. Reviews appear after completed events.
        </div>
      ) : (
        <div className="space-y-6 mb-8">
          {reviews.map((review) => {
            const name = review.customerId
              ? `${review.customerId.firstName || ""} ${review.customerId.lastName || ""}`.trim()
              : "Client";
            const avatar = getApiImageUrl(review.customerId?.avatar) ||
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120";
            const comment = review.reviewText
              ? `"${review.reviewText}"`
              : '"No comment provided."';
            const event =
              review.bookingId?.eventType ||
              (review.bookingId?.clientName ? `${review.bookingId.clientName}'s Event` : "DJ Performance");
            const tags = review.tags?.length ? review.tags : ["DJ Artist"];

            return (
              <div
                key={review._id}
                className="bg-white border border-[#E0D8C3] p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border border-[#E0D8C3]" />
                    <div>
                      <h4 className="text-base font-serif font-bold text-gray-900 leading-tight">{name}</h4>
                      <p className="text-[9px] font-bold tracking-wider text-[#A6955C] mt-0.5 uppercase">{event}</p>
                    </div>
                  </div>
                  <div className="flex space-x-0.5 shrink-0">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-[#B08D2C] fill-[#B08D2C]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5 font-medium pl-1">{comment}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold tracking-wider border border-[#E0D8C3] bg-[#FAF6EE] text-[#7C6A2E] px-3 py-1 rounded-sm uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentFeedback;
