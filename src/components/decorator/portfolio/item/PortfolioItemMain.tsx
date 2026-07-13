"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Tag, Share2, Heart, Edit2 } from 'lucide-react';
import Footer from '../../my_jobs/Footer';
import EditPortfolioModal from './EditPortfolioModal';

interface PortfolioItemMainProps {
  itemId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PortfolioItemMain = ({ itemId }: PortfolioItemMainProps) => {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      const { decoratorAPI } = await import('@/lib/api');
      const res = await decoratorAPI.getPortfolioItems();
      if (res.ok && res.data?.data) {
        const found = res.data.data.find((i: any) => i._id === itemId);
        setItem(found);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#7C6A2E] font-serif italic animate-pulse">Loading masterpiece details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-serif italic">Masterpiece not found.</p>
      </div>
    );
  }

  const coverMedia = item.media?.find((m: any) => m.isCover) || item.media?.[0];
  const getMediaUrl = (url: string) => url.startsWith("http") ? url : `${API_URL}${url}`;
  const coverUrl = coverMedia ? getMediaUrl(coverMedia.url) : "https://via.placeholder.com/1200x800";

  // Gallery images (excluding cover if desired, or all images)
  const galleryImages = item.media?.map((m: any) => getMediaUrl(m.url)) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1">
        {/* Navigation Bar */}
        <div className="px-6 sm:px-8 lg:px-12 py-6 flex justify-between items-center border-b border-[#E0D8C3] bg-white sticky top-0 z-20">
          <Link 
            href="/decorator/portfolio" 
            className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-gray-500 hover:text-[#7C6A2E] uppercase transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Gallery</span>
          </Link>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#B08D2C] hover:text-[#7C6A2E] uppercase transition-colors"
            >
              <Edit2 size={12} />
              <span>Edit Masterpiece</span>
            </button>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#7C6A2E] uppercase border-l border-[#E0D8C3] pl-4 hidden sm:block">
              Case Study
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] relative group overflow-hidden">
          <img 
            src={coverUrl} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 lg:p-16 max-w-6xl mx-auto w-full flex flex-col justify-end">
            <div className="inline-block bg-[#7C6A2E] text-white px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase mb-4 self-start shadow-md">
              {item.servicesProvided?.[0]?.replace(/([A-Z])/g, ' $1').toUpperCase() || "PORTFOLIO"}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight mb-4 tracking-tight drop-shadow-md">
              {item.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-[10px] sm:text-xs font-bold tracking-widest uppercase drop-shadow">
              <div className="flex items-center space-x-2">
                <MapPin size={14} />
                <span>{item.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tag size={14} />
                <span>Premium Configuration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Main Description (Left) */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#A6955C]"></span>
                The Vision
              </h3>
              <p className="text-lg sm:text-xl font-serif text-gray-800 leading-relaxed text-justify">
                {item.description}
              </p>
            </div>
            
            <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm relative">
              <div className="absolute -top-3 left-8 bg-[#FDF9F1] px-2 text-[#7C6A2E]">
                <SparkleIcon />
              </div>
              <p className="text-sm italic font-serif text-gray-600 leading-loose">
                "Our design philosophy for this project was to transform the venue into an immersive experience. Every floral arrangement and lighting cue was meticulously calculated to evoke grandeur while retaining a sense of intimate warmth."
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#E0D8C3] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Lead Designer" className="w-full h-full object-cover" />
                </div>
                <div className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">
                  Lead Decorator
                </div>
              </div>
            </div>
          </div>

          {/* Details Sidebar (Right) */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 border-b border-[#E0D8C3] pb-2 uppercase">Project Specifications</h3>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Location</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{item.venue}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Event Type</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{item.eventType || "Grand Gala"}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Date</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{new Date(item.eventDate).toLocaleDateString() || "Ongoing"}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mb-1">Style</div>
                  <div className="text-sm font-serif font-bold text-gray-800">{item.servicesProvided?.[0]?.replace(/([A-Z])/g, ' $1') || "Premium"}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-white border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-3 text-[10px] font-bold tracking-widest uppercase transition-colors flex justify-center items-center space-x-2">
                <Heart size={14} />
                <span>Feature Work</span>
              </button>
              <button className="flex-1 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white py-3 text-[10px] font-bold tracking-widest uppercase shadow-sm transition-colors flex justify-center items-center space-x-2">
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white border-t border-[#E0D8C3] py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <h3 className="text-center text-sm font-bold tracking-[0.2em] text-[#A6955C] uppercase mb-12 flex items-center justify-center gap-4">
              <span className="w-12 h-[1px] bg-[#E0D8C3]"></span>
              Visual Journey
              <span className="w-12 h-[1px] bg-[#E0D8C3]"></span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryImages.map((src: string, idx: number) => (
                <div key={idx} className="aspect-[4/5] relative overflow-hidden group cursor-pointer border border-[#F2EDE0] shadow-sm">
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

      </div>
      <Footer />
      
      {isEditModalOpen && (
        <EditPortfolioModal 
          item={item} 
          onClose={() => setIsEditModalOpen(false)} 
          onSuccess={() => {
            setIsEditModalOpen(false);
            setLoading(true);
            fetchItem(); // Refresh the data
          }} 
        />
      )}
    </div>
  );
};

// Helper Sparkle Icon
const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);

export default PortfolioItemMain;
