"use client";

import React from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import VendorCards from "@/components/landing/vendors/VendorCards";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function SavedVendorsPage() {
  const { favoriteVendors } = useVendorCartStore();
  const { vendors, isLoading, fetchVendors } = useVendorStore();
  const router = useRouter();
  const { user } = useAuthStore();

  React.useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const filteredVendors = vendors.filter((vendor) => 
    favoriteVendors?.includes(vendor.id)
  );

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white transition-colors duration-300">
      <MainNavbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-[#C9A84C]" />
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C1E14] dark:text-white">
            Saved <span className="italic text-[#C9A84C]">Vendors</span>
          </h1>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full"></div>
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="-mx-6">
            <VendorCards filteredVendors={filteredVendors} onClearFilters={() => {}} isGuest={!user} />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111111] border border-[#D4C9A8] dark:border-[#C9A84C]/20 py-16 px-6 text-center space-y-4 rounded-sm shadow-md transition-colors duration-300">
            <h3 className="text-xl font-serif text-[#2C1E14] dark:text-white">Your Favorites list is empty</h3>
            <p className="max-w-md mx-auto text-gray-500 dark:text-gray-400 text-sm">
              Explore our wide range of professional vendors and add them to your favorites to easily find them later.
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
