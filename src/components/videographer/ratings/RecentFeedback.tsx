"use client";

import React, { useState, useEffect } from 'react';
import { Star, SlidersHorizontal, Loader2 } from 'lucide-react';
import { videographerAPI } from '@/lib/api';

interface Review {
  id: string;
  name: string;
  event: string;
  avatar: string;
  rating: number;
  comment: string;
  tags: string[];
}

const RecentFeedback = () => {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { ok, data } = await videographerAPI.getRatings();
        if (ok && data.success && data.data && Array.isArray(data.data.reviews)) {
          const mappedReviews = data.data.reviews.map((r: any) => ({
            id: r._id,
            name: r.customerId ? `${r.customerId.firstName} ${r.customerId.lastName}`.trim() : "Customer",
            event: "Videography Service",
            avatar: r.customerId?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120",
            rating: r.rating || 5,
            comment: r.reviewText ? `"${r.reviewText}"` : '"No comment provided."',
            tags: ["Videography"]
          }));
          setReviewsData(mappedReviews);
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div>
      {/* List Header */}
      <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-3 mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900">
          Recent Feedback
        </h3>

        <button className="flex items-center space-x-1.5 text-[10px] font-bold tracking-widest text-[#7C6A2E] hover:text-[#9B7A20] uppercase transition-colors">
          <SlidersHorizontal size={12} />
          <span>NEWEST FIRST</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#B08D2C]" size={32} />
        </div>
      ) : reviewsData.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No feedback received yet.
        </div>
      ) : (
        <>
          {/* Review cards */}
          <div className="space-y-6 mb-8">
            {reviewsData.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-[#E0D8C3] p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                {/* Top row: Profile & Star Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#E0D8C3]"
                    />
                    <div>
                      <h4 className="text-base font-serif font-bold text-gray-900 leading-tight">
                        {review.name}
                      </h4>
                      <p className="text-[9px] font-bold tracking-wider text-[#A6955C] mt-0.5 uppercase">
                        {review.event}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-0.5 shrink-0 self-start sm:self-auto">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={`filled-${i}`} size={14} className="text-[#B08D2C] fill-[#B08D2C]" />
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                      <Star key={`empty-${i}`} size={14} className="text-[#E0D8C3]" />
                    ))}
                  </div>
                </div>

                {/* Comment Section */}
                <p className="text-xs sm:text-sm font-sans text-gray-600 leading-relaxed mb-5 font-medium pl-1">
                  {review.comment}
                </p>

                {/* Bottom tags */}
                <div className="flex flex-wrap gap-2">
                  {review.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold tracking-wider border border-[#E0D8C3] bg-[#FAF6EE] text-[#7C6A2E] px-3 py-1 rounded-sm uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center my-12">
            <button className="border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] px-8 py-3 text-xs font-bold tracking-widest transition-colors uppercase">
              LOAD MORE REVIEWS
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentFeedback;
