import React, { useState, useMemo, useEffect } from "react";
import { 
  Calculator, Info, Minus, Plus, Calendar, Send, Award 
} from "lucide-react";
import { SIGNATURE_PACKAGES } from "./types";

interface CostCalculatorProps {
  selectedPkg: "silver" | "gold" | "diamond";
  onPackageChange: (pkgId: "silver" | "gold" | "diamond") => void;
}

export default function CostCalculator({ selectedPkg, onPackageChange }: CostCalculatorProps) {
  // Sync guest count and state when selected package changes
  const activePkgDetail = useMemo(() => {
    return SIGNATURE_PACKAGES.find(pkg => pkg.id === selectedPkg)!;
  }, [selectedPkg]);

  const [guestCount, setGuestCount] = useState<number>(activePkgDetail.baseGuests);
  const [extraHours, setExtraHours] = useState<number>(0);
  
  const [addOns, setAddOns] = useState({
    poruwa: false,
    suspendedCeiling: false,
    mixologyBar: false,
    aerialDrone: false,
  });

  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    notes: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync guest count default when changing package
  useEffect(() => {
    setGuestCount(activePkgDetail.baseGuests);
  }, [selectedPkg, activePkgDetail]);

  const handleLocalPkgChange = (pkgId: "silver" | "gold" | "diamond") => {
    onPackageChange(pkgId);
  };

  const calculatedCosts = useMemo(() => {
    const basePrice = activePkgDetail.priceNum;
    
    // Additional guests calculation
    const extraGuests = Math.max(0, guestCount - activePkgDetail.baseGuests);
    const guestSurcharge = extraGuests * activePkgDetail.extraGuestFee;
    
    // Add-ons total
    let addOnsTotal = 0;
    if (addOns.poruwa) addOnsTotal += 350000;
    if (addOns.suspendedCeiling) addOnsTotal += 250000;
    if (addOns.mixologyBar) addOnsTotal += 150000;
    if (addOns.aerialDrone) addOnsTotal += 220000;
    
    // Extra hours (LKR 80,000 per hour)
    const extraHoursCost = extraHours * 80000;
    
    const grandTotal = basePrice + guestSurcharge + addOnsTotal + extraHoursCost;
    
    return {
      basePrice,
      extraGuests,
      guestSurcharge,
      addOnsTotal,
      extraHoursCost,
      grandTotal
    };
  }, [activePkgDetail, guestCount, addOns, extraHours]);

  // Formatter for LKR Prices
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0
    }).format(val).replace("LKR", "LKR ");
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      alert("Please fill in all mandatory fields (*).");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate luxury API booking request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const resetForm = () => {
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      date: "",
      notes: ""
    });
    setIsSubmitted(false);
  };

  return (
    <section id="calculator" className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center mb-16 space-y-3">
        <p className="text-[#c69c6d] text-[10px] tracking-[0.2em] uppercase font-semibold">
          Bespoke Pricing
        </p>
        <h2 className="text-3xl font-serif text-gray-900 leading-tight">
          Interactive Cost Estimator
        </h2>
        <p className="text-xs text-gray-500 font-light max-w-md mx-auto">
          Design your celebration structure in real-time. Alter guest capacities, layer structural styling elements, and calculate instant budgets.
        </p>
        <div className="w-12 h-[1px] bg-[#c69c6d] mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Inputs Block */}
        <div className="lg:col-span-7 bg-white border border-[#E8DFC9] p-6 md:p-8 shadow-md rounded-sm space-y-8">
          
          {/* Step 1: Base Package Selection */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">
              Step 1: Choose Your Celebration Base
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SIGNATURE_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handleLocalPkgChange(pkg.id)}
                  className={`p-4 border text-center flex flex-col justify-between items-center transition-all duration-300 rounded-sm ${
                    selectedPkg === pkg.id 
                      ? "border-[#c69c6d] bg-[#C69C6D]/5 shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-widest font-semibold text-gray-500 mb-1">{pkg.name.split(" ")[0]}</span>
                  <span className="text-lg font-serif font-bold text-gray-900">{pkg.price.split(" ")[1]}</span>
                  <span className="text-[9px] text-gray-400 mt-1">{pkg.baseGuests} Guests base</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Guest Count Slider / Buttons */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">
                Step 2: Expected Guest Attendance
              </label>
              <span className="text-xs font-semibold text-gray-400">
                Base Capacity: <span className="text-[#1A1512]">{activePkgDetail.baseGuests} Guests</span>
              </span>
            </div>

            <div className="bg-[#FAF6EE] p-4 border border-[#E8DFC9] flex items-center justify-between rounded-sm">
              <button 
                onClick={() => setGuestCount(Math.max(50, guestCount - 10))}
                className="w-10 h-10 bg-white border border-[#E0D8C3] hover:border-gray-400 transition-all rounded-sm flex items-center justify-center text-gray-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-3xl font-serif font-bold text-gray-900">{guestCount}</span>
                <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Guests Selected</span>
              </div>
              <button 
                onClick={() => setGuestCount(Math.min(600, guestCount + 10))}
                className="w-10 h-10 bg-white border border-[#E0D8C3] hover:border-gray-400 transition-all rounded-sm flex items-center justify-center text-gray-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {guestCount > activePkgDetail.baseGuests && (
              <div className="flex gap-2 items-center text-[11px] text-[#7C6A2E] bg-[#C69C6D]/5 border border-[#c69c6d]/20 p-3 rounded-sm leading-relaxed">
                <Info className="w-4 h-4 text-[#c69c6d] shrink-0" />
                <p>
                  Attendance exceeds baseline by <strong>{guestCount - activePkgDetail.baseGuests} guests</strong>. Additional charges apply at {formatCurrency(activePkgDetail.extraGuestFee)} per person.
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Premium Upgrades & Add-ons */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">
              Step 3: Signature Venue Upgrades
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Traditional Poruwa */}
              <label className={`p-4 border rounded-sm flex items-start gap-3.5 cursor-pointer transition-all ${
                addOns.poruwa ? "border-[#c69c6d] bg-[#C69C6D]/5" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input 
                  type="checkbox"
                  checked={addOns.poruwa}
                  onChange={(e) => setAddOns({...addOns, poruwa: e.target.checked})}
                  className="mt-1 accent-[#c69c6d]"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Traditional Royal Poruwa</p>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">Gold leaf structure setup</p>
                  <span className="text-[11px] text-[#7C6A2E] font-medium block mt-1.5">+ LKR 350,000</span>
                </div>
              </label>

              {/* Suspended Ceiling */}
              <label className={`p-4 border rounded-sm flex items-start gap-3.5 cursor-pointer transition-all ${
                addOns.suspendedCeiling ? "border-[#c69c6d] bg-[#C69C6D]/5" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input 
                  type="checkbox"
                  checked={addOns.suspendedCeiling}
                  onChange={(e) => setAddOns({...addOns, suspendedCeiling: e.target.checked})}
                  className="mt-1 accent-[#c69c6d]"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Suspended Overhead Florals</p>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">Full-scale imported orchid styling</p>
                  <span className="text-[11px] text-[#7C6A2E] font-medium block mt-1.5">+ LKR 250,000</span>
                </div>
              </label>

              {/* Mixology Bar */}
              <label className={`p-4 border rounded-sm flex items-start gap-3.5 cursor-pointer transition-all ${
                addOns.mixologyBar ? "border-[#c69c6d] bg-[#C69C6D]/5" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input 
                  type="checkbox"
                  checked={addOns.mixologyBar}
                  onChange={(e) => setAddOns({...addOns, mixologyBar: e.target.checked})}
                  className="mt-1 accent-[#c69c6d]"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Molecular Mixology Bar</p>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">Artisanal live drink chemistry</p>
                  <span className="text-[11px] text-[#7C6A2E] font-medium block mt-1.5">+ LKR 150,000</span>
                </div>
              </label>

              {/* Aerial Drone Video */}
              <label className={`p-4 border rounded-sm flex items-start gap-3.5 cursor-pointer transition-all ${
                addOns.aerialDrone ? "border-[#c69c6d] bg-[#C69C6D]/5" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input 
                  type="checkbox"
                  checked={addOns.aerialDrone}
                  onChange={(e) => setAddOns({...addOns, aerialDrone: e.target.checked})}
                  className="mt-1 accent-[#c69c6d]"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">4K Cinematic Aerial Drone</p>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">Event videography drone flights</p>
                  <span className="text-[11px] text-[#7C6A2E] font-medium block mt-1.5">+ LKR 220,000</span>
                </div>
              </label>

            </div>
          </div>

          {/* Step 4: Extra Event Hours */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold">
                Step 4: Extension of Timeline
              </label>
              <span className="text-xs font-semibold text-gray-600">
                {extraHours} Additional Hours
              </span>
            </div>
            <div className="flex items-center gap-4 bg-[#FAF6EE] p-4 border border-[#E8DFC9] rounded-sm">
              <button 
                onClick={() => setExtraHours(Math.max(0, extraHours - 1))}
                className="w-8 h-8 bg-white border border-[#E0D8C3] hover:border-gray-400 transition-all rounded-sm flex items-center justify-center text-gray-600 shrink-0"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input 
                type="range"
                min="0"
                max="4"
                value={extraHours}
                onChange={(e) => setExtraHours(Number(e.target.value))}
                className="w-full accent-[#c69c6d]"
              />
              <button 
                onClick={() => setExtraHours(Math.min(4, extraHours + 1))}
                className="w-8 h-8 bg-white border border-[#E0D8C3] hover:border-gray-400 transition-all rounded-sm flex items-center justify-center text-gray-600 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 italic">
              Standard reservation provides 6 exclusive event hours. Additional time is billed at LKR 80,000 per hour.
            </p>
          </div>

        </div>

        {/* RIGHT: Live Price Statement Card & Pre-filled Inquiry */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Pricing Breakdown Card */}
          <div className="bg-[#1A1512] text-white border border-[#c69c6d]/20 p-6 md:p-8 shadow-2xl rounded-sm relative overflow-hidden">
            {/* Gold Accent Corner Decor */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#c69c6d]/20 pointer-events-none"></div>
            
            <div className="flex items-center gap-2 text-[#c69c6d] mb-4">
              <Calculator className="w-4 h-4" />
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold">Estimated Cost Statement</span>
            </div>

            <h3 className="text-xl font-serif mb-6 pb-4 border-b border-white/10 font-medium">Cost Breakdown</h3>

            <div className="space-y-4 text-xs font-light text-gray-300">
              
              <div className="flex justify-between items-center">
                <span>Base Package ({activePkgDetail.name}):</span>
                <span className="font-semibold text-white">{formatCurrency(calculatedCosts.basePrice)}</span>
              </div>

              {calculatedCosts.extraGuests > 0 && (
                <div className="flex justify-between items-center text-[#d9b891]">
                  <span>Extra Guests ({calculatedCosts.extraGuests} pax):</span>
                  <span className="font-semibold">{formatCurrency(calculatedCosts.guestSurcharge)}</span>
                </div>
              )}

              {calculatedCosts.addOnsTotal > 0 && (
                <div className="flex justify-between items-center">
                  <span>Aesthetic Upgrades:</span>
                  <span className="font-semibold text-white">{formatCurrency(calculatedCosts.addOnsTotal)}</span>
                </div>
              )}

              {calculatedCosts.extraHoursCost > 0 && (
                <div className="flex justify-between items-center">
                  <span>Extended Hours ({extraHours} hrs):</span>
                  <span className="font-semibold text-white">{formatCurrency(calculatedCosts.extraHoursCost)}</span>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-[10px] tracking-wider uppercase font-bold text-gray-400">Total Estimate</span>
                <div className="text-right">
                  <span className="text-2xl font-serif font-bold text-[#c69c6d]">
                    {formatCurrency(calculatedCosts.grandTotal)}
                  </span>
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Estimated Total</p>
                </div>
              </div>

            </div>

            <p className="text-[9px] text-gray-500 italic mt-6 leading-normal font-light">
              * Prices computed are estimations. Local taxes, luxury levies, and structural installation parameters will be finalized in your contractual agreement.
            </p>
          </div>

          {/* pre-filled Booking / Inquiry Form */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-md rounded-sm">
            {!isSubmitted ? (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="flex items-center gap-1 text-[#A6955C] mb-2">
                  <Calendar className="w-4 h-4 text-[#c69c6d]" />
                  <h4 className="text-[10px] uppercase tracking-widest font-bold">Request Bespoke Reservation</h4>
                </div>
                
                <p className="text-[11px] text-gray-500 leading-normal font-light mb-4">
                  Send your configured estimation to our events concierge to check calendar availability.
                </p>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Names of the Couple *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name & Name"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                      className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="client@mail.com"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="+94 XX XXX XXXX"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Auspicious Event Date *</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                      className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-wider text-gray-500 font-bold mb-1">Special Curation Vision</label>
                    <textarea
                      rows={2}
                      placeholder="Tell us about your culinary requirements, color themes, or guest parameters..."
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                      className="w-full bg-[#FAF6EE] border border-[#E0D8C3] p-3 text-xs text-[#1A1512] outline-none focus:border-[#C69C6D] rounded-sm placeholder:text-gray-400 font-sans resize-none"
                    ></textarea>
                  </div>

                  {/* Pre-populated metadata inputs */}
                  <div className="hidden">
                    <input type="text" readOnly value={selectedPkg} />
                    <input type="number" readOnly value={guestCount} />
                    <input type="text" readOnly value={calculatedCosts.grandTotal} />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1A1512] text-white hover:bg-[#c69c6d] hover:text-black py-3 rounded-sm text-[10px] uppercase font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Request...</span>
                    ) : (
                      <>
                        <span>Send Estimation to Concierge</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 px-4 space-y-4">
                <div className="w-12 h-12 bg-[#C69C6D]/15 border border-[#c69c6d]/30 text-[#7C6A2E] rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif text-gray-900">Inquiry Transmitted</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{bookingForm.name}</strong>. Your custom configured estimation of{" "}
                  <strong className="text-[#7C6A2E]">{formatCurrency(calculatedCosts.grandTotal)}</strong> for your{" "}
                  <strong>{activePkgDetail.name}</strong> celebration on <strong>{bookingForm.date}</strong> has been secured by our Executive Butler team.
                </p>
                <p className="text-[10px] text-gray-400 italic">
                  A dedicated coordinator will verify ballroom availability and contact you within 24 hours.
                </p>
                <button
                  onClick={resetForm}
                  className="border border-[#1A1512] text-[#1A1512] px-6 py-2 hover:bg-[#1A1512] hover:text-white transition-all duration-300 text-[9px] uppercase font-bold tracking-widest rounded-sm"
                >
                  Configure Another Setup
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
