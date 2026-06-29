"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/Landing/shared/MainNavbar";
import Footer from "@/components/Landing/shared/Footer";
import PackagesHero from "@/components/Landing/packages/PackagesHero";
import PackageCards from "@/components/Landing/packages/PackageCards";
import ComparisonMatrix from "@/components/Landing/packages/ComparisonMatrix";
import CostCalculator from "@/components/Landing/packages/CostCalculator";
import FAQAccordion from "@/components/Landing/packages/FAQAccordion";
import TrustSection from "@/components/Landing/packages/TrustSection";

export default function PackagesPage() {
  const [activePackage, setActivePackage] = useState<"silver" | "gold" | "diamond">("gold");

  return (
    <div className="bg-[#FDFBF7] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#2C1E14] dark:text-white transition-colors duration-300">
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
