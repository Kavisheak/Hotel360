"use client";

import React, { useState, useEffect } from "react";
import { Upload, Search, ChevronDown, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { videographerAPI } from "@/lib/api";

interface GalleryItem {
  id: string | number;
  title: string;
  category: string;
  year: string;
  image: string;
  galleryImages?: string[];
  description?: string;
}

const mockGalleryData: GalleryItem[] = [
  {
    id: 1,
    title: "Sterling-Vance Wedding",
    category: "Wedding Videos",
    year: "2026",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    title: "Okafor Engagement Session",
    category: "Engagement Sessions",
    year: "2026",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    title: "Harrison Corporate Gala",
    category: "Event Highlights",
    year: "2026",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    title: "Montague Anniversary",
    category: "Wedding Videos",
    year: "2025",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    title: "Bridal Pre-Shoot — Amara",
    category: "Pre-Shoot Projects",
    year: "2026",
    image: "https://images.unsplash.com/photo-1464699908537-0954e50791ee?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    title: "The Grand Wedding Film",
    category: "Wedding Videos",
    year: "2025",
    image: "https://images.unsplash.com/photo-1582274032558-64e7c3e6b23e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    title: "Summer Garden Wedding",
    category: "Wedding Videos",
    year: "2025",
    image: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    title: "Corporate Summit 2025",
    category: "Event Highlights",
    year: "2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    title: "Priya & Rahul Engagement",
    category: "Engagement Sessions",
    year: "2026",
    image: "https://images.unsplash.com/photo-1542833443-3f44b1fbf3cc?auto=format&fit=crop&w=600&q=80",
  },
];

const categories = ["All", "Wedding Film", "Engagement Session", "Corporate Event", "Pre-Wedding Shoot", "Event Highlight Reel", "Anniversary Film", "Cinematic Story"];

const GalleryGrid = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { ok, data } = await videographerAPI.getPortfolioItems();
        if (ok && data.success) {
          const items = data.data.map((item: any) => {
            const coverMedia = item.media?.find((m: any) => m.isCover) || item.media?.[0];
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const imageUrl = coverMedia?.url 
              ? (coverMedia.url.startsWith('http') ? coverMedia.url : `${apiBase}${coverMedia.url}`)
              : "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80";

            return {
              id: item._id,
              title: item.title || "Untitled Project",
              eventType: item.eventType || "Unknown",
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

  const filtered = galleryData.filter((item: any) => {
    const matchesCategory = activeCategory === "All" || item.eventType === activeCategory;
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

      {/* Gallery Grid / Loader */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#7C6A2E]">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-xs font-bold tracking-wider uppercase">Loading Gallery Projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-gray-500 font-light italic">
              No cinematic projects found.
            </div>
          ) : (
            filtered.map((item) => (
              <Link 
                href={`/videographer/gallery/${item.id}`}
                key={item.id}
                className="flex flex-col bg-white border border-[#E0D8C3] hover:shadow-md transition-all duration-300 group cursor-pointer"
              >
                {/* Image Container with Absolute Badge */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-[#7C6A2E] text-white px-3 py-1.5 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm">
                    {item.category?.replace(/([A-Z])/g, ' $1').toUpperCase() || "CINEMATOGRAPHY"}
                  </div>
                  
                  {/* Portfolio Image */}
                  <img
                    src={item.image}
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
                      {item.description || "A professionally captured project featuring cinematic storytelling."}
                    </p>
                  </div>

                  {/* Bottom Panel */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F2EDE0] text-[9px] font-bold tracking-[0.15em] uppercase">
                    {/* Event Year */}
                    <span className="text-gray-400">
                      PREMIUM · {item.year}
                    </span>

                    {/* View Case Link */}
                    <div className="flex items-center space-x-1.5 text-[#7C6A2E] group-hover:text-[#B08D2C] transition-colors">
                      <span>DETAILS</span>
                      <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Load More */}
      <div className="flex justify-center my-8">
        <button className="border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] px-8 py-3 text-xs font-bold tracking-widest transition-colors uppercase">
          LOAD MORE PROJECTS
        </button>
      </div>
    </div>
  );
};

export default GalleryGrid;
