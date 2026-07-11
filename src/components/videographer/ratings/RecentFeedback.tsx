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

<<<<<<< Updated upstream
const reviewsData: Review[] = [
  {
    name: 'Eleanor Sterling',
    event: 'STERLING-VANCE WEDDING FILM',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120',
    rating: 5,
    comment: '"The wedding film exceeded every expectation. Every glance, every tear, every laugh was captured with breathtaking precision. The cinematic style, the colour grading, and the music selection created an emotional masterpiece that we will treasure forever. A. Malik and his team are truly gifted storytellers."',
    tags: ['Cinematic Wedding', 'Full-Day Coverage']
  },
  {
    name: 'James Harrison',
    event: 'HARRISON CORPORATE SUMMIT 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120',
    rating: 5,
    comment: '"Outstanding professional videography service for our annual summit. The highlight reel was polished, on-brand, and delivered ahead of schedule. The team captured every keynote, panel discussion, and networking moment seamlessly. Highly recommended for corporate events of any scale."',
    tags: ['Corporate Event', 'Event Highlight Reel']
  },
  {
    name: 'Amara Okafor',
    event: 'OKAFOR ENGAGEMENT SESSION',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120',
    rating: 5,
    comment: '"Our engagement session was pure magic. A. Malik made us feel completely at ease in front of the camera, and the final video was like a short film — warm, intimate, and beautifully lit. We cannot wait to see what he creates for our wedding day. Truly exceptional talent."',
    tags: ['Engagement Session', 'Pre-Wedding Shoot']
  },
  {
    name: 'Richard Montague',
    event: 'MONTAGUE 25TH ANNIVERSARY',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120',
    rating: 4,
    comment: '"A beautifully crafted anniversary film that perfectly captured 25 years of love and family. The documentary-style approach was exactly what we wanted. Minor delays in final delivery, but the quality of the final product more than compensated. An incredibly talented videographer."',
    tags: ['Anniversary Event', 'Documentary Style']
  },
];

const RecentFeedback = () => {
=======
const RecentFeedback = ({ reviews, loading }: { reviews: any[]; loading: boolean }) => {
  const [reviewsData, setReviewsData] = useState<Review[]>([]);

  useEffect(() => {
    if (reviews && Array.isArray(reviews)) {
      const mappedReviews = reviews.map((r: any) => ({
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
  }, [reviews]);

  const getAvatarUrl = (avatarUrl: string) => {
    if (!avatarUrl) return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120";
    if (avatarUrl.startsWith('http')) return avatarUrl;
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${base}${avatarUrl}`;
  };

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      {/* Review cards */}
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
=======
      {loading ? (
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
                      src={getAvatarUrl(review.avatar)}
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
>>>>>>> Stashed changes
                </div>
              </div>

              <div className="flex space-x-0.5 shrink-0 self-start sm:self-auto">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#B08D2C] fill-[#B08D2C]" />
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-[#E0D8C3]" />
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
    </div>
  );
};

export default RecentFeedback;
