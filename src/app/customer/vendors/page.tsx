"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import VendorsHero from "@/components/landing/vendors/VendorsHero";
import VendorsFilters from "@/components/landing/vendors/VendorsFilters";
import VendorCards from "@/components/landing/vendors/VendorCards";
import VendorsTrust from "@/components/landing/vendors/VendorsTrust";
import { VENDORS_DATA, type Vendor } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "decorators" | "djs" | "others">("all");
  
  const router = useRouter();
  const storeVendors = useVendorCartStore((state) => state.vendors);
  const cartVendorsList = useVendorCartStore((state) => state.cartVendors) || [];
  const selectedCount = cartVendorsList.length;

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

        <VendorCards 
          filteredVendors={filteredVendors} 
          onClearFilters={handleClearFilters}
        />
        
        <VendorsTrust />
      </main>

      <Footer />

      {/* Floating Booking Cart Button */}
      {selectedCount > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => router.push("/customer/saved")}
            className="bg-[#C9A84C] text-[#2C1E14] dark:text-[#1A1A1A] px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-[#B89238] transition-transform hover:scale-105 btn-interactive"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {selectedCount}
              </span>
            </div>
            <span className="text-[11px] uppercase font-bold tracking-widest">
              View Cart
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
