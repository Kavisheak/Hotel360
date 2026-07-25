import React from 'react';
import { Star } from 'lucide-react';

const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      quote: "Our wedding was an absolute dream. The attention to detail, from the crystal chandeliers to the flawless service, made it an evening we will never forget.",
      author: "Samantha & Michael",
      role: "Married November 2025"
    },
    {
      id: 2,
      quote: "The culinary team outdid themselves. Every dish was a masterpiece, and the staff anticipated our every need before we even had to ask.",
      author: "David Perera",
      role: "Father of the Bride"
    },
    {
      id: 3,
      quote: "We looked at venues across the country, but nothing compared to the intimacy and grandeur of this ballroom. It truly felt like the space was ours alone.",
      author: "Anjali & Kevin",
      role: "Married January 2026"
    }
  ];

  return (
    <section className="w-full bg-white py-20 md:py-28 px-6 md:px-12 lg:px-20 flex flex-col items-center section-reveal">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-[1px] bg-[#C9A84C]/60"></div>
          <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase font-bold">
            Words of Praise
          </p>
          <div className="w-12 h-[1px] bg-[#C9A84C]/60"></div>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A1512] leading-tight">
          A legacy of <span className="italic text-[#C9A84C]">celebration.</span>
        </h2>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {reviews.map((review, index) => (
          <div key={review.id} className={`flex flex-col bg-[#F9F6F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#C9A84C]/20 relative hover-lift hover-glow card-entrance stagger-${index + 1}`}>
            {/* Stars */}
            <div className="flex gap-1.5 mb-6 text-[#C9A84C]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            
            {/* Quote */}
            <p className="text-[#1A1512] text-sm md:text-base italic font-serif leading-relaxed mb-8 flex-grow font-light">
              &ldquo;{review.quote}&rdquo;
            </p>
            
            {/* Author */}
            <div className="border-t border-[#C9A84C]/20 pt-4">
              <p className="text-[#1A1512] font-bold font-sans text-[11px] uppercase tracking-wider mb-1">
                {review.author}
              </p>
              <p className="text-[#C9A84C] text-[9px] uppercase tracking-[0.2em] font-semibold">
                {review.role}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default ReviewsSection;
