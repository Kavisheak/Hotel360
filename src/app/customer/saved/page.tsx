"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import VendorCards from "@/components/landing/vendors/VendorCards";
import { VENDORS_DATA } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function SavedVendorsPage() {
  const [activeTab, setActiveTab] = useState<"cart" | "favorites">("cart");
  const { cartVendors, favoriteVendors } = useVendorCartStore();
  const router = useRouter();
  const { user } = useAuthStore();

  const currentListIds = activeTab === "cart" ? cartVendors : favoriteVendors;
  
  const filteredVendors = VENDORS_DATA.filter((vendor) => 
    currentListIds?.includes(vendor.id)
  );

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white transition-colors duration-300">
      <MainNavbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2C1E14] dark:text-white mb-8">
          Saved <span className="italic text-[#C9A84C]">Vendors</span>
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-[#D4C9A8] dark:border-[#C9A84C]/20 mb-8">
          <button
            onClick={() => setActiveTab("cart")}
            className={`flex items-center gap-2 px-6 py-4 text-xs uppercase font-bold tracking-widest transition-colors ${activeTab === "cart" ? "border-b-2 border-[#C9A84C] text-[#2C1E14] dark:text-white" : "text-gray-500 hover:text-[#2C1E14] dark:text-gray-400 dark:hover:text-white"}`}
          >
            <ShoppingCart className="w-4 h-4" />
            Booking Cart ({cartVendors?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-6 py-4 text-xs uppercase font-bold tracking-widest transition-colors ${activeTab === "favorites" ? "border-b-2 border-[#C9A84C] text-[#2C1E14] dark:text-white" : "text-gray-500 hover:text-[#2C1E14] dark:text-gray-400 dark:hover:text-white"}`}
          >
            <Heart className="w-4 h-4" />
            Favorites ({favoriteVendors?.length || 0})
          </button>
        </div>

        {/* Vendor Grid */}
        {filteredVendors.length > 0 ? (
          <div className="-mx-6">
            <VendorCards filteredVendors={filteredVendors} onClearFilters={() => {}} isGuest={!user} />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111111] border border-[#D4C9A8] dark:border-[#C9A84C]/20 py-16 px-6 text-center space-y-4 rounded-sm shadow-md transition-colors duration-300">
            <h3 className="text-xl font-serif text-[#2C1E14] dark:text-white">Your {activeTab === "cart" ? "Cart" : "Favorites"} is empty</h3>
            <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400 text-sm">
              Explore our wide range of professional vendors and add them to your {activeTab === "cart" ? "cart" : "favorites"} to easily find them later.
            </p>
            <button 
              onClick={() => router.push("/customer/vendors")}
              className="btn-interactive bg-[#C9A84C] text-[#2C1E14] px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-[#B89238] transition-colors rounded-sm mt-4 inline-block"
            >
              Browse Vendors
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
