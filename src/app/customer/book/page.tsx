"use client";

import React, { useState, useMemo } from "react";
import BookHeader from "@/components/landing/book/BookHeader";
import BookHero from "@/components/landing/book/BookHero";
import CalendarPicker from "@/components/landing/book/CalendarPicker";
import TimeslotSelector from "@/components/landing/book/TimeslotSelector";
import PackageSelector, { PACKAGES_LIST } from "@/components/landing/book/PackageSelector";
import GuestCounter from "@/components/landing/book/GuestCounter";
import CostBreakdown from "@/components/landing/book/CostBreakdown";
import BookingForm from "@/components/landing/book/BookingForm";
import TrustDivider from "@/components/landing/book/TrustDivider";
import BookFooter from "@/components/landing/book/BookFooter";

export default function BookPage() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [selectedDate, setSelectedDate] = useState<number>(4); // June 4, 2026 as initial available selection
  const [selectedTimeslot, setSelectedTimeslot] = useState<"morning" | "evening" | "full-day">("evening");
  const [selectedPkg, setSelectedPkg] = useState<"silver" | "gold" | "diamond">("gold");
  const [guestCount, setGuestCount] = useState<number>(380);

  // ==========================================
  // COMPUTED COST METRICS
  // ==========================================
  const activePkg = useMemo(() => {
    return PACKAGES_LIST.find(p => p.id === selectedPkg)!;
  }, [selectedPkg]);

  // Adjust defaults when swapping packages
  const handlePkgChange = (pkgId: "silver" | "gold" | "diamond") => {
    setSelectedPkg(pkgId);
    const target = PACKAGES_LIST.find(p => p.id === pkgId)!;
    setGuestCount(target.baseGuests);
  };

  const timeslotPremium = useMemo(() => {
    if (selectedTimeslot === "evening") return 100000;
    if (selectedTimeslot === "full-day") return 300000;
    return 0; // Morning gala has 0 premium
  }, [selectedTimeslot]);

  const costBreakdown = useMemo(() => {
    const basePrice = activePkg.priceNum;
    const extraGuestsCount = Math.max(0, guestCount - activePkg.baseGuests);
    const guestSurcharges = extraGuestsCount * activePkg.extraGuestFee;
    const grandTotal = basePrice + timeslotPremium + guestSurcharges;
    
    return {
      basePrice,
      extraGuestsCount,
      guestSurcharges,
      timeslotPremium,
      grandTotal
    };
  }, [activePkg, guestCount, timeslotPremium]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0
    }).format(val).replace("LKR", "LKR ");
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1512] font-sans selection:bg-[#C69C6D] selection:text-black">
      
      {/* Sticky Premium Navigation Header */}
      <BookHeader />

      {/* Hero Section */}
      <BookHero />

      {/* Main Reservation Panel */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Interactive Steps Form */}
          <div className="lg:col-span-7 bg-white border border-[#E8DFC9] p-6 md:p-8 shadow-md rounded-sm space-y-8">
            
            {/* STEP 1: Elegant Month Calendar Picker */}
            <CalendarPicker 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
            />

            {/* STEP 2: Timeslot Options */}
            <TimeslotSelector 
              selectedTimeslot={selectedTimeslot} 
              onSelectTimeslot={setSelectedTimeslot} 
            />

            {/* STEP 3: Base Package Selection */}
            <PackageSelector 
              selectedPkg={selectedPkg} 
              onSelectPkg={handlePkgChange} 
            />

            {/* STEP 4: Guest Attendance Count */}
            <GuestCounter 
              guestCount={guestCount} 
              baseGuests={activePkg.baseGuests} 
              extraGuestFee={activePkg.extraGuestFee} 
              onChangeGuestCount={setGuestCount} 
              formatCurrency={formatCurrency} 
            />

          </div>

          {/* RIGHT COLUMN: Cost Breakdown & Request Details Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Pricing Breakdown Card */}
            <CostBreakdown 
              packageName={activePkg.name} 
              selectedTimeslot={selectedTimeslot} 
              costBreakdown={costBreakdown} 
              formatCurrency={formatCurrency} 
            />

            {/* Reservation Form Details */}
            <BookingForm 
              selectedDate={selectedDate} 
              selectedTimeslot={selectedTimeslot} 
              selectedPkg={selectedPkg} 
              guestCount={guestCount} 
              grandTotal={costBreakdown.grandTotal} 
              formatCurrency={formatCurrency} 
            />

          </div>

        </div>
      </section>

      {/* Brand Trust Divider */}
      <TrustDivider />

      {/* Brand Footer Section */}
      <BookFooter />

    </div>
  );
}
