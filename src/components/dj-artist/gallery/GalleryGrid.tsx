"use client";

import React, { useState } from "react";
import { Upload, Search, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { djAPI } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import AddPortfolioModal from "@/components/shared/AddPortfolioModal";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";
import RatingsStats from "../ratings/RatingsStats";
import RecentFeedback from "../ratings/RecentFeedback";

const categories = ["All", "Wedding Reception", "Club Night", "Corporate Gala", "Private Party", "Festival / Arena", "Birthday Celebration"];

interface GalleryGridProps {
  items: any[];
  loading: boolean;
  refresh: () => void;
}

const GalleryGrid = ({ items = [], loading = false, refresh }: GalleryGridProps) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = items.filter((item) => {
    let matchesCategory = activeCategory === "All";
    if (!matchesCategory) {
      const itemEvent = (item.eventType || "").toLowerCase().trim();
      const activeLower = activeCategory.toLowerCase().trim();
      matchesCategory = itemEvent === activeLower;

      // Legacy support mapping for mis-saved generic "wedding" items
      if (!matchesCategory && activeLower === "wedding reception" && itemEvent === "wedding") {
        matchesCategory = true;
      }
    }
    const itemTitle = item.title || "";
    const matchesSearch = itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await djAPI.deleteGalleryItem(itemToDelete);
      refresh();
      setItemToDelete(null);
    } catch (e) {
      console.error("Failed to delete gallery item:", e);
    } finally {
      setIsDeleting(false);
    }
  };

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
          onClick={() => setIsAddModalOpen(true)}
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm text-[#7C6A2E] animate-pulse">
            Loading performance gallery...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-sm text-gray-500 font-light italic">
            No projects found.
          </div>
        ) : filtered.map((item) => {
          const coverMedia = item.media?.find((m: any) => m.isCover) || item.media?.[0];
          const rawUrl = coverMedia?.url || "";
          const imgUrl = coverMedia ? (rawUrl.startsWith("http") ? rawUrl : `${API_URL}${rawUrl}`) : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";

          return (
            <div
              key={item._id}
              className="relative flex flex-col bg-white border border-[#E0D8C3] hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <Link href={`/dj-artist/gallery/${item._id}`} className="absolute inset-0 z-0" />

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setItemToDelete(item._id);
                }}
                className="absolute top-4 right-4 z-20 bg-white/90 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                title="Delete Portfolio Item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>

              {/* Image Container with Absolute Badge */}
              <div className="relative aspect-[4/3] overflow-hidden z-10 pointer-events-none">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10 bg-[#7C6A2E] text-white px-3 py-1.5 text-[8px] font-bold tracking-[0.2em] uppercase shadow-sm">
                  {item.category?.replace(/([A-Z])/g, ' $1').toUpperCase() || "PERFORMANCE"}
                </div>

                {/* Portfolio Image */}
                <img
                  src={imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>

              {/* Card Details Panel */}
              <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between bg-[#FCFAED]/50 border-t border-[#F2EDE0] z-10 pointer-events-none">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-[#7C6A2E] transition-colors leading-tight">
                    {item.title}
                  </h3>

                  {/* Price Tag */}
                  {item.price ? (
                    <div className="inline-block bg-[#FDF9F1] border border-[#E0D8C3] px-3 py-1 mb-3">
                      <span className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">
                        LKR {item.price.toLocaleString()}
                      </span>
                    </div>
                  ) : null}

                  {/* Description */}
                  <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">
                    {item.description || "A high-energy performance captured live, featuring dynamic crowd interactions and premium sound."}
                  </p>
                </div>

                {/* Bottom Panel */}
                <div className="flex items-center justify-between pt-4 border-t border-[#F2EDE0] text-[9px] font-bold tracking-[0.15em] uppercase">
                  {/* Event Year */}
                  <span className="text-gray-400">
                    PREMIUM · {new Date(item.eventDate || new Date()).getFullYear()}
                  </span>

                  {/* View Case Link */}
                  <div className="flex items-center space-x-1.5 text-[#7C6A2E] group-hover:text-[#B08D2C] transition-colors">
                    <span>DETAILS</span>
                    <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="flex justify-center my-8">
        <button className="border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] px-8 py-3 text-xs font-bold tracking-widest transition-colors uppercase">
          LOAD MORE PROJECTS
        </button>
      </div>

      {/* Add Portfolio Modal */}
      <AddPortfolioModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        vendorType="dj"
        onSubmitSuccess={refresh}
      />
    </div>
  );
};

export default GalleryGrid;
