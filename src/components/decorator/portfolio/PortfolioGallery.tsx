import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { portfolioItems, PortfolioItem } from './portfolioData';

interface PortfolioGalleryProps {
  activeCategory: string;
  items?: any[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PortfolioGallery = ({ activeCategory, items = [] }: PortfolioGalleryProps) => {
  // Filter items dynamically based on active category
  // Assuming the DB has servicesProvided which is an array, we can filter based on that,
  // or simply show all for now if category logic doesn't cleanly map to services.
  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.length === 0 ? (
        <div className="col-span-full py-20 text-center text-gray-500 italic">No masterpieces found for this category.</div>
      ) : (
        filteredItems.map((item: any) => {
          const coverMedia = item.media?.find((m: any) => m.isCover) || item.media?.[0];
          const rawUrl = coverMedia?.url || "";
          const imgUrl = coverMedia ? (rawUrl.startsWith("http") ? rawUrl : `${API_URL}${rawUrl}`) : "https://via.placeholder.com/600x400";
          
          return (
            <Link 
              href={`/decorator/portfolio/item/${item._id}`}
              key={item._id}
              className="flex flex-col bg-white border border-[#E0D8C3] hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              {/* Image Container with Absolute Badge */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10 bg-[#7C6A2E] text-white px-3 py-1.5 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm">
                  {item.category?.replace(/([A-Z])/g, ' $1').toUpperCase() || "PORTFOLIO ITEM"}
                </div>
                
                {/* Portfolio Image */}
                <img
                  src={imgUrl}
                  alt={item.title}
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
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Panel */}
                <div className="flex items-center justify-between pt-4 border-t border-[#F2EDE0] text-[9px] font-bold tracking-[0.15em] uppercase">
                  {/* Event Location */}
                  <span className="text-gray-400">
                    {item.venue}
                  </span>

                  {/* View Case Link */}
                  <div className="flex items-center space-x-1.5 text-[#7C6A2E] group-hover:text-[#B08D2C] transition-colors">
                    <span>DETAILS</span>
                    <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default PortfolioGallery;
