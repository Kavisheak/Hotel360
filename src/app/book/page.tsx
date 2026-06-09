"use client";

import React, { useState, useEffect } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import BookHero from "@/components/landing/book/BookHero";
import CalendarPicker from "@/components/landing/book/CalendarPicker";
import CostBreakdown from "@/components/landing/book/CostBreakdown";
import TrustDivider from "@/components/landing/book/TrustDivider";
import TimeslotSelector from "@/components/landing/book/TimeslotSelector";
import PackageSelector from "@/components/landing/book/PackageSelector";
import GuestCounter from "@/components/landing/book/GuestCounter";
import BookingVendorSelector from "@/components/landing/book/BookingVendorSelector";
import BookingMenuSelector from "@/components/landing/book/BookingMenuSelector";
import BookingForm from "@/components/landing/book/BookingForm";
import { VENDORS_DATA } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useBookingStore } from "@/store/bookingStore";

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [timeslot, setTimeslot] = useState<string>("evening");
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");
  const [guestCount, setGuestCount] = useState<number>(380);
  
  const cartVendors = useVendorCartStore((state) => state.vendors);
  const cartMenu = useVendorCartStore((state) => state.menuSelection);
  const setStoreVendor = useVendorCartStore((state) => state.setVendor);

  const [vendors, setLocalVendors] = useState({ 
    decorator: cartVendors.decorator, 
    dj: cartVendors.dj, 
    videographer: cartVendors.videographer,
    caterer: cartVendors.caterer
  });
  
  const [menu, setMenu] = useState("signature");

  const setVendors = (newVendors: typeof vendors) => {
    setLocalVendors(newVendors);
    if (newVendors.decorator !== cartVendors.decorator) setStoreVendor("decorator", newVendors.decorator);
    if (newVendors.dj !== cartVendors.dj) setStoreVendor("dj", newVendors.dj);
    if (newVendors.videographer !== cartVendors.videographer) setStoreVendor("videographer", newVendors.videographer);
    if (newVendors.caterer !== cartVendors.caterer) setStoreVendor("caterer", newVendors.caterer);
  };

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const preDecorator = searchParams.get("decorator");
      const preDj = searchParams.get("dj");
      const preVid = searchParams.get("videographer");
      const preCat = searchParams.get("caterer");

      if (preDecorator || preDj || preVid || preCat) {
        setVendors({
          decorator: preDecorator || cartVendors.decorator,
          dj: preDj || cartVendors.dj,
          videographer: preVid || cartVendors.videographer,
          caterer: preCat || cartVendors.caterer
        });
      }
    }
  }, []);

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

  const getVendorCost = (vendorId: string) => {
    if (vendorId === "none") return 0;
    const v = VENDORS_DATA.find(v => v.id === vendorId);
    if (!v) return 0;
    
    // Parse starting price "LKR 450,000" -> 450000
    const numericStr = v.startingPrice.replace(/[^0-9]/g, "");
    return numericStr ? parseInt(numericStr, 10) : 0;
  };

  const basePrice = getBasePrice();
  const extraGuests = Math.max(0, guestCount - getBaseGuests());
  const guestSurcharges = extraGuests * 8500;
  const timeslotPremium = timeslot === "full" ? 500000 : 0;
  
  let addonsCost = getVendorCost(vendors.decorator) + getVendorCost(vendors.dj) + getVendorCost(vendors.videographer) + getVendorCost(vendors.caterer);

  if (menu === "custom") {
    addonsCost += 200000; // custom menu surcharge
    // Add cost of selected custom menu items
    const customMenuCost = cartMenu.items.reduce((total, item) => total + item.price, 0);
    addonsCost += customMenuCost;
  }

  const grandTotal = basePrice + guestSurcharges + timeslotPremium + addonsCost;

  const formatCurrency = (val: number) => {
    return "LKR " + val.toLocaleString();
  };

  const addBooking = useBookingStore(state => state.addBooking);
  const clearCart = useVendorCartStore(state => state.clearCart);

  const handleFinalizeBooking = (contactInfo: any) => {
    const eventTypeName = selectedPackage === "silver" ? "Classic Silver Package" : selectedPackage === "diamond" ? "Luxury Diamond Gala" : "Grand Gold Celebration";
    
    const dateString = selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD";

    addBooking({
      id: "bk-" + Math.floor(1000 + Math.random() * 9000),
      clientName: `${contactInfo.firstName} ${contactInfo.lastName}`,
      email: contactInfo.email,
      eventType: eventTypeName,
      date: dateString,
      guests: guestCount,
      status: "Pending",
      totalCost: grandTotal,
      vendors: {
        decorator: vendors.decorator,
        dj: vendors.dj,
        videographer: vendors.videographer,
        caterer: vendors.caterer,
      },
      menuType: menu,
      createdAt: new Date().toISOString()
    });

    clearCart();
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedDate === 0) {
      alert("Please select an available date to continue.");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col font-sans text-[#2C1E14]">
      <MainNavbar />

      <main className="flex-grow pb-24">
        <BookHero />
        
        <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start section-reveal">
          
          {/* Left Column: Booking Form Steps */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step Indicator */}
            <div className="flex items-center justify-between border-b border-[#D4C9A8] pb-4 mb-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`flex items-center gap-2 ${currentStep === step ? 'text-[#C9A84C]' : currentStep > step ? 'text-[#2C1E14]' : 'text-gray-400 opacity-50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${currentStep >= step ? 'border-current bg-current text-white' : 'border-gray-400'}`}>
                    {step}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">
                    {step === 1 && "Event Details"}
                    {step === 2 && "Vendors"}
                    {step === 3 && "Menu"}
                    {step === 4 && "Checkout"}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Event Details */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                <div className="h-px bg-[#D4C9A8] w-full"></div>
                <TimeslotSelector timeslot={timeslot} onSelectTimeslot={setTimeslot} />
                <div className="h-px bg-[#D4C9A8] w-full"></div>
                <PackageSelector selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
                <div className="h-px bg-[#D4C9A8] w-full"></div>
                <GuestCounter count={guestCount} onChange={setGuestCount} min={100} max={600} baseLine={getBaseGuests()} />
              </div>
            )}

            {/* Step 2: Vendor Selection */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <BookingVendorSelector vendors={vendors} onChange={setVendors} />
              </div>
            )}

            {/* Step 3: Food Menu Customization */}
            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <BookingMenuSelector menu={menu} onChange={setMenu} />
              </div>
            )}

            {/* Step 4: Checkout */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <BookingForm selectedDate={selectedDate} onSubmitBooking={handleFinalizeBooking} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[#D4C9A8] mt-8">
              {currentStep > 1 ? (
                <button 
                  onClick={handleBack}
                  className="px-6 py-3 text-[10px] uppercase font-bold tracking-widest text-[#2C1E14] border border-[#2C1E14] hover:bg-[#2C1E14] hover:text-white transition-colors rounded-sm"
                >
                  Go Back
                </button>
              ) : <div></div>}
              
              {currentStep < 4 && (
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#C9A84C] text-[#2C1E14] text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#B89238] transition-colors rounded-sm shadow-md hover-lift"
                >
                  Next Step
                </button>
              )}
            </div>

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
