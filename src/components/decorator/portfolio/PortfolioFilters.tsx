"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from './portfolioData';

interface PortfolioFiltersProps {
  activeCategory?: string;
  setActiveCategory?: (category: string) => void;
}

const PortfolioFilters = ({ activeCategory, setActiveCategory }: PortfolioFiltersProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2.5 mb-8">
      {categories.map((cat) => {
        // If controlled by state (activeCategory prop provided)
        if (activeCategory !== undefined && setActiveCategory !== undefined) {
          const isActive = cat.slug === activeCategory;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase border transition-colors ${
                isActive
                  ? 'bg-[#7C6A2E] text-white border-[#7C6A2E]'
                  : 'bg-white text-gray-500 border-[#E0D8C3] hover:border-[#B08D2C] hover:text-[#7C6A2E]'
              }`}
            >
              {cat.label}
            </button>
          );
        }

        // Otherwise, fallback to static href Link behavior
        const isHrefActive =
          cat.slug === 'all'
            ? pathname === '/decorator/portfolio'
            : pathname === `/decorator/portfolio/${cat.slug}`;

        return (
          <Link
            key={cat.slug}
            href={cat.slug === 'all' ? '/decorator/portfolio' : `/decorator/portfolio/${cat.slug}`}
            className={`px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase border transition-colors ${
              isHrefActive
                ? 'bg-[#7C6A2E] text-white border-[#7C6A2E]'
                : 'bg-white text-gray-500 border-[#E0D8C3] hover:border-[#B08D2C] hover:text-[#7C6A2E]'
            }`}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
};

export default PortfolioFilters;
