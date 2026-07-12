"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';
import { getApiImageUrl } from '@/lib/vendorUtils';

const CATEGORY_LABELS: Record<string, string> = {
  installations: 'Installations',
  floral: 'Floral Design',
  lighting: 'Lighting',
  tablescapes: 'Tablescapes',
  backdrops: 'Backdrops',
};

interface CategoryGalleryProps {
  categorySlug: string;
}

const CategoryGallery = ({ categorySlug }: CategoryGalleryProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    decoratorAPI.getPortfolioItems().then((res) => {
      if (res.ok && res.data?.data) {
        setItems(res.data.data.filter((i: any) => i.category === categorySlug));
      }
      setLoading(false);
    });
  }, [categorySlug]);

  const label = CATEGORY_LABELS[categorySlug] || categorySlug;

  if (loading) {
    return <div className="py-12 text-center text-gray-500 animate-pulse">Loading portfolio...</div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[9px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-1">
            {items.length} {items.length === 1 ? 'WORK' : 'WORKS'} IN THIS CATEGORY
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 font-bold tracking-tight">{label}</h2>
        </div>
        <Link href="/decorator/portfolio" className="text-[10px] font-bold tracking-widest text-gray-500 hover:text-[#7C6A2E] uppercase border-b pb-0.5">
          ← ALL WORKS
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const cover = item.media?.find((m: any) => m.isCover) || item.media?.[0];
          const src = cover ? getApiImageUrl(cover.url) : '';
          return (
            <Link href={`/decorator/portfolio/item/${item._id}`} key={item._id} className="flex flex-col bg-white border border-[#E0D8C3] hover:shadow-md transition-all group">
              <div className="relative aspect-[4/3] overflow-hidden">
                {src && <img src={src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-[#7C6A2E]">{item.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-4 mt-4 border-t text-[9px] font-bold tracking-widest uppercase text-[#7C6A2E]">
                  <span>{item.eventType}</span>
                  <ArrowRight size={10} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-24 text-gray-400 font-serif italic text-lg">No works in this category yet.</div>
      )}
    </div>
  );
};

export default CategoryGallery;
