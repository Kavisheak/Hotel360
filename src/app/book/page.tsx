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
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { customerBookingAPI } from "@/lib/api";

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("18:00");
  const [endTime, setEndTime] = useState<string>("23:00");
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");
  const [eventType, setEventType] = useState<string>("Wedding");
  const [guestCount, setGuestCount] = useState<number>(380);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { fetchUser, user } = useAuthStore();
  const { vendors: globalVendors, fetchVendors } = useVendorStore();
  
  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user && (user.role === "customer" || user.role === "decorator")) {
      setIsGuest(false);
    } else {
      setIsGuest(true);
    }
  }, [user]);
  
  const cartVendors = useVendorCartStore((state) => state.vendors);
  const cartMenu = useVendorCartStore((state) => state.menuSelection);
  const setMenuTypeStore = useVendorCartStore((state) => state.setMenuType);
  const setStoreVendor = useVendorCartStore((state) => state.setVendor);

  const [vendors, setLocalVendors] = useState({ 
    decorator: "none", 
    decoratorPackage: "none",
    dj: "none",
    djPackage: "none",
    videographer: "none",
    videographerPackage: "none"
  });
  
  const [menu, setMenu] = useState<"signature" | "custom">(
    (cartMenu.type === "signature" || cartMenu.type === "custom") ? cartMenu.type : "signature"
  );

  const handleMenuChange = (newMenu: "signature" | "custom") => {
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
          ...vendors,
          decorator: preDecorator || "none",
          dj: preDj || "none",
          videographer: preVid || "none"
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

  const getVendorCost = (category: "decorator" | "dj" | "videographer") => {
    const vendorId = vendors[category];
    if (vendorId === "none" || vendorId === "custom_preference") return 0;
    
    if (category === "decorator") {
      const pkgName = vendors[`decoratorPackage`];
      if (pkgName === "none" || pkgName === "Custom Preferences") return 0;
      
      const v = globalVendors.find(v => v.id === vendorId);
      if (!v) return 0;
      
      const pkg = v.packages.find(p => p.name === pkgName);
      if (pkg) {
        const numericStr = pkg.price.replace(/[^0-9]/g, "");
        return numericStr ? parseInt(numericStr, 10) : 0;
      }
      return 0;
    } else {
      // For DJ and Videographer, use startingPrice since they don't have package selection
      const v = globalVendors.find(v => v.id === vendorId);
      if (!v) return 0;
      const numericStr = v.startingPrice.replace(/[^0-9]/g, "");
      return numericStr ? parseInt(numericStr, 10) : 0;
    }
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
  
  let addonsCost = getVendorCost("decorator") + getVendorCost("dj") + getVendorCost("videographer");

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
    
    const dateString = selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString();

    const bookingPayload = {
      clientName: `${contactInfo.firstName} ${contactInfo.lastName}`,
      email: contactInfo.email,
      phone: contactInfo.phone,
      alternativePhone: contactInfo.alternativePhone || "",
      eventType: eventType,
      eventName: eventTypeName,
      date: dateString,
      timeslot: `${startTime} - ${endTime}`,
      durationHours: durationHours,
      guests: guestCount,
      packageId: selectedPackage,
      paymentMethod: contactInfo.paymentMethod,
      menuType: menu,
      customMenuItems: menu === "custom" ? cartMenu.addedOptionalItems.map(item => item.name) : [],
      vendors: {
        decorator: {
          vendorId: vendors.decorator !== "none" ? vendors.decorator : null,
          status: vendors.decorator !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.decoratorPackage !== "none" ? vendors.decoratorPackage : ""
        },
        dj: {
          vendorId: vendors.dj !== "none" ? vendors.dj : null,
          status: vendors.dj !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.djPackage !== "none" ? vendors.djPackage : ""
        },
        videographer: {
          vendorId: vendors.videographer !== "none" ? vendors.videographer : null,
          status: vendors.videographer !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.videographerPackage !== "none" ? vendors.videographerPackage : ""
        }
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
    if (step < currentStep) {
      setCurrentStep(step);
    }
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${currentStep === step ? 'border-[#C69C6D] text-[#C69C6D]' : currentStep > step ? 'border-[#A6955C] bg-[#A6955C] text-white' : 'border-gray-300 dark:border-gray-700'}`}>
                    {step}
                  </div>
                  <span className="text-sm uppercase font-bold tracking-widest hidden sm:block">
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
                <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm">
                  <label className="block text-base uppercase tracking-widest text-[#805D3A] dark:text-[#C9A84C] font-bold mb-4">Event Type</label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#FDFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-3 rounded-sm text-base text-[#1A1512] dark:text-white outline-none focus:border-[#C9A84C]"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Corporate Meeting">Corporate Meeting</option>
                    <option value="Conference">Conference</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Other">Other Event</option>
                  </select>
                </div>
                <div className="h-px bg-[#D4C9A8] w-full"></div>
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
                  className="px-8 py-3 bg-transparent text-[#C69C6D] border border-[#C69C6D] text-sm uppercase font-bold tracking-[0.2em] hover:bg-[#C69C6D] hover:text-white transition-colors rounded-sm shadow-sm"
                >
                  &larr; Previous Step
                </button>
              ) : <div></div>}

              {currentStep < 4 && (
                <button 
                  onClick={handleNext}
                  className="px-8 py-3 bg-[#C69C6D] text-white text-sm uppercase font-bold tracking-[0.2em] hover:bg-[#B58B5C] transition-colors rounded-sm shadow-md"
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
