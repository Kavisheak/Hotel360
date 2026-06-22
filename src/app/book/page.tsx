"use client";

import React, { useState, useEffect } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import BookHero from "@/components/landing/book/BookHero";
import CalendarPicker from "@/components/landing/book/CalendarPicker";
import CostBreakdown from "@/components/landing/book/CostBreakdown";
import TrustDivider from "@/components/landing/book/TrustDivider";
import TimeRangeSelector from "@/components/landing/book/TimeRangeSelector";
import PackageSelector from "@/components/landing/book/PackageSelector";
import GuestCounter from "@/components/landing/book/GuestCounter";
import BookingVendorSelector from "@/components/landing/book/BookingVendorSelector";
import BookingMenuSelector from "@/components/landing/book/BookingMenuSelector";
import BookingForm from "@/components/landing/book/BookingForm";
import DateRequiredModal from "@/components/landing/book/DateRequiredModal";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";
import { VENDORS_DATA } from "@/components/landing/vendors/types";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useBookingStore } from "@/store/bookingStore";
import { customerBookingAPI } from "@/lib/api";

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("18:00");
  const [endTime, setEndTime] = useState<string>("23:00");
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");
  const [guestCount, setGuestCount] = useState<number>(380);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user === "customer" || user === "decorator") {
      setIsGuest(false);
    }
  }, []);
  
  const cartVendors = useVendorCartStore((state) => state.vendors);
  const cartMenu = useVendorCartStore((state) => state.menuSelection);
  const setMenuTypeStore = useVendorCartStore((state) => state.setMenuType);
  const setStoreVendor = useVendorCartStore((state) => state.setVendor);

  const [vendors, setLocalVendors] = useState({ 
    decorator: cartVendors.decorator, 
    dj: cartVendors.dj,
    videographer: cartVendors.videographer
  });
  
  const [menu, setMenu] = useState(cartMenu.type !== "none" ? cartMenu.type : "signature");

  const handleMenuChange = (newMenu: string) => {
    setMenu(newMenu);
    if (newMenu === "signature" || newMenu === "custom") {
      setMenuTypeStore(newMenu);
    }
  };

  const setVendors = (newVendors: typeof vendors) => {
    setLocalVendors(newVendors);
    if (newVendors.decorator !== cartVendors.decorator) setStoreVendor("decorator", newVendors.decorator);
    if (newVendors.dj !== cartVendors.dj) setStoreVendor("dj", newVendors.dj);
    if (newVendors.videographer !== cartVendors.videographer) setStoreVendor("videographer", newVendors.videographer);
  };

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const preDecorator = searchParams.get("decorator");
      const preDj = searchParams.get("dj");
      const preVid = searchParams.get("videographer");
      const prePackage = searchParams.get("package");

      if (preDecorator || preDj || preVid) {
        setVendors({
          decorator: preDecorator || cartVendors.decorator,
          dj: preDj || cartVendors.dj,
          videographer: preVid || cartVendors.videographer
        });
      }

      if (prePackage && ["silver", "gold", "diamond"].includes(prePackage)) {
        setSelectedPackage(prePackage);
      }
    }
  }, []);

  const getBasePrice = () => {
    if (selectedPackage === "silver") return 1800000;
    if (selectedPackage === "diamond") return 5000000;
    return 3400000;
  };

  const getMenuPricePerGuest = () => {
    if (menu === "custom") return 6500;
    return 3500; // signature
  };

  const getVendorCost = (vendorId: string) => {
    if (vendorId === "none") return 0;
    const v = VENDORS_DATA.find(v => v.id === vendorId);
    if (!v) return 0;
    
    // Parse starting price "LKR 450,000" -> 450000
    const numericStr = v.startingPrice.replace(/[^0-9]/g, "");
    return numericStr ? parseInt(numericStr, 10) : 0;
  };

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let hours = endH - startH;
    let mins = endM - startM;
    if (mins < 0) { hours -= 1; mins += 60; }
    return hours + (mins / 60);
  };

  const durationHours = calculateDuration();

  const basePrice = getBasePrice(); // Fixed Hall Price
  const extraHoursPremium = Math.max(0, durationHours - 6) * 50000;
  const foodCost = guestCount * getMenuPricePerGuest();
  const timeslotPremium = 0; // Removing timeslot premium since we use pure time range
  
  let addonsCost = getVendorCost(vendors.decorator) + getVendorCost(vendors.dj) + getVendorCost(vendors.videographer);

  if (menu === "custom") {
    // Add cost of selected custom menu items * guest count
    const customMenuCost = cartMenu.addedOptionalItems.reduce((total, item) => total + item.price, 0);
    addonsCost += (customMenuCost * guestCount);
  }

  const grandTotal = basePrice + extraHoursPremium + foodCost + timeslotPremium + addonsCost;

  const formatCurrency = (val: number) => {
    return "LKR " + val.toLocaleString();
  };

  const addBooking = useBookingStore(state => state.addBooking);
  const clearCart = useVendorCartStore(state => state.clearCart);

  const handleFinalizeBooking = async (contactInfo: any) => {
    const eventTypeName = selectedPackage === "silver" ? "Classic Silver Package" : selectedPackage === "diamond" ? "Luxury Diamond Gala" : "Grand Gold Celebration";
    
    // We send raw ISO date string to backend for accurate parsing
    const dateString = selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString();

    const bookingPayload = {
      clientName: `${contactInfo.firstName} ${contactInfo.lastName}`,
      email: contactInfo.email,
      phone: contactInfo.phone,
      alternativePhone: contactInfo.alternativePhone || "",
      eventType: eventTypeName,
      date: dateString,
      timeslot: `${startTime} - ${endTime}`,
      durationHours: durationHours,
      guests: guestCount,
      packageId: selectedPackage,
      paymentMethod: contactInfo.paymentMethod,
      menuType: menu,
      customMenuItems: menu === "custom" ? cartMenu.addedOptionalItems.map(item => item.name) : [],
      vendors: {
        decoratorId: vendors.decorator !== "none" ? vendors.decorator : undefined,
        djId: vendors.dj !== "none" ? vendors.dj : undefined,
        videographerId: vendors.videographer !== "none" ? vendors.videographer : undefined
      }
    };

    try {
      const res = await customerBookingAPI.createBooking(bookingPayload);
      if (res.ok && res.data.success) {
        clearCart();
        return true; // Success
      } else {
        alert(res.data.message || "Failed to create booking");
        return false;
      }
    } catch (error) {
      alert("An error occurred while creating booking");
      return false;
    }
  };

  const handleNext = () => {
    if (isGuest) {
      setLoginModalOpen(true);
      return;
    }
    if (currentStep === 1 && selectedDate === 0) {
      setIsDateModalOpen(true);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleStepClick = (step: number) => {
    if (isGuest) {
      setLoginModalOpen(true);
      return;
    }
    if (step > 1 && selectedDate === 0) {
      setIsDateModalOpen(true);
      return;
    }
    setCurrentStep(step);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white transition-colors duration-300">
      <MainNavbar />

      <main className="flex-grow">
        <BookHero />
        
        <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Left Column: Booking Form Steps */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Stepper Indicator */}
            <div className="flex items-center justify-between border-b border-[#E8DFC9] dark:border-gray-800 pb-6 mb-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#E8DFC9] dark:bg-gray-800 -z-10 -translate-y-1/2"></div>
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  onClick={() => handleStepClick(step)}
                  className={`flex items-center gap-3 bg-white dark:bg-[#0A0A0A] pr-4 cursor-pointer hover:opacity-80 transition-opacity ${currentStep === step ? 'text-[#1A1512] dark:text-white' : currentStep > step ? 'text-[#A6955C]' : 'text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${currentStep === step ? 'border-[#C69C6D] text-[#C69C6D]' : currentStep > step ? 'border-[#A6955C] bg-[#A6955C] text-white' : 'border-gray-300 dark:border-gray-700'}`}>
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
                <TimeRangeSelector 
                  startTime={startTime} 
                  endTime={endTime} 
                  onChange={(start, end) => {
                    setStartTime(start);
                    setEndTime(end);
                  }} 
                />
                <div className="h-px bg-[#D4C9A8] w-full"></div>
                <PackageSelector selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
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
              <div className="space-y-8 animate-fadeIn">
                <BookingMenuSelector menu={menu} onChange={handleMenuChange} />
                <div className="h-px bg-[#D4C9A8] w-full"></div>
                <GuestCounter count={guestCount} onChange={setGuestCount} min={100} max={600} />
              </div>
            )}

            {/* Step 4: Checkout */}
            {currentStep === 4 && (
              <div className="animate-fadeIn">
                <BookingForm selectedDate={selectedDate} onSubmitBooking={handleFinalizeBooking} />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8">
              {currentStep > 1 ? (
                <button 
                  onClick={handleBack}
                  className="px-8 py-3 bg-transparent text-[#C69C6D] border border-[#C69C6D] text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#C69C6D] hover:text-white transition-colors rounded-sm shadow-sm"
                >
                  &larr; Previous Step
                </button>
              ) : <div></div>}

              {currentStep < 4 && (
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#C69C6D] text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#B58B5C] transition-colors rounded-sm shadow-md"
                >
                  Next Step &rarr;
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Cost Breakdown & Trust Flags */}
          <div className="lg:col-span-4 space-y-6 sticky top-24 section-reveal stagger-2">
            <CostBreakdown 
              packageName={selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}
              selectedTimeslot={`${startTime} - ${endTime}`}
              costBreakdown={{
                basePrice,
                extraHoursPremium,
                foodCost,
                guestCount,
                timeslotPremium,
                addonsCost,
                grandTotal
              }}
              formatCurrency={formatCurrency}
            />
            <TrustDivider />
          </div>

        </div>

        {/* Bottom Call to Action */}
        <section className="relative w-full py-24 bg-[#FAF6EE] dark:bg-[#0A0A0A] overflow-hidden border-t border-[#E8DFC9] dark:border-gray-800">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 z-10"></div>
            <img 
              src="/vendors_hero_bg_v3.png" 
              alt="EASCC Venue" 
              className="w-full h-full object-cover opacity-60 dark:opacity-30"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
            <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#A6955C]">
              Reservations Open
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1512] dark:text-white">
              Begin the conversation.
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-light max-w-lg mx-auto">
              A bespoke evening starts with a single date. View availability and compose your celebration in minutes.
            </p>
            <button className="px-8 py-3.5 bg-[#C69C6D] text-white text-[10px] uppercase font-bold tracking-widest hover:bg-[#B58B5C] transition-colors rounded-sm shadow-md mt-4">
              Reserve Your Date &rarr;
            </button>
          </div>
        </section>

      </main>

      <Footer />
      
      <DateRequiredModal 
        isOpen={isDateModalOpen} 
        onClose={() => setIsDateModalOpen(false)} 
      />

      <LoginRequiredModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        message="Please log in to continue with your booking process." 
      />
    </div>
  );
}
