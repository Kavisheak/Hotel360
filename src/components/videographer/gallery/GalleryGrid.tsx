"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Search, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { videographerAPI } from "@/lib/api";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
}

const categories = ["All", "Wedding Videos", "Pre-Shoot Projects", "Engagement Sessions", "Event Highlights", "cinematography"];

const GalleryGrid = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { ok, data } = await videographerAPI.getPortfolioItems();
        if (ok && data.success) {
          const items = data.data.map((item: any) => {
            const coverMedia = item.media?.find((m: any) => m.isCover) || item.media?.[0];
            const imageUrl = coverMedia?.url 
              ? `http://localhost:5000${coverMedia.url}` 
              : "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80";

            return {
              id: item._id,
              title: item.title || "Untitled Project",
              category: item.category || "cinematography",
              year: item.eventDate ? new Date(item.eventDate).getFullYear().toString() : new Date().getFullYear().toString(),
              image: imageUrl,
              description: item.description || "A professionally captured project featuring cinematic storytelling.",
            };
          });
          setGalleryData(items);
        }
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

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
            <span>VIDEOGRAPHER</span>
            <span className="text-gray-400">›</span>
            <span className="text-[#7C6A2E]">PORTFOLIO GALLERY</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Portfolio Gallery
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            A curated collection of cinematic wedding films, engagement sessions, and event highlight reels.
          </p>
        </div>

        <button
          onClick={() => router.push('/videographer/gallery/new')}
          className="flex items-center justify-center space-x-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-6 py-3 font-semibold text-xs tracking-widest transition-colors shadow-md shrink-0 self-start md:mt-2"
        >
          <Upload size={16} />
          <span>UPLOAD PROJECT</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors border ${activeCategory === cat
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

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#B08D2C]" size={32} />
        </div>
      ) : galleryData.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No portfolio items uploaded yet.
        </div>
      ) : (
        <>
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
                  <span className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase">{item.category} · {item.year}</span>
                  <p className="text-sm font-serif font-bold text-gray-900 mt-1">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filtered.length > 0 && (
            <div className="flex justify-center my-8">
              <button className="border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] px-8 py-3 text-xs font-bold tracking-widest transition-colors uppercase">
                LOAD MORE PROJECTS
              </button>
            </div>
          )}
        </>
      )}

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
              <span className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase">{previewItem.category} · {previewItem.year}</span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-2 mb-2">{previewItem.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {previewItem.description}
              </p>
              <div className="flex gap-3 mt-5">
                <button className="flex-1 bg-[#7C6A2E] hover:bg-[#685724] text-white py-2.5 text-xs font-bold tracking-widest transition-colors uppercase shadow-md">
                  DOWNLOAD REEL
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
