"use client";

import React, { useState } from "react";
import { Upload, X, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: "Sterling-Vance Wedding Reception",
    category: "Wedding Sets",
    year: "2026",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Neon Club Night — Ibiza",
    category: "Club & Nightlife",
    year: "2026",
    image: "https://images.unsplash.com/photo-1571266028243-d2e1e5d4bded?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Harrison Corporate Gala",
    category: "Corporate Events",
    year: "2026",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Rooftop Sunset Session",
    category: "Private Parties",
    year: "2025",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Arena Festival Main Stage",
    category: "Festivals",
    year: "2026",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "Montague Anniversary Gala",
    category: "Wedding Sets",
    year: "2025",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    title: "Underground Warehouse Rave",
    category: "Club & Nightlife",
    year: "2025",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    title: "Tech Summit After Party",
    category: "Corporate Events",
    year: "2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    title: "Priya & Rahul Wedding Bash",
    category: "Wedding Sets",
    year: "2026",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80",
  },
];

const categories = ["All", "Wedding Sets", "Club & Nightlife", "Corporate Events", "Private Parties", "Festivals"];

const GalleryGrid = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const filtered = galleryData.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Gallery Header */}
      <div className="mb-8 mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-3">
            <span>DJ ARTIST</span>
            <span className="text-gray-400">›</span>
            <span className="text-[#7C6A2E]">PERFORMANCE GALLERY</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Performance Gallery
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            A curated showcase of live sets, wedding receptions, festival stages, and private events that define the sound and atmosphere.
          </p>
        </div>

        <button
          onClick={() => router.push("/dj-artist/gallery/new")}
          className="flex items-center justify-center space-x-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-6 py-3 font-semibold text-xs tracking-widest transition-colors shadow-md shrink-0 self-start md:mt-2"
        >
          <Upload size={16} />
          <span>UPLOAD PROJECT</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors border ${
                activeCategory === cat
                  ? "bg-[#7C6A2E] text-white border-[#7C6A2E]"
                  : "bg-white text-gray-600 border-[#E0D8C3] hover:bg-[#F2EADA]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#E0D8C3] bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#B08D2C] tracking-wide"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-[#E0D8C3] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => setPreviewItem(item)}
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[10px] font-bold tracking-widest uppercase px-4 py-2 text-[#7C6A2E]">
                  PREVIEW
                </span>
              </div>
            </div>
            <div className="p-4">
              <span className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase">
                {item.category} · {item.year}
              </span>
              <p className="text-sm font-serif font-bold text-gray-900 mt-1">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center my-8">
        <button className="border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] px-8 py-3 text-xs font-bold tracking-widest transition-colors uppercase">
          LOAD MORE PROJECTS
        </button>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-3 right-3 bg-white p-1.5 shadow-sm hover:bg-gray-100 transition-colors"
                onClick={() => setPreviewItem(null)}
              >
                <X size={16} className="text-gray-700" />
              </button>
            </div>
            <div className="p-6">
              <span className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase">
                {previewItem.category} · {previewItem.year}
              </span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-2 mb-2">{previewItem.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                A high-energy {previewItem.category.toLowerCase()} performance featuring seamless mixing, curated playlists, and an unforgettable atmosphere tailored to the occasion.
              </p>
              <div className="flex gap-3 mt-5">
                <button className="flex-1 bg-[#7C6A2E] hover:bg-[#685724] text-white py-2.5 text-xs font-bold tracking-widest transition-colors uppercase shadow-md">
                  VIEW FULL SET
                </button>
                <button className="flex-1 border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-700 py-2.5 text-xs font-bold tracking-widest transition-colors uppercase">
                  SHARE PROJECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
