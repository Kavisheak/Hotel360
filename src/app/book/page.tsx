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
import BookingForm from "@/components/landing/book/BookingForm";
import BookingHistory from "@/components/landing/book/BookingHistory";
import DateRequiredModal from "@/components/landing/book/DateRequiredModal";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import type { Vendor, VendorPackage } from "@/store/vendorStore";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { customerBookingAPI } from "@/lib/api";

export default function BookPage() {
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [holdExpiresAt, setHoldExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

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
  const setStoreVendor = useVendorCartStore((state) => state.setVendor);

  const [vendors, setLocalVendors] = useState<{
    decorator: string | null;
    decoratorPackage: string;
    dj: string | null;
    djPackage: string;
    videographer: string | null;
    videographerPackage: string;
    photographer: string | null;
    photographerPackage: string;
    cake: string | null;
    cakePackage: string;
    florist: string | null;
    floristPackage: string;
  }>({
    decorator: "none",
    decoratorPackage: "none",
    dj: "none",
    djPackage: "none",
    videographer: "none",
    videographerPackage: "none",
    photographer: "none",
    photographerPackage: "none",
    cake: "none",
    cakePackage: "none",
    florist: "none",
    floristPackage: "none",
  });

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
          videographer: preVid || "none",
        });
      }

      if (prePackage && ["silver", "gold", "diamond"].includes(prePackage)) {
        setSelectedPackage(prePackage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBasePrice = () => {
    if (selectedPackage === "silver") return 1800000;
    if (selectedPackage === "diamond") return 5000000;
    return 3400000;
  };

  const getVendorCost = (category: "decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist") => {
    const vendorId = vendors[category];
    if (!vendorId || vendorId === "none" || vendorId === "custom_preference") return 0;
    
    if (category === "decorator" || category === "photographer" || category === "cake" || category === "florist") {
      const pkgName = vendors[`${category}Package` as keyof typeof vendors];
      if (pkgName === "none" || pkgName === "Custom Preferences") return 0;
    }

    const pkgName = vendors[`${category}Package` as keyof typeof vendors];
    if (pkgName && pkgName !== "none" && pkgName !== "Custom Preferences") {
      const v = globalVendors.find((v: Vendor) => v.id === vendorId);
      if (!v) return 0;

      const pkg = v.packages?.find((p: VendorPackage) => p.name === pkgName);
      if (pkg) {
        const numericStr = pkg.price.replace(/[^0-9]/g, "");
        return numericStr ? parseInt(numericStr, 10) : 0;
      }
      return 0;
    }

    // Fallback: use starting price
    const v = globalVendors.find((v: Vendor) => v.id === vendorId);
    if (!v) return 0;
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
    return hours + mins / 60;
  };

  const durationHours = calculateDuration();
  const basePrice = getBasePrice();
  const extraHoursPremium = Math.max(0, durationHours - 6) * 50000;
  const timeslotPremium = 0;

  let addonsCost = 
    getVendorCost("decorator") + 
    getVendorCost("dj") + 
    getVendorCost("videographer") + 
    getVendorCost("photographer") + 
    getVendorCost("cake") + 
    getVendorCost("florist");

  const grandTotal = basePrice + extraHoursPremium + timeslotPremium + addonsCost;

  const formatCurrency = (val: number) => "LKR " + val.toLocaleString();

  const addBooking = useBookingStore((state) => state.addBooking);
  const clearCart = useVendorCartStore((state) => state.clearCart);

  const handleFinalizeBooking = async (contactInfo: any) => {
    const eventTypeName =
      selectedPackage === "silver"
        ? "Classic Silver Package"
        : selectedPackage === "diamond"
        ? "Luxury Diamond Gala"
        : "Grand Gold Celebration";

    const dateString = selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString();

    const bookingPayload = {
      clientName: `${contactInfo.firstName} ${contactInfo.lastName}`,
      email: contactInfo.email,
      phone: contactInfo.phone,
      alternativePhone: contactInfo.alternativePhone || "",
      eventType,
      eventName: eventTypeName,
      date: dateString,
      timeslot: `${startTime} - ${endTime}`,
      durationHours,
      guests: guestCount,
      packageId: selectedPackage,
      paymentMethod: contactInfo.paymentMethod,
      decoratorCost: getVendorCost("decorator"),
      djCost: getVendorCost("dj"),
      videographerCost: getVendorCost("videographer"),
      photographerCost: getVendorCost("photographer"),
      cakeCost: getVendorCost("cake"),
      floristCost: getVendorCost("florist"),
      totalCost: grandTotal,
      vendors: {
        decorator: {
          vendorId: vendors.decorator !== "none" ? vendors.decorator : null,
          status: vendors.decorator !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.decoratorPackage !== "none" ? vendors.decoratorPackage : "",
        },
        dj: {
          vendorId: vendors.dj !== "none" ? vendors.dj : null,
          status: vendors.dj !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.djPackage !== "none" ? vendors.djPackage : "",
        },
        videographer: {
          vendorId: vendors.videographer !== "none" ? vendors.videographer : null,
          status: vendors.videographer !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.videographerPackage !== "none" ? vendors.videographerPackage : "",
        },
        photographer: {
          vendorId: vendors.photographer !== "none" ? vendors.photographer : null,
          status: vendors.photographer !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.photographerPackage !== "none" ? vendors.photographerPackage : "",
        },
        cake: {
          vendorId: vendors.cake !== "none" ? vendors.cake : null,
          status: vendors.cake !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.cakePackage !== "none" ? vendors.cakePackage : "",
        },
        florist: {
          vendorId: vendors.florist !== "none" ? vendors.florist : null,
          status: vendors.florist !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.floristPackage !== "none" ? vendors.floristPackage : "",
        }
      },
    };

    try {
      const res = await customerBookingAPI.createBooking(bookingPayload);
      if (res.ok && res.data.success) {
        clearCart();
        return true;
      } else {
        alert(res.data.message || "Failed to create booking");
        return false;
      }
    } catch (error) {
      alert("An error occurred while creating booking");
      return false;
    }
  };

  useEffect(() => {
    if (!holdExpiresAt) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((holdExpiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        setHoldExpiresAt(null);
        handleHoldExpired();
      }
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdExpiresAt, selectedDate]);

  const handleHoldExpired = async () => {
    alert("Your 10-minute event hold has expired. The date has been released. Returning to Step 1.");
    if (selectedDate) {
      const dateString = new Date(selectedDate).toISOString();
      await customerBookingAPI.releaseHold({ date: dateString });
    }
    setCurrentStep(1);
  };

  const TOTAL_STEPS = 4;

  const handleNext = async () => {
    if (isGuest) {
      setLoginModalOpen(true);
      return;
    }
    if (currentStep === 1) {
      if (selectedDate === 0) {
        setIsDateModalOpen(true);
        return;
      }
      try {
        const dateString = new Date(selectedDate).toISOString();
        const res = await customerBookingAPI.createHold({ date: dateString });
        const data = res.data;
        if (res.ok && data.success) {
          const expiresAt = new Date(data.expiresAt).getTime();
          setHoldExpiresAt(expiresAt);
          setTimeLeft(Math.max(0, Math.round((expiresAt - Date.now()) / 1000)));
        } else {
          alert(data.message || "This date is currently held by another user. Please choose another date.");
          return;
        }
      } catch (e) {
        alert("Failed to secure temporary hold. Please try again.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleStepClick = async (step: number) => {
    if (isGuest) {
      setLoginModalOpen(true);
      return;
    }
    if (step < currentStep) {
      if ((currentStep === 2 || currentStep === 3 || currentStep === 4) && step === 1) {
        setHoldExpiresAt(null);
        setTimeLeft(0);
        if (selectedDate) {
          const dateString = new Date(selectedDate).toISOString();
          await customerBookingAPI.releaseHold({ date: dateString }).catch(console.error);
        }
      }
      setCurrentStep(step);
    }
  };

  const handleBack = async () => {
    if (currentStep === 2 || currentStep === 3 || currentStep === 4) {
      if (currentStep === 2) {
        setHoldExpiresAt(null);
        setTimeLeft(0);
        try {
          const dateString = new Date(selectedDate).toISOString();
          await customerBookingAPI.releaseHold({ date: dateString });
        } catch (e) {
          console.error("Failed to release hold on back navigation:", e);
        }
      }
    }
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const STEP_LABELS: Record<number, string> = {
    1: "Event Details",
    2: "Vendors",
    3: "Review",
    4: "Checkout",
  };

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white transition-colors duration-300">
      <MainNavbar />

      <main className="flex-grow">
        <BookHero />

        <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">

          {/* Left Column: Booking Form Steps */}
          <div className={`${activeTab === "history" ? "lg:col-span-12" : "lg:col-span-8"} space-y-12 transition-all duration-500`}>

            {/* Tab Switcher */}
            {!isGuest && (
              <div className="flex border-b border-[#E8DFC9] dark:border-gray-800 mb-8 overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setActiveTab("new")}
                  className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-colors relative whitespace-nowrap ${activeTab === "new" ? "text-[#C69C6D]" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                  New Booking
                  {activeTab === "new" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C69C6D]" />}
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-4 px-6 font-bold uppercase tracking-widest text-sm transition-colors relative whitespace-nowrap ${activeTab === "history" ? "text-[#C69C6D]" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                >
                  Booking History
                  {activeTab === "history" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C69C6D]" />}
                </button>
              </div>
            )}

            {activeTab === "history" ? (
              <BookingHistory />
            ) : (
              <>
                {/* Hold countdown banner */}
                {holdExpiresAt && timeLeft > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 px-4 py-3 rounded-sm flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                    <span>⚠️ Temporary reservation active. Secure your event date before the hold expires!</span>
                    <span className="font-mono text-sm bg-[#C69C6D] text-white px-2 py-1 rounded-sm">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                )}

                {/* Stepper Indicator */}
                <div className="flex items-center justify-between border-b border-[#E8DFC9] dark:border-gray-800 pb-6 mb-12 relative">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#E8DFC9] dark:bg-gray-800 -z-10 -translate-y-1/2" />
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      onClick={() => handleStepClick(step)}
                      className={`flex items-center gap-3 bg-white dark:bg-[#0A0A0A] pr-4 cursor-pointer hover:opacity-80 transition-opacity ${
                        currentStep === step
                          ? "text-[#1A1512] dark:text-white"
                          : currentStep > step
                          ? "text-[#A6955C]"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                          currentStep === step
                            ? "border-[#C69C6D] text-[#C69C6D]"
                            : currentStep > step
                            ? "border-[#A6955C] bg-[#A6955C] text-white"
                            : "border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        {step}
                      </div>
                      <span className="text-sm uppercase font-bold tracking-widest hidden sm:block">
                        {STEP_LABELS[step]}
                      </span>
                    </div>
                  ))}
                </div>                

                {/* Step 1: Event Details */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm">
                      <label className="block text-base uppercase tracking-widest text-[#805D3A] dark:text-[#C9A84C] font-bold mb-4">
                        Event Type
                      </label>
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
                    <div className="h-px bg-[#D4C9A8] w-full" />
                    <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                    <div className="h-px bg-[#D4C9A8] w-full" />
                    <TimeRangeSelector
                      startTime={startTime}
                      endTime={endTime}
                      onChange={(start, end) => {
                        setStartTime(start);
                        setEndTime(end);
                      }}
                    />
                    <div className="h-px bg-[#D4C9A8] w-full" />
                    <PackageSelector selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
                    <div className="h-px bg-[#D4C9A8] w-full" />
                    <GuestCounter count={guestCount} onChange={setGuestCount} min={100} max={600} />
                  </div>
                )}

                {/* Step 2: Vendor Selection */}
                {currentStep === 2 && (
                  <div className="animate-fadeIn">
                    <BookingVendorSelector vendors={vendors} onChange={setVendors} />
                  </div>
                )}

                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn bg-white dark:bg-[#111111] p-6 border border-[#E8DFC9] dark:border-gray-800 rounded-sm">
                    <h3 className="text-xl font-serif text-[#1A1512] dark:text-white mb-4">Review Your Booking</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                        <span className="text-gray-500">Event Date:</span>
                        <span className="font-bold text-[#1A1512] dark:text-white">
                          {selectedDate
                            ? new Date(selectedDate).toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                        <span className="text-gray-500">Timeslot &amp; Duration:</span>
                        <span className="font-bold text-[#1A1512] dark:text-white">
                          {startTime} - {endTime} ({durationHours} hrs)
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                        <span className="text-gray-500">Guests:</span>
                        <span className="font-bold text-[#1A1512] dark:text-white">
                          {guestCount} Guests
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                        <span className="text-gray-500">Venue Package:</span>
                        <span className="font-bold text-[#1A1512] dark:text-white capitalize">
                          {selectedPackage} Package
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                        <span className="text-gray-500">Selected Vendors:</span>
                        <div className="text-right font-bold text-[#1A1512] dark:text-white space-y-1 text-xs">
                          {([ "decorator", "dj", "videographer", "photographer", "cake", "florist"] as const).map((cat) => {
                            const id = vendors[cat];
                            if (!id || id === "none") return null;
                            const v = globalVendors.find((v: Vendor) => v.id === id);
                            return <p key={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}: {v ? v.name : "Selected"}</p>;
                          })}
                          {(["decorator", "dj", "videographer", "photographer", "cake", "florist"] as const).every(
                            (cat) => !vendors[cat] || vendors[cat] === "none"
                          ) && <p className="text-gray-400 font-normal">No vendors selected</p>}
                        </div>
                      </div>
                      <div className="flex justify-between pb-3 text-sm font-bold">
                        <span className="text-[#1A1512] dark:text-white">Estimated Total:</span>
                        <span className="text-[#C69C6D] text-base">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFC9] dark:border-white/10 rounded-sm">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[#A6955C] mb-2">
                        Cancellation Policy
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        &bull; <strong>More than 30 days before event:</strong> Free cancellation from your dashboard.
                        <br />
                        &bull; <strong>14–30 days before event:</strong> Cancellation requires Manager review.
                        <br />
                        &bull; <strong>Less than 14 days:</strong> Cancellation not possible via portal. Contact hotel directly.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <input
                        type="checkbox"
                        id="termsAgree"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="accent-[#C69C6D] h-4 w-4 cursor-pointer"
                      />
                      <label htmlFor="termsAgree" className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                        I have reviewed and agree to the EASCC Cancellation Policy and Event Booking Terms.
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 4: Checkout */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-white dark:bg-[#111111] p-6 border border-[#E8DFC9] dark:border-gray-800 rounded-sm">
                      <h3 className="text-xl font-serif text-[#1A1512] dark:text-white mb-4">Review Your Statement</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                          <span className="text-gray-500">Event Date:</span>
                          <span className="font-bold text-[#1A1512] dark:text-white">
                            {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                          <span className="text-gray-500">Timeslot & Duration:</span>
                          <span className="font-bold text-[#1A1512] dark:text-white">{startTime} - {endTime} ({durationHours} hours)</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                          <span className="text-gray-500">Total Guests:</span>
                          <span className="font-bold text-[#1A1512] dark:text-white">{guestCount} Guests</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                          <span className="text-gray-500">Venue Package:</span>
                          <span className="font-bold text-[#1A1512] dark:text-white capitalize">{selectedPackage} Package</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                          <span className="text-gray-500">Selected Artisans:</span>
                          <div className="text-right font-bold text-[#1A1512] dark:text-white space-y-1">
                            <p>Decorator: {vendors.decorator !== "none" ? "Selected" : "None"}</p>
                            <p>DJ Artist: {vendors.dj !== "none" ? "Selected" : "None"}</p>
                            <p>Videographer: {vendors.videographer !== "none" ? "Selected" : "None"}</p>
                            <p>Photographer: {vendors.photographer !== "none" ? "Selected" : "None"}</p>
                            <p>Florist: {vendors.florist !== "none" ? "Selected" : "None"}</p>
                            <p>Cake: {vendors.cake !== "none" ? "Selected" : "None"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-4 bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFC9] dark:border-white/10 rounded-sm">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-[#A6955C] mb-2">Cancellation Cutoff Policy</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed space-y-1">
                          • **More than 30 days before event:** Free cancellation directly from your dashboard.<br/>
                          • **Between 14 and 30 days before event:** Cancellation requires Manager review and approval.<br/>
                          • **Less than 14 days before event:** Cancellation is no longer possible through the portal. Please contact the hotel directly.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <input 
                          type="checkbox" 
                          id="termsAgree" 
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="accent-[#C69C6D] h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="termsAgree" className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                          I review and agree to the EASCC Cancellation Cutoff Policy and Event Booking Terms.
                        </label>
                      </div>
                    </div>
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
                  ) : (
                    <div />
                  )}

                  {currentStep < TOTAL_STEPS && (
                    <button
                      onClick={handleNext}
                      disabled={currentStep === 3 && !termsAccepted}
                      className={`px-8 py-3 text-white text-sm uppercase font-bold tracking-[0.2em] transition-colors rounded-sm shadow-md ${
                        currentStep === 3 && !termsAccepted
                          ? "bg-gray-400 cursor-not-allowed opacity-50"
                          : "bg-[#C69C6D] hover:bg-[#B58B5C]"
                      }`}
                    >
                      Next Step &rarr;
                    </button>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Right Column: Sticky Cost Breakdown */}
          {activeTab === "new" && (
            <div className="lg:col-span-4 space-y-6 sticky top-24 section-reveal stagger-2">
              <CostBreakdown
                packageName={selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}
                selectedTimeslot={`${startTime} - ${endTime}`}
                costBreakdown={{
                  basePrice,
                  extraHoursPremium,
                  guestCount,
                  timeslotPremium,
                  addonsCost,
                  grandTotal,
                }}
                formatCurrency={formatCurrency}
              />
              <TrustDivider />
            </div>
          )}

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
