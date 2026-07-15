"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import BookHero from "@/components/landing/book/BookHero";
import CalendarPicker from "@/components/landing/book/CalendarPicker";
import TrustDivider from "@/components/landing/book/TrustDivider";
import TimeRangeSelector from "@/components/landing/book/TimeRangeSelector";
import PackageSelector from "@/components/landing/book/PackageSelector";
import GuestCounter from "@/components/landing/book/GuestCounter";
import BookingVendorSelector from "@/components/landing/book/BookingVendorSelector";
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
  const router = useRouter();
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

  // Step 2 Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("France");
  const [paymentMethod, setPaymentMethod] = useState<"Visa" | "MasterCard" | "PayPal" | "Stripe">("Visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    billingAddress?: string;
    billingCity?: string;
    billingPostalCode?: string;
    billingCountry?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  }>({});

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
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      
      if (user.savedCards && user.savedCards.length > 0) {
        const defaultCard = user.savedCards.find((c: any) => c.isDefault) || user.savedCards[0];
        if (defaultCard) {
          setCardNumber(defaultCard.cardNumber || "");
          setCardExpiry(defaultCard.expiry || "");
          setCardCvc("***");
          
          if (defaultCard.cardNumber?.startsWith("4")) setPaymentMethod("Visa");
          else if (defaultCard.cardNumber?.startsWith("5")) setPaymentMethod("MasterCard");
          else if (defaultCard.cardNumber?.startsWith("3")) setPaymentMethod("Stripe");
        }
      }
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

  // Sync global cartVendors store with local vendors state
  useEffect(() => {
    const storePackages = useVendorCartStore.getState().vendorPackages;
    setLocalVendors({
      decorator: cartVendors.decorator || "none",
      decoratorPackage: storePackages.decorator || "none",
      dj: cartVendors.dj || "none",
      djPackage: "none",
      videographer: cartVendors.videographer || "none",
      videographerPackage: "none",
    });
  }, [cartVendors]);

  // Read URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const prePackage = searchParams.get("package");
      const preDecorator = searchParams.get("decorator") || searchParams.get("decorators");
      const preDj = searchParams.get("dj") || searchParams.get("djs");
      const preVid = searchParams.get("videographer") || searchParams.get("videographers");

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

  const addBooking = useBookingStore((state) => state.addBooking);
  const clearCart = useVendorCartStore((state) => state.clearCart);
  const requestedDesigns = useVendorCartStore((state) => state.requestedDesigns);
  const requestedDesignPrices = useVendorCartStore((state) => state.requestedDesignPrices);

  const getVendorCost = (category: "decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist") => {
    const vendorId = vendors[category];
    if (!vendorId || vendorId === "none" || vendorId === "custom_preference") return 0;
    
    // Check if there is a specific requested design price first
    if (requestedDesignPrices && requestedDesignPrices[category] !== undefined && requestedDesignPrices[category] !== null) {
      return requestedDesignPrices[category] as number;
    }

    if (category === "decorator" || category === "photographer" || category === "cake" || category === "florist") {
      const pkgName = vendors[`${category}Package` as keyof typeof vendors];
      if (pkgName === "none" || pkgName === "Custom Preferences") return 0;
    }

    const pkgName = vendors[`${category}Package` as keyof typeof vendors];
    if (pkgName && pkgName !== "none" && pkgName !== "Custom Preferences") {
      const v = globalVendors.find((v: Vendor) => v.id === vendorId || (v as any)._id === vendorId);
      if (!v) return 0;

      const pkg = v.packages?.find((p: VendorPackage) => p.name === pkgName);
      if (pkg) {
        const numericStr = pkg.price.replace(/[^0-9]/g, "");
        return numericStr ? parseInt(numericStr, 10) : 0;
      }
      return 0;
    }

    // Fallback: use starting price
    const v = globalVendors.find((v: Vendor) => v.id === vendorId || (v as any)._id === vendorId);
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
  const taxes = Math.round(grandTotal * 0.08);
  const bookingTotal = grandTotal + taxes;
  const depositToday = Math.round(bookingTotal * 0.3);
  const balanceDue = bookingTotal - depositToday;

  const formatCurrency = (val: number) => "LKR " + val.toLocaleString();

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
      totalCost: bookingTotal,
      vendors: {
        decorator: {
          vendorId: vendors.decorator !== "none" ? vendors.decorator : null,
          status: vendors.decorator !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.decoratorPackage !== "none" ? vendors.decoratorPackage : "",
          requestedDesignId: requestedDesigns.decorator || null,
        },
        dj: {
          vendorId: vendors.dj !== "none" ? vendors.dj : null,
          status: vendors.dj !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.djPackage !== "none" ? vendors.djPackage : "",
          requestedDesignId: requestedDesigns.dj || null,
        },
        videographer: {
          vendorId: vendors.videographer !== "none" ? vendors.videographer : null,
          status: vendors.videographer !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.videographerPackage !== "none" ? vendors.videographerPackage : "",
          requestedDesignId: requestedDesigns.videographer || null,
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

  const handleConfirmAndPay = async () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }
    setIsProcessing(true);
    const success = await handleFinalizeBooking({
      firstName,
      lastName,
      email,
      phone,
      paymentMethod,
    });
    setIsProcessing(false);
    if (success) {
      setShowSuccessModal(true);
    }
  };

  const TOTAL_STEPS = 3;

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

    if (currentStep === 2) {
      // Validate Step 2 Form
      setErrors({});
      let hasError = false;
      const newErrors: typeof errors = {};

      if (!firstName.trim()) {
        newErrors.firstName = "First name is required.";
        hasError = true;
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Last name is required.";
        hasError = true;
      }
      const { validateEmail, validatePhone } = await import("@/lib/validation");
      if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address.";
        hasError = true;
      }
      if (!validatePhone(phone)) {
        newErrors.phone = "Please enter a valid Sri Lankan phone number.";
        hasError = true;
      }
      if (!billingAddress.trim()) {
        newErrors.billingAddress = "Billing address is required.";
        hasError = true;
      }
      if (!billingCity.trim()) {
        newErrors.billingCity = "Billing city is required.";
        hasError = true;
      }
      if (!billingPostalCode.trim()) {
        newErrors.billingPostalCode = "Postal code is required.";
        hasError = true;
      }

      // Card details validation
      if (!cardNumber.trim()) {
        newErrors.cardNumber = "Card number is required.";
        hasError = true;
      }
      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = "Expiry date is required.";
        hasError = true;
      }
      if (!cardCvc.trim()) {
        newErrors.cardCvc = "CVC is required.";
        hasError = true;
      }

      if (hasError) {
        setErrors(newErrors);
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
      if ((currentStep === 2 || currentStep === 3) && step === 1) {
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
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const STEP_LABELS: Record<number, string> = {
    1: "Event & Vendors",
    2: "Guest & Payment",
    3: "Confirmation",
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
                  {[1, 2, 3].map((step) => (
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

                {/* Step 1: Event & Vendors */}
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
                    <div className="h-px bg-[#D4C9A8] dark:bg-gray-800 w-full" />
                    <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                    <div className="h-px bg-[#D4C9A8] dark:bg-gray-800 w-full" />
                    <TimeRangeSelector
                      startTime={startTime}
                      endTime={endTime}
                      onChange={(start, end) => {
                        setStartTime(start);
                        setEndTime(end);
                      }}
                    />
                    <div className="h-px bg-[#D4C9A8] dark:bg-gray-800 w-full" />
                    <BookingVendorSelector vendors={vendors} onChange={setVendors} />
                  </div>
                )}

                {/* Step 2: Guest & Payment */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Package & Guest Selection */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-8">
                      <h3 className="text-sm font-bold tracking-widest text-[#805D3A] dark:text-[#C9A84C] uppercase">
                        Package & Guests Selection
                      </h3>
                      <PackageSelector selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
                      <div className="h-px bg-[#D4C9A8] dark:bg-gray-800 w-full" />
                      <GuestCounter count={guestCount} onChange={setGuestCount} min={100} max={600} />
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-6">
                      <h3 className="text-lg font-serif font-semibold text-[#2C1E14] dark:text-white">
                        Customer information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">First name</label>
                          <input
                            type="text"
                            placeholder="John"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                            }}
                          />
                          {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Last name</label>
                          <input
                            type="text"
                            placeholder="Doe"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                            }}
                          />
                          {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Email</label>
                          <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors({ ...errors, email: undefined });
                            }}
                          />
                          {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Phone</label>
                          <input
                            type="tel"
                            placeholder="0771234567"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors({ ...errors, phone: undefined });
                            }}
                          />
                          {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Billing Details */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-6">
                      <h3 className="text-lg font-serif font-semibold text-[#2C1E14] dark:text-white">
                        Billing details
                      </h3>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Address</label>
                        <input
                          type="text"
                          placeholder="123 Luxury Avenue"
                          className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                          value={billingAddress}
                          onChange={(e) => {
                            setBillingAddress(e.target.value);
                            if (errors.billingAddress) setErrors({ ...errors, billingAddress: undefined });
                          }}
                        />
                        {errors.billingAddress && <p className="text-red-500 text-[10px] mt-1">{errors.billingAddress}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">City</label>
                          <input
                            type="text"
                            placeholder="Paris"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={billingCity}
                            onChange={(e) => {
                              setBillingCity(e.target.value);
                              if (errors.billingCity) setErrors({ ...errors, billingCity: undefined });
                            }}
                          />
                          {errors.billingCity && <p className="text-red-500 text-[10px] mt-1">{errors.billingCity}</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Postal code</label>
                          <input
                            type="text"
                            placeholder="75001"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={billingPostalCode}
                            onChange={(e) => {
                              setBillingPostalCode(e.target.value);
                              if (errors.billingPostalCode) setErrors({ ...errors, billingPostalCode: undefined });
                            }}
                          />
                          {errors.billingPostalCode && <p className="text-red-500 text-[10px] mt-1">{errors.billingPostalCode}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Country</label>
                        <input
                          type="text"
                          placeholder="France"
                          className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                          value={billingCountry}
                          onChange={(e) => {
                            setBillingCountry(e.target.value);
                            if (errors.billingCountry) setErrors({ ...errors, billingCountry: undefined });
                          }}
                        />
                        {errors.billingCountry && <p className="text-red-500 text-[10px] mt-1">{errors.billingCountry}</p>}
                      </div>
                    </div>

                    {/* Advance Payment Card */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-6">
                      <h3 className="text-lg font-serif font-semibold text-[#2C1E14] dark:text-white">
                        Advance payment — 30% deposit
                      </h3>
                      
                      {/* Tabs */}
                      <div className="flex flex-wrap gap-3 pb-2">
                        {(["Visa", "MasterCard", "PayPal", "Stripe"] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              setPaymentMethod(method);
                              if (user && user.savedCards && user.savedCards.length > 0) {
                                let targetCard = null;
                                if (method === "Visa") {
                                  targetCard = user.savedCards.find((c: any) => c.cardNumber?.startsWith("4"));
                                } else if (method === "MasterCard") {
                                  targetCard = user.savedCards.find((c: any) => c.cardNumber?.startsWith("5"));
                                } else if (method === "Stripe") {
                                  targetCard = user.savedCards.find((c: any) => c.cardNumber?.startsWith("3"));
                                }
                                
                                if (targetCard) {
                                  setCardNumber(targetCard.cardNumber || "");
                                  setCardExpiry(targetCard.expiry || "");
                                  setCardCvc("***");
                                } else {
                                  setCardNumber("");
                                  setCardExpiry("");
                                  setCardCvc("");
                                }
                              }
                            }}
                            className={`px-4 py-2 rounded-sm border text-xs font-bold tracking-wider transition-all duration-200 ${
                              paymentMethod === method
                                ? "bg-[#FAF6EE] dark:bg-white/10 border-[#C9A84C] text-[#805D3A] dark:text-[#C9A84C] shadow-sm"
                                : "bg-transparent border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                          >
                            💳 {method}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Card number</label>
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={cardNumber}
                            onChange={(e) => {
                              setCardNumber(e.target.value);
                              if (errors.cardNumber) setErrors({ ...errors, cardNumber: undefined });
                            }}
                          />
                          {errors.cardNumber && <p className="text-red-500 text-[10px] mt-1">{errors.cardNumber}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                              value={cardExpiry}
                              onChange={(e) => {
                                setCardExpiry(e.target.value);
                                if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: undefined });
                              }}
                            />
                            {errors.cardExpiry && <p className="text-red-500 text-[10px] mt-1">{errors.cardExpiry}</p>}
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">CVC</label>
                            <input
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                              value={cardCvc}
                              onChange={(e) => {
                                setCardCvc(e.target.value);
                                if (errors.cardCvc) setErrors({ ...errors, cardCvc: undefined });
                              }}
                            />
                            {errors.cardCvc && <p className="text-red-500 text-[10px] mt-1">{errors.cardCvc}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-6">
                      <h3 className="text-xl font-serif text-[#1A1512] dark:text-white pb-3 border-b border-[#E8DFC9]/40 dark:border-gray-800">
                        Review &amp; Final Confirmation
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        {/* Event Details */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-[#805D3A] dark:text-[#C9A84C] uppercase tracking-wider text-[11px]">Event Information</h4>
                          <p><span className="text-gray-500">Event Type:</span> {eventType}</p>
                          <p>
                            <span className="text-gray-500">Date:</span>{" "}
                            {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Not selected"}
                          </p>
                          <p><span className="text-gray-500">Timeslot:</span> {startTime} - {endTime} ({durationHours} hrs)</p>
                          <p><span className="text-gray-500">Guests:</span> {guestCount} guests</p>
                          <p><span className="text-gray-500">Venue Package:</span> <span className="capitalize">{selectedPackage}</span></p>
                        </div>

                        {/* Customer & Billing Details */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-[#805D3A] dark:text-[#C9A84C] uppercase tracking-wider text-[11px]">Client &amp; Billing Details</h4>
                          <p><span className="text-gray-500">Client Name:</span> {firstName} {lastName}</p>
                          <p><span className="text-gray-500">Email:</span> {email}</p>
                          <p><span className="text-gray-500">Phone:</span> {phone}</p>
                          <p><span className="text-gray-500">Address:</span> {billingAddress}, {billingCity}, {billingPostalCode}, {billingCountry}</p>
                        </div>

                        {/* Payment Summary */}
                        <div className="space-y-2">
                          <h4 className="font-bold text-[#805D3A] dark:text-[#C9A84C] uppercase tracking-wider text-[11px]">Payment Summary</h4>
                          <p><span className="text-gray-500">Subtotal:</span> {formatCurrency(grandTotal)}</p>
                          <p><span className="text-gray-500">Taxes &amp; Fees (8%):</span> {formatCurrency(taxes)}</p>
                          <p className="font-bold text-gray-800 dark:text-gray-200"><span className="text-gray-500 font-normal">Total:</span> {formatCurrency(bookingTotal)}</p>
                          <div className="bg-[#FAF6EE] dark:bg-white/5 p-2 rounded-sm border border-[#E8DFC9] dark:border-gray-800 space-y-1">
                            <p className="text-[11px] font-bold text-[#805D3A] dark:text-[#C9A84C]">
                              30% Deposit: {formatCurrency(depositToday)}
                            </p>
                            <p className="text-[9px] text-gray-500">
                              Balance: {formatCurrency(balanceDue)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-[#E8DFC9] dark:bg-gray-800 w-full" />

                      {/* Selected Vendors */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[#805D3A] dark:text-[#C9A84C] uppercase tracking-wider text-[11px]">Selected Artisans</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          {([ "decorator", "dj", "videographer"] as const).map((cat) => {
                            const id = vendors[cat];
                            const isNone = !id || id === "none";
                            const v = globalVendors.find((v: Vendor) => v.id === id || (v as any)._id === id);
                            return (
                              <div key={cat} className="border border-gray-100 dark:border-gray-800 p-3 rounded-sm bg-[#FAFBF7] dark:bg-white/5">
                                <p className="font-bold uppercase tracking-widest text-[9px] text-[#A6955C] mb-1">{cat}</p>
                                <p className="font-medium text-gray-800 dark:text-gray-200">
                                  {isNone ? "Not Required" : (v ? v.name : "Custom Selected")}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="h-px bg-[#E8DFC9] dark:bg-gray-800 w-full" />

                      {/* Cancellation Policy */}
                      <div className="p-4 bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFC9] dark:border-white/10 rounded-sm">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#A6955C] mb-2">
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

                      {/* Terms Agree checkbox */}
                      <div className="flex items-center gap-3 pt-2">
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
                          I have reviewed and agree to the EASCC Cancellation Policy and Event Booking Terms.
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

                  {currentStep < TOTAL_STEPS ? (
                    <button
                      onClick={handleNext}
                      className="px-8 py-3 text-white text-sm uppercase font-bold tracking-[0.2em] bg-[#C69C6D] hover:bg-[#B58B5C] transition-colors rounded-sm shadow-md"
                    >
                      Next Step &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmAndPay}
                      disabled={!termsAccepted || isProcessing}
                      className={`px-8 py-3 text-white text-sm uppercase font-bold tracking-[0.2em] transition-colors rounded-sm shadow-md ${
                        !termsAccepted || isProcessing
                          ? "bg-gray-400 cursor-not-allowed opacity-50"
                          : "bg-[#C69C6D] hover:bg-[#B58B5C]"
                      }`}
                    >
                      {isProcessing ? "Processing Booking..." : "Confirm & Pay Deposit"}
                    </button>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Right Column: Sticky Cost Breakdown / Booking Summary */}
          {activeTab === "new" && (
            <div className="lg:col-span-4 space-y-6 sticky top-24 section-reveal stagger-2">
              <div className="bg-white dark:bg-[#111111] p-6 border border-[#E8DFC9] dark:border-gray-800 rounded-sm shadow-[0_0_20px_rgba(128,93,58,0.05)] dark:shadow-[0_0_20px_rgba(201,168,76,0.05)] space-y-6">
                <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">Booking summary</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Updates live as you choose</p>

                <div className="space-y-4">
                  {/* Package details */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      🏢 {selectedPackage === "silver" ? "Classic Silver Package" : selectedPackage === "diamond" ? "Luxury Diamond Gala" : "Grand Gold Celebration"}
                    </span>
                    <span className="font-bold">{formatCurrency(basePrice)}</span>
                  </div>

                  {/* Vendor additions */}
                  {addonsCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">✨ Selected Artisans</span>
                      <span className="font-bold">{formatCurrency(addonsCost)}</span>
                    </div>
                  )}

                  {/* Extra duration */}
                  {extraHoursPremium > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">⏳ Extra Hours Premium</span>
                      <span className="font-bold">{formatCurrency(extraHoursPremium)}</span>
                    </div>
                  )}

                  {/* Guest count display */}
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
                    <span className="text-gray-500">👥 Guests</span>
                    <span className="font-bold">{guestCount} Guests</span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold">{formatCurrency(grandTotal)}</span>
                  </div>

                  {/* Taxes and fees */}
                  <div className="flex justify-between text-sm pb-3">
                    <span className="text-gray-500">Taxes & fees</span>
                    <span className="font-bold">{formatCurrency(taxes)}</span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-sm font-bold border-t border-gray-100 dark:border-gray-800 pt-3">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-[#C69C6D] text-base">{formatCurrency(bookingTotal)}</span>
                  </div>

                  {/* 30% Deposit Box */}
                  <div className="bg-[#FAF6EE] dark:bg-white/5 p-4 rounded-sm border border-[#E8DFC9]/50 dark:border-white/10 space-y-2">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">30% deposit today</div>
                    <div className="text-2xl font-serif font-bold text-[#805D3A] dark:text-[#C9A84C]">
                      {formatCurrency(depositToday)}
                    </div>
                    <div className="text-[10px] text-gray-500 leading-normal">
                      Balance {formatCurrency(balanceDue)} due 30 days before event.
                    </div>
                  </div>
                </div>
              </div>
              <TrustDivider />
            </div>
          )}

        </div>
      </main>

      <Footer />
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Booking Confirmed!</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Your 30% deposit has been successfully processed. The artisan team has been notified and your date is secured.
            </p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/customer/myaccount?tab=bookings");
              }}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Footer */}

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