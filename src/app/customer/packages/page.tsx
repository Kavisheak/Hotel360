"use client";

import React, { useState, useEffect } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import PackagesHero from "@/components/landing/packages/PackagesHero";
import PackageCards from "@/components/landing/packages/PackageCards";
import ComparisonMatrix from "@/components/landing/packages/ComparisonMatrix";
import CostCalculator from "@/components/landing/packages/CostCalculator";
import FAQAccordion from "@/components/landing/packages/FAQAccordion";
import TrustSection from "@/components/landing/packages/TrustSection";
import { packageAPI } from "@/lib/api";

export default function PackagesPage() {
  const [activePackage, setActivePackage] = useState<string>("gold");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await packageAPI.getAllPackages();
        if (res.ok && res.data?.success && Array.isArray(res.data.data)) {
          const mapped = res.data.data.map((pkg: any) => {
            const lowerName = pkg.name.toLowerCase();
            let slug = "gold";
            if (lowerName.includes("silver")) slug = "silver";
            else if (lowerName.includes("diamond")) slug = "diamond";

            return {
              id: slug,
              dbId: pkg._id,
              name: pkg.name,
              price: `LKR ${pkg.price.toLocaleString()}`,
              priceNum: pkg.price,
              guests: `Up to ${pkg.maxGuests} guests`,
              baseGuests: pkg.baseGuests || pkg.maxGuests,
              extraGuestFee: pkg.guestSurcharge || 0,
              description: pkg.description,
              image: slug === "silver" ? "/silver_package.png" : (slug === "diamond" ? "/diamond_package.png" : "/gold_package.png"),
              isMostLoved: pkg.badge === "MOST POPULAR" || pkg.badge === "MOST CHOSEN" || pkg.badge === "MOST LOVED" || pkg.badge === "RECOMMENDED" || pkg.badge === "LIMITED OFFER",
              features: pkg.features || [],
            };
          });
          if (mapped.length > 0) {
            setPackages(mapped);
          }
        }
      } catch (error) {
        console.error("Failed to fetch packages from API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white transition-colors duration-300">
      <MainNavbar />
      
      <main className="flex-grow">
        <PackagesHero />
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <PackageCards 
            activePackage={activePackage} 
            setActivePackage={setActivePackage} 
            packages={packages}
          />
        )}
        
        <ComparisonMatrix />
        
        <CostCalculator />
        
        <FAQAccordion />
        
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}
