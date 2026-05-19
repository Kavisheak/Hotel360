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
    <section className="w-full bg-[#fcfaf7] py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <p className="text-[#c69c6d] text-xs tracking-[0.2em] uppercase font-semibold">
          Words of Praise
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
          A legacy of <span className="italic text-[#c69c6d]">celebration.</span>
        </h2>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl w-full">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col bg-white p-10 shadow-sm border border-gray-100 relative">
            {/* Stars */}
            <div className="flex gap-1 mb-6 text-[#c69c6d]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            
            {/* Quote */}
            <p className="text-gray-700 text-base md:text-lg italic font-serif leading-relaxed mb-8 flex-grow">
              "{review.quote}"
            </p>
            
            {/* Author */}
            <div>
              <p className="text-gray-900 font-semibold font-sans text-sm uppercase tracking-wider mb-1">
                {review.author}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">
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
