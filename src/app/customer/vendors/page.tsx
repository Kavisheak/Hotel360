"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import VendorsHero from "@/components/landing/vendors/VendorsHero";
import VendorsFilters from "@/components/landing/vendors/VendorsFilters";
import VendorCards from "@/components/landing/vendors/VendorCards";
import VendorsTrust from "@/components/landing/vendors/VendorsTrust";
import { VENDORS_DATA, type Vendor } from "@/components/landing/vendors/types";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "decorators" | "djs" | "others">("all");

  const handleClearFilters = () => {
    setSearchQuery("");
    setRatingFilter(0);
    setPriceFilter("all");
    setActiveTab("all");
  };

  const filteredVendors = VENDORS_DATA.filter((vendor) => {
    const matchesTab = activeTab === "all" || vendor.category === activeTab;
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vendor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRating = vendor.rating >= ratingFilter;
    const matchesPrice = priceFilter === "all" || vendor.priceLevel === priceFilter;

    return matchesTab && matchesSearch && matchesRating && matchesPrice;
  });

  return (
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col font-sans text-[#2C1E14]">
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredCount={filteredVendors.length}
        />

        <VendorCards 
          filteredVendors={filteredVendors} 
          onClearFilters={handleClearFilters}
        />
        
        <VendorsTrust />
      </main>

      <Footer />
    </div>
  );
}
