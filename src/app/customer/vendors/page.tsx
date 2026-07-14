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
  const [activeTab, setActiveTab] = useState<"all" | "decorators" | "videographers" | "djs">("all");

  const [viewMode, setViewMode] = useState<"gallery" | "cards">("gallery");

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
    if (tabParam && ["all", "decorators", "videographers", "djs"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      // Basic Tab Matching
      if (activeTab !== "all" && v.category !== activeTab) return false;
      
      // Keyword Search
      if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase()) && !v.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Rating Match
      if (v.rating < ratingFilter) return false;
      
      // Budget Tier
      if (priceFilter !== "all" && v.priceLevel !== priceFilter) return false;
      
      // Additional filters can be implemented here based on style/setting if they exist in Vendor interface
      
      return true;
    });
  }, [vendors, activeTab, searchQuery, ratingFilter, priceFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setRatingFilter(0);
    setPriceFilter("all");
    setStyleFilter("all");
    setSettingFilter("all");
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredCount={filteredVendors.length}
        />

        <div className="max-w-7xl mx-auto px-6 mt-6 mb-4 flex items-center gap-4">
          <div className="flex border border-[#D4C9A8] dark:border-[#C9A84C]/30 rounded-sm overflow-hidden">
            <button 
              onClick={() => setViewMode("gallery")}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest transition-colors ${viewMode === "gallery" ? "bg-[#C9A84C] text-black" : "bg-white dark:bg-[#111111] text-gray-500 hover:text-[#C9A84C]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              Portfolio Gallery
            </button>
            <button 
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest transition-colors border-l border-[#D4C9A8] dark:border-[#C9A84C]/30 ${viewMode === "cards" ? "bg-[#C9A84C] text-black" : "bg-white dark:bg-[#111111] text-gray-500 hover:text-[#C9A84C]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Browse Vendors
            </button>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold hidden md:inline-block">Click any image to discover the vendor</span>
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
              isGuest={false}
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
