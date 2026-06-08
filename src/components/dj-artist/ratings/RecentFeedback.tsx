import React from 'react';
import { Star, SlidersHorizontal } from 'lucide-react';

interface Review {
  name: string;
  event: string;
  avatar: string;
  rating: number;
  comment: string;
  tags: string[];
}

const reviewsData: Review[] = [
  {
    name: 'Eleanor Vance',
    event: 'VANCE HARLOW WEDDING RECEPTION',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120',
    rating: 5,
    comment: '“The DJ performance was absolutely outstanding. The music flow perfectly matched the event atmosphere, from soft background music during dinner to an energetic dance set later in the night. The transitions were smooth and professional, keeping the guests fully engaged throughout the event.”',
    tags: ['Wedding DJ', 'Music Mixing']
  },
  {
    name: 'Julian Sterling',
    event: 'STERLING EXECUTIVE SUMMIT 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120',
    rating: 5,
    comment: '“Excellent DJ service for our corporate summit. The audio setup was clear, professional, and perfectly balanced. Background music during networking sessions was subtle and appropriate, and the transition into event highlights was seamless.”',
    tags: ['Corporate Event', 'Professional DJ']
  },
  {
    name: 'Amara Okafor',
    event: 'OKAFOR-DUMONT WEDDING CELEBRATION',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120',
    rating: 5,
    comment: '“The DJ created an unforgettable experience for our wedding. Every song selection matched the mood perfectly, and the crowd was energized all night. There was a slight delay in setup, but the final performance more than made up for it. Highly recommended.”',
    tags: ['Wedding DJ', 'Live Mixing']
  }
];

const RecentFeedback = () => {
  return (
    <div>
      {/* List Header */}
      <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-3 mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900">
          Recent Feedback
        </h3>
        
        {/* Sort trigger */}
        <button className="flex items-center space-x-1.5 text-[10px] font-bold tracking-widest text-[#7C6A2E] hover:text-[#9B7A20] uppercase transition-colors">
          <SlidersHorizontal size={12} />
          <span>NEWEST FIRST</span>
        </button>
      </div>

      {/* Review cards vertical layout */}
      <div className="space-y-6 mb-8">
        {reviewsData.map((review, idx) => (
          <div 
            key={idx} 
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

              {/* Star rating alignment */}
              <div className="flex space-x-0.5 shrink-0 self-start sm:self-auto">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#B08D2C] fill-[#B08D2C]" />
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

      {/* Load More Reviews Button */}
      <div className="flex justify-center my-12">
        <button className="border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] px-8 py-3 text-xs font-bold tracking-widest transition-colors uppercase">
          LOAD MORE REVIEWS
        </button>
      </div>
    </div>
  );
};

export default RecentFeedback;
