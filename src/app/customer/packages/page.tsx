"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import PackagesHero from "@/components/landing/packages/PackagesHero";
import PackageCards from "@/components/landing/packages/PackageCards";
import ComparisonMatrix from "@/components/landing/packages/ComparisonMatrix";
import CostCalculator from "@/components/landing/packages/CostCalculator";
import FAQAccordion from "@/components/landing/packages/FAQAccordion";
import TrustSection from "@/components/landing/packages/TrustSection";

export default function PackagesPage() {
  const [activePackage, setActivePackage] = useState<"silver" | "gold" | "diamond">("gold");

  return (
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col font-sans text-[#2C1E14]">
      <MainNavbar />
      
      <main className="flex-grow">
        <PackagesHero />
        
        <PackageCards 
          activePackage={activePackage} 
          setActivePackage={setActivePackage} 
        />
        
        <ComparisonMatrix />
        
        <CostCalculator />
        
        <FAQAccordion />
        
        <TrustSection />
      </main>

      <Footer />
    </div>
  );
}
