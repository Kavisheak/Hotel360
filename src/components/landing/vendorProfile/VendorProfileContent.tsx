"use client";

import React, { useState } from "react";
import { Vendor } from "@/components/landing/vendors/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, MapPin, Star, Calendar, Truck, Headphones, Check, X, Phone, Mail, AlertTriangle, MessageSquare } from "lucide-react";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { motion, AnimatePresence } from "framer-motion";

interface VendorProfileContentProps {
  vendor: Vendor;
  isBooking?: boolean;
}

export default function VendorProfileContent({ vendor, isBooking = false }: VendorProfileContentProps) {
  const router = useRouter();
  const { vendors: allVendors } = useVendorStore();
  const { vendors: cartVendors, setVendor } = useVendorCartStore();

  const [activeTab, setActiveTab] = useState<"portfolio" | "packages" | "reviews" | "availability" | "about">("portfolio");

  // Selection state
  const storeCat = getStoreCategory(vendor.category);
  const isSelected = cartVendors[storeCat] === vendor.id;

  // Modals state
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [existingVendorName, setExistingVendorName] = useState("");
  
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState("Hi! I would like to check your rates and availability for my upcoming event at EASCC. Looking forward to hearing from you.");
  const [inquirySent, setInquirySent] = useState(false);
  const [isInquiring, setIsInquiring] = useState(false);

  // Dynamic backend published portfolio state
  const [dynamicAlbums, setDynamicAlbums] = useState<any[] | null>(null);
  const [selectedBackendAlbum, setSelectedBackendAlbum] = useState<any | null>(null);

  React.useEffect(() => {
    if (activeTab === "portfolio" && vendor.id) {
      fetchPublicPortfolio();
    }
  }, [activeTab, vendor.id]);

  const fetchPublicPortfolio = async () => {
    try {
      const { vendorAPI } = await import("@/lib/api");
      const res = await vendorAPI.getPublicVendorPortfolio(vendor.id);
      if (res.ok && res.data?.data && res.data.data.length > 0) {
        setDynamicAlbums(res.data.data);
      } else {
        setDynamicAlbums([]);
      }
    } catch (e) {
      console.error("Fetch public portfolio error:", e);
      setDynamicAlbums([]);
    }
  };

  function getStoreCategory(category: string): "decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist" {
    if (category === "decorators") return "decorator";
    if (category === "djs") return "dj";
    if (category === "videographers") return "videographer";
    if (category === "photographers") return "photographer";
    if (category === "cake") return "cake";
    if (category === "florists") return "florist";
    return "decorator";
  }

  const handleSelectVendorClick = () => {
    const existingId = cartVendors[storeCat];

    if (existingId === vendor.id) {
      // Deselect
      setVendor(storeCat, null);
      return;
    }

    if (existingId) {
      const existing = allVendors.find(v => v.id === existingId);
      setExistingVendorName(existing ? existing.name : "another provider");
      setReplaceModalOpen(true);
    } else {
      // Select directly
      setVendor(storeCat, vendor.id);
    }
  };

  const confirmReplace = () => {
    setVendor(storeCat, vendor.id);
    setReplaceModalOpen(false);
  };

  const sendInquiry = () => {
    setIsInquiring(true);
    setTimeout(() => {
      setIsInquiring(false);
      setInquirySent(true);
    }, 1200);
  };

  const tabs = [
    { id: "portfolio", label: "Portfolio" },
    { id: "packages", label: "Packages & Pricing" },
    { id: "reviews", label: `Reviews (${vendor.reviewsCount})` },
    { id: "availability", label: "Availability" },
    { id: "about", label: "Vendor Profile" },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#E8DFC9] dark:border-white/10 overflow-x-auto pb-[1px] mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[11px] tracking-[0.1em] uppercase font-bold whitespace-nowrap transition-colors relative
                ${activeTab === tab.id 
                  ? "text-[#1A1512] dark:text-[#C69C6D]" 
                  : "text-gray-400 hover:text-[#1A1512] dark:hover:text-gray-300"}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#1A1512] dark:bg-[#C69C6D]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="min-h-100">
          
          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <section className="space-y-4">
                <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">About {vendor.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-3xl">
                  {vendor.description}
                </p>
                <div className="pt-4 flex flex-wrap gap-3">
                  {vendor.specialties.map((spec, i) => (
                    <span 
                      key={i} 
                      className="bg-[#FAF6EE] dark:bg-transparent text-[#A6955C] dark:text-[#C69C6D] text-[10px] font-bold tracking-widest uppercase px-4 py-2 border border-[#E8DFC9] dark:border-[#C69C6D]/30 rounded-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </section>

              {vendor.location && (
                <section className="space-y-6">
                  <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">Location</h3>
                  <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-6 rounded-sm shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#FAF6EE] dark:bg-black rounded-sm shrink-0 border border-[#E8DFC9]/50 dark:border-white/5">
                        <MapPin className="w-5 h-5 text-[#C69C6D]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A1512] dark:text-white">Main Studio</h4>
                        <p className="text-gray-500 text-sm mt-1">
                          {vendor.location}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Visits by appointment only.</p>
                      </div>
                    </div>
                    <button className="shrink-0 px-6 py-2 border border-[#E8DFC9] dark:border-white/10 text-[#C69C6D] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      Get Directions
                    </button>
                  </div>
                  {/* Embedded Map Dummy */}
                  <div className="w-full h-[300px] bg-[#FAF6EE]/50 dark:bg-[#111315] rounded-sm relative overflow-hidden flex flex-col items-center justify-center border border-[#E8DFC9] dark:border-white/10">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                    <MapPin className="w-10 h-10 text-[#C69C6D] relative z-10 drop-shadow-md mb-2" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 relative z-10">Map View</span>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* PORTFOLIO TAB */}
          {activeTab === "portfolio" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {selectedBackendAlbum ? (
                /* Selected Album Detail View */
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-[#E8DFC9] pb-3">
                    <div>
                      <button
                        onClick={() => setSelectedBackendAlbum(null)}
                        className="text-xs font-bold uppercase tracking-wider text-[#C69C6D] hover:underline mb-1 flex items-center gap-1"
                      >
                        &larr; Back to All Albums
                      </button>
                      <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white font-bold">
                        {selectedBackendAlbum.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedBackendAlbum.photoCount || selectedBackendAlbum.images?.length || 0} Showcase Photos
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(selectedBackendAlbum.images || []).map((img: any, i: number) => (
                      <div key={i} className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-white/10 rounded-sm overflow-hidden shadow-xs group">
                        <div className="aspect-4/3 overflow-hidden relative">
                          <img
                            src={typeof img === 'string' ? img : img.url}
                            alt={img.caption || `Album photo ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        {img.caption && (
                          <div className="p-3 bg-white dark:bg-[#111315]">
                            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{img.caption}</p>
                            {img.tags && img.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {img.tags.map((t: string) => (
                                  <span key={t} className="text-[9px] font-bold uppercase tracking-wider bg-[#FAF6EE] text-[#A6955C] px-1.5 py-0.5 rounded border border-[#E8DFC9]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : dynamicAlbums && dynamicAlbums.length > 0 ? (
                /* Published Albums Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dynamicAlbums.map((alb) => (
                    <div
                      key={alb._id}
                      onClick={() => setSelectedBackendAlbum(alb)}
                      className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-16/10 bg-[#FAF6EE] dark:bg-black overflow-hidden">
                          {alb.coverUrl ? (
                            <img
                              src={alb.coverUrl}
                              alt={alb.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase font-bold">
                              No Cover Photo
                            </div>
                          )}
                          <span className="absolute top-3 right-3 bg-[#C69C6D] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-xs">
                            {alb.photoCount || alb.images?.length || 0} Photos
                          </span>
                        </div>

                        <div className="p-4">
                          <h4 className="font-serif font-bold text-lg text-[#1A1512] dark:text-white group-hover:text-[#C69C6D] transition-colors truncate">
                            {alb.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Published Showcase Album
                          </p>
                        </div>
                      </div>

                      <div className="px-4 py-2.5 bg-[#FAF6EE] dark:bg-black border-t border-[#E8DFC9] dark:border-white/10 text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C69C6D]">
                          Explore Album &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Static Portfolio Fallback Grid */
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                  {vendor.portfolio.map((img, i) => (
                    <div key={i} className="relative break-inside-avoid bg-[#E8DFC9]/30 dark:bg-white/5 rounded-sm overflow-hidden group mb-4">
                      <img 
                        src={img} 
                        alt={`${vendor.name} portfolio ${i + 1}`}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PACKAGES TAB */}
          {activeTab === "packages" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {vendor.packages.map((pkg, i) => (
                <div key={i} className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div>
                      <h4 className="text-xl font-serif text-[#1A1512] dark:text-white">{pkg.name}</h4>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase tracking-widest text-[#A6955C] font-bold block mb-1">Package Price</span>
                      <span className="text-2xl font-bold text-[#1A1512] dark:text-white">{pkg.price}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[#C69C6D] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-[#E8DFC9] dark:border-white/10">
                    <button className="w-full md:w-auto px-6 py-2.5 border border-[#1A1512] dark:border-white text-[#1A1512] dark:text-white text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#1A1512] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                      Inquire About This Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8DFC9] dark:border-white/10 pb-6">
                <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">Customer Reviews & Feedback</h3>
                <button className="px-6 py-2 border border-[#E8DFC9] dark:border-white/10 text-[#C69C6D] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Write a Review
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {/* Overall Rating Card */}
                <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-8 rounded-sm shadow-sm flex flex-col justify-center min-w-[320px] shrink-0">
                  <div className="flex items-start gap-8 mb-6">
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-serif text-[#1A1512] dark:text-[#C69C6D] mb-2">{vendor.rating}</span>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(vendor.rating) ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 dark:text-gray-700 fill-gray-300 dark:fill-gray-700'}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mb-1">Out of 5</p>
                      <p className="text-[10px] text-gray-400">Based on {vendor.reviewsCount} reviews</p>
                    </div>
                    
                    {/* Rating Breakdown */}
                    <div className="flex-1 flex flex-col gap-1.5">
                      {[
                        { stars: 5, count: 82, width: "85%" },
                        { stars: 4, count: 10, width: "10%" },
                        { stars: 3, count: 3, width: "3%" },
                        { stars: 2, count: 1, width: "1%" },
                        { stars: 1, count: 0, width: "0%" }
                      ].map((row) => (
                        <div key={row.stars} className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-400 dark:text-gray-500 w-4 flex items-center gap-0.5">{row.stars} <Star className="w-2.5 h-2.5 fill-current" /></span>
                          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C69C6D] rounded-full" style={{ width: row.width }}></div>
                          </div>
                          <span className="text-gray-400 dark:text-gray-500 w-4 text-right">{row.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Horizontal Scrolling Reviews */}
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                  {vendor.reviews.map((review, i) => (
                    <div key={i} className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-6 rounded-sm shadow-sm space-y-4 min-w-[320px] max-w-[320px] shrink-0 snap-start flex flex-col">
                      <div className="flex items-start gap-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#FAF6EE] dark:bg-black text-[#A6955C] flex items-center justify-center font-bold text-sm shrink-0 border border-[#E8DFC9] dark:border-[#C9A84C]/30">
                          {review.client.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h5 className="font-bold text-[#1A1512] dark:text-white text-sm">{review.client}</h5>
                          <p className="text-[10px] text-gray-400 mt-0.5">Recent Booking</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`w-3 h-3 ${idx < review.rating ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 fill-gray-300'}`} />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed flex-1">"{review.text}"</p>
                      <div className="mt-4 pt-4 border-t border-[#E8DFC9] dark:border-white/10">
                        <span className="text-[9px] text-[#A6955C] border border-[#E8DFC9] dark:border-[#C9A84C]/30 bg-[#FAF6EE] dark:bg-black px-2 py-1 rounded-sm uppercase tracking-widest">
                          Verified Booker
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AVAILABILITY TAB */}
          {activeTab === "availability" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-8 rounded-sm shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-3">Live Availability Calendar</h3>
                  <p className="text-sm text-gray-500 max-w-lg leading-relaxed mb-6">
                    Select your preferred event date to check if {vendor.name} is available. High-demand vendors book up months in advance, so early booking is recommended.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#C69C6D]"></div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-800"></div>
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Booked Out</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm bg-[#FAF6EE] dark:bg-[#2A2312] border border-[#C69C6D]/30"></div>
                      <span className="text-[10px] uppercase font-bold text-[#C69C6D] tracking-widest">Limited / Pending</span>
                    </div>
                  </div>
                </div>
                
                {/* Mock Calendar Widget */}
                <div className="w-full md:w-[320px] shrink-0 border border-[#E8DFC9] dark:border-white/10 rounded-sm overflow-hidden bg-[#FAF6EE] dark:bg-black">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DFC9] dark:border-white/10">
                    <button className="p-1 hover:bg-[#E8DFC9] dark:hover:bg-white/10 rounded-sm">&lt;</button>
                    <span className="text-sm font-bold tracking-widest uppercase text-[#1A1512] dark:text-white">December 2026</span>
                    <button className="p-1 hover:bg-[#E8DFC9] dark:hover:bg-white/10 rounded-sm">&gt;</button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                        <span key={d} className="text-[9px] text-gray-400 font-bold">{d}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        const isBooked = [3, 4, 12, 18, 19, 25, 31].includes(day);
                        const isPending = [10, 11, 26].includes(day);
                        return (
                          <div 
                            key={day} 
                            className={`aspect-square flex items-center justify-center text-xs rounded-sm cursor-pointer transition-colors
                              ${isBooked ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50' : 
                                isPending ? 'bg-[#FAF6EE] dark:bg-[#2A2312] border border-[#C69C6D]/30 text-[#C69C6D]' : 
                                'hover:bg-[#C69C6D] hover:text-white text-[#1A1512] dark:text-gray-300 font-medium'}`}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-[#FAF6EE] dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 bg-white dark:bg-transparent rounded-full flex items-center justify-center shrink-0 border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-sm">
              <Headphones className="w-6 h-6 text-[#C69C6D]" />
            </div>
            <div>
              <h4 className="text-lg font-serif text-[#1A1512] dark:text-white mb-1">Have questions or planning an event?</h4>
              <p className="text-sm text-gray-500">Our team is here to help you create unforgettable moments.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button 
              onClick={handleSelectVendorClick} 
              className={`w-full sm:w-auto px-8 py-3.5 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all shadow-md flex items-center gap-2 justify-center
                ${isSelected 
                  ? 'bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                  : 'bg-[#C69C6D] text-white border border-[#C69C6D] hover:bg-[#B58B5C] hover:border-[#B58B5C]'}`}
            >
              {isSelected ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              {isSelected ? "Deselect Vendor" : "Select This Vendor"}
            </button>
            <button 
              onClick={() => setContactModalOpen(true)} 
              className="w-full sm:w-auto border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 px-8 py-3.5 text-[10px] uppercase font-bold tracking-widest rounded-sm hover:border-[#C69C6D] hover:text-[#C69C6D] transition-colors"
            >
              Contact Vendor
            </button>
          </div>
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="lg:w-80 shrink-0">
        <div className="space-y-6 sticky top-28">
          <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 p-6 rounded-sm shadow-sm space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Vendor Summary</h4>
                {isSelected && (
                  <span className="bg-[#C9A84C] text-black text-[8px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-sm flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} /> Selected
                  </span>
                )}
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-[#E8DFC9] dark:border-white/10 pb-3">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-[#1A1512] dark:text-white">{vendor.categoryLabel}</span>
                </li>
                {vendor.responseTime && (
                  <li className="flex justify-between border-b border-[#E8DFC9] dark:border-white/10 pb-3">
                    <span className="text-gray-500">Response Time</span>
                    <span className="font-semibold text-[#1A1512] dark:text-white">{vendor.responseTime}</span>
                  </li>
                )}
                {vendor.depositReq && (
                  <li className="flex justify-between border-b border-[#E8DFC9] dark:border-white/10 pb-3">
                    <span className="text-gray-500">Deposit Req.</span>
                    <span className="font-semibold text-[#1A1512] dark:text-white">{vendor.depositReq}</span>
                  </li>
                )}
                {vendor.cancellation && (
                  <li className="flex justify-between pb-1">
                    <span className="text-gray-500">Cancellation</span>
                    <span className="font-semibold text-[#1A1512] dark:text-white">{vendor.cancellation}</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSelectVendorClick} 
                className={`w-full py-3.5 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all shadow-md flex items-center justify-center gap-2
                  ${isSelected 
                    ? 'bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                    : 'bg-[#C69C6D] text-white border border-[#C69C6D] hover:bg-[#B58B5C]'}`}
              >
                {isSelected ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                {isSelected ? "Deselect Vendor" : "Select This Vendor"}
              </button>
              <button 
                onClick={() => setContactModalOpen(true)} 
                className="w-full border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 py-3.5 text-[10px] uppercase font-bold tracking-widest rounded-sm hover:border-[#C69C6D] hover:text-[#C69C6D] transition-colors"
              >
                Contact Vendor
              </button>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4 px-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Verified Vendor</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{vendor.reviewsCount} Reviews</span>
            </div>
            {vendor.eventsCompleted && (
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{vendor.eventsCompleted} Events Completed</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#C69C6D]" strokeWidth={1.5} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {vendor.availableIslandWide !== false ? "Available Island-wide" : "Available Locally Only"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Replacement Confirmation Modal */}
      <AnimatePresence>
        {replaceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setReplaceModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#1A1A1A] p-8 max-w-md w-full rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#E8DFC9] dark:border-[#C9A84C]/30 text-center z-10"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C1E14] dark:text-white mb-3">Replace Selected Partner?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                You already have <strong className="text-black dark:text-white">"{existingVendorName}"</strong> selected in this category. Would you like to confirm and replace them with <strong className="text-black dark:text-white">"{vendor.name}"</strong>?
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setReplaceModalOpen(false)}
                  className="flex-1 py-3 border border-[#E8DFC9] dark:border-gray-700 text-[#1A1512] dark:text-gray-300 text-xs uppercase font-bold tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReplace}
                  className="flex-1 py-3 bg-[#C9A84C] text-black text-xs uppercase font-bold tracking-widest hover:bg-opacity-95 transition-colors rounded-sm"
                >
                  Confirm & Replace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Vendor Modal */}
      <AnimatePresence>
        {contactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setContactModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#111111] p-8 max-w-lg w-full rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#E8DFC9] dark:border-[#C9A84C]/30 z-10 flex flex-col"
            >
              <button 
                onClick={() => setContactModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {!inquirySent ? (
                <>
                  <h3 className="font-serif text-2xl text-[#2C1E14] dark:text-white mb-6 border-b border-[#E8DFC9] dark:border-zinc-800 pb-3">Contact Partner</h3>
                  
                  <div className="flex gap-4 items-center mb-6 bg-[#FAF6EE] dark:bg-black p-4 border border-[#E8DFC9]/50 dark:border-white/5">
                    <img src={vendor.avatar || vendor.image} className="w-16 h-16 rounded-full object-cover border border-[#C9A84C]" alt={vendor.name} />
                    <div className="text-left">
                      <h4 className="font-serif text-lg text-black dark:text-white font-bold">{vendor.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{vendor.categoryLabel} • {vendor.location || "Colombo, LK"}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-[#C9A84C]" />
                        <span>{vendor.contactPhone || "+94 77 123 4567"}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-[#C9A84C]" />
                        <span>{vendor.contactEmail || `hello@${vendor.id}.com`}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-[#A67C52] font-bold mb-2">Message Inquiry</label>
                      <textarea
                        rows={4}
                        value={inquiryText}
                        onChange={(e) => setInquiryText(e.target.value)}
                        className="w-full bg-white dark:bg-[#1A1A1A] text-xs text-black dark:text-white border border-[#E8DFC9] dark:border-[#C9A84C]/30 p-3 outline-none focus:border-[#C9A84C] rounded-sm font-sans"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={sendInquiry}
                    disabled={isInquiring}
                    className="w-full py-3.5 bg-[#C9A84C] text-black text-xs uppercase font-bold tracking-widest hover:bg-opacity-90 transition-all rounded-sm flex items-center justify-center gap-2"
                  >
                    {isInquiring ? "Sending inquiry..." : "Send Event Inquiry"}
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-emerald-500" strokeWidth={3} />
                  </div>
                  <h3 className="font-serif text-2xl text-[#2C1E14] dark:text-white mb-3">Inquiry Sent Successfully!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed px-4">
                    Your inquiry has been successfully transmitted to <strong className="text-black dark:text-white">{vendor.name}</strong>. The partner will get back to you shortly via contact phone or email.
                  </p>
                  <button 
                    onClick={() => setContactModalOpen(false)}
                    className="px-8 py-3 bg-[#C9A84C] text-black text-xs uppercase font-bold tracking-widest hover:bg-opacity-95 transition-colors rounded-sm"
                  >
                    Back to Profile
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
