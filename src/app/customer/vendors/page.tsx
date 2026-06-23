"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import VendorsHero from "@/components/landing/vendors/VendorsHero";
import VendorsFilters from "@/components/landing/vendors/VendorsFilters";
import VendorCards from "@/components/landing/vendors/VendorCards";
import VendorsTrust from "@/components/landing/vendors/VendorsTrust";
import { type Vendor } from "@/components/landing/vendors/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useVendorStore } from "@/store/vendorStore";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "decorators" | "djs" | "others">("all");
  
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
    setActiveTab("all");
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesTab = activeTab === "all" || vendor.category === activeTab;
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (vendor.specialties && vendor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesRating = vendor.rating >= ratingFilter;
    const matchesPrice = priceFilter === "all" || vendor.priceLevel === priceFilter;

    return matchesTab && matchesSearch && matchesRating && matchesPrice;
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredCount={filteredVendors.length}
        />

        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full"></div>
          </div>
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
