"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Search, ChevronDown, Loader2, Edit3, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { videographerAPI } from "@/lib/api";

interface GalleryItem {
  id: string | number;
  title: string;
  category: string;
  year: string;
  image: string;
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

const categories = ["All", "Wedding Videos", "Pre-Shoot Projects", "Engagement Sessions", "Event Highlights"];

const GalleryGrid = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (itemId: string | number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await videographerAPI.deletePortfolioItem(itemId.toString());
        if (res.ok && res.data?.success) {
          setGalleryData(prev => prev.filter(item => item.id !== itemId));
          setPreviewItem(null);
        } else {
          alert(res.data?.message || "Failed to delete portfolio item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete portfolio item due to network error.");
      }
    }
  };

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
        // Fall back to mock data if fetch fails
        setGalleryData(mockGalleryData);
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

      {/* Gallery Grid / Loader */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#7C6A2E]">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p className="text-xs font-bold tracking-wider uppercase">Loading Gallery Projects...</p>
        </div>
      ) : (
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
      )}

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
              <span className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase">{previewItem.category} · {previewItem.year}</span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-2 mb-2">{previewItem.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {previewItem.description || `A professionally captured ${previewItem.category.toLowerCase()} project featuring cinematic storytelling.`}
              </p>
              <div className="flex gap-3 mt-5">
                <button 
                  onClick={() => router.push(`/videographer/gallery/edit/${previewItem.id}`)}
                  className="flex-1 border border-[#E0D8C3] hover:bg-[#F2EADA] text-[#7C6A2E] py-2.5 text-xs font-bold tracking-widest transition-colors uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit3 size={14} /> EDIT
                </button>
                <button 
                  onClick={() => handleDelete(previewItem.id)}
                  className="flex-1 bg-[#93000a] hover:bg-[#7a0008] text-white py-2.5 text-xs font-bold tracking-widest transition-colors uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={14} /> DELETE
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
