"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import BookHero from "@/components/landing/book/BookHero";
import CalendarPicker from "@/components/landing/book/CalendarPicker";
import CostBreakdown from "@/components/landing/book/CostBreakdown";
import TrustDivider from "@/components/landing/book/TrustDivider";
import TimeslotSelector from "@/components/landing/book/TimeslotSelector";
import PackageSelector from "@/components/landing/book/PackageSelector";
import GuestCounter from "@/components/landing/book/GuestCounter";
import AddonsSelector from "@/components/landing/book/AddonsSelector";
import BookingForm from "@/components/landing/book/BookingForm";

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [timeslot, setTimeslot] = useState<string>("evening");
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");
  const [guestCount, setGuestCount] = useState<number>(380);
  const [addons, setAddons] = useState<string[]>([]);

  // Simple mock calculation logic
  const getBasePrice = () => {
    if (selectedPackage === "silver") return 1800000;
    if (selectedPackage === "diamond") return 5900000;
    return 3400000;
  };

  const getBaseGuests = () => {
    if (selectedPackage === "silver") return 250;
    if (selectedPackage === "diamond") return 480;
    return 380;
  };

  const basePrice = getBasePrice();
  const extraGuests = Math.max(0, guestCount - getBaseGuests());
  const guestSurcharges = extraGuests * 8500;
  const timeslotPremium = timeslot === "full" ? 500000 : 0;
  
  let addonsCost = 0;
  if (addons.includes("decor")) addonsCost += 300000;
  if (addons.includes("band")) addonsCost += 150000;
  if (addons.includes("photo")) addonsCost += 200000;

  const grandTotal = basePrice + guestSurcharges + timeslotPremium + addonsCost;

  const formatCurrency = (val: number) => {
    return "LKR " + val.toLocaleString();
  };

  return (
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col font-sans text-[#2C1E14]">
      <MainNavbar />

      <main className="flex-grow pb-24">
        <BookHero />
        
        <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start section-reveal">
          
          {/* Left Column: Booking Form Steps */}
          <div className="lg:col-span-7 space-y-12">
            <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            <div className="h-px bg-[#D4C9A8] w-full"></div>
            <TimeslotSelector timeslot={timeslot} onSelectTimeslot={setTimeslot} />
            <div className="h-px bg-[#D4C9A8] w-full"></div>
            <PackageSelector selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
            <div className="h-px bg-[#D4C9A8] w-full"></div>
            <GuestCounter count={guestCount} onChange={setGuestCount} min={100} max={600} baseLine={getBaseGuests()} />
            <div className="h-px bg-[#D4C9A8] w-full"></div>
            <AddonsSelector addons={addons} onChange={setAddons} />
            <div className="h-px bg-[#D4C9A8] w-full"></div>
            <BookingForm selectedDate={selectedDate} />
          </div>

          {/* Right Column: Sticky Cost Breakdown & Trust Flags */}
          <div className="lg:col-span-5 space-y-8 sticky top-24 section-reveal stagger-2">
            <CostBreakdown 
              packageName={selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}
              selectedTimeslot={timeslot}
              costBreakdown={{
                basePrice,
                extraGuestsCount: extraGuests,
                guestSurcharges,
                timeslotPremium,
                addonsCost,
                grandTotal
              }}
              formatCurrency={formatCurrency}
            />
            <TrustDivider />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
