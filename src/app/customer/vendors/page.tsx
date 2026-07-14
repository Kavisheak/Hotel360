"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import VendorsHero from "@/components/landing/vendors/VendorsHero";
import VendorsFilters from "@/components/landing/vendors/VendorsFilters";
import VendorCards from "@/components/landing/vendors/VendorCards";
import VendorsTrust from "@/components/landing/vendors/VendorsTrust";
import PortfolioGallery from "@/components/landing/vendors/PortfolioGallery";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useVendorStore } from "@/store/vendorStore";
import { LayoutGrid, Images } from "lucide-react";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [settingFilter, setSettingFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "decorators" | "videographers" | "djs" | "photographers" | "cake" | "florists">("all");
  const [viewMode, setViewMode] = useState<"portfolio" | "vendors">("portfolio");
  
  const router = useRouter();
  const { user } = useAuthStore();
  
  const { vendors, isLoading, fetchVendors } = useVendorStore();

  React.useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setRatingFilter(0);
    setPriceFilter("all");
    setStyleFilter("all");
    setSettingFilter("all");
    setActiveTab("all");
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesTab = activeTab === "all" || vendor.category === activeTab;
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (vendor.specialties && vendor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesRating = vendor.rating >= ratingFilter;
    const matchesPrice = priceFilter === "all" || vendor.priceLevel === priceFilter;

    const matchesStyle = styleFilter === "all" || 
                         vendor.description.toLowerCase().includes(styleFilter) || 
                         vendor.specialties.some(s => s.toLowerCase().includes(styleFilter));

    const matchesSetting = settingFilter === "all" || 
                           vendor.description.toLowerCase().includes(settingFilter) || 
                           vendor.specialties.some(s => s.toLowerCase().includes(settingFilter));

    return matchesTab && matchesSearch && matchesRating && matchesPrice && matchesStyle && matchesSetting;
  });

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white transition-colors duration-300">
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

        {/* View Mode Toggle */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-2 flex items-center gap-3">
          <div className="flex items-center bg-[#FAF6EE] dark:bg-[#111111] border border-[#E8DFC9] dark:border-white/10 rounded-sm p-1 gap-1">
            <button
              onClick={() => setViewMode("portfolio")}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all duration-200 ${
                viewMode === "portfolio"
                  ? "bg-[#C69C6D] text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#C69C6D]"
              }`}
            >
              <Images className="w-3.5 h-3.5" />
              Portfolio Gallery
            </button>
            <button
              onClick={() => setViewMode("vendors")}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-all duration-200 ${
                viewMode === "vendors"
                  ? "bg-[#C69C6D] text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#C69C6D]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Browse Vendors
            </button>
          </div>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest hidden sm:block">
            {viewMode === "portfolio" ? "Click any image to discover the vendor" : `${filteredVendors.length} vendors found`}
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full"></div>
          </div>
        ) : viewMode === "portfolio" ? (
          <PortfolioGallery
            vendors={filteredVendors}
            isGuest={!user}
          />
        ) : (
          <VendorCards 
            filteredVendors={filteredVendors} 
            onClearFilters={handleClearFilters}
            isGuest={!user}
          />
        )}
        
        <VendorsTrust />
      </main>

      <Footer />
    </div>
  );
}
