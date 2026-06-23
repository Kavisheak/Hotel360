import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { portfolioItems, categories } from './portfolioData';

interface CategoryGalleryProps {
  categorySlug: string;
}

const CategoryGallery = ({ categorySlug }: CategoryGalleryProps) => {
  const items = portfolioItems.filter((i) => i.category === categorySlug);
  const cat = categories.find((c) => c.slug === categorySlug);

  return (
    <div>
      {/* Category heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[9px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-1">
            {items.length} {items.length === 1 ? 'WORK' : 'WORKS'} IN THIS CATEGORY
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 font-bold tracking-tight">
            {cat?.label}
          </h2>
        </div>
        <Link
          href="/decorator/portfolio"
          className="text-[10px] font-bold tracking-widest text-gray-500 hover:text-[#7C6A2E] uppercase border-b border-gray-300 hover:border-[#7C6A2E] transition-colors pb-0.5 self-start sm:self-auto"
        >
          ← ALL WORKS
        </Link>
      </div>

      {/* Uniform 3-col grid on lg, 2-col on sm, 1-col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link 
            href={`/decorator/portfolio/item/${item.id}`}
            key={item.id} 
            className="flex flex-col bg-white border border-[#E0D8C3] hover:shadow-md transition-all duration-300 group cursor-pointer"
          >
            {/* Image Container with Absolute Badge */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute top-4 left-4 z-10 bg-[#7C6A2E] text-white px-3 py-1.5 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm">
                {item.categoryLabel}
              </div>
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

              {/* Bottom Info Row */}
              <div className="flex items-center justify-between pt-4 border-t border-[#F2EDE0] text-[9px] font-bold tracking-[0.15em] uppercase">
                <span className="text-gray-400">{item.event}</span>
                <div className="flex items-center space-x-1.5 text-[#7C6A2E] group-hover:text-[#B08D2C] transition-colors">
                  <span>{item.linkText}</span>
                  <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-24 text-gray-400 font-serif italic text-lg">
          No works in this category yet.
        </div>
      )}
    </div>
  );
};

export default CategoryGallery;
