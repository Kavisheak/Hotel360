"use client";

import React, { useState, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Award, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Minus, 
  Send, 
  Info, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

// ==========================================
// MOCK CALENDAR DAYS FOR JUNE 2026
// ==========================================
interface CalendarDay {
  date: number;
  dayName: string;
  status: "available" | "reserved" | "pending";
}

const JUNE_2026_DAYS: CalendarDay[] = [
  { date: 1, dayName: "Mon", status: "available" },
  { date: 2, dayName: "Tue", status: "available" },
  { date: 3, dayName: "Wed", status: "reserved" },
  { date: 4, dayName: "Thu", status: "available" },
  { date: 5, dayName: "Fri", status: "pending" },
  { date: 6, dayName: "Sat", status: "reserved" },
  { date: 7, dayName: "Sun", status: "reserved" },
  { date: 8, dayName: "Mon", status: "available" },
  { date: 9, dayName: "Tue", status: "available" },
  { date: 10, dayName: "Wed", status: "available" },
  { date: 11, dayName: "Thu", status: "available" },
  { date: 12, dayName: "Fri", status: "reserved" },
  { date: 13, dayName: "Sat", status: "reserved" },
  { date: 14, dayName: "Sun", status: "available" },
  { date: 15, dayName: "Mon", status: "available" },
  { date: 16, dayName: "Tue", status: "available" },
  { date: 17, dayName: "Wed", status: "pending" },
  { date: 18, dayName: "Thu", status: "available" },
  { date: 19, dayName: "Fri", status: "available" },
  { date: 20, dayName: "Sat", status: "reserved" },
  { date: 21, dayName: "Sun", status: "reserved" },
  { date: 22, dayName: "Mon", status: "available" },
  { date: 23, dayName: "Tue", status: "available" },
  { date: 24, dayName: "Wed", status: "available" },
  { date: 25, dayName: "Thu", status: "available" },
  { date: 26, dayName: "Fri", status: "available" },
  { date: 27, dayName: "Sat", status: "reserved" },
  { date: 28, dayName: "Sun", status: "reserved" },
  { date: 29, dayName: "Mon", status: "available" },
  { date: 30, dayName: "Tue", status: "available" }
];

// ==========================================
// PACKAGES DEFINITION
// ==========================================
interface BasePackage {
  id: "silver" | "gold" | "diamond";
  name: string;
  price: string;
  priceNum: number;
  baseGuests: number;
  extraGuestFee: number;
}

const PACKAGES_LIST: BasePackage[] = [
  {
    id: "silver",
    name: "Silver Package",
    price: "LKR 1.8M",
    priceNum: 1800000,
    baseGuests: 250,
    extraGuestFee: 5000
  },
  {
    id: "gold",
    name: "Gold Package",
    price: "LKR 3.4M",
    priceNum: 3400000,
    baseGuests: 380,
    extraGuestFee: 6000
  },
  {
    id: "diamond",
    name: "Diamond Package",
    price: "LKR 5.9M",
    priceNum: 5900000,
    baseGuests: 480,
    extraGuestFee: 8000
  }
];

export default function BookPage() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [selectedDate, setSelectedDate] = useState<number>(4); // June 4, 2026 as initial available selection
  const [selectedTimeslot, setSelectedTimeslot] = useState<"morning" | "evening" | "full-day">("evening");
  const [selectedPkg, setSelectedPkg] = useState<"silver" | "gold" | "diamond">("gold");
  const [guestCount, setGuestCount] = useState<number>(380);
  
  // Client personal details
  const [coupleDetails, setCoupleDetails] = useState({
    partner1: "",
    partner2: "",
    email: "",
    phone: "",
    visionNotes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // ==========================================
  // FORM HANDLER
  // ==========================================
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleDetails.partner1 || !coupleDetails.partner2 || !coupleDetails.email || !coupleDetails.phone) {
      alert("Please enter all required fields (*).");
      return;
    }

    setIsSubmitting(true);
    // Simulate booking transmission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setCoupleDetails({
      partner1: "",
      partner2: "",
      email: "",
      phone: "",
      visionNotes: ""
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1512] font-sans selection:bg-[#C69C6D] selection:text-black">
      
      {/* Sticky Premium Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-[#151210]/95 backdrop-blur-md border-b border-[#c69c6d]/20 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-5 h-[1px] bg-[#c69c6d] group-hover:w-8 transition-all duration-300"></div>
            <span className="font-serif text-lg tracking-wider text-[#FAF6EE] normal-case">
              EASCC <span className="font-light italic text-[#c69c6d] text-sm">Conference Center</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-gray-300">
            <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <Link href="/packages" className="hover:text-white transition-colors duration-200">Packages</Link>
            <Link href="/vendors" className="hover:text-white transition-colors duration-200">Vendors</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Virtual Tour</Link>
            <Link href="/book" className="text-[#c69c6d] border-b border-[#c69c6d] pb-0.5 font-bold tracking-widest">Book</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs uppercase tracking-widest font-semibold text-gray-300 hover:text-white transition-colors duration-200">
              Sign In
            </Link>
            <Link 
              href="/book" 
              className="bg-[#c69c6d] text-black px-4 py-1.5 hover:bg-[#b0885a] transition-all duration-300 text-[10px] uppercase font-bold tracking-widest"
            >
              Reserve
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-16 bg-[#1A1512] text-white overflow-hidden border-b border-[#c69c6d]/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white"></div>
          <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white"></div>
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#c69c6d]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Exclusive Booking Office</span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif leading-tight">
            Compose Your <span className="italic text-[#c69c6d]">Historic Union</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm font-light leading-relaxed">
            By holding only one wedding per day, EASCC guarantees absolute, uninterrupted focus on your celebration. Plan your date, hours, and guests details below to coordinate with our concierge.
          </p>
        </div>
      </section>

      {/* Main Reservation Panel */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Interactive Steps Form */}
          <div className="lg:col-span-7 bg-white border border-[#E8DFC9] p-6 md:p-8 shadow-md rounded-sm space-y-8">
            
            {/* STEP 1: Elegant Month Calendar Picker */}
            <div className="space-y-4">
              <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-[#c69c6d]" /> Step 1: Select Event Date (June 2026)
              </label>
              
              {/* Legend */}
              <div className="flex gap-4 text-[9px] uppercase tracking-widest font-semibold text-gray-500 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-white border border-gray-200 block rounded-sm"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-red-50 border border-red-200 block rounded-sm"></span>
                  <span>Reserved</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-orange-50 border border-orange-200 block rounded-sm"></span>
                  <span>Pending Hold</span>
                </div>
              </div>

              {/* Month Header */}
              <div className="text-center py-2 bg-[#FAF6EE] text-xs font-serif font-semibold border-t border-b border-[#E0D8C3]">
                June 2026
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                  <div key={idx} className="font-semibold text-[9px] text-[#A6955C] uppercase tracking-widest py-1">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells to align Monday start for June 1st 2026 */}
                {JUNE_2026_DAYS.map((day) => {
                  const isSelected = selectedDate === day.date;
                  
                  let cellStyle = "bg-white text-gray-900 border border-gray-200 hover:border-[#c69c6d] cursor-pointer";
                  if (day.status === "reserved") {
                    cellStyle = "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed line-through";
                  } else if (day.status === "pending") {
                    cellStyle = "bg-orange-50/70 text-orange-400 border border-orange-100 cursor-not-allowed";
                  }

                  if (isSelected && day.status === "available") {
                    cellStyle = "bg-[#1A1512] text-white border-[#1A1512] shadow-md ring-2 ring-[#c69c6d] ring-offset-2 font-bold scale-[1.03]";
                  }

                  return (
                    <button
                      key={day.date}
                      type="button"
                      disabled={day.status !== "available"}
                      onClick={() => setSelectedDate(day.date)}
                      className={`h-12 w-full flex flex-col justify-center items-center rounded-sm transition-all duration-200 relative ${cellStyle}`}
                    >
                      <span className="font-medium text-xs">{day.date}</span>
                      {day.status === "reserved" && (
                        <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-red-400">Booked</span>
                      )}
                      {day.status === "pending" && (
                        <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-orange-400">Pending</span>
                      )}
                      {day.status === "available" && isSelected && (
                        <span className="absolute bottom-0.5 text-[7px] uppercase tracking-wider font-semibold text-[#c69c6d]">Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Timeslot Options */}
            <div className="space-y-4">
              <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c69c6d]" /> Step 2: Choose Event Timeslot
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Morning slot */}
                <button
                  type="button"
                  onClick={() => setSelectedTimeslot("morning")}
                  className={`p-4 border text-left rounded-sm transition-all duration-300 flex flex-col justify-between ${
                    selectedTimeslot === "morning"
                      ? "border-[#c69c6d] bg-[#C69C6D]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-[#A6955C] font-bold">8:00 AM - 2:00 PM</span>
                    <h4 className="text-sm font-serif font-bold text-gray-900 mt-1">Morning Gala</h4>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-3 font-semibold">Standard Pricing</span>
                </button>

                {/* Evening slot */}
                <button
                  type="button"
                  onClick={() => setSelectedTimeslot("evening")}
                  className={`p-4 border text-left rounded-sm transition-all duration-300 flex flex-col justify-between relative ${
                    selectedTimeslot === "evening"
                      ? "border-[#c69c6d] bg-[#C69C6D]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="absolute top-2 right-2 bg-[#c69c6d] text-white text-[7px] uppercase tracking-wider px-1.5 py-0.5 font-bold">Premium</span>
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-[#A6955C] font-bold">4:00 PM - 10:00 PM</span>
                    <h4 className="text-sm font-serif font-bold text-gray-900 mt-1">Evening Soiree</h4>
                  </div>
                  <span className="text-[10px] text-[#7C6A2E] mt-3 font-semibold">+ LKR 100,000</span>
                </button>

                {/* Full day slot */}
                <button
                  type="button"
                  onClick={() => setSelectedTimeslot("full-day")}
                  className={`p-4 border text-left rounded-sm transition-all duration-300 flex flex-col justify-between ${
                    selectedTimeslot === "full-day"
                      ? "border-[#c69c6d] bg-[#C69C6D]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-[#A6955C] font-bold">9:00 AM - Midnight</span>
                    <h4 className="text-sm font-serif font-bold text-gray-900 mt-1">Full-Day Grandeur</h4>
                  </div>
                  <span className="text-[10px] text-[#7C6A2E] mt-3 font-semibold">+ LKR 300,000</span>
                </button>

              </div>
            </div>

            {/* STEP 3: Base Package Selection */}
            <div className="space-y-4">
              <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#c69c6d]" /> Step 3: Choose Celebration Package
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PACKAGES_LIST.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handlePkgChange(pkg.id)}
                    className={`p-4 border text-left flex flex-col justify-between transition-all duration-300 rounded-sm ${
                      selectedPkg === pkg.id 
                        ? "border-[#c69c6d] bg-[#C69C6D]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-semibold text-gray-900">{pkg.name}</h5>
                      <span className="text-lg font-serif font-bold text-[#7C6A2E] block mt-1">{pkg.price}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-3">{pkg.baseGuests} Guests baseline</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4: Guest Attendance Count */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#c69c6d]" /> Step 4: Expected Attendance
                </label>
                <span className="text-xs text-gray-400 font-semibold">
                  Included in Package: <span className="text-gray-900">{activePkg.baseGuests} Guests</span>
                </span>
              </div>

              <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-4 flex items-center justify-between rounded-sm max-w-md mx-auto">
                <button 
                  type="button"
                  onClick={() => setGuestCount(Math.max(50, guestCount - 10))}
                  className="w-10 h-10 bg-white border border-[#E0D8C3] hover:border-gray-400 rounded-sm flex items-center justify-center text-gray-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <span className="text-3xl font-serif font-bold text-gray-900">{guestCount}</span>
                  <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Guests Selected</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setGuestCount(Math.min(600, guestCount + 10))}
                  className="w-10 h-10 bg-white border border-[#E0D8C3] hover:border-gray-400 rounded-sm flex items-center justify-center text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {guestCount > activePkg.baseGuests && (
                <div className="flex gap-2 items-center text-[11px] text-[#7C6A2E] bg-[#C69C6D]/5 border border-[#c69c6d]/20 p-3 rounded-sm leading-relaxed">
                  <Info className="w-4 h-4 text-[#c69c6d] shrink-0" />
                  <p>
                    Guest capacity exceeds baseline by <strong>{guestCount - activePkg.baseGuests} guests</strong>. Additional catering & tablescapes are billed at <strong>{formatCurrency(activePkg.extraGuestFee)}</strong> per attendee.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Cost Breakdown & Request Details Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Pricing Breakdown Card */}
            <div className="bg-[#1A1512] text-white border border-[#c69c6d]/20 p-6 md:p-8 shadow-2xl rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#c69c6d]/20 pointer-events-none"></div>
              
              <div className="flex items-center gap-2 text-[#c69c6d] mb-4">
                <Award className="w-4 h-4 animate-pulse" />
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold">Estimated Cost Summary</span>
              </div>

              <h3 className="text-lg font-serif mb-6 pb-4 border-b border-white/10 font-medium">Bespoke Statement</h3>

              <div className="space-y-4 text-xs font-light text-gray-300">
                
                <div className="flex justify-between items-center">
                  <span>{activePkg.name} Base:</span>
                  <span className="font-semibold text-white">{formatCurrency(costBreakdown.basePrice)}</span>
                </div>

                {costBreakdown.timeslotPremium > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Timeslot Premium ({selectedTimeslot.toUpperCase()}):</span>
                    <span className="font-semibold text-white">{formatCurrency(costBreakdown.timeslotPremium)}</span>
                  </div>
                )}

                {costBreakdown.guestSurcharges > 0 && (
                  <div className="flex justify-between items-center text-[#d9b891]">
                    <span>Additional Attendees ({costBreakdown.extraGuestsCount} guests):</span>
                    <span className="font-semibold">{formatCurrency(costBreakdown.guestSurcharges)}</span>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-gray-400">Total Price</span>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[#c69c6d]">
                      {formatCurrency(costBreakdown.grandTotal)}
                    </span>
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Estimated Total</p>
                  </div>
                </div>

              </div>

              <p className="text-[9px] text-gray-500 italic mt-6 leading-normal font-light">
                * Computations are projections. A non-refundable 25% deposit is required within 48 hours to secure this date. Surcharges for decor customization and specific menu swaps will be final in our formal banquet contract.
              </p>
            </div>

            {/* Reservation Form Details */}
            <div className="bg-white border border-[#E8DFC9] p-6 shadow-md rounded-sm">
              {!isSubmitted ? (
                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="flex items-center gap-1.5 text-[#A6955C] mb-2">
                    <CalendarIcon className="w-4 h-4 text-[#c69c6d]" />
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">Secure Your Reservation</h4>
                  </div>
                  
                  <p className="text-[11px] text-gray-500 leading-normal font-light">
                    Transmit this configured date, timeslot, and guest size configuration to our concierge office to lock in your hold.
                  </p>

                  <div className="space-y-3.5 border-t border-[#FAF6EE] pt-4">
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Partner 1 Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="First Name"
                          value={coupleDetails.partner1}
                          onChange={(e) => setCoupleDetails({...coupleDetails, partner1: e.target.value})}
                          className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Partner 2 Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="First Name"
                          value={coupleDetails.partner2}
                          onChange={(e) => setCoupleDetails({...coupleDetails, partner2: e.target.value})}
                          className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Couple Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="weddings@mail.com"
                        value={coupleDetails.email}
                        onChange={(e) => setCoupleDetails({...coupleDetails, email: e.target.value})}
                        className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Contact Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+94 XX XXX XXXX"
                        value={coupleDetails.phone}
                        onChange={(e) => setCoupleDetails({...coupleDetails, phone: e.target.value})}
                        className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Additional Curation Directives</label>
                      <textarea
                        rows={3}
                        placeholder="Preferred color schemas, traditional oil lamp requirements, high-end visual or specific catering needs..."
                        value={coupleDetails.visionNotes}
                        onChange={(e) => setCoupleDetails({...coupleDetails, visionNotes: e.target.value})}
                        className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm placeholder:text-gray-400 font-sans resize-none"
                      ></textarea>
                    </div>

                    {/* Pre-populated metadata fields */}
                    <div className="hidden">
                      <input type="text" readOnly value={`June ${selectedDate}, 2026`} />
                      <input type="text" readOnly value={selectedTimeslot} />
                      <input type="text" readOnly value={selectedPkg} />
                      <input type="number" readOnly value={guestCount} />
                      <input type="text" readOnly value={costBreakdown.grandTotal} />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1A1512] text-white hover:bg-[#c69c6d] hover:text-black py-3.5 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Securing Reservation Date...</span>
                      ) : (
                        <>
                          <span>Transmit Secure Booking</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 px-2 space-y-5">
                  <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-serif text-gray-900 leading-tight">Reservation Secured</h4>
                  <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">
                    Congratulations, <strong>{coupleDetails.partner1} &amp; {coupleDetails.partner2}</strong>. We have registered your holding reservation for <strong>June {selectedDate}, 2026</strong>.
                  </p>

                  <div className="border border-[#E8DFC9] bg-[#FAF6EE] p-4 text-left text-xs space-y-2 rounded-sm max-w-xs mx-auto">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium uppercase text-[8px] tracking-wider">Booking Ref:</span>
                      <strong className="text-gray-900">EASCC-2026-X81A</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium uppercase text-[8px] tracking-wider">Timeslot:</span>
                      <span className="font-semibold text-gray-800 capitalize">{selectedTimeslot} Set</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium uppercase text-[8px] tracking-wider">Package / Pax:</span>
                      <span className="font-semibold text-gray-800 capitalize">{selectedPkg} / {guestCount} Guests</span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-gray-200">
                      <span className="text-gray-800 font-bold uppercase text-[8px] tracking-wider">Hold Deposit:</span>
                      <strong className="text-[#7C6A2E]">{formatCurrency(costBreakdown.grandTotal * 0.25)}</strong>
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px] text-gray-500 font-light max-w-xs mx-auto leading-normal">
                    <p>
                      1. To finalize this hold, your 25% reservation deposit must be submitted within <strong>48 hours</strong>.
                    </p>
                    <p>
                      2. Transfer details and deposit instructions have been dispatched to <strong>{coupleDetails.email}</strong>.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="border border-[#1A1512] text-[#1A1512] px-6 py-2.5 hover:bg-[#1A1512] hover:text-white transition-all duration-300 text-[9px] uppercase font-bold tracking-widest rounded-sm"
                    >
                      Book Another Date
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Brand Trust Divider */}
      <section className="bg-[#1A1512] text-white py-12 px-6 border-t border-[#c69c6d]/20 mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#c69c6d]/20 pb-6 md:pb-0 md:pr-8">
            <div className="flex justify-center md:justify-start text-[#c69c6d]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg">100% Date Exclusivity</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              We pledge 100% estate dedication. You alone will occupy the grand ballroom, arrival foyer, and gardens for the entire duration of your wedding.
            </p>
          </div>

          <div className="space-y-2 border-b md:border-b-0 md:border-r border-[#c69c6d]/20 pb-6 md:pb-0 md:pr-8">
            <div className="flex justify-center md:justify-start text-[#c69c6d]">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg">Custom Timeline Bending</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Morning, Evening, or Full-Day configurations adapt precisely to your auspicious hour requirements, complete with early arrival suites.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-center md:justify-start text-[#c69c6d]">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg">Deposit Holding Grace</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Enjoy a 48-hour complimentary calendar hold while coordinating payment transfers and booking walkthroughs.
            </p>
          </div>

        </div>
      </section>

      {/* Brand Footer Section */}
      <footer className="w-full bg-[#151210] border-t border-[#c69c6d]/20 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-[1px] bg-[#c69c6d]"></div>
            <span className="text-sm font-serif tracking-normal text-[#FAF6EE]">EASCC &copy; 2026</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
            <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <Link href="/packages" className="hover:text-white transition-colors duration-200">Packages</Link>
            <Link href="/vendors" className="hover:text-white transition-colors duration-200">Vendors</Link>
            <Link href="#" className="hover:text-white transition-colors duration-200">Virtual Tour</Link>
            <Link href="/book" className="text-[#C69C6D] hover:text-white transition-colors duration-200">Book</Link>
          </div>
          
          <p className="text-[9px] text-gray-600 uppercase tracking-widest font-semibold">Crafted with Intention</p>
        </div>
      </footer>

    </div>
  );
}
