"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Tag, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import RatingsStats from '../../ratings/RatingsStats';
import RecentFeedback from '../../ratings/RecentFeedback';

interface GalleryItemMainProps {
  itemId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const GalleryItemMain = ({ itemId }: GalleryItemMainProps) => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Dynamic Ratings state
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  const router = useRouter();

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      const { videographerAPI } = await import('@/lib/api');
      
      const resItem = await videographerAPI.getPortfolioItems();
      let foundItem = null;
      if (resItem.ok && resItem.data?.data) {
        foundItem = resItem.data.data.find((i: any) => i._id === itemId);
        setItem(foundItem);
      }

      // Fetch specific rating for this project if it was auto-created from a booking
      if (foundItem && foundItem.bookingId) {
        const resRatings = await videographerAPI.getRatings();
        if (resRatings.ok && resRatings.data?.data) {
          const allReviews = resRatings.data.data.reviews || [];
          const specificReview = allReviews.find((r: any) => 
            r.bookingId === foundItem.bookingId || r.bookingId?._id === foundItem.bookingId
          );
          setReviews(specificReview ? [specificReview] : []);
        }
      } else {
        setReviews([]);
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
    
    setIsDeleting(true);
    try {
      const { videographerAPI } = await import('@/lib/api');
      const res = await videographerAPI.deletePortfolioItem(itemId);
      if (res.ok) {
        alert("Project deleted successfully.");
        router.push('/videographer/gallery');
      } else {
        alert(res.data?.message || 'Failed to delete gallery item');
        setIsDeleting(false);
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while deleting.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#7C6A2E] font-serif italic animate-pulse">Loading cinematic project details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-serif italic">Project not found.</p>
      </div>
    );
  }

  const coverMedia = item.media?.find((m: any) => m.isCover) || item.media?.[0];
  const getMediaUrl = (url: string) => url.startsWith("http") ? url : `${API_URL}${url}`;

  // Gallery images
  const galleryImages = item.media?.map((m: any) => getMediaUrl(m.url)) || [];
  const displayUrl = galleryImages.length > 0 ? galleryImages[currentImageIndex] : "https://via.placeholder.com/1200x800";

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };
  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1">
        {/* Navigation Bar */}
        <div className="px-6 sm:px-8 lg:px-12 py-6 flex justify-between items-center border-b border-[#E0D8C3] bg-white sticky top-0 z-20">
          <Link 
            href="/videographer/gallery" 
            className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-gray-500 hover:text-[#7C6A2E] uppercase transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Gallery</span>
          </Link>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push(`/videographer/gallery/edit/${item._id}`)}
              className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#B08D2C] hover:text-[#7C6A2E] uppercase transition-colors cursor-pointer"
            >
              <Edit2 size={12} />
              <span>Edit Project</span>
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-red-400 hover:text-red-600 uppercase transition-colors pl-4 border-l border-[#E0D8C3] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <Trash2 size={12} />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#7C6A2E] uppercase border-l border-[#E0D8C3] pl-4 hidden sm:block">
              Case Study
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] relative group overflow-hidden bg-black">
          <img 
            src={displayUrl} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          
          {galleryImages.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/70 border border-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer z-20 pointer-events-auto group-hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/70 border border-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer z-20 pointer-events-auto group-hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16 max-w-6xl mx-auto w-full flex flex-col justify-end pointer-events-none">
            <div className="inline-block bg-[#7C6A2E] text-white px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 self-start shadow-md">
              {item.category?.replace(/([A-Z])/g, ' $1').toUpperCase() || "CINEMATOGRAPHY"}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight mb-4 tracking-tight drop-shadow-md pointer-events-auto">
              {item.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-[10px] sm:text-xs font-bold tracking-widest uppercase drop-shadow pointer-events-auto">
              <div className="flex items-center space-x-2">
                <MapPin size={14} />
                <span>{item.venue || 'Premium Location'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag size={14} />
                <span>Cinematic Configuration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Main Description (Left) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="bg-white p-10 border border-[#E0D8C3] shadow-sm relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#B08D2C]" />
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-4 leading-tight">
                <span className="w-12 h-[1px] bg-[#E0D8C3]"></span>
                {item.title}
              </h3>
              <p className="text-base sm:text-lg font-serif text-gray-600 leading-relaxed text-justify whitespace-pre-wrap">
                {item.description || `A professionally captured cinematography project featuring cinematic storytelling, multiple angles, and premium color grading.`}
              </p>
            </div>
          </div>

          {/* Details Sidebar (Right) */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 border-b border-[#E0D8C3] pb-2 uppercase">Project Specifications</h3>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Location</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{item.venue || 'Premium Location'}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Event Type</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{item.category || "Cinematography"}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Date</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{item.eventDate ? new Date(item.eventDate).toLocaleDateString() : "2026"}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Style</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{"Cinematic Film"}</div>
                </div>
                {item.price ? (
                  <div className="col-span-2 pt-2 border-t border-[#F2EDE0]">
                    <div className="text-[9px] font-bold tracking-widest text-[#B08D2C] uppercase mb-1">Project Value</div>
                    <div className="text-lg font-serif font-bold text-gray-900">LKR {item.price.toLocaleString()}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <div className="bg-white border-t border-[#E0D8C3] py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
              <h3 className="text-center text-sm font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-12 flex items-center justify-center gap-4">
                <span className="w-12 h-[1px] bg-[#E0D8C3]"></span>
                Visual Journey
                <span className="w-12 h-[1px] bg-[#E0D8C3]"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map((src: string, idx: number) => (
                  <div key={idx} onClick={() => setCurrentImageIndex(idx)} className={`aspect-square relative overflow-hidden group cursor-pointer border shadow-sm transition-all ${currentImageIndex === idx ? 'border-[#B08D2C] scale-[0.98] ring-2 ring-[#F9DD76]/50' : 'border-[#F2EDE0] hover:border-[#B08D2C]/50'}`}>
                    <img 
                      src={src} 
                      alt={`Gallery perspective ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Client Review Section - DYNAMIC (Only shows if this project has a review) */}
        {reviews.length > 0 && (
          <div className="bg-[#FCFAED] border-t border-[#E0D8C3] py-16 lg:py-24">
            <div className="max-w-5xl mx-auto px-6 sm:px-8">
              <h3 className="text-center text-sm font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-12 flex items-center justify-center gap-4">
                <span className="w-12 h-[1px] bg-[#E0D8C3]"></span>
                Client Feedback for this Project
                <span className="w-12 h-[1px] bg-[#E0D8C3]"></span>
              </h3>

              <RecentFeedback reviews={reviews} />

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GalleryItemMain;
