"use client";

import React, { useState } from "react";
import PackagesHeader from "@/components/landing/packages/PackagesHeader";
import PackagesHero from "@/components/landing/packages/PackagesHero";
import PackageCards from "@/components/landing/packages/PackageCards";
import ComparisonMatrix from "@/components/landing/packages/ComparisonMatrix";
import CostCalculator from "@/components/landing/packages/CostCalculator";
import FAQAccordion from "@/components/landing/packages/FAQAccordion";
import TrustSection from "@/components/landing/packages/TrustSection";
import PackagesFooter from "@/components/landing/packages/PackagesFooter";

export default function PackagesPage() {
  const [selectedCalcPkg, setSelectedCalcPkg] = useState<"silver" | "gold" | "diamond">("gold");

  const handleSelectPackage = (pkgId: "silver" | "gold" | "diamond") => {
    setSelectedCalcPkg(pkgId);
    const calculatorElement = document.getElementById("calculator");
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1512] font-sans selection:bg-[#C69C6D] selection:text-black">
      {/* Sticky Premium Navigation Header */}
      <PackagesHeader />

      {/* Hero Banner Section */}
      <PackagesHero />

      {/* Signature Packages Display Grid */}
      <PackageCards onSelectPackage={handleSelectPackage} />

      {/* Detailed Side-by-Side Comparison Matrix */}
      <ComparisonMatrix />

      {/* Cost Calculator Section */}
      <CostCalculator 
        selectedPkg={selectedCalcPkg} 
        onPackageChange={setSelectedCalcPkg} 
      />

      {/* Frequently Asked Questions Section */}
      <FAQAccordion />

      {/* Brand Trust Divider */}
      <TrustSection />

      {/* Styled Footer Block Section */}
      <PackagesFooter />
    </div>
  );
}
