"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { portfolioItems, PortfolioItem } from './portfolioData';

interface PortfolioGalleryProps {
  activeCategory: string;
}

const PortfolioGallery = ({ activeCategory }: PortfolioGalleryProps) => {
  // Filter items dynamically based on active category
  const filteredItems = activeCategory === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item: PortfolioItem) => (
        <div 
          key={item.id}
          className="flex flex-col bg-white border border-[#E0D8C3] hover:shadow-md transition-all duration-300 group"
        >
          {/* Image Container with Absolute Badge */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10 bg-[#7C6A2E] text-white px-3 py-1.5 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm">
              {item.categoryLabel}
            </div>
            
            {/* Portfolio Image */}
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>

          {/* Card Details Panel */}
          <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between bg-[#FCFAED]/50 border-t border-[#F2EDE0]">
            <div>
              {/* Title */}
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-[#7C6A2E] transition-colors leading-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            {/* Bottom Panel */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F2EDE0] text-[9px] font-bold tracking-[0.15em] uppercase">
              {/* Event Location */}
              <span className="text-gray-400">
                {item.event}
              </span>

              {/* View Case Link */}
              <button className="flex items-center space-x-1.5 text-[#7C6A2E] hover:text-[#B08D2C] transition-colors">
                <span>{item.linkText}</span>
                <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGallery;
