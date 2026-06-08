import React from 'react';

const RatingsHeader = () => {
  return (
    <div className="mb-8 mt-4">
      {/* Subtitle */}
      <p className="text-sm font-serif italic text-[#A6955C] mb-1">
        Excellence Reflected
      </p>
      
      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
        Client Reviews
      </h1>

      {/* Description */}
      <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
        An overview of our creative impact through the eyes of those we've served. Our
        commitment to luxury decor and seamless execution is reflected in every rating.
      </p>
    </div>
  );
};

export default RatingsHeader;
