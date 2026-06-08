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
    <section className="w-full bg-[#F0E6D0] py-16 md:py-20 px-6 md:px-12 lg:px-20 flex flex-col items-center section-reveal">
      
      {/* Header */}
      <div className="text-center mb-10 space-y-3">
        <p className="text-[#C9A84C] text-[10px] tracking-[0.2em] uppercase font-semibold">
          Words of Praise
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
          A legacy of <span className="italic text-[#C9A84C]">celebration.</span>
        </h2>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {reviews.map((review, index) => (
          <div key={review.id} className={`flex flex-col bg-white p-7 shadow-sm border border-gray-100 relative hover-lift hover-glow card-entrance stagger-${index + 1}`}>
            {/* Stars */}
            <div className="flex gap-1 mb-4 text-[#C9A84C]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            
            {/* Quote */}
            <p className="text-gray-700 text-sm italic font-serif leading-relaxed mb-6 flex-grow">
              &ldquo;{review.quote}&rdquo;
            </p>
            
            {/* Author */}
            <div>
              <p className="text-gray-900 font-semibold font-sans text-xs uppercase tracking-wider mb-0.5">
                {review.author}
              </p>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">
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
