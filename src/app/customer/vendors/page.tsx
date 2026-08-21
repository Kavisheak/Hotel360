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

  const filteredVendors = useMemo(() => {
    let result = vendors.filter(v => {
      // Basic Tab Matching
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
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
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
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans transition-colors duration-300">
      <MainNavbar />
      
      <main className="flex-grow">
        <VendorsHero />
        
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

        <div className="max-w-7xl mx-auto px-6 mt-8 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Showing <span className="font-bold text-[#2C1E14] dark:text-white">{filteredVendors.length}</span> verified vendors
          </p>
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
