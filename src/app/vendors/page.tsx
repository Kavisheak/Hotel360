"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import VendorsHero from "@/components/landing/vendors/VendorsHero";
import VendorsFilters from "@/components/landing/vendors/VendorsFilters";
import VendorCards from "@/components/landing/vendors/VendorCards";
import VendorsTrust from "@/components/landing/vendors/VendorsTrust";
import PortfolioGallery from "@/components/landing/vendors/PortfolioGallery";
import Footer from "@/components/landing/shared/Footer";
import { useVendorStore } from "@/store/vendorStore";
import { useAuthStore } from "@/store/authStore";
import { useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import AIVisualMatcherModal from "@/components/landing/vendors/AIVisualMatcherModal";

function VendorsContent() {
  const { fetchUser, user } = useAuthStore();
  const { vendors, fetchVendors, isLoading } = useVendorStore();
  
  const [isGuest, setIsGuest] = useState(true);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [settingFilter, setSettingFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [activeTab, setActiveTab] = useState<string>("all");

  const [viewMode, setViewMode] = useState<"gallery" | "cards">("cards");

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const handleAiMatchComplete = (analysis: any) => {
    setAiAnalysis(analysis);
    setActiveTab("decorators");
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchUser();
    fetchVendors();
  }, [fetchUser, fetchVendors]);

  useEffect(() => {
    if (user && (user.role.toLowerCase() === "customer" || user.role.toLowerCase() === "decorator" || user.role.toLowerCase() === "videographer" || user.role.toLowerCase() === "dj-artist")) {
      setIsGuest(false);
    } else {
      setIsGuest(true);
    }
  }, [user]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const matchedVendorsForCards = useMemo(() => {
    if (!aiAnalysis || !aiAnalysis.matches || activeTab !== "decorators") return null;
    
    return aiAnalysis.matches.map((match: any) => {
      const originalVendor = vendors.find(v => v.id === match.vendorId);
      if (!originalVendor) return null;
      
      const matchedItem = originalVendor.portfolioItems?.find(p => (p.id || (p as any)._id) === match.portfolioItemId) || {
        id: match.portfolioItemId,
        title: match.title,
        price: match.price,
        media: [{ url: match.image, isCover: true }],
        description: ""
      };
      
      return {
        ...originalVendor,
        portfolioItems: [{ ...matchedItem, matchScore: match.matchScore }]
      };
    }).filter(Boolean);
  }, [aiAnalysis, vendors, activeTab]);

  const filteredVendors = useMemo(() => {
    let result = vendors.filter(v => {
      // AI Match Logic (now handled separately for display, but we can keep filter logic to just match the vendors if we still want to show them in the main grid if AI match is active. Actually, let's just return true for category matching)
      if (activeTab !== "all" && v.category !== activeTab) return false;
      if (activeTab !== "all" && v.category !== activeTab) return false;
      
      // Keyword Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = v.name.toLowerCase().includes(query);
        const matchesDesc = v.description.toLowerCase().includes(query);
        const matchesSpecialty = v.specialties.some(s => s.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesSpecialty) return false;
      }
      
      // Rating Match
      if (v.rating < ratingFilter) return false;
      
      // Budget Tier
      if (priceFilter !== "all" && v.priceLevel !== priceFilter) return false;
      
      // Availability Filter
      if (availabilityFilter !== "all") {
        const lastChar = v.id.slice(-1);
        const status = ["3", "4", "5"].includes(lastChar) ? "booked" : 
                       ["0", "1", "2"].includes(lastChar) ? "limited" : "available";
        if (availabilityFilter !== status) return false;
      }
      
      // Location Filter
      if (locationFilter !== "all") {
        if (!v.location || !v.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }
      
      return true;
    });

    // Sorting
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "popularity") {
      // Logarithmic Approach: balance between rating quality and review volume
      result.sort((a, b) => {
        const scoreA = a.rating * Math.log10(a.reviewsCount + 1);
        const scoreB = b.rating * Math.log10(b.reviewsCount + 1);
        return scoreB - scoreA;
      });
    } else if (sortBy === "price_low") {
      const getNumericPrice = (p: string) => parseInt(p.replace(/[^0-9]/g, ""), 10) || 0;
      result.sort((a, b) => getNumericPrice(a.startingPrice) - getNumericPrice(b.startingPrice));
    } else if (sortBy === "price_high") {
      const getNumericPrice = (p: string) => parseInt(p.replace(/[^0-9]/g, ""), 10) || 0;
      result.sort((a, b) => getNumericPrice(b.startingPrice) - getNumericPrice(a.startingPrice));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return result;
  }, [vendors, activeTab, searchQuery, ratingFilter, priceFilter, availabilityFilter, locationFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setRatingFilter(0);
    setPriceFilter("all");
    setStyleFilter("all");
    setSettingFilter("all");
    setAvailabilityFilter("all");
    setLocationFilter("all");
    setSortBy("popularity");
    setActiveTab("all");
    setAiAnalysis(null);
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans transition-colors duration-300">
      <MainNavbar />
      
      <main className="flex-grow">
        <VendorsHero />
        
        {/* Premium AI Visualizer Banner */}
        <div className="max-w-7xl mx-auto px-6 mt-8 mb-4">
          <div className="bg-gradient-to-br from-[#FDFBF7] to-[#FAF6EE] dark:from-[#111] dark:to-[#0A0A0A] border border-[#C9A84C]/40 rounded-xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C9A84C] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
            
            <div className="relative z-10 flex items-center gap-5 w-full md:w-auto">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#C9A84C]/30 items-center justify-center text-[#C9A84C] shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-serif font-bold text-[#1A1512] dark:text-white flex items-center gap-2 mb-1">
                  AI Visual Matcher 
                  <span className="bg-[#C9A84C] text-white text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm">New</span>
                </h4>
                <p className="text-xs text-gray-500 max-w-xl">
                  Upload your decoration inspiration and let our AI find the 3-best matching decoration styles for your event.
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 w-full md:w-auto flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 mr-2">
                <img src="/images/decor_sample_1.png" className="w-10 h-10 rounded object-cover border border-[#C9A84C]/30 opacity-80" alt="Decoration Sample 1" />
                <img src="/images/decor_sample_2.png" className="w-10 h-10 rounded object-cover border border-[#C9A84C]/30 opacity-90 scale-110 shadow-md" alt="Decoration Sample 2" />
                <img src="/images/decor_sample_3.png" className="w-10 h-10 rounded object-cover border border-[#C9A84C]/30 opacity-80" alt="Decoration Sample 3" />
              </div>
              <button 
                onClick={() => setIsAiModalOpen(true)}
                className="group relative overflow-hidden w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-[#9D7639] via-[#C9A84C] to-[#9D7639] bg-[length:200%_auto] transition-all duration-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(157,118,57,0.6)] hover:shadow-[0_0_30px_rgba(157,118,57,0.8)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-white/10 blur-md rounded-full animate-pulse z-0 pointer-events-none"></div>
                
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent z-0 pointer-events-none" style={{ animation: 'shimmer 2.5s infinite linear' }}>
                  <style>{`
                    @keyframes shimmer {
                      0% { transform: translateX(-150%) skewX(-12deg); }
                      60% { transform: translateX(300%) skewX(-12deg); }
                      100% { transform: translateX(300%) skewX(-12deg); }
                    }
                  `}</style>
                </div>

                <span className="relative z-10 flex items-center gap-2">
                  Try AI Visual Matcher
                </span>
                <div className="relative z-10 flex items-center pl-1">
                  <Sparkles className="w-4 h-4 opacity-100 animate-pulse text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <VendorsFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          styleFilter={styleFilter}
          setStyleFilter={setStyleFilter}
          settingFilter={settingFilter}
          setSettingFilter={setSettingFilter}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredCount={filteredVendors.length}
        />

        {matchedVendorsForCards && matchedVendorsForCards.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mt-8 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-serif text-[#1A1512] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                Top Matched Decorations
              </h3>
              <button onClick={() => setAiAnalysis(null)} className="text-xs text-gray-500 hover:text-[#C9A84C] underline cursor-pointer">
                Clear Results
              </button>
            </div>
          </div>
        )}
        
        {matchedVendorsForCards && matchedVendorsForCards.length > 0 && (
          <VendorCards 
            filteredVendors={matchedVendorsForCards} 
            onClearFilters={handleClearFilters} 
            isGuest={isGuest} 
            sortBy={sortBy} 
          />
        )}

        <div className="max-w-7xl mx-auto px-6 mt-8 mb-6 flex flex-col sm:flex-row items-center justify-end gap-4">
          <div className="flex items-center gap-4">
            <div className="flex bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-full p-1 shadow-sm">
              <button 
                onClick={() => setViewMode("cards")}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${viewMode === "cards" ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Grid View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>
              </button>
              <button 
                onClick={() => setViewMode("gallery")}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${viewMode === "gallery" ? "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="List View"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-white dark:bg-[#111111] border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              Compare
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-[#C9A84C] text-sm animate-pulse font-serif italic">Loading Elite Partners...</p>
          </div>
        ) : (
          viewMode === "gallery" ? (
            <React.Suspense fallback={<div className="h-64" />}>
              <PortfolioGallery filteredVendors={filteredVendors} />
            </React.Suspense>
          ) : (
            <VendorCards 
              filteredVendors={filteredVendors} 
              onClearFilters={handleClearFilters}
              isGuest={isGuest}
              sortBy={sortBy}
            />
          )
        )}
        
        <VendorsTrust />
      </main>
      
      <AIVisualMatcherModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onMatchComplete={handleAiMatchComplete} 
      />

      <Footer />
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0A0A0A]" />}>
      <VendorsContent />
    </Suspense>
  );
}
