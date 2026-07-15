"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, X, User, CreditCard, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

import CalendarPicker from "@/components/landing/book/CalendarPicker";
import CostBreakdown from "@/components/landing/book/CostBreakdown";
import TrustDivider from "@/components/landing/book/TrustDivider";
import TimeRangeSelector from "@/components/landing/book/TimeRangeSelector";
import PackageSelector from "@/components/landing/book/PackageSelector";
import GuestCounter from "@/components/landing/book/GuestCounter";
import BookingVendorSelector from "@/components/landing/book/BookingVendorSelector";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import type { Vendor, VendorPackage } from "@/store/vendorStore";
import { bookingAPI } from "@/lib/api";
import { validateEmail, validatePhone } from "@/lib/validation";

interface NewBookingMainProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function NewBookingMain({ onClose, onSuccess }: NewBookingMainProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("18:00");
  const [endTime, setEndTime] = useState<string>("23:00");
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");
  const [eventType, setEventType] = useState<string>("Wedding");
  const [guestCount, setGuestCount] = useState<number>(380);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { vendors: globalVendors, fetchVendors } = useVendorStore();
  const requestedDesignPrices = useVendorCartStore((state) => state.requestedDesignPrices);
  const requestedDesigns = useVendorCartStore((state) => state.requestedDesigns);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const [vendors, setVendors] = useState<{
    decorator: string | null;
    decoratorPackage: string;
    dj: string | null;
    djPackage: string;
    videographer: string | null;
    videographerPackage: string;
  }>({
    decorator: "none",
    decoratorPackage: "none",
    dj: "none",
    djPackage: "none",
    videographer: "none",
    videographerPackage: "none",
  });

  const getBasePrice = () => {
    if (selectedPackage === "silver") return 1800000;
    if (selectedPackage === "diamond") return 5000000;
    return 3400000;
  };

  const getVendorCost = (category: "decorator" | "dj" | "videographer") => {
    const vendorId = vendors[category];
    if (vendorId === "none" || vendorId === "custom_preference" || !vendorId) return 0;

    // Check if there is a specific requested design price first
    if (requestedDesignPrices && requestedDesignPrices[category] !== undefined && requestedDesignPrices[category] !== null) {
      return requestedDesignPrices[category] as number;
    }

    const pkgName = vendors[`${category}Package` as keyof typeof vendors];
    if (pkgName && pkgName !== "none" && pkgName !== "Custom Preferences") {
      const v = globalVendors.find((v: Vendor) => v.id === vendorId);
      if (!v) return 0;
      const pkg = v.packages.find((p: VendorPackage) => p.name === pkgName);
      if (pkg) {
        const numericStr = pkg.price.replace(/[^0-9]/g, "");
        return numericStr ? parseInt(numericStr, 10) : 0;
      }
      return 0;
    }

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
    getVendorCost("videographer");

  const grandTotal = basePrice + extraHoursPremium + timeslotPremium + addonsCost;
  const formatCurrency = (val: number) => "LKR " + val.toLocaleString();

  const TOTAL_STEPS = 4;

  const handleNext = () => {
    if (currentStep === 1 && selectedDate === 0) {
      alert("Please select an event date on the calendar.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) setCurrentStep(step);
  };

  const STEP_LABELS: Record<number, string> = {
    1: "Event Details",
    2: "Vendors",
    3: "Review",
    4: "Checkout",
  };

  // --- Step 4: Checkout Form Logic ---
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    alternativePhone: "",
    notes: "",
    paymentMethod: "Card"
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<{email?: string, phone?: string, alternativePhone?: string}>({});

  const handleFinalizeBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate === 0) {
      alert("Please go back to Step 1 and select an available event date.");
      return;
    }
    
    if (formData.paymentMethod === "Card" && (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv)) {
      alert("Please enter payment details.");
      return;
    }

    if (formData.paymentMethod === "Manual" && !cashConfirmed) {
      alert("Please confirm that you have physically received the cash deposit.");
      return;
    }

    setErrors({});
    let hasError = false;
    const newErrors: typeof errors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }
    if (formData.alternativePhone && !validatePhone(formData.alternativePhone)) {
      newErrors.alternativePhone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);

    const eventTypeName =
      selectedPackage === "silver"
        ? "Classic Silver Package"
        : selectedPackage === "diamond"
        ? "Luxury Diamond Gala"
        : "Grand Gold Celebration";

    const dateString = selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString();

    const bookingPayload = {
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      alternativePhone: formData.alternativePhone || "",
      eventType,
      eventName: eventTypeName,
      date: dateString,
      timeslot: `${startTime} - ${endTime}`,
      durationHours,
      guests: guestCount,
      packageId: selectedPackage,
      packageName: selectedPackage,
      paymentMethod: formData.paymentMethod,
      decoratorCost: getVendorCost("decorator"),
      djCost: getVendorCost("dj"),
      videographerCost: getVendorCost("videographer"),
      totalCost: grandTotal,
      depositAmount: grandTotal * 0.3,
      balanceAmount: 0,
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
      },
    };

    try {
      const res = await bookingAPI.createBooking(bookingPayload);
      if (res.ok && res.data.success) {
        setShowSuccessModal(true);
      } else {
        alert(res.data.message || "Failed to create booking.");
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`flex flex-col flex-1 min-w-0 bg-white dark:bg-[#0A0A0A] font-sans text-[#1A1512] dark:text-white transition-colors duration-300 ${onClose ? 'max-h-[90vh]' : 'min-h-screen'}`}>
      
      {/* Header for Manager Modal/Page */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#E8DFC9] dark:border-gray-800 flex items-center justify-between px-6 h-16 shrink-0">
        <div className="flex items-center gap-4">
          {!onClose && (
            <>
              <Link href="/hotel-manager" className="text-gray-400 hover:text-[#C69C6D] transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div className="w-px h-6 bg-[#E8DFC9] dark:bg-gray-800" />
            </>
          )}
          <h2 className="font-serif italic text-[#C69C6D] text-xl font-semibold tracking-wide">
            New Assisted Booking
          </h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        )}
      </header>

      <main className={`flex-grow px-6 py-8 overflow-y-auto ${onClose ? 'max-h-[calc(90vh-4rem)]' : ''}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
          
          {/* Left Column: Booking Form Steps */}
          <div className="lg:col-span-8 space-y-12">
            
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
                <div className="h-px bg-[#D4C9A8] dark:bg-[#C9A84C]/30 w-full" />
                <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                <div className="h-px bg-[#D4C9A8] dark:bg-[#C9A84C]/30 w-full" />
                <TimeRangeSelector
                  startTime={startTime}
                  endTime={endTime}
                  onChange={(start, end) => {
                    setStartTime(start);
                    setEndTime(end);
                  }}
                />
                <div className="h-px bg-[#D4C9A8] dark:bg-[#C9A84C]/30 w-full" />
                <PackageSelector selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} />
                <div className="h-px bg-[#D4C9A8] dark:bg-[#C9A84C]/30 w-full" />
                <GuestCounter count={guestCount} onChange={setGuestCount} min={100} max={600} />
              </div>
            )}

            {/* Step 2: Vendor Selection */}
            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <BookingVendorSelector vendors={vendors} onChange={setVendors as any} />
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
                      {([ "decorator", "dj", "videographer"] as const).map((cat) => {
                        const id = vendors[cat];
                        if (!id || id === "none") return null;
                        const v = globalVendors.find((v: Vendor) => v.id === id);
                        return <p key={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}: {v ? v.name : "Selected"}</p>;
                      })}
                      {(["decorator", "dj", "videographer"] as const).every(
                        (cat) => !vendors[cat] || vendors[cat] === "none"
                      ) && <p className="text-gray-400 font-normal">No vendors selected</p>}
                    </div>
                  </div>
                  <div className="flex justify-between pb-3 text-sm font-bold">
                    <span className="text-[#1A1512] dark:text-white">Estimated Total:</span>
                    <span className="text-[#C69C6D] text-base">{formatCurrency(grandTotal)}</span>
                  </div>
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
                    I confirm that I have reviewed the booking details with the client and they agree to the EASCC Cancellation Policy.
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Checkout */}
            {currentStep === 4 && (
              <div className="animate-fadeIn space-y-8 bg-white dark:bg-[#111111] p-6 border border-[#E8DFC9] dark:border-gray-800 rounded-sm shadow-[0_0_20px_rgba(128,93,58,0.05)] dark:shadow-[0_0_20px_rgba(201,168,76,0.05)]">
                <label className="block text-[10px] uppercase tracking-widest text-[#805D3A] dark:text-[#C9A84C] font-bold flex items-center gap-1.5 border-b border-[#D4C9A8] dark:border-[#C9A84C]/30 pb-3 mb-4">
                  <User className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C]" /> Client Registry & Payment
                </label>

                <form onSubmit={handleFinalizeBooking} className="space-y-8">
                  {/* Contact Details */}
                  <div className="space-y-6">
                    <h4 className="text-base font-serif font-semibold text-[#2C1E14] dark:text-white">Client Details</h4>
                    
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John & Sarah"
                        className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-base text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                        value={formData.clientName}
                        onChange={e => setFormData({...formData, clientName: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Email Address</label>
                        <input 
                          required
                          type="email"
                          placeholder="client@example.com"
                          className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-base text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                          value={formData.email}
                          onChange={e => {
                            setFormData({...formData, email: e.target.value});
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                        />
                        {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Phone Number</label>
                        <input 
                          required
                          type="tel"
                          placeholder="+94 77 ..."
                          className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-base text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                          value={formData.phone}
                          onChange={e => {
                            setFormData({...formData, phone: e.target.value});
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                        />
                        {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Alternative Phone Number (Optional)</label>
                      <input 
                        type="tel"
                        placeholder="+94 77 000 0000"
                        className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] px-3 py-2 text-base text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                        value={formData.alternativePhone}
                        onChange={e => {
                          setFormData({...formData, alternativePhone: e.target.value});
                          if (errors.alternativePhone) setErrors({ ...errors, alternativePhone: undefined });
                        }}
                      />
                      {errors.alternativePhone && <p className="text-red-500 text-[10px] mt-1">{errors.alternativePhone}</p>}
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Special Requests / Notes</label>
                      <textarea 
                        rows={3}
                        className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#1A1A1A] p-3 text-base text-[#2C1E14] dark:text-white focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                        placeholder="Internal manager notes or client requests..."
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                      ></textarea>
                    </div>
                  </div>

                  <div className="h-px bg-[#D4C9A8] dark:bg-[#C9A84C]/20 w-full" />

                  {/* Payment Details */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-serif font-semibold text-[#2C1E14] dark:text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#805D3A] dark:text-[#C9A84C]" /> Deposit Collection
                      </h4>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold tracking-widest uppercase">
                        30% Due Now
                      </div>
                    </div>

                    <div className="flex items-center gap-6 pb-2">
                      <label className="flex items-center gap-2 cursor-pointer text-base text-[#2C1E14] dark:text-white">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="Card" 
                          checked={formData.paymentMethod === "Card"} 
                          onChange={(e) => setFormData({...formData, paymentMethod: "Card"})}
                          className="accent-[#805D3A] dark:accent-[#C9A84C]"
                        />
                        Card Payment (Terminal)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-base text-[#2C1E14] dark:text-white">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="Manual" 
                          checked={formData.paymentMethod === "Manual"} 
                          onChange={(e) => setFormData({...formData, paymentMethod: "Manual"})}
                          className="accent-[#805D3A] dark:accent-[#C9A84C]"
                        />
                        Cash Deposit (Desk)
                      </label>
                    </div>

                    {formData.paymentMethod === "Card" ? (
                      <div className="bg-[#F0E6D0] dark:bg-[#1A1A1A] p-5 border border-[#D4C9A8] dark:border-[#C9A84C]/30 rounded-sm space-y-5 shadow-inner">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Card Number</label>
                          <input 
                            required
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white px-3 py-2 text-base focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                            value={paymentDetails.cardNumber}
                            onChange={e => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">Expiry Date</label>
                            <input 
                              required
                              type="text" 
                              placeholder="MM/YY"
                              className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white px-3 py-2 text-base focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                              value={paymentDetails.expiry}
                              onChange={e => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-bold mb-2">CVV</label>
                            <input 
                              required
                              type="password" 
                              placeholder="***"
                              maxLength={4}
                              className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#FDFBF7] dark:bg-[#0A0A0A] text-[#2C1E14] dark:text-white px-3 py-2 text-base focus:border-[#805D3A] dark:focus:border-[#C9A84C] outline-none transition-colors rounded-sm"
                              value={paymentDetails.cvv}
                              onChange={e => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#F0E6D0] dark:bg-[#1A1A1A] p-5 border border-[#D4C9A8] dark:border-[#C9A84C]/30 rounded-sm space-y-3 shadow-inner flex items-start gap-3">
                        <input 
                          type="checkbox" 
                          id="cashConfirm" 
                          checked={cashConfirmed}
                          onChange={(e) => setCashConfirmed(e.target.checked)}
                          className="mt-1 w-4 h-4 accent-[#805D3A] dark:accent-[#C9A84C] cursor-pointer"
                        />
                        <label htmlFor="cashConfirm" className="text-sm text-[#2C1E14] dark:text-gray-300 cursor-pointer">
                          <strong className="text-[#805D3A] dark:text-[#C9A84C]">I confirm</strong> that I have physically received the 30% initial deposit (<strong className="text-gray-900 dark:text-white">LKR {(grandTotal * 0.3).toLocaleString()}</strong>) in cash from the client.
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#D4C9A8] dark:border-[#C9A84C]/20">
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full py-4 text-[10px] uppercase font-bold tracking-[0.2em] transition-all duration-300 rounded-sm shadow-md ${isProcessing ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)]'}`}
                    >
                      {isProcessing ? "Processing..." : "Finalize & Add Booking"}
                    </button>
                  </div>
                </form>
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

          </div>

          {/* Right Column: Sticky Cost Breakdown */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
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

        </div>
      </main>

      {/* Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center rounded-sm">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Lock size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Booking Created Successfully!</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              The new booking has been added to the system and the requested artisans have been notified.
            </p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                if (onSuccess) {
                  onSuccess();
                } else {
                  router.push("/hotel-manager/bookings");
                }
              }}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] text-black px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm rounded-sm"
            >
              Continue to Bookings
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
