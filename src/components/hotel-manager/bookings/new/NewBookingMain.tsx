"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Palette, Video, Music, X } from 'lucide-react';
import Link from 'next/link';
import { Vendor } from '@/components/landing/vendors/types';
import { useVendorStore } from '@/store/vendorStore';
import { bookingAPI, packageAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { validateEmail, validatePhone } from '@/lib/validation';

import CalendarPicker from "@/components/landing/book/CalendarPicker";
import TimeRangeSelector from "@/components/landing/book/TimeRangeSelector";
import PackageSelector from "@/components/landing/book/PackageSelector";

interface NewBookingMainProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function NewBookingMain({ onClose, onSuccess }: NewBookingMainProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventType, setEventType] = useState("Wedding");
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("23:00");
  const [selectedPackage, setSelectedPackage] = useState<string>("gold");
  const [guestCount, setGuestCount] = useState<number>(300);

  const [vendors, setLocalVendors] = useState<{
    decorator: string | null;
    decoratorPackage: string;
    dj: string | null;
    djPackage: string;
    videographer: string | null;
    videographerPackage: string;
  }>({
    decorator: null,
    decoratorPackage: "none",
    dj: null,
    djPackage: "none",
    videographer: null,
    videographerPackage: "none"
  });

  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '', alternativePhone: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [previewVendor, setPreviewVendor] = useState<Vendor | null>(null);

  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const router = useRouter();

  const { vendors: globalVendors, fetchVendors } = useVendorStore();

  useEffect(() => {
    fetchVendors();
    packageAPI.getAllPackages().then(res => {
      if (res.ok && res.data?.data) {
        setDbPackages(res.data.data);
      }
    });
  }, [fetchVendors]);

  useEffect(() => {
    if (dbPackages.length > 0) {
      const matchedPkg = dbPackages.find(p => p.name.toLowerCase().includes(selectedPackage.toLowerCase()));
      if (matchedPkg) {
        setGuestCount(matchedPkg.maxGuests || 380);
      }
    }
  }, [selectedPackage, dbPackages]);

  const decorators = globalVendors.filter(v => v.category === 'decorators');
  const djs = globalVendors.filter(v => v.category === 'djs');
  const videographers = globalVendors.filter(v => v.category === 'videographers' || v.category === 'others');

  const handleVendorSelect = (category: "decorator" | "dj" | "videographer", vendorId: string) => {
    setLocalVendors(prev => ({
      ...prev,
      [category]: prev[category] === vendorId ? null : vendorId
    }));
  };

  // Calculations
  const getVendorCost = (cat: "decorator" | "dj" | "videographer") => {
    const vId = vendors[cat];
    if (!vId) return 0;
    const v = globalVendors.find(x => x.id === vId);
    if (!v) return 0;
    const numericStr = v.startingPrice.replace(/[^0-9]/g, "");
    return numericStr ? parseInt(numericStr, 10) : 0;
  };

  const selectedPkgData = dbPackages.find(p => p.name.toLowerCase().includes(selectedPackage));
  const basePrice = selectedPkgData ? selectedPkgData.price : 0;
  const foodCost = guestCount * 3500;

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
  const extraHours = Math.max(0, durationHours - 6);
  const extraHoursPremium = extraHours * 50000;

  const decCost = getVendorCost('decorator');
  const vidCost = getVendorCost('videographer');
  const djCost = getVendorCost('dj');
  const totalCost = basePrice + foodCost + extraHoursPremium + decCost + vidCost + djCost;
  const depositAmount = totalCost * 0.3;
  const balanceAmount = totalCost * 0.7;

  const handleNext = () => {
    if (currentStep === 1 && selectedDate === 0) {
      alert("Please select an available event date on the calendar.");
      return;
    }
    setCurrentStep(2);
  };

  const submitBooking = async () => {
    setErrors({});
    let hasError = false;
    const newErrors: typeof errors = {};

    if (!validateEmail(clientInfo.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!validatePhone(clientInfo.phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setToast({ type: 'error', msg: 'Please fix the validation errors.' });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    if (!clientInfo.name || !clientInfo.email || !clientInfo.phone) {
      setToast({ type: 'error', msg: 'Please fill in all client details before finalizing.' });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    if (paymentMethod === 'cash' && !cashConfirmed) {
      setToast({ type: 'error', msg: 'Please confirm cash receipt to proceed.' });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      clientName: clientInfo.name,
      email: clientInfo.email,
      phone: clientInfo.phone,
      alternativePhone: clientInfo.alternativePhone || "",
      eventType: eventType,
      packageId: selectedPkgData ? selectedPkgData._id : null,
      packageName: selectedPkgData ? selectedPkgData.name : 'Custom',
      date: selectedDate ? new Date(selectedDate).toISOString() : new Date().toISOString(),
      timeslot: `${startTime} - ${endTime}`,
      durationHours: durationHours,
      guests: guestCount,
      status: 'Pending',  // must match backend enum exactly
      totalCost,
      depositAmount,
      balanceAmount: 0,
      menuType: 'signature',
      vendors: {
        decorator: {
          vendorId: vendors.decorator || null,
          status: vendors.decorator ? 'Pending' : 'NotRequired',
          packageName: vendors.decoratorPackage !== "none" ? vendors.decoratorPackage : ""
        },
        dj: {
          vendorId: vendors.dj || null,
          status: vendors.dj ? 'Pending' : 'NotRequired',
          packageName: vendors.djPackage !== "none" ? vendors.djPackage : ""
        },
        videographer: {
          vendorId: vendors.videographer || null,
          status: vendors.videographer ? 'Pending' : 'NotRequired',
          packageName: vendors.videographerPackage !== "none" ? vendors.videographerPackage : ""
        }
      },
      pricingBreakdown: {
        hallFixedPrice: basePrice,
        extraHoursPremium: extraHoursPremium,
        foodCost: foodCost,
        timeslotPremium: 0,
        decoratorCost: decCost,
        videographerCost: vidCost,
        djCost,
        customMenuSurcharge: 0,
      },
    };

    try {
      const res = await bookingAPI.createBooking(payload);
      if (res.ok) {
        setToast({ type: 'success', msg: 'Booking created successfully!' });
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push('/hotel-manager/bookings');
          }
        }, 1500);
      } else {
        setToast({ type: 'error', msg: res.data?.message || 'Failed to create booking.' });
        setTimeout(() => setToast(null), 4000);
      }
    } catch (err) {
      setToast({ type: 'error', msg: 'Network error. Please check your connection.' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderVendorCard = (vendor: Vendor, category: "decorator" | "dj" | "videographer") => {
    const isSelected = vendors[category] === vendor.id;
    return (
      <div 
        key={vendor.id}
        onClick={() => handleVendorSelect(category, vendor.id)}
        className={`bg-white border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 flex flex-col h-full ${
          isSelected ? 'border-[#B08D2C] ring-2 ring-[#B08D2C]/20 shadow-md' : 'border-[#E0D8C3] hover:border-[#B08D2C] hover:shadow-sm'
        }`}
      >
        <div className="h-40 overflow-hidden relative">
          <img src={vendor.image} alt={vendor.name} className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'hover:scale-105'}`} />
          {isSelected && (
            <div className="absolute top-3 right-3 bg-[#B08D2C] text-white p-1 rounded-full shadow-sm">
              <Check size={14} strokeWidth={3} />
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold tracking-widest px-2 py-1 rounded">
            {vendor.startingPrice}
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <p className="text-[9px] font-bold text-[#A6955C] tracking-widest uppercase mb-1">{vendor.categoryLabel}</p>
            <h4 className="text-base font-serif font-bold text-gray-900 mb-1">{vendor.name}</h4>
            <p className="text-xs text-gray-500 line-clamp-2">{vendor.description}</p>
            <div className="mt-2.5 flex flex-wrap gap-1">
              {vendor.specialties.slice(0, 2).map((s, idx) => (
                <span key={idx} className="bg-[#FAF6EE] border border-[#E0D8C3]/40 text-gray-600 text-[9px] px-2 py-0.5 rounded-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewVendor(vendor);
            }}
            className="mt-4 w-full py-2 border border-[#E0D8C3] text-[10px] font-bold tracking-widest uppercase text-[#7C6A2E] hover:bg-[#FAF6EE] transition-colors"
          >
            View Portfolio
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col flex-1 min-w-0 bg-[#FDF9F1] ${onClose ? 'max-h-[90vh]' : 'min-h-screen'}`}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 text-sm font-semibold rounded shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center justify-between px-4 lg:px-6 h-16 shrink-0">
        <div className="flex items-center gap-4">
          {!onClose && (
            <>
              <Link href="/hotel-manager" className="text-gray-400 hover:text-[#7C6A2E] transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <div className="w-px h-6 bg-[#E0D8C3]" />
            </>
          )}
          <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">
            New Assisted Booking
          </h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition-all"
            title="Close"
          >
            <X size={20} />
          </button>
        )}
      </header>

      <main className={`flex-1 px-4 lg:px-10 py-8 max-w-7xl mx-auto w-full overflow-y-auto ${onClose ? 'max-h-[calc(90vh-4rem)]' : ''}`}>
        {/* Stepper */}
        <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-6 mb-12 relative max-w-xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#E0D8C3] -z-10 -translate-y-1/2"></div>
          {[
            { step: 1, label: "Event Details & Vendors" },
            { step: 2, label: "Payment & Details" }
          ].map((item) => (
            <div 
              key={item.step} 
              onClick={() => {
                if (item.step < currentStep) setCurrentStep(item.step);
              }}
              className={`flex items-center gap-3 bg-[#FDF9F1] pr-4 cursor-pointer hover:opacity-80 transition-opacity ${
                currentStep === item.step ? 'text-gray-900 font-bold' : currentStep > item.step ? 'text-[#7C6A2E]' : 'text-gray-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                currentStep === item.step ? 'border-[#B08D2C] text-[#B08D2C]' :
                currentStep > item.step ? 'border-[#B08D2C] bg-[#B08D2C] text-white' : 'border-gray-300'
              }`}>
                {currentStep > item.step ? <Check size={14} strokeWidth={3} /> : item.step}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:block">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Flow Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Step 1: Event & Vendor Parameters */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Event Type */}
                <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm rounded-sm">
                  <label className="block text-base uppercase tracking-widest text-[#7C6A2E] font-bold mb-4">Event Type</label>
                  <select 
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-4 py-3 rounded-sm text-base text-gray-800 outline-none focus:border-[#B08D2C]"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Corporate Meeting">Corporate Meeting</option>
                    <option value="Conference">Conference</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Other">Other Event</option>
                  </select>
                </div>

                <div className="h-px bg-[#E0D8C3] w-full"></div>
                <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                <div className="h-px bg-[#E0D8C3] w-full"></div>
                <TimeRangeSelector 
                  startTime={startTime} 
                  endTime={endTime} 
                  onChange={(start, end) => {
                    setStartTime(start);
                    setEndTime(end);
                  }} 
                />

                <div className="h-px bg-[#E0D8C3] w-full"></div>
                <PackageSelector 
                  selectedPackage={selectedPackage} 
                  onSelectPackage={setSelectedPackage} 
                  dbPackages={dbPackages}
                />

                <div className="h-px bg-[#E0D8C3] w-full"></div>
                
                {/* Visual vendor grid layouts */}
                <div className="space-y-10">
                  <div className="max-w-2xl">
                    <h3 className="text-2xl font-serif font-bold text-[#7C6A2E] mb-2">Artisan Showcases</h3>
                    <p className="text-xs text-gray-500 font-serif italic">
                      Review portfolio works with the client and choose their preferred decorators, music providers, or film creators.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-[#E0D8C3] pb-2">
                      <Palette size={16} className="text-[#B08D2C]" />
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#7C6A2E]">Master Decorators</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {decorators.map(v => renderVendorCard(v, 'decorator'))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-[#E0D8C3] pb-2">
                      <Video size={16} className="text-[#B08D2C]" />
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#7C6A2E]">Cinematography & Photography</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {videographers.map(v => renderVendorCard(v, 'videographer'))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4 border-b border-[#E0D8C3] pb-2">
                      <Music size={16} className="text-[#B08D2C]" />
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#7C6A2E]">Musical Entertainment</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {djs.map(v => renderVendorCard(v, 'dj'))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Checkout Registry */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Client registry form */}
                <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm">
                  <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-6">Client Registry</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                        placeholder="e.g. John & Sarah"
                        className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FAF6EE]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Email Address</label>
                        <input 
                          type="email"
                          value={clientInfo.email}
                          onChange={(e) => {
                            setClientInfo({...clientInfo, email: e.target.value});
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder="client@example.com"
                          className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FAF6EE]"
                        />
                        {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Phone Number</label>
                        <input 
                          type="tel"
                          value={clientInfo.phone}
                          onChange={(e) => {
                            setClientInfo({...clientInfo, phone: e.target.value});
                            if (errors.phone) setErrors({ ...errors, phone: undefined });
                          }}
                          placeholder="+94 77 ..."
                          className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FAF6EE]"
                        />
                        {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-2">Alternative Phone (Optional)</label>
                      <input 
                        type="tel" 
                        value={clientInfo.alternativePhone}
                        onChange={(e) => setClientInfo({...clientInfo, alternativePhone: e.target.value})}
                        placeholder="+94 77 ..."
                        className="w-full border border-[#E0D8C3] px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-[#FAF6EE]"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment method selector */}
                <div className="bg-white border border-[#E0D8C3] p-8 shadow-sm">
                  <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2">Payment Collection</h3>
                  <p className="text-xs text-gray-500 italic font-serif mb-6">
                    A 30% initial deposit is required to secure the reservation. The remaining 70% must be paid 14 days prior to the event date.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div 
                      onClick={() => setPaymentMethod('card')}
                      className={`border p-4 cursor-pointer text-center transition-colors ${paymentMethod === 'card' ? 'border-[#B08D2C] bg-[#FAF6EE]' : 'border-[#E0D8C3] hover:border-[#B08D2C]'}`}
                    >
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Card Payment</p>
                      <p className="text-[10px] text-gray-500 mt-1">Send payment link</p>
                    </div>
                    <div 
                      onClick={() => setPaymentMethod('cash')}
                      className={`border p-4 cursor-pointer text-center transition-colors ${paymentMethod === 'cash' ? 'border-[#B08D2C] bg-[#FAF6EE]' : 'border-[#E0D8C3] hover:border-[#B08D2C]'}`}
                    >
                      <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Cash Deposit</p>
                      <p className="text-[10px] text-gray-500 mt-1">Collect at desk</p>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="bg-[#FAF6EE] p-5 border border-[#E0D8C3] space-y-4 animate-fadeIn">
                      <p className="text-xs font-bold text-[#7C6A2E] tracking-widest uppercase mb-4 border-b border-[#E0D8C3] pb-2">Credit Card Details</p>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1.5">Cardholder Name</label>
                        <input type="text" placeholder="e.g. John Doe" className="w-full border border-[#E0D8C3] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white rounded-sm" />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1.5">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-[#E0D8C3] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white rounded-sm font-mono" maxLength={19} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1.5">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" className="w-full border border-[#E0D8C3] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white rounded-sm font-mono" maxLength={5} />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-500 tracking-widest uppercase mb-1.5">CVV / CVC</label>
                          <input type="text" placeholder="123" className="w-full border border-[#E0D8C3] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] bg-white rounded-sm font-mono" maxLength={4} />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="bg-[#FAF6EE] p-4 border border-[#E0D8C3] flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="cashConfirm" 
                        checked={cashConfirmed}
                        onChange={(e) => setCashConfirmed(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#B08D2C] cursor-pointer"
                      />
                      <label htmlFor="cashConfirm" className="text-xs text-gray-700 cursor-pointer">
                        <strong className="text-[#7C6A2E]">I confirm</strong> that I have physically received the 30% initial deposit (<strong className="text-gray-900">LKR {depositAmount.toLocaleString()}</strong>) in cash from the client.
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-[#E0D8C3]">
              {currentStep > 1 ? (
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 bg-transparent text-[#B08D2C] border border-[#B08D2C] text-xs uppercase font-bold tracking-[0.2em] hover:bg-[#B08D2C] hover:text-white transition-colors rounded-sm"
                >
                  &larr; Previous Step
                </button>
              ) : <div></div>}

              {currentStep === 1 ? (
                <button 
                  onClick={handleNext}
                  className="bg-[#7C6A2E] hover:bg-[#5E4F20] text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm shadow-sm transition-colors"
                >
                  Continue &rarr;
                </button>
              ) : (
                <button 
                  onClick={submitBooking}
                  disabled={isSubmitting}
                  className="bg-green-700 hover:bg-green-800 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Finalizing...' : 'Finalize & Add Booking'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-4 bg-[#FAF6EE] border border-[#E0D8C3] shadow-sm flex flex-col h-fit sticky top-24 rounded-sm">
            <div className="bg-[#4E411B] p-5 text-center">
              <h3 className="text-lg font-serif font-bold text-white tracking-widest uppercase">Investment Summary</h3>
            </div>
            
            <div className="p-6 space-y-6 flex-1 text-sm text-gray-700">
              <div className="border-b border-[#E0D8C3] pb-4">
                <p className="text-[9px] font-bold text-[#A6955C] tracking-widest uppercase mb-1">Event Type & Date</p>
                <p className="text-sm font-bold text-gray-900">{eventType}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date Not Selected'}
                </p>
              </div>

              <div className="space-y-3 pb-4 border-b border-[#E0D8C3]">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Base {selectedPackage.toUpperCase()}</span>
                  <span className="text-xs font-bold text-gray-900">LKR {basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Signature Menu ({guestCount} pax)</span>
                  <span className="text-xs font-bold text-gray-900">LKR {foodCost.toLocaleString()}</span>
                </div>
                {extraHoursPremium > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Duration Extension ({durationHours.toFixed(1)} hrs)</span>
                    <span className="text-xs font-bold text-gray-900">LKR {extraHoursPremium.toLocaleString()}</span>
                  </div>
                )}
                {decCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Decorator ({globalVendors.find(v=>v.id===vendors.decorator)?.name})</span>
                    <span className="text-xs font-bold text-gray-900">LKR {decCost.toLocaleString()}</span>
                  </div>
                )}
                {vidCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Videography ({globalVendors.find(v=>v.id===vendors.videographer)?.name})</span>
                    <span className="text-xs font-bold text-gray-900">LKR {vidCost.toLocaleString()}</span>
                  </div>
                )}
                {djCost > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Entertainment ({globalVendors.find(v=>v.id===vendors.dj)?.name})</span>
                    <span className="text-xs font-bold text-gray-900">LKR {djCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-[#7C6A2E]">Total Investment</span>
                  <span className="text-xl font-serif font-bold text-gray-900">LKR {totalCost.toLocaleString()}</span>
                </div>
                
                <div className="bg-white border border-[#E0D8C3] p-4 text-center">
                  <p className="text-[9px] font-bold tracking-widest text-[#B08D2C] uppercase mb-1">Deposit Due Now (30%)</p>
                  <p className="text-lg font-serif font-bold text-gray-900">
                    LKR {depositAmount.toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-[10px] text-gray-500">
                    Balance of <strong className="text-[#7C6A2E]">LKR {balanceAmount.toLocaleString()}</strong> due before event.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Portfolio Preview Modal */}
      {previewVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FDF9F1] w-full max-w-5xl rounded shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#E0D8C3]">
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#7C6A2E]">{previewVendor.name} - Portfolio</h3>
                <p className="text-sm text-gray-500 font-serif italic">{previewVendor.categoryLabel} Showcase</p>
              </div>
              <button type="button" onClick={() => setPreviewVendor(null)} className="p-2 bg-[#E0D8C3] hover:bg-[#D0C8B3] rounded-full transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <p className="text-gray-700 text-sm mb-6 leading-relaxed max-w-3xl font-light">
                {previewVendor.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {previewVendor.portfolio && previewVendor.portfolio.length > 0 ? (
                  previewVendor.portfolio.map((img, idx) => (
                    <div key={idx} className="relative aspect-square overflow-hidden group border border-[#E0D8C3]">
                      <img src={img} alt={`Portfolio ${idx+1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-gray-500 italic">No portfolio images available for this artisan.</div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-[#E0D8C3] bg-[#FAF6EE] flex justify-end">
              <button 
                type="button"
                onClick={() => {
                  handleVendorSelect(
                    previewVendor.category === 'decorators' ? 'decorator' : 
                    previewVendor.category === 'djs' ? 'dj' : 'videographer', 
                    previewVendor.id
                  );
                  setPreviewVendor(null);
                }}
                className="bg-[#7C6A2E] hover:bg-[#5E4F20] text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded shadow-sm transition-colors"
              >
                {vendors[
                  previewVendor.category === 'decorators' ? 'decorator' : 
                  previewVendor.category === 'djs' ? 'dj' : 'videographer'
                ] === previewVendor.id ? 'Unselect Artisan' : 'Select This Artisan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
