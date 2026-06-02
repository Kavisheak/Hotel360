"use client";

import React, { useState, useMemo } from "react";
import { VENDORS_DATA, Vendor } from "@/components/landing/vendors/types";
import VendorsHeader from "@/components/landing/vendors/VendorsHeader";
import VendorsHero from "@/components/landing/vendors/VendorsHero";
import VendorsFilters from "@/components/landing/vendors/VendorsFilters";
import VendorCards from "@/components/landing/vendors/VendorCards";
import VendorDetailModal from "@/components/landing/vendors/VendorDetailModal";
import VendorsTrust from "@/components/landing/vendors/VendorsTrust";
import VendorsFooter from "@/components/landing/vendors/VendorsFooter";

export default function VendorsDirectory() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState<"all" | "decorators" | "djs" | "others">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number>(0); // 0 means all
  const [priceFilter, setPriceFilter] = useState<string>("all");
  
  // Detail Modal State
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // ==========================================
  // FILTERING LOGIC
  // ==========================================
  const filteredVendors = useMemo(() => {
    return VENDORS_DATA.filter((vendor) => {
      // Tab Category Filter
      if (activeTab !== "all" && vendor.category !== activeTab) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = vendor.name.toLowerCase().includes(query);
        const matchesSpecialty = vendor.specialties.some(spec => spec.toLowerCase().includes(query));
        const matchesDesc = vendor.description.toLowerCase().includes(query);
        if (!matchesName && !matchesSpecialty && !matchesDesc) {
          return false;
        }
      }

      // Rating Filter
      if (ratingFilter > 0 && vendor.rating < ratingFilter) {
        return false;
      }

      // Price Level Filter
      if (priceFilter !== "all" && vendor.priceLevel !== priceFilter) {
        return false;
      }

      return true;
    });
  }, [activeTab, searchQuery, ratingFilter, priceFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setRatingFilter(0);
    setPriceFilter("all");
    setActiveTab("all");
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1512] font-sans selection:bg-[#C69C6D] selection:text-black">
      {/* Sticky Premium Navigation Header */}
      <VendorsHeader />

      {/* Hero Banner Section */}
      <VendorsHero />

      {/* Search & Filter Controls System */}
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

      {/* Grid List of Vetted Vendor Cards */}
      <VendorCards
        filteredVendors={filteredVendors}
        onSelectVendor={setSelectedVendor}
        onClearFilters={handleClearFilters}
      />

      {/* Decorative Brand Trust Divider */}
      <VendorsTrust />

      {/* Interactive Vendor Detail Modal Popup Overlay */}
      {selectedVendor && (
        <VendorDetailModal
          selectedVendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}

      {/* Styled Footer Block Section */}
      <VendorsFooter />
    </div>
  );
}
