"use client";

import React, { useState, useEffect } from "react";
import { Vendor } from "@/components/landing/vendors/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, MapPin, Star, Calendar, Truck, Headphones, Check, X, Phone, Mail, AlertTriangle, MessageSquare, ThumbsUp, Share2, MoreHorizontal, Package } from "lucide-react";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { motion, AnimatePresence } from "framer-motion";
import { vendorAPI } from "@/lib/api";

interface VendorProfileContentProps {
  vendor: Vendor;
  isBooking?: boolean;
}

export default function VendorProfileContent({ vendor, isBooking = false }: VendorProfileContentProps) {
  const router = useRouter();
  const { vendors: allVendors } = useVendorStore();
  const { vendors: cartVendors, setVendor, requestedDesigns, setRequestedDesign } = useVendorCartStore();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [expandedReviews, setExpandedReviews] = useState<string | null>(null);
  const [expandedAlbums, setExpandedAlbums] = useState<Record<string, boolean>>({});

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedDays, setBookedDays] = useState<number[]>([]);
  const [blockedDays, setBlockedDays] = useState<number[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "availability") {
      const fetchAvailability = async () => {
        setCalendarLoading(true);
        try {
          const res = await vendorAPI.checkVendorAvailability(vendor.id, {
            month: currentMonth.getMonth() + 1,
            year: currentMonth.getFullYear()
          });
          if (res.ok) {
            setBookedDays(res.data.bookedDays || []);
            setBlockedDays(res.data.blockedDays || []);
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
        } finally {
          setCalendarLoading(false);
        }
      };
      fetchAvailability();
    }
  }, [activeTab, currentMonth, vendor.id]);

  // Selection state
  const storeCat = getStoreCategory(vendor.category);
  const isSelected = cartVendors[storeCat] === vendor.id;

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "2 days ago";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

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
    if ((activeTab === "portfolio" || activeTab === "designs") && vendor.id) {
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

  const [pendingDesignSelection, setPendingDesignSelection] = useState<{ id: string, price: number } | null>(null);

  const handleSelectVendorClick = () => {
    const existingId = cartVendors[storeCat];

    if (existingId === vendor.id) {
      // Deselect
      setVendor(storeCat, null);
      setRequestedDesign(storeCat, null, null);
      return;
    }

    if (existingId) {
      const existing = allVendors.find(v => v.id === existingId);
      setExistingVendorName(existing ? existing.name : "another provider");
      setPendingDesignSelection(null);
      setReplaceModalOpen(true);
    } else {
      // Select directly
      setVendor(storeCat, vendor.id);
      setRequestedDesign(storeCat, null, null);
    }
  };

  const handleSelectDesignClick = (albId: string, price: number) => {
    const existingId = cartVendors[storeCat];
    const existingDesignId = requestedDesigns[storeCat];

    if (existingId === vendor.id && existingDesignId === albId) {
      // Deselect
      setVendor(storeCat, null);
      setRequestedDesign(storeCat, null, null);
      return;
    }

    if (existingId && existingId !== vendor.id) {
      const existing = allVendors.find(v => v.id === existingId);
      setExistingVendorName(existing ? existing.name : "another provider");
      setPendingDesignSelection({ id: albId, price });
      setReplaceModalOpen(true);
    } else {
      // Select directly or swap design for same vendor
      setVendor(storeCat, vendor.id);
      setRequestedDesign(storeCat, albId, price);
    }
  };

  const confirmReplace = () => {
    setVendor(storeCat, vendor.id);
    if (pendingDesignSelection) {
      setRequestedDesign(storeCat, pendingDesignSelection.id, pendingDesignSelection.price);
    } else {
      setRequestedDesign(storeCat, null, null);
    }
    setPendingDesignSelection(null);
    setReplaceModalOpen(false);
  };

  const sendInquiry = () => {
    setIsInquiring(true);
    setTimeout(() => {
      setIsInquiring(false);
      setInquirySent(true);
    }, 1200);
  };

  const tabs = (() => {
    if (vendor.category === "videographers") {
      return [
        { id: "overview", label: "Overview" },
        { id: "designs", label: "Portfolio" },
        { id: "packages", label: "Packages" },
        { id: "about", label: "About" },
      ];
    }
    if (vendor.category === "djs") {
      return [
        { id: "overview", label: "Overview" },
        { id: "packages", label: "Packages" },
        { id: "about", label: "About" },
      ];
    }
    return [
      { id: "overview", label: "Overview" },
      { id: "designs", label: "Designs" },
      { id: "about", label: "About" },
    ];
  })();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#E8DFC9] dark:border-white/10 overflow-x-auto pb-[1px] mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 text-[14px] md:text-[15px] tracking-[0.08em] uppercase font-bold whitespace-nowrap transition-all relative
                ${activeTab === tab.id 
                  ? "text-[#1A1512] dark:text-[#C69C6D]" 
                  : "text-gray-400 hover:text-[#1A1512] dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/5 rounded-t-sm"}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[4px] bg-[#1A1512] dark:bg-[#C69C6D] rounded-t-md" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="min-h-100">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* About Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-serif text-[#1A1512] dark:text-white font-bold border-b border-[#E8DFC9] dark:border-white/10 pb-3">
                  About {vendor.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-3xl">
                  {vendor.description}
                </p>
              </section>

              {/* Events We Serve Section */}
              {vendor.eventTypesServed && vendor.eventTypesServed.filter(e => e !== 'Other' && e !== 'Islandwide').length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Events We Serve
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                    {vendor.eventTypesServed
                      .filter(e => e !== 'Other' && e !== 'Islandwide')
                      .map((eventType, i) => {
                        let icon = "✨"; 
                        if (eventType === "Wedding") icon = "💍";
                        else if (eventType === "Engagement") icon = "💐";
                        else if (eventType === "Birthday") icon = "🎂";
                        else if (eventType === "Anniversary") icon = "🥂";
                        else if (eventType === "Corporate") icon = "🏢";
                        else if (eventType === "Graduation") icon = "🎓";
                        else if (eventType === "Baby Shower") icon = "👶";
                        else if (eventType === "Private Party") icon = "🎉";

                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xl">{icon}</span>
                            <span className="text-[13px] text-gray-800 dark:text-gray-200 font-medium">{eventType}</span>
                          </div>
                        );
                      })}
                  </div>
                </section>
              )}

              {/* Decoration Specialties */}
              {vendor.specialties && vendor.specialties.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Decoration Specialties
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {vendor.specialties.map((spec, i) => (
                      <span 
                        key={i} 
                        className="text-[#1A1512] dark:text-gray-200 text-[13px] font-medium tracking-widest uppercase border border-[#E8DFC9] dark:border-white/10 bg-[#FAF6EE]/50 dark:bg-black px-4 py-2 rounded-sm shadow-sm hover:border-[#C69C6D] transition-colors"
                      >
                        [ {spec} ]
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Cultural Expertise */}
              {vendor.culturalExpertise && vendor.culturalExpertise.length > 0 && (
                <section className="space-y-6">
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Cultural & Religious Expertise
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {vendor.culturalExpertise.map((culture, i) => (
                      <span 
                        key={i} 
                        className="text-[#C69C6D] text-[13px] font-bold tracking-widest uppercase border-b-2 border-[#C69C6D]/30 pb-1"
                      >
                        {culture}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* PACKAGES TAB */}
          {activeTab === "packages" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white">Our Packages</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#E8DFC9] dark:from-[#C9A84C]/30 to-transparent" />
              </div>
              
              {vendor.packages && vendor.packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vendor.packages.map((pkg, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 rounded-xl p-6 shadow-sm flex flex-col transition-all hover:-translate-y-1 hover:shadow-md">
                      <h4 className="text-lg font-bold text-[#1A1512] dark:text-white mb-2">{pkg.name}</h4>
                      <div className="text-2xl font-serif text-[#C69C6D] mb-4">Rs {Number(pkg.price).toLocaleString()}</div>
                      <ul className="space-y-3 flex-1">
                        {Array.isArray(pkg.features) 
                          ? pkg.features.map((feature: any, fIdx: number) => (
                            <li key={fIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Check className="w-4 h-4 text-[#C69C6D] flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))
                          : (pkg as any).details ? (pkg as any).details.split(',').map((detail: string, dIdx: number) => (
                            <li key={dIdx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Check className="w-4 h-4 text-[#C69C6D] flex-shrink-0 mt-0.5" />
                              <span>{detail.trim()}</span>
                            </li>
                          )) : null
                        }
                      </ul>
                      <button 
                        onClick={() => {
                           const bookButton = document.getElementById('book-vendor-button');
                           if (bookButton) bookButton.click();
                        }}
                        className="mt-6 w-full py-3 bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFC9] dark:border-[#C9A84C]/20 text-[#1A1512] dark:text-white text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-[#E8DFC9] dark:hover:bg-[#C9A84C]/20 transition-colors"
                      >
                        Select Package
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-[#111315] rounded-xl border border-dashed border-[#E8DFC9] dark:border-white/10">
                  <Package className="w-8 h-8 text-gray-300 dark:text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No specific packages listed. Please contact the vendor for custom quotes.</p>
                </div>
              )}
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === "about" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* About the business */}
              <section className="space-y-3">
                <h3 className="text-sm font-serif font-bold text-[#1A1512] dark:text-white border-b border-[#E8DFC9] dark:border-white/10 pb-2">
                  About the business
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm max-w-3xl">
                  {vendor.description || "No description provided."}
                </p>
              </section>

              {/* Location */}
              {vendor.location && (
                <section className="space-y-3">
                  <h3 className="text-sm font-serif font-bold text-[#1A1512] dark:text-white border-b border-[#E8DFC9] dark:border-white/10 pb-2">
                    Location
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-[#C69C6D]" /> {vendor.location}
                  </div>
                </section>
              )}

              {/* Service areas */}
              {(((vendor.serviceAreas?.length ?? 0) > 0) || vendor.availableIslandWide) && (
                <section className="space-y-3">
                  <h3 className="text-sm font-serif font-bold text-[#1A1512] dark:text-white border-b border-[#E8DFC9] dark:border-white/10 pb-2">
                    Service areas
                  </h3>
                  <div className="text-sm text-gray-700 dark:text-gray-300 pt-1">
                    {vendor.availableIslandWide || vendor.serviceAreas?.includes("Islandwide") ? (
                      <span className="flex items-center gap-2 text-[#C69C6D] font-bold">
                        Islandwide Service
                      </span>
                    ) : (
                      <ul className="space-y-2 uppercase tracking-widest text-[11px] font-medium text-gray-600 dark:text-gray-400">
                        {vendor.serviceAreas?.map((area, idx) => (
                          <li key={idx}>{area}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* DESIGNS TAB */}
          {activeTab === "designs" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl mx-auto">
              {dynamicAlbums && dynamicAlbums.length > 0 ? (
                /* Published Albums Posts Feed */
                <div className="flex flex-col gap-8">
                  {dynamicAlbums.map((alb) => (
                    <div
                      key={alb._id}
                      className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 rounded-xl overflow-hidden shadow-sm flex flex-col"
                    >
                      {/* Facebook Post Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <img src={vendor.avatar || vendor.image} className="w-10 h-10 rounded-full object-cover border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-sm" alt={vendor.name} />
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#1A1512] dark:text-white leading-tight">
                              {vendor.name} <span className="font-normal text-gray-500">added a new design showcase.</span>
                            </span>
                            <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                              {formatTimeAgo(alb.createdAt)} • 🌍
                            </span>
                          </div>
                        </div>
                        <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><MoreHorizontal className="w-5 h-5" /></button>
                      </div>

                      {/* Post Content (Title + Description) */}
                      <div className="px-4 pb-4">
                        <h4 className="font-bold text-[15px] text-[#1A1512] dark:text-white mb-1">
                          {alb.title}
                        </h4>
                        {alb.description && (
                          <p className="text-[14px] text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {alb.description}
                          </p>
                        )}
                      </div>

                      {/* All Images Grid */}
                      {(() => {
                        const isExpanded = expandedAlbums[alb._id];
                        const imagesList = alb.images || [];
                        const visibleImages = isExpanded ? imagesList : imagesList.slice(0, 4);
                        const hasMore = !isExpanded && imagesList.length > 4;
                        const extraCount = imagesList.length - 4;

                        return (
                          <div className={`grid gap-0.5 border-t border-[#E8DFC9] dark:border-white/10 ${
                            visibleImages.length === 1 ? 'grid-cols-1' :
                            visibleImages.length === 2 ? 'grid-cols-2' :
                            visibleImages.length === 3 ? 'grid-cols-2' :
                            'grid-cols-2'
                          }`}>
                            {visibleImages.map((img: any, i: number) => {
                              const isLastVisible = i === 3 && hasMore;
                              return (
                                <div 
                                  key={i} 
                                  onClick={() => {
                                    if (isLastVisible) {
                                      setExpandedAlbums(prev => ({...prev, [alb._id]: true}));
                                    }
                                  }}
                                  className={`relative bg-[#FAF6EE] dark:bg-black group overflow-hidden ${
                                    visibleImages.length === 1 ? 'aspect-[4/3] sm:aspect-video' :
                                    (visibleImages.length === 3 && i === 0) ? 'col-span-2 aspect-video' : 
                                    'aspect-square'
                                  } ${isLastVisible ? 'cursor-pointer' : ''}`}
                                >
                                  <img 
                                    src={typeof img === 'string' ? img : img.url} 
                                    alt={img.caption || `${alb.title} photo ${i + 1}`}
                                    className={`w-full h-full object-cover transition-transform duration-700 ${isLastVisible ? '' : 'group-hover:scale-105'}`}
                                    loading="lazy"
                                  />
                                  {isLastVisible && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-colors hover:bg-black/70">
                                      <span className="text-white text-3xl font-bold">+{extraCount}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {/* Post Footer Actions */}
                      {vendor.category !== "videographers" && (
                        <div className="p-4 border-t border-[#E8DFC9] dark:border-white/10 flex flex-col sm:flex-row gap-3">
                          {(() => {
                            const isVendorSelected = cartVendors[storeCat] === vendor.id;
                            const isThisDesignSelected = isVendorSelected && requestedDesigns[storeCat] === alb._id;
                            
                            return (
                              <button 
                                onClick={() => handleSelectDesignClick(alb._id, alb.price || 0)} 
                                className={`flex-1 py-2.5 text-[11px] uppercase font-bold tracking-widest rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                                  isThisDesignSelected 
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20" 
                                    : "bg-[#C69C6D] text-white hover:bg-[#B58B5C]"
                                }`}
                              >
                                {isThisDesignSelected ? (
                                  <>
                                    <X className="w-4 h-4" /> Deselect Design
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" /> Select This Design
                                  </>
                                )}
                              </button>
                            );
                          })()}
                          <button 
                            onClick={() => setExpandedReviews(expandedReviews === alb._id ? null : alb._id)}
                            className={`flex-1 py-2.5 text-[11px] uppercase font-bold tracking-widest rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 border border-[#E8DFC9] dark:border-[#C9A84C]/30 ${expandedReviews === alb._id ? 'bg-[#E8DFC9] dark:bg-[#C9A84C]/20 text-[#1A1512] dark:text-white' : 'text-[#1A1512] dark:text-white hover:bg-[#FAF6EE] dark:hover:bg-white/5'}`}
                          >
                            {expandedReviews === alb._id ? 'Hide Reviews' : 'View Reviews'} {(alb as any).reviews && (alb as any).reviews.length > 0 ? `(${(alb as any).reviews.length})` : ""}
                          </button>
                        </div>
                      )}

                      {/* Expandable Reviews Section for this specific design */}
                      <AnimatePresence>
                        {expandedReviews === alb._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-[#E8DFC9] dark:border-white/10"
                          >
                            <div className="p-4 bg-gray-50 dark:bg-[#111315] space-y-4">
                              <h4 className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                Customer Reviews for this Design
                              </h4>
                              {(alb as any).reviews && (alb as any).reviews.length > 0 ? (
                                <div className="space-y-4">
                                  {(alb as any).reviews.map((rev: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-black border border-[#E8DFC9] dark:border-white/10 p-4 rounded-sm shadow-sm space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#111315] text-[#A6955C] flex items-center justify-center font-bold text-[10px] uppercase">
                                            {rev.client ? rev.client.substring(0, 2) : "C"}
                                          </div>
                                          <span className="font-bold text-[#1A1512] dark:text-white text-xs">{rev.client}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                          {[...Array(5)].map((_, starIdx) => (
                                            <Star key={starIdx} className={`w-3 h-3 ${starIdx < Math.round(rev.rating) ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 fill-gray-300'}`} />
                                          ))}
                                        </div>
                                      </div>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs italic">
                                        "{rev.text}"
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-6 text-center border border-dashed border-[#E8DFC9] dark:border-white/10 rounded-sm">
                                  <p className="text-gray-500 text-xs">No reviews yet for this specific design.</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                /* Static Portfolio Fallback Grid */
                <div className="flex flex-col gap-8">
                  {vendor.portfolio && vendor.portfolio.length > 0 && (
                    <div className="bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-[#C9A84C]/20 rounded-xl overflow-hidden shadow-sm flex flex-col">
                      
                      {/* Post Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <img src={vendor.avatar || vendor.image} className="w-10 h-10 rounded-full object-cover border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-sm" alt={vendor.name} />
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-[#1A1512] dark:text-white leading-tight">
                              {vendor.name} <span className="font-normal text-gray-500">shared a design showcase.</span>
                            </span>
                            <span className="text-[12px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                              Recently • 🌍
                            </span>
                          </div>
                        </div>
                        <button className="text-gray-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><MoreHorizontal className="w-5 h-5" /></button>
                      </div>

                      {/* Post Content */}
                      <div className="px-4 pb-4">
                        <p className="text-[14px] text-gray-700 dark:text-gray-300">
                          Loving the vibes from our showcase setups! ✨
                        </p>
                      </div>

                      {/* All Images Grid */}
                      {(() => {
                        const isExpanded = expandedAlbums['static'];
                        const imagesList = vendor.portfolio || [];
                        const visibleImages = isExpanded ? imagesList : imagesList.slice(0, 4);
                        const hasMore = !isExpanded && imagesList.length > 4;
                        const extraCount = imagesList.length - 4;

                        return (
                          <div className={`grid gap-0.5 border-t border-[#E8DFC9] dark:border-white/10 ${
                            visibleImages.length === 1 ? 'grid-cols-1' :
                            visibleImages.length === 2 ? 'grid-cols-2' :
                            visibleImages.length === 3 ? 'grid-cols-2' :
                            'grid-cols-2'
                          }`}>
                            {visibleImages.map((img: string, i: number) => {
                              const isLastVisible = i === 3 && hasMore;
                              return (
                                <div 
                                  key={i} 
                                  onClick={() => {
                                    if (isLastVisible) {
                                      setExpandedAlbums(prev => ({...prev, 'static': true}));
                                    }
                                  }}
                                  className={`relative bg-[#FAF6EE] dark:bg-black group overflow-hidden ${
                                    visibleImages.length === 1 ? 'aspect-[4/3] sm:aspect-video' :
                                    (visibleImages.length === 3 && i === 0) ? 'col-span-2 aspect-video' : 
                                    'aspect-square'
                                  } ${isLastVisible ? 'cursor-pointer' : ''}`}
                                >
                                  <img 
                                    src={img} 
                                    alt={`${vendor.name} portfolio ${i + 1}`}
                                    className={`w-full h-full object-cover transition-transform duration-700 ${isLastVisible ? '' : 'group-hover:scale-105'}`}
                                    loading="lazy"
                                  />
                                  {isLastVisible && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-colors hover:bg-black/70">
                                      <span className="text-white text-3xl font-bold">+{extraCount}</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {/* Post Footer Actions */}
                      {vendor.category !== "videographers" && (
                        <div className="p-4 border-t border-[#E8DFC9] dark:border-white/10 flex flex-col sm:flex-row gap-3">
                          {(() => {
                            const isVendorSelected = cartVendors[storeCat] === vendor.id;
                            return (
                              <button 
                                onClick={handleSelectVendorClick} 
                                className={`flex-1 py-2.5 text-[11px] uppercase font-bold tracking-widest rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                                  isVendorSelected 
                                    ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20" 
                                    : "bg-[#C69C6D] text-white hover:bg-[#B58B5C]"
                                }`}
                              >
                                {isVendorSelected ? (
                                  <>
                                    <X className="w-4 h-4" /> Deselect Design
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4" /> Select This Design
                                  </>
                                )}
                              </button>
                            );
                          })()}
                          <button 
                            onClick={() => setExpandedReviews(expandedReviews === 'static' ? null : 'static')}
                            className={`flex-1 py-2.5 text-[11px] uppercase font-bold tracking-widest rounded-sm transition-all shadow-sm flex items-center justify-center gap-2 border border-[#E8DFC9] dark:border-[#C9A84C]/30 ${expandedReviews === 'static' ? 'bg-[#E8DFC9] dark:bg-[#C9A84C]/20 text-[#1A1512] dark:text-white' : 'text-[#1A1512] dark:text-white hover:bg-[#FAF6EE] dark:hover:bg-white/5'}`}
                          >
                            {expandedReviews === 'static' ? 'Hide Reviews' : 'View Reviews'} {vendor.reviews && vendor.reviews.length > 0 ? `(${vendor.reviews.length})` : ""}
                          </button>
                        </div>
                      )}

                      {/* Expandable Reviews Section for Static Portfolio */}
                      <AnimatePresence>
                        {expandedReviews === 'static' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-[#E8DFC9] dark:border-white/10"
                          >
                            <div className="p-4 bg-gray-50 dark:bg-[#111315] space-y-4">
                              <h4 className="text-[11px] uppercase tracking-widest font-bold text-gray-500 mb-2">
                                General Customer Reviews
                              </h4>
                              {vendor.reviews && vendor.reviews.length > 0 ? (
                                <div className="space-y-4">
                                  {vendor.reviews.map((rev: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-black border border-[#E8DFC9] dark:border-white/10 p-4 rounded-sm shadow-sm space-y-2">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#111315] text-[#A6955C] flex items-center justify-center font-bold text-[10px] uppercase">
                                            {rev.client ? rev.client.substring(0, 2) : "C"}
                                          </div>
                                          <span className="font-bold text-[#1A1512] dark:text-white text-xs">{rev.client}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                          {[...Array(5)].map((_, starIdx) => (
                                            <Star key={starIdx} className={`w-3 h-3 ${starIdx < Math.round(rev.rating) ? 'text-[#C69C6D] fill-[#C69C6D]' : 'text-gray-300 fill-gray-300'}`} />
                                          ))}
                                        </div>
                                      </div>
                                      <p className="text-gray-600 dark:text-gray-400 text-xs italic">
                                        "{rev.text}"
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-6 text-center border border-dashed border-[#E8DFC9] dark:border-white/10 rounded-sm">
                                  <p className="text-gray-500 text-xs">No reviews yet.</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
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
                      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Booked / Blocked</span>
                    </div>
                  </div>
                </div>
                
                {/* Dynamic Calendar Widget */}
                <div className="w-full md:w-[320px] shrink-0 border border-[#E8DFC9] dark:border-white/10 rounded-sm overflow-hidden bg-[#FAF6EE] dark:bg-black relative">
                  {calendarLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#C69C6D] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8DFC9] dark:border-white/10">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:bg-[#E8DFC9] dark:hover:bg-white/10 rounded-sm transition-colors">&lt;</button>
                    <span className="text-sm font-bold tracking-widest uppercase text-[#1A1512] dark:text-white">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:bg-[#E8DFC9] dark:hover:bg-white/10 rounded-sm transition-colors">&gt;</button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                        <span key={d} className="text-[9px] text-gray-400 font-bold">{d}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay())].map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                      ))}
                      {[...Array(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                        const day = i + 1;
                        const isUnavailable = bookedDays.includes(day) || blockedDays.includes(day);
                        return (
                          <div 
                            key={day} 
                            className={`aspect-square flex items-center justify-center text-xs rounded-sm transition-colors
                              ${isUnavailable ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50' : 
                                'hover:bg-[#C69C6D] hover:text-white text-[#1A1512] dark:text-gray-300 font-medium cursor-pointer bg-white dark:bg-transparent shadow-sm hover:shadow-none'}`}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setReplaceModalOpen(false);
                setPendingDesignSelection(null);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative bg-white dark:bg-[#111315] border border-[#E8DFC9] dark:border-white/10 p-8 rounded-sm shadow-xl max-w-md w-full"
            >
              <div className="flex items-center gap-4 text-[#C69C6D] mb-6">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">Replace Vendor?</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                You already have <strong className="text-[#1A1512] dark:text-white">{existingVendorName}</strong> selected for {vendor.categoryLabel.toLowerCase()}s. Would you like to replace them with <strong className="text-[#1A1512] dark:text-white">{vendor.name}</strong>?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setReplaceModalOpen(false);
                    setPendingDesignSelection(null);
                  }} 
                  className="flex-1 py-3 text-[11px] uppercase font-bold tracking-widest border border-[#E8DFC9] dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReplace} 
                  className="flex-1 py-3 text-[11px] uppercase font-bold tracking-widest bg-[#C69C6D] text-white hover:bg-[#B58B5C] transition-colors shadow-sm"
                >
                  Replace
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
