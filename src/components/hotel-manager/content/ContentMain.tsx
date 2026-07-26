"use client";

import React, { useState } from 'react';
import {
  Image as ImageIcon, Upload, Check, Trash2, Edit2, Plus,
  Eye, Star, Globe, Shield, RefreshCw
} from 'lucide-react';

interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

const initialBanners: HeroBanner[] = [
  {
    id: 'banner-1',
    title: 'An Evening That Becomes Your Forever',
    subtitle: 'Step into luxury at EASCCA Conference Centre, Eravur.',
    imageUrl: '/packages_hero_bg.png',
    ctaText: 'Explore Packages',
    ctaLink: '/customer/packages',
    active: true,
  },
  {
    id: 'banner-2',
    title: '360° Interactive Virtual Tour',
    subtitle: 'Walk the aisle before you walk it.',
    imageUrl: '/virtual_tour_bg.png',
    ctaText: 'Launch Virtual Tour',
    ctaLink: '/customer/virtual-tour',
    active: true,
  },
];

export default function ContentMain() {
  const [banners, setBanners] = useState<HeroBanner[]>(initialBanners);
  const [activeTab, setActiveTab] = useState<'banners' | 'featured' | 'gallery'>('banners');

  const handleToggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#1E56A0]" />
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Maintain homepage banners, featured package highlights, photo galleries, and virtual tour media.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3.5 py-2 rounded-md transition ${activeTab === 'banners' ? 'bg-white text-[#1E56A0] shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Hero Banners
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3.5 py-2 rounded-md transition ${activeTab === 'featured' ? 'bg-white text-[#1E56A0] shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Featured Highlights
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-md transition ${activeTab === 'gallery' ? 'bg-white text-[#1E56A0] shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Media Gallery & 360°
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Homepage Banner Carousel</h2>
            <button className="flex items-center gap-2 bg-[#1E56A0] text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-[#15417E]">
              <Plus className="w-4 h-4" /> Add Banner Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
                <div>
                  <div className="relative h-48 bg-gray-100">
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${banner.active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                        {banner.active ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-gray-900 text-base">{banner.title}</h3>
                    <p className="text-xs text-gray-500">{banner.subtitle}</p>
                    <div className="pt-2 flex items-center gap-2 text-[11px] font-semibold text-[#1E56A0]">
                      <span>Button: "{banner.ctaText}"</span>
                      <span>→ {banner.ctaLink}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
                  <button
                    onClick={() => handleToggleBanner(banner.id)}
                    className={`px-3 py-1.5 rounded-md font-semibold ${banner.active ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}
                  >
                    {banner.active ? 'Deactivate' : 'Publish'}
                  </button>
                  <button className="text-gray-500 hover:text-red-600 font-medium">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'featured' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Featured Packages & Recommendations</h2>
          <p className="text-xs text-gray-500">Select which packages will display the "MOST LOVED" or "RECOMMENDED" badge on the landing page.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-lg space-y-2">
              <span className="px-2 py-0.5 bg-[#1E56A0] text-white text-[9px] font-bold rounded">BADGE: MOST LOVED</span>
              <h4 className="font-bold text-gray-900">Gold Elegance Package</h4>
              <p className="text-gray-600 text-[11px]">Includes full hall lighting, stage setup, decor & videography.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg space-y-2">
              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[9px] font-bold rounded">BADGE: STANDARD</span>
              <h4 className="font-bold text-gray-900">Silver Classic Package</h4>
              <p className="text-gray-600 text-[11px]">Essential hall package for intimate events up to 200 guests.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg space-y-2">
              <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded">BADGE: LUXURY</span>
              <h4 className="font-bold text-gray-900">Diamond Royal Package</h4>
              <p className="text-gray-600 text-[11px]">All-inclusive luxury experience with live DJ and full media team.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Virtual Tour & Media Assets</h2>
              <p className="text-xs text-gray-500">Configure 360° panoramas and 3D space planner asset paths.</p>
            </div>
            <button className="px-3.5 py-2 bg-[#1E56A0] text-white rounded-lg text-xs font-semibold hover:bg-[#15417E]">
              Upload New Asset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
              <span className="font-bold text-gray-900 block">360° Main Hall Panorama</span>
              <p className="text-gray-500 text-[11px]">Target: `/customer/virtual-tour`</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">VERIFIED</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50 space-y-2">
              <span className="font-bold text-gray-900 block">Three.js 3D Furniture Models</span>
              <p className="text-gray-500 text-[11px]">Target: `FurnitureModels.tsx`</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">LOADED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
