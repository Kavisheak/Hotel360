"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles, Calendar, Clock, Users, Building, Gift, Check, Plus, ChevronUp, ChevronDown, Lock, X, ArrowRight, Edit2, Headphones, ShieldCheck, AlertTriangle } from "lucide-react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import PackageCards from "@/components/landing/packages/PackageCards";
import BookingVendorSelector, { VendorsState } from "@/components/landing/book/BookingVendorSelector";
import BookingHistory from "@/components/landing/book/BookingHistory";
import DateRequiredModal from "@/components/landing/book/DateRequiredModal";
import CalendarPicker from "@/components/landing/book/CalendarPicker";
import LoginRequiredModal from "@/components/landing/shared/LoginRequiredModal";
import PolicyModal from "@/components/landing/book/PolicyModal";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useVendorStore } from "@/store/vendorStore";
import type { Vendor, VendorPackage } from "@/store/vendorStore";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { customerBookingAPI, packageAPI, hotelManagerAPI } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";

function AnimatedPrice({ value, format }: { value: number; format: (val: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value);
  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    const duration = 800; // ms
    const startTime = performance.now();
    let animationFrame: number;
    
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      const current = Math.round(start + (end - start) * ease);
      setDisplayValue(current);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <span>{format(displayValue)}</span>;
}

export default function BookPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [startTime, setStartTime] = useState<string>("18:00");
  const [endTime, setEndTime] = useState<string>("23:00");
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [eventType, setEventType] = useState<string>("Wedding");
  const [guestCount, setGuestCount] = useState<number>(380);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [holdExpiresAt, setHoldExpiresAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Toast state
  const [toast, setToast] = useState<{show: boolean; title: string; subtitle: string}>({ show: false, title: "", subtitle: "" });
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout[]>([]);

  const triggerToast = (title: string, subtitle: string = "You can now configure your event details.") => {
    console.log("TRIGGER TOAST CALLED", { title, subtitle });
    // Clear any existing timeouts to prevent overlapping animations
    toastTimeoutRef.current.forEach(clearTimeout);
    toastTimeoutRef.current = [];

    // Start by hiding the toast if it's currently visible
    setIsToastVisible(false);
    
    // Wait a brief moment for the CSS to reset before showing the new one
    const t1 = setTimeout(() => {
      console.log("SETTING TOAST STATE", { title, subtitle });
      setToast({ show: true, title, subtitle });
      
      const t2 = setTimeout(() => setIsToastVisible(true), 100);
      const t3 = setTimeout(() => setIsToastVisible(false), 4500);
      const t4 = setTimeout(() => setToast({ show: false, title: "", subtitle: "" }), 5500);
      
      toastTimeoutRef.current.push(t2, t3, t4);
    }, 150);
    
    toastTimeoutRef.current.push(t1);
  };

  // Step 2 Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [nic, setNic] = useState("");
  const [notes, setNotes] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("France");
  const [paymentMethod, setPaymentMethod] = useState<"Visa" | "MasterCard" | "PayPal" | "Stripe">("Visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [walletId, setWalletId] = useState("");
  const [vishwaUser, setVishwaUser] = useState("");
  const [vishwaAccount, setVishwaAccount] = useState("");
  const [kokoPhone, setKokoPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBookingRef, setSuccessBookingRef] = useState("");
  const [successAdvancePaid, setSuccessAdvancePaid] = useState(0);
  const [successRemainingBalance, setSuccessRemainingBalance] = useState(0);
  const [successBookingId, setSuccessBookingId] = useState("");
  const [paymentPendingNotice, setPaymentPendingNotice] = useState<{ bookingId: string } | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    nic?: string;
    billingAddress?: string;
    billingCity?: string;
    billingPostalCode?: string;
    billingCountry?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  }>({});

  const [glowHall, setGlowHall] = useState(false);
  const [glowPackage, setGlowPackage] = useState(false);
  const [glowDecorator, setGlowDecorator] = useState(false);
  const [glowDj, setGlowDj] = useState(false);
  const [glowVideographer, setGlowVideographer] = useState(false);
  const [glowGuests, setGlowGuests] = useState(false);
  const [mobileSummaryExpanded, setMobileSummaryExpanded] = useState(false);
  const [mobileOpenAccordion, setMobileOpenAccordion] = useState<string | null>(null);

  const { fetchUser, user } = useAuthStore();
  const { vendors: globalVendors, fetchVendors } = useVendorStore();
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [maxCapacity, setMaxCapacity] = useState<number>(600);
  const [venueSettings, setVenueSettings] = useState<any>(null);
  const [unavailableDates, setUnavailableDates] = useState<{date: string, status: string}[]>([]);
  const { addToast } = useToastStore();
  const [policyModalType, setPolicyModalType] = useState<"vendor" | "cancellation" | null>(null);
  useEffect(() => {
    fetchVendors();
    packageAPI.getAllPackages().then((res) => {
      if (res.ok && res.data?.data) {
        setDbPackages(res.data.data);
      }
    });
    hotelManagerAPI.getVenueSettings().then((res) => {
      if (res.ok && res.data?.settings) {
        setVenueSettings(res.data.settings);
        if (res.data.settings.maxCapacity) {
          setMaxCapacity(res.data.settings.maxCapacity);
        }
      }
    });
    customerBookingAPI.getAvailability().then(res => {
      if (res.ok && res.data?.data) {
        setUnavailableDates(res.data.data);
      }
    });
  }, [fetchVendors]);

  const isSelectedDateUnavailable = () => {
    if (!selectedDate) return false;
    const dateStr = new Date(selectedDate).toDateString();
    return unavailableDates.some(ud => new Date(ud.date).toDateString() === dateStr);
  };

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
      setNic(user.nic || "");
      
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

  const [decoratorRequirements, setDecoratorRequirements] = useState("");
  const [videographerRequirements, setVideographerRequirements] = useState("");
  const [djRequirements, setDjRequirements] = useState("");

  const [vendors, setLocalVendors] = useState<VendorsState>({
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

  const [isStateLoaded, setIsStateLoaded] = useState(false);

  useEffect(() => {
    let finalVendors: Partial<typeof vendors> = {};
    let isVendorUpdate = false;

    // 1. Load from Draft
    const saved = sessionStorage.getItem("bookingDraft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.selectedDate) setSelectedDate(new Date(parsed.selectedDate).getTime());
        if (parsed.eventType) setEventType(parsed.eventType);
        if (parsed.guestCount) setGuestCount(parsed.guestCount);
        else if (parsed.guests) setGuestCount(parsed.guests);
        if (parsed.startTime) setStartTime(parsed.startTime);
        if (parsed.endTime) setEndTime(parsed.endTime);
        if (parsed.selectedPackage) setSelectedPackage(parsed.selectedPackage);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.vendors) {
          finalVendors = { ...finalVendors, ...parsed.vendors };
          isVendorUpdate = true;
        }
      } catch (e) {}
    }

    // 2. Load from URL parameters
    const searchParams = new URLSearchParams(window.location.search || window.location.href.split('?')[1] || "");
    const prePackage = searchParams.get("package") || searchParams.get("pkg");
    const preDecorator = searchParams.get("decorator") || searchParams.get("decorators");
    const preDj = searchParams.get("dj") || searchParams.get("djs");
    const preVid = searchParams.get("videographer") || searchParams.get("videographers");
    const prePhotographer = searchParams.get("photographer") || searchParams.get("photographers");
    const preCake = searchParams.get("cake");
    const preFlorist = searchParams.get("florist") || searchParams.get("florists");
    const fromSelect = searchParams.get("fromSelect");

    if (preDecorator || preDj || preVid || prePhotographer || preCake || preFlorist) {
      finalVendors = {
        ...finalVendors,
        decorator: preDecorator || finalVendors.decorator || "none",
        dj: preDj || finalVendors.dj || "none",
        videographer: preVid || finalVendors.videographer || "none",
        photographer: prePhotographer || finalVendors.photographer || "none",
        cake: preCake || finalVendors.cake || "none",
        florist: preFlorist || finalVendors.florist || "none",
      };
      isVendorUpdate = true;
    }

    if (prePackage && ["silver", "gold", "diamond"].includes(prePackage)) {
      setSelectedPackage(prePackage);
      if (fromSelect) {
        const pkgName = prePackage.charAt(0).toUpperCase() + prePackage.slice(1) + " Package";
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("fromSelect");
        window.history.replaceState({}, "", newUrl.toString());
        setTimeout(() => triggerToast(`Selected ${pkgName}!`, "You can now configure your event details."), 300);
      }
    }

    // 3. Load from Cart
    const importFromCart = sessionStorage.getItem("importFromCart");
    const fromCartParam = searchParams.get("fromCart");
    
    if (importFromCart === "true" || fromCartParam === "true") {
      sessionStorage.removeItem("importFromCart");
      sessionStorage.removeItem("bookingDraft");
      if (fromCartParam === "true") {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("fromCart");
        window.history.replaceState({}, "", newUrl.toString());
      }

      // Read from localStorage first (zustand persist may not have rehydrated yet)
      let cartVendorIds: Record<string, string | null> = {
        decorator: null, dj: null, videographer: null,
        photographer: null, cake: null, florist: null
      };
      let cartPackages: Record<string, string> = {
        decorator: "none", photographer: "none", cake: "none", florist: "none"
      };

      try {
        const rawLocal = localStorage.getItem("vendor-cart");
        if (rawLocal) {
          const parsedLocal = JSON.parse(rawLocal);
          if (parsedLocal?.state?.vendors) {
            cartVendorIds = { ...cartVendorIds, ...parsedLocal.state.vendors };
          }
          if (parsedLocal?.state?.vendorPackages) {
            cartPackages = { ...cartPackages, ...parsedLocal.state.vendorPackages };
          }
        }
      } catch (e) {
        console.error("Error reading vendor-cart from localStorage", e);
      }

      // Overlay with zustand state only if it has non-null values (i.e., already rehydrated)
      const zustandCart = useVendorCartStore.getState().vendors;
      const zustandPkgs = useVendorCartStore.getState().vendorPackages;
      for (const key of Object.keys(zustandCart) as (keyof typeof zustandCart)[]) {
        if (zustandCart[key]) {
          cartVendorIds[key] = zustandCart[key];
        }
      }
      for (const key of Object.keys(zustandPkgs) as (keyof typeof zustandPkgs)[]) {
        if (zustandPkgs[key] && zustandPkgs[key] !== "none") {
          cartPackages[key] = zustandPkgs[key];
        }
      }

      finalVendors = {
        ...finalVendors,
        decorator: cartVendorIds.decorator || "none",
        decoratorPackage: cartPackages.decorator || "none",
        dj: cartVendorIds.dj || "none",
        djPackage: "none",
        videographer: cartVendorIds.videographer || "none",
        videographerPackage: "none",
        photographer: cartVendorIds.photographer || "none",
        photographerPackage: cartPackages.photographer || "none",
        cake: cartVendorIds.cake || "none",
        cakePackage: cartPackages.cake || "none",
        florist: cartVendorIds.florist || "none",
        floristPackage: cartPackages.florist || "none",
      };
      isVendorUpdate = true;
      setTimeout(() => triggerToast("Vendors Imported!", "Your selected vendors have been added to your booking."), 300);
    }

    if (isVendorUpdate) {
      setLocalVendors(prev => ({ ...prev, ...finalVendors }));
    }

    setIsStateLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isStateLoaded) return;
    const draft = {
      selectedDate,
      eventType,
      guestCount,
      startTime,
      endTime,
      selectedPackage,
      currentStep,
      vendors
    };
    sessionStorage.setItem("bookingDraft", JSON.stringify(draft));
  }, [isStateLoaded, selectedDate, eventType, guestCount, startTime, endTime, selectedPackage, currentStep, vendors]);

  const getVendorName = (id: string | null) => {
    if (!id || id === "none") return "";
    if (id === "custom_preference") return "Custom Preference";
    const v = globalVendors.find((v: Vendor) => v.id === id || (v as any)._id === id);
    return v ? ((v as any).businessName || v.name) : "";
  };

  const getPackageName = (id: string | null) => {
    if (!id) return "";
    const pkg = dbPackages.find((p: any) => p.id === id || p._id === id);
    if (pkg) return pkg.name;
    // Fallback if dbPackages isn't loaded or id is a slug
    if (["silver", "gold", "diamond"].includes(id.toLowerCase())) {
      return id.charAt(0).toUpperCase() + id.slice(1);
    }
    return "Custom";
  };

  const setVendors = (newVendors: typeof vendors, categoryUpdated?: string) => {
    // Check which vendor was selected by using the explicitly passed category
    // Toast messages for vendor selections have been removed per user request

    setLocalVendors(newVendors);
    // Removed: no longer writing back to the global vendorCartStore
  };



  useEffect(() => {
    if (selectedDate !== 0) {
      setGlowHall(true);
      const timer = setTimeout(() => setGlowHall(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedDate]);

  useEffect(() => {
    setGlowPackage(true);
    const timer = setTimeout(() => setGlowPackage(false), 1200);
    return () => clearTimeout(timer);
  }, [selectedPackage]);

  useEffect(() => {
    if (vendors.decorator && vendors.decorator !== "none") {
      setGlowDecorator(true);
      const timer = setTimeout(() => setGlowDecorator(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [vendors.decorator]);

  useEffect(() => {
    if (vendors.dj && vendors.dj !== "none") {
      setGlowDj(true);
      const timer = setTimeout(() => setGlowDj(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [vendors.dj]);

  useEffect(() => {
    if (vendors.videographer && vendors.videographer !== "none") {
      setGlowVideographer(true);
      const timer = setTimeout(() => setGlowVideographer(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [vendors.videographer]);

  useEffect(() => {
    setGlowGuests(true);
    const timer = setTimeout(() => setGlowGuests(false), 1200);
    return () => clearTimeout(timer);
  }, [guestCount]);

  const getBasePrice = () => {
    if (dbPackages && dbPackages.length > 0) {
      const matched = dbPackages.find((pkg) => {
        if (pkg.id === selectedPackage || pkg._id === selectedPackage) return true;
        const nameLower = pkg.name.toLowerCase();
        let slug = "gold";
        if (nameLower.includes("silver")) slug = "silver";
        else if (nameLower.includes("diamond")) slug = "diamond";
        return slug === selectedPackage;
      });
      if (matched && matched.price) {
        return typeof matched.price === "number" ? matched.price : parseInt(matched.price, 10);
      }
    }
    if (selectedPackage === "silver") return 1800000;
    if (selectedPackage === "gold") return 3400000;
    if (selectedPackage === "diamond") return 5000000;
    return 0;
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

    if (category === "decorator") {
      const pkgName = vendors[`${category}Package` as keyof typeof vendors];
      if (pkgName === "none" || pkgName === "Custom Preferences") return 0;
    }

    const pkgName = vendors[`${category}Package` as keyof typeof vendors];
    if (pkgName && pkgName !== "none" && pkgName !== "Custom Preferences") {
      const v = globalVendors.find((v: Vendor) => v.id === vendorId || (v as any)._id === vendorId);
      if (!v) return 0;

      const pkg = v.packages?.find((p: VendorPackage) => p.name === pkgName);
      if (pkg && pkg.price !== undefined) {
        const numericStr = String(pkg.price).replace(/[^0-9]/g, "");
        return numericStr ? parseInt(numericStr, 10) : 0;
      }
    }

    // No package selected, do not add starting price or default package price
    return 0;
  };

  const formatTimeStr = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hr = parseInt(h);
    const suffix = hr >= 12 ? "PM" : "AM";
    const displayHr = hr % 12 || 12;
    return `${displayHr}:${m} ${suffix}`;
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
  const extraHoursPremium = Math.max(0, durationHours - 8) * 5000;
  const timeslotPremium = 0;

  let addonsCost = 
    getVendorCost("decorator") + 
    getVendorCost("dj") + 
    getVendorCost("videographer") +
    getVendorCost("photographer") +
    getVendorCost("cake") +
    getVendorCost("florist");

  const hallBase = basePrice + extraHoursPremium + timeslotPremium;
  const hallTax = 0; // Tax removed as requested
  const hallTotalWithTax = hallBase + hallTax;

  const grandTotal = hallBase + addonsCost;
  const taxes = 0; // Tax removed as requested
  const bookingTotal = grandTotal + taxes;
  const getVendorAdvanceInfo = (category: "decorator" | "dj" | "videographer" | "photographer" | "cake" | "florist") => {
    const cost = getVendorCost(category);
    if (cost === 0) return { advance: 0, percentage: 0 };
    const vendorId = vendors[category];
    if (!vendorId || vendorId === "none" || vendorId === "custom_preference") return { advance: 0, percentage: 0 };
    const v = globalVendors.find((v: Vendor) => v.id === vendorId || (v as any)._id === vendorId);
    if (!v) return { advance: 0, percentage: 0 };
    const percentage = v.advancePaymentPercentage || 0;
    return { advance: Math.round(cost * (percentage / 100)), percentage, cost };
  };

  const hallAdvance = Math.round(hallBase * 0.30);
  const decoratorAdv = getVendorAdvanceInfo("decorator");
  const djAdv = getVendorAdvanceInfo("dj");
  const videographerAdv = getVendorAdvanceInfo("videographer");
  const photographerAdv = getVendorAdvanceInfo("photographer");
  const cakeAdv = getVendorAdvanceInfo("cake");
  const floristAdv = getVendorAdvanceInfo("florist");

  const depositToday = hallAdvance + decoratorAdv.advance + djAdv.advance + videographerAdv.advance + photographerAdv.advance + cakeAdv.advance + floristAdv.advance;
  const balanceDue = bookingTotal - depositToday;

  const formatCurrency = (val: number) => "LKR " + val.toLocaleString();

  const handleFinalizeBooking = async (contactInfo: any) => {
    const matchedPkg = dbPackages.find((pkg) => pkg.id === selectedPackage || pkg._id === selectedPackage);
    const eventTypeName = matchedPkg
      ? matchedPkg.name
      : selectedPackage === "silver"
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
      nic: contactInfo.nic,
      billingAddress: contactInfo.billingAddress,
      billingCity: contactInfo.billingCity,
      billingPostalCode: contactInfo.billingPostalCode,
      billingCountry: contactInfo.billingCountry,
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
      totalCost: bookingTotal,
      vendors: {
        decorator: {
          vendorId: vendors.decorator !== "none" ? vendors.decorator : null,
          status: vendors.decorator !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.decoratorPackage !== "none" ? vendors.decoratorPackage : "",
          requestedDesignId: requestedDesigns.decorator || null,
          requirements: { specialRequests: decoratorRequirements }
        },
        dj: {
          vendorId: vendors.dj !== "none" ? vendors.dj : null,
          status: vendors.dj !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.djPackage !== "none" ? vendors.djPackage : "",
          requestedDesignId: requestedDesigns.dj || null,
          requirements: { specialRequests: djRequirements }
        },
        videographer: {
          vendorId: vendors.videographer !== "none" ? vendors.videographer : null,
          status: vendors.videographer !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.videographerPackage !== "none" ? vendors.videographerPackage : "",
          requestedDesignId: requestedDesigns.videographer || null,
          requirements: { specialRequests: videographerRequirements }
        },
        photographer: {
          vendorId: vendors.photographer && vendors.photographer !== "none" ? vendors.photographer : null,
          status: vendors.photographer && vendors.photographer !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.photographerPackage && vendors.photographerPackage !== "none" ? vendors.photographerPackage : "",
          requestedDesignId: requestedDesigns.photographer || null,
        },
        cake: {
          vendorId: vendors.cake && vendors.cake !== "none" ? vendors.cake : null,
          status: vendors.cake && vendors.cake !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.cakePackage && vendors.cakePackage !== "none" ? vendors.cakePackage : "",
          requestedDesignId: requestedDesigns.cake || null,
        },
        florist: {
          vendorId: vendors.florist && vendors.florist !== "none" ? vendors.florist : null,
          status: vendors.florist && vendors.florist !== "none" ? "Pending" : "NotRequired",
          packageName: vendors.floristPackage && vendors.floristPackage !== "none" ? vendors.floristPackage : "",
          requestedDesignId: requestedDesigns.florist || null,
        }
      },
    };

    try {
      const res = await customerBookingAPI.createBooking(bookingPayload);
      if (res.ok && res.data.success) {
        return res.data.data?._id || res.data.data?.id || true;
      } else {
        addToast({ message: res.data.message || "Failed to create booking", type: "error" });
        return false;
      }
    } catch (error: any) {
      console.error("EXACT ERROR FINDING - Booking Submission Failed:", error);
      console.error("Failed Payload Was:", JSON.stringify(bookingPayload, null, 2));
      alert(`An error occurred while creating booking: ${error?.message || "Unknown Error"}`);
      return false;
    }
  };

  const resetBookingForm = () => {
    sessionStorage.removeItem("bookingDraft");
    clearCart();
    setCurrentStep(1);
    setSelectedDate(0);
    setStartTime("18:00");
    setEndTime("23:00");
    setSelectedPackage("");
    setEventType("Wedding");
    setGuestCount(380);
    setLocalVendors({
      decorator: "none", decoratorPackage: "none",
      dj: "none", djPackage: "none",
      videographer: "none", videographerPackage: "none",
      photographer: "none", photographerPackage: "none",
      cake: "none", cakePackage: "none",
      florist: "none", floristPackage: "none",
    });
    setNotes("");
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
    addToast({ message: "Your 10-minute hold has expired. You can still continue your booking, but the date is no longer guaranteed and may be booked by someone else.", type: "error" });
    if (selectedDate) {
      const dateString = new Date(selectedDate).toISOString();
      try {
        await customerBookingAPI.releaseHold({ date: dateString });
      } catch (e) {}
    }
    // We no longer reset the date or send them back to Step 1
    // They can continue from where they stopped.
    setHoldExpiresAt(null);
    setTimeLeft(0);
  };

  const handleConfirmAndPay = async () => {
    if (!termsAccepted) {
      addToast({ message: "Please accept the terms and conditions.", type: "error" });
      return;
    }
    
    // Validate Contact & Billing Form
    setErrors({});
    let hasError = false;
    const newErrors: typeof errors = {};

    if (!firstName.trim()) { newErrors.firstName = "First name is required."; hasError = true; }
    if (!lastName.trim()) { newErrors.lastName = "Last name is required."; hasError = true; }
    const { validateEmail, validatePhone } = await import("@/lib/validation");
    if (!validateEmail(email)) { newErrors.email = "Please enter a valid email address."; hasError = true; }
    if (!validatePhone(phone)) { newErrors.phone = "Please enter a valid Sri Lankan phone number."; hasError = true; }
    if (!nic.trim() || !/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(nic)) { newErrors.nic = "Please enter a valid Sri Lankan NIC."; hasError = true; }
    if (!billingAddress.trim()) { newErrors.billingAddress = "Billing address is required."; hasError = true; }
    if (!billingCity.trim()) { newErrors.billingCity = "Billing city is required."; hasError = true; }
    if (!billingPostalCode.trim()) { newErrors.billingPostalCode = "Postal code is required."; hasError = true; }
    if (!billingCountry.trim()) { newErrors.billingCountry = "Country is required."; hasError = true; }

    if (hasError) {
      setErrors(newErrors);
      setCurrentStep(4);
      addToast({ message: "Please fill in all required customer details.", type: "error" });
      return;
    }

    // We removed the strict hold expiration check here.
    // If the hold expired, the backend will verify if the date is still available during checkout.

    setIsProcessing(true);
    const bookingResult = await handleFinalizeBooking({
      firstName,
      lastName,
      email,
      phone,
      alternativePhone,
      nic,
      billingAddress,
      billingCity,
      billingPostalCode,
      billingCountry,
      notes,
      paymentMethod,
    });
    
    if (typeof bookingResult === "string") {
      // Hand off entirely to PayHere's official Hosted Checkout Modal
      const { startPayHerePayment } = await import("@/utils/payhere");
      await startPayHerePayment({
        bookingId: bookingResult,
        paymentType: "deposit",
        onSuccess: () => {
          // Fetch the completed booking details to display on the success screen
          customerBookingAPI.getMyBookings().then(res => {
            if (res.ok && res.data?.data) {
              const matched = res.data.data.find((b: any) => (b._id || b.id) === bookingResult);
              if (matched) {
                setSuccessBookingRef(matched.bookingRef);
                setSuccessAdvancePaid(matched.depositAmount);
                const due = Math.max(0, matched.totalCost - matched.depositAmount - matched.balanceAmount - (matched.bookingCredit || 0));
                setSuccessRemainingBalance(due);
                setSuccessBookingId(matched._id || matched.id);
                setIsProcessing(false);
                resetBookingForm();
                triggerToast("30% Deposit Paid!", "Booking Confirmed. Waiting for manager approval.");
                return;
              }
            }
            // Fallback
            setSuccessBookingRef(`LG-${new Date().getFullYear()}-${bookingResult.slice(-4).toUpperCase()}`);
            setSuccessAdvancePaid(depositToday);
            setSuccessRemainingBalance(balanceDue);
            setSuccessBookingId(bookingResult);
            setIsProcessing(false);
            resetBookingForm();
            triggerToast("30% Deposit Paid!", "Booking Confirmed. Waiting for manager approval.");
          }).catch(() => {
            setSuccessBookingRef(`LG-${new Date().getFullYear()}-${bookingResult.slice(-4).toUpperCase()}`);
            setSuccessAdvancePaid(depositToday);
            setSuccessRemainingBalance(balanceDue);
            setSuccessBookingId(bookingResult);
            setIsProcessing(false);
            resetBookingForm();
            triggerToast("30% Deposit Paid!", "Booking Confirmed. Waiting for manager approval.");
          });
        },
        onDismiss: () => {
          setIsProcessing(false);
          if (bookingResult) {
            setPaymentPendingNotice({ bookingId: bookingResult });
          }
        },
        onError: () => {
          setIsProcessing(false);
          if (bookingResult) {
            setPaymentPendingNotice({ bookingId: bookingResult });
            addToast({ message: "Payment failed. Booking submitted but deposit is pending.", type: "error" });
          }
        }
      });
    } else if (bookingResult) {
      setIsProcessing(false);
      resetBookingForm();
      setShowSuccessModal(true);
      addToast({ message: "Booking Submitted! Please pay the deposit offline within 48 hours.", type: "success" });
    } else {
      setIsProcessing(false);
    }
  };

  const TOTAL_STEPS = 5;

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
      if (isSelectedDateUnavailable()) {
        addToast({ message: "This date is currently unavailable. Please choose another date.", type: "error" });
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
          addToast({ message: data.message || "This date is currently held by another user. Please choose another date.", type: "error" });
          return;
        }
      } catch (e) {
        addToast({ message: "Failed to secure temporary hold. Please try again.", type: "error" });
        return;
      }
    }

    if (currentStep === 2 && !selectedPackage) {
      addToast({ message: "Please select a venue package before proceeding to the next step.", type: "error" });
      return;
    }

    if (currentStep === 3) {
      if (vendors.videographer && vendors.videographer !== "none" && (!vendors.videographerPackage || vendors.videographerPackage === "none")) {
        addToast({ message: "Please select a package for the Videographer before proceeding.", type: "error" });
        return;
      }
      if (vendors.dj && vendors.dj !== "none" && (!vendors.djPackage || vendors.djPackage === "none")) {
        addToast({ message: "Please select a package for the DJ before proceeding.", type: "error" });
        return;
      }
    }

    if (currentStep === 4) {
      // Validate Contact & Billing Form
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
      if (!nic.trim() || !/^([0-9]{9}[vVxX]|[0-9]{12})$/.test(nic)) {
        newErrors.nic = "Please enter a valid Sri Lankan NIC.";
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
      if (!billingCountry.trim()) {
        newErrors.billingCountry = "Country is required.";
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
      setCurrentStep(step);
    }
  };

  const handleBack = async () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleDownloadReceipt = () => {
    const receiptWindow = window.open("", "_blank");
    if (receiptWindow) {
      receiptWindow.document.write(`
        <html>
          <head>
            <title>EASCCA Conference Centre - Receipt</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; color: #1a1512; line-height: 1.6; max-width: 800px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; color: #805d3a; margin: 0; }
              .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
              .details-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              .details-table th, .details-table td { border-bottom: 1px solid #e8dfc9; padding: 12px; text-align: left; }
              .details-table th { background: #faf6ee; color: #805d3a; font-size: 12px; text-transform: uppercase; }
              .total-box { background: #faf6ee; border: 1px solid #c9a84c; padding: 20px; margin-top: 20px; text-align: right; }
              .status-badge { display: inline-block; padding: 4px 12px; background: #d1fae5; color: #065f46; font-size: 12px; font-weight: bold; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">EASCCA CONFERENCE CENTRE</div>
              <p style="margin: 5px 0 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #805d3a;">Official Advance Payment Receipt</p>
            </div>
            <div class="meta">
              <div>
                <strong>Booking Reference:</strong> ${successBookingRef}<br/>
                <strong>Date:</strong> ${new Date().toLocaleDateString()}<br/>
                <strong>Client Name:</strong> ${firstName} ${lastName}
              </div>
              <div style="text-align: right;">
                <strong>Event Date:</strong> ${selectedDate ? new Date(selectedDate).toLocaleDateString() : ""}<br/>
                <strong>Payment Gateway:</strong> PayHere 🇱🇰<br/>
                <span class="status-badge">PAID</span>
              </div>
            </div>
            <table class="details-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${eventType} Hall Rental (${selectedPackage.toUpperCase()} Package)</td>
                  <td style="text-align:right;">${formatCurrency(basePrice)}</td>
                </tr>
                ${addonsCost > 0 ? `
                <tr>
                  <td>Selected Artisans & Add-ons</td>
                  <td style="text-align:right;">${formatCurrency(addonsCost)}</td>
                </tr>
                ` : ""}
                ${extraHoursPremium > 0 ? `
                <tr>
                  <td>Extra Hours Premium (${durationHours - 8} hrs)</td>
                  <td style="text-align:right;">${formatCurrency(extraHoursPremium)}</td>
                </tr>
                ` : ""}

                <tr style="font-weight:bold;">
                  <td>Total Estimated Cost</td>
                  <td style="text-align:right;">${formatCurrency(bookingTotal)}</td>
                </tr>
              </tbody>
            </table>
            <div class="total-box">
              <p style="margin:0 0 5px 0; font-size:12px; color:gray; text-transform:uppercase;">Advance Deposit Paid</p>
              <h3 style="margin:0 0 10px 0; color:#805d3a; font-size:24px;">${formatCurrency(successAdvancePaid)}</h3>
              <div style="font-size:10px; color:#555; text-align:right; margin-bottom:10px;">
                <p style="margin:2px 0;">Hall Advance (30%): ${formatCurrency(hallAdvance)}</p>
                ${decoratorAdv.advance > 0 ? `<p style="margin:2px 0;">Decorator Advance (${decoratorAdv.percentage}%): ${formatCurrency(decoratorAdv.advance)}</p>` : ""}
                ${djAdv.advance > 0 ? `<p style="margin:2px 0;">DJ Advance (${djAdv.percentage}%): ${formatCurrency(djAdv.advance)}</p>` : ""}
                ${videographerAdv.advance > 0 ? `<p style="margin:2px 0;">Videographer Advance (${videographerAdv.percentage}%): ${formatCurrency(videographerAdv.advance)}</p>` : ""}
                ${photographerAdv.advance > 0 ? `<p style="margin:2px 0;">Photographer Advance (${photographerAdv.percentage}%): ${formatCurrency(photographerAdv.advance)}</p>` : ""}
                ${cakeAdv.advance > 0 ? `<p style="margin:2px 0;">Cake Advance (${cakeAdv.percentage}%): ${formatCurrency(cakeAdv.advance)}</p>` : ""}
                ${floristAdv.advance > 0 ? `<p style="margin:2px 0;">Florist Advance (${floristAdv.percentage}%): ${formatCurrency(floristAdv.advance)}</p>` : ""}
              </div>
              <p style="margin:0; font-size:12px;">Remaining Balance: <strong>${formatCurrency(successRemainingBalance)}</strong></p>
            </div>
            <p style="text-align:center; font-size:10px; color:gray; margin-top:50px;">Thank you for reserving with EASCCA. This is a computer-generated official receipt.</p>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    }
  };

  const STEP_LABELS: Record<number, string> = {
    1: "Date & Guests",
    2: "Venue Package",
    3: "Select Artisans",
    4: "Billing Details",
    5: "Review & Policies",
  };

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white transition-colors duration-300">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes goldGlow {
          0% { box-shadow: 0 0 0 0 rgba(198, 156, 109, 0.4); border-color: #c69c6d; }
          50% { box-shadow: 0 0 15px 5px rgba(198, 156, 109, 0.6); border-color: #c69c6d; transform: scale(1.02); }
          100% { box-shadow: 0 0 0 0 rgba(198, 156, 109, 0); border-color: #e8dfc9; }
        }
        .animate-gold-glow {
          animation: goldGlow 1.2s ease-out;
        }
      `}} />
      <MainNavbar />

      <main className="flex-grow relative pt-28 md:pt-32">
        
        {/* Toast Notification */}
        {toast.show && (
          <div 
            className={`fixed left-1/2 -translate-x-1/2 z-[40] transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isToastVisible 
                ? 'top-[110px] opacity-100 scale-100' 
                : '-top-[100px] opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="bg-white rounded-r-2xl rounded-l-md border-l-[6px] border-[#C9A84C] shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-xl w-[90vw] md:w-[600px] flex items-center p-3 md:p-5 relative overflow-hidden text-left">
              
              {/* Faint leaf background graphics */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 opacity-[0.07] pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#C9A84C] fill-current">
                  <path d="M30 50 Q50 20 70 50 Q50 80 30 50 Z" />
                  <path d="M40 30 Q60 10 80 30 Q60 50 40 30 Z" />
                  <path d="M40 70 Q60 90 80 70 Q60 50 40 70 Z" />
                </svg>
              </div>
              
              {/* Faint stars corners */}
              <div className="absolute right-4 top-3 text-[#C9A84C] opacity-30 text-xl">✦</div>
              <div className="absolute right-8 bottom-2 text-[#C9A84C] opacity-30 text-lg">✧</div>

              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-[1.5px] border-[#C9A84C] flex items-center justify-center relative z-10 shrink-0 bg-white shadow-[0_0_20px_rgba(201,168,76,0.15)]">
                <Check className="text-[#C9A84C] w-5 h-5 md:w-7 md:h-7" strokeWidth={3} />
              </div>

              <div className="flex-1 ml-3 md:ml-5 relative z-10">
                <h4 className="text-[#5C4520] font-serif font-bold text-[15px] md:text-[19px] mb-1">{toast.title}</h4>
                <p className="text-gray-600 text-[11px] md:text-[14px] leading-snug">{toast.subtitle}</p>
              </div>

              <div className="border-l border-gray-200 h-8 md:h-10 mx-2 md:mx-5 relative z-10"></div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setIsToastVisible(false); }}
                className="text-gray-400 hover:text-[#5C4520] transition-colors relative z-10 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Top Stepper Banner removed as per user request */}

        <div className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start mb-24">

          {/* Left Column: Booking Form Steps */}
          <div className={`${activeTab === "history" || successBookingRef ? "lg:col-span-12" : "lg:col-span-8"} space-y-10 transition-all duration-500`}>

            {/* Tab Switcher */}
            {!isGuest && !successBookingRef && (
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

            {successBookingRef ? (
              <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-8 rounded-sm text-center shadow-[0_0_30px_rgba(128,93,58,0.05)] space-y-6 max-w-xl mx-auto my-8">
                <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <span className="text-3xl text-emerald-600 dark:text-emerald-500">✓</span>
                </div>
                
                <h2 className="text-2xl font-serif font-bold text-[#805D3A] dark:text-[#C9A84C] tracking-wide">
                  Advance Payment Successful
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your 30% advance deposit payment has been received and verified. Your event date is officially secured.
                </p>

                <div className="bg-[#FAF6EE] dark:bg-zinc-900/60 border border-[#E8DFC9] dark:border-zinc-800/80 p-5 rounded-md space-y-3.5 text-sm text-left max-w-sm mx-auto font-mono">
                  <div className="flex justify-between border-b border-[#E8DFC9]/50 dark:border-zinc-800/50 pb-2">
                    <span className="text-gray-500">Booking Reference</span>
                    <span className="font-bold text-gray-850 dark:text-white">{successBookingRef}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8DFC9]/50 dark:border-zinc-800/50 pb-2">
                    <span className="text-gray-500">Advance Paid</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(successAdvancePaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Remaining Balance</span>
                    <span className="font-bold text-gray-850 dark:text-white">{formatCurrency(successRemainingBalance)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                  <button 
                    onClick={() => router.push("/customer/myaccount?tab=bookings")}
                    className="px-6 py-3 bg-[#C9A84C] hover:bg-[#B58B5C] text-[#2C1E14] text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm shadow-sm"
                  >
                    View Booking
                  </button>
                  <button 
                    onClick={handleDownloadReceipt}
                    className="px-6 py-3 border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#2C1E14] text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm"
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            ) : activeTab === "history" ? (
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

                {/* Step 1: Event Details */}
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fadeIn">
                    
                    {/* Step 1 Header */}
                    <div className="bg-[#FAF9F6] border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-10 relative overflow-hidden shadow-sm flex flex-col justify-center items-center text-center">
                      <div className="absolute right-0 top-0 h-full w-1/3 opacity-80 pointer-events-none" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'multiply' }}></div>
                      <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent pointer-events-none"></div>
                      <h2 className="text-[32px] font-serif text-[#1A1512] dark:text-white relative z-10 mb-4 tracking-tight">Let's start with your event details</h2>
                      <div className="flex items-center justify-center gap-2 mb-4 relative z-10">
                        <div className="w-8 h-px bg-[#C9A84C]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#C9A84C]"></div>
                        <div className="w-8 h-px bg-[#C9A84C]"></div>
                      </div>
                      <p className="text-[15px] text-gray-500 max-w-md relative z-10 font-medium">Provide basic information about your event so we can help you find the best options.</p>
                    </div>

                    {/* Event Type Grid */}
                    <div className="bg-white dark:bg-[#111111] border-b border-gray-100 pb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-full bg-[#C9A84C] text-white flex items-center justify-center font-bold text-xs shadow-md">1</div>
                        <h3 className="text-xl font-bold text-[#1A1512] dark:text-white">Event Type</h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { id: 'Wedding', icon: '💍' },
                          { id: 'Engagement', icon: '💎' },
                          { id: 'Birthday', icon: '🎂' },
                          { id: 'Anniversary', icon: '❤️' },
                          { id: 'Corporate', icon: '💼' },
                          { id: 'Conference', icon: '👥' },
                          { id: 'Graduation', icon: '🎓' },
                          { id: 'Other', icon: '💬' },
                        ].map((type) => (
                          <div 
                            key={type.id}
                            onClick={() => setEventType(type.id)}
                            className={`cursor-pointer rounded-lg p-5 flex flex-col items-center justify-center gap-3 transition-all ${eventType === type.id ? 'border-2 border-[#C9A84C] bg-[#FDFBF7] shadow-[0_4px_15px_rgba(201,168,76,0.15)] scale-[1.02]' : 'border border-gray-200 hover:border-[#C9A84C] hover:bg-gray-50'}`}
                          >
                            <span className="text-2xl">{type.icon}</span>
                            <span className={`text-[13px] font-bold ${eventType === type.id ? 'text-[#C9A84C]' : 'text-gray-600'}`}>{type.id}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="bg-white dark:bg-[#111111] border-b border-gray-100 pb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-full bg-[#C9A84C] text-white flex items-center justify-center font-bold text-xs shadow-md">2</div>
                        <h3 className="text-xl font-bold text-[#1A1512] dark:text-white">Event Date & Time</h3>
                      </div>
                      
                      <div className="mb-6">
                        <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2">Event Start Time</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input 
                              type="time" 
                              className="w-full border border-gray-200 rounded-lg py-3.5 pl-11 pr-4 text-sm font-medium text-gray-700 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-shadow"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2">Event End Time</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input 
                              type="time" 
                              className="w-full border border-gray-200 rounded-lg py-3.5 pl-11 pr-4 text-sm font-medium text-gray-700 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] focus:outline-none transition-shadow"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {durationHours > 8 ? (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg py-3 px-4 mb-6 flex items-start gap-3 text-sm text-amber-700 dark:text-amber-500 font-medium shadow-sm">
                          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div>
                            Your event duration is {durationHours} hours. Base packages include up to 8 hours. 
                            An extra premium of <span className="font-bold">LKR {(durationHours - 8) * 5000}</span> will be applied for the additional {durationHours - 8} hour(s).
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2 px-1">
                          <Clock className="w-3.5 h-3.5" />
                          Base packages include up to 8 hours of hall access.
                        </div>
                      )}

                      {selectedDate !== 0 && (
                        <div className="bg-[#FDFBF7] border border-[#F2E5C5] rounded-lg py-3.5 px-5 flex items-center gap-3 text-sm text-[#805D3A] font-medium shadow-sm">
                          <Calendar className="w-4 h-4 text-[#C9A84C]" />
                          Selected date: {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      )}
                      {isSelectedDateUnavailable() && (
                        <div className="text-red-500 text-xs font-medium mt-3">
                          This date is currently unavailable. Please select another beautiful day for your event.
                        </div>
                      )}
                    </div>

                    {/* Guest Count */}
                    <div className="bg-white dark:bg-[#111111] border-b border-gray-100 pb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-full bg-[#C9A84C] text-white flex items-center justify-center font-bold text-xs shadow-md">3</div>
                        <h3 className="text-xl font-bold text-[#1A1512] dark:text-white">Guest Count</h3>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-8">
                        <div className="flex-1 w-full">
                          <label className="block text-[13px] font-bold text-gray-700 mb-3">Expected Number of Guests</label>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[#FAF9F6]">
                            <button onClick={() => setGuestCount(Math.max(50, guestCount - 10))} className="px-6 py-3.5 text-[#C9A84C] hover:bg-white hover:text-[#805D3A] font-bold text-xl transition-colors border-r border-gray-200">-</button>
                            <input 
                              type="number" 
                              value={guestCount}
                              onChange={(e) => {
                                let val = Number(e.target.value);
                                if (val > 1000) val = 1000;
                                setGuestCount(val);
                              }}
                              onBlur={() => {
                                if (guestCount < 50) setGuestCount(50);
                              }}
                              className="flex-1 text-center font-bold text-xl py-3.5 bg-transparent focus:outline-none text-[#1A1512]"
                            />
                            <button onClick={() => setGuestCount(Math.min(1000, guestCount + 10))} className="px-6 py-3.5 text-[#C9A84C] hover:bg-white hover:text-[#805D3A] font-bold text-xl transition-colors border-l border-gray-200">+</button>
                          </div>
                        </div>
                        
                        <div className="flex-1 w-full bg-[#FDFBF7] border border-[#E8DFC9] rounded-xl p-6 flex items-start gap-4 shadow-sm">
                          <div className="text-[#C9A84C] bg-white p-3 rounded-full shadow-[0_2px_10px_rgba(201,168,76,0.15)]"><Users className="w-6 h-6" /></div>
                          <div>
                            <h4 className="text-[13px] font-bold text-[#805D3A] mb-1">Recommended Capacity</h4>
                            <p className="text-[15px] font-bold text-[#1A1512] mb-1">50 - 1000 Guests</p>
                            <p className="text-[11px] text-gray-500 font-medium">(Comfortable seating)</p>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                )}

                {/* Step 2: Venue Package Selection */}
                {currentStep === 2 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-4">
                      <h3 className="text-sm font-bold tracking-widest text-[#805D3A] dark:text-[#C9A84C] uppercase">
                        Venue Package Selection
                      </h3>
                      <p className="text-xs text-gray-500">
                        Based on your guest count of <strong>{guestCount}</strong>, we recommend the <strong>{guestCount <= 250 ? "Silver" : guestCount <= 450 ? "Gold" : "Diamond"}</strong> package.
                      </p>
                      <PackageCards 
                        activePackage={selectedPackage} 
                        setActivePackage={setSelectedPackage} 
                        packages={dbPackages && dbPackages.length > 0 ? dbPackages.map((pkg) => {
                          const nameLower = pkg.name.toLowerCase();
                          let slug = "gold";
                          if (nameLower.includes("silver")) slug = "silver";
                          else if (nameLower.includes("diamond")) slug = "diamond";

                          return {
                            id: pkg._id || pkg.id || slug,
                            name: pkg.name,
                            price: typeof pkg.price === 'number' ? `LKR ${pkg.price.toLocaleString()}` : pkg.price,
                            guests: pkg.maxGuests ? `Up to ${pkg.maxGuests} guests` : "Guests",
                            description: pkg.description || "",
                            features: pkg.features || []
                          };
                        }).sort((a, b) => {
                          const order = { "silver": 1, "gold": 2, "diamond": 3 };
                          return (order[a.id as keyof typeof order] || 4) - (order[b.id as keyof typeof order] || 4);
                        }) : undefined}
                        onSelect={(id) => {
                          setSelectedPackage(id);
                          setCurrentStep(3);
                        }}
                        isCompact={true}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Select Artisans */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-4">
                      <h3 className="text-sm font-bold tracking-widest text-[#805D3A] dark:text-[#C9A84C] uppercase">
                        Select Artisans & Vendors
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        Add curated third-party vendor services to complete your event. You can also proceed without selecting them if you have alternative arrangements.
                      </p>
                      <BookingVendorSelector 
                        vendors={vendors} 
                        onChange={setVendors} 
                        decoratorRequirements={decoratorRequirements}
                        setDecoratorRequirements={setDecoratorRequirements}
                        videographerRequirements={videographerRequirements}
                        setVideographerRequirements={setVideographerRequirements}
                        djRequirements={djRequirements}
                        setDjRequirements={setDjRequirements}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Billing Details */}
                {currentStep === 4 && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Customer Information */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-6">
                      <h3 className="text-lg font-serif font-semibold text-[#2C1E14] dark:text-white">
                        Customer Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">First name<span className="text-red-500 ml-1">*</span></label>
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
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Last name<span className="text-red-500 ml-1">*</span></label>
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
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Email<span className="text-red-500 ml-1">*</span></label>
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
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Phone<span className="text-red-500 ml-1">*</span></label>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Alternative Phone (Optional)</label>
                          <input
                            type="tel"
                            placeholder="0779876543"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={alternativePhone}
                            onChange={(e) => setAlternativePhone(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">NIC Number<span className="text-red-500 ml-1">*</span></label>
                          <input
                            type="text"
                            placeholder="e.g. 199912345678 or 991234567V"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={nic}
                            onChange={(e) => {
                              setNic(e.target.value.toUpperCase());
                              if (errors.nic) setErrors({ ...errors, nic: undefined });
                            }}
                          />
                          {errors.nic && <p className="text-red-500 text-[10px] mt-1">{errors.nic}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Billing Details */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-6">
                      <h3 className="text-lg font-serif font-semibold text-[#2C1E14] dark:text-white">
                        Billing Details
                      </h3>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Address<span className="text-red-500 ml-1">*</span></label>
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
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">City<span className="text-red-500 ml-1">*</span></label>
                          <input
                            type="text"
                            placeholder="Colombo"
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
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Postal code<span className="text-red-500 ml-1">*</span></label>
                          <input
                            type="text"
                            placeholder="00100"
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
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Country<span className="text-red-500 ml-1">*</span></label>
                        <input
                          type="text"
                          placeholder="Sri Lanka"
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
                  </div>
                )}

                {/* Step 5: Review & Final Confirmation */}
                {currentStep === 5 && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Main Dashboard Review Card */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-[#FAFBF7] dark:bg-[#1A1A1A] px-6 py-4 border-b border-[#E8DFC9] dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">
                          Final Review Dashboard
                        </h3>
                        <div className="text-left md:text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Booking Total</p>
                          <p className="text-2xl font-bold text-[#805D3A] dark:text-[#C9A84C]">{formatCurrency(bookingTotal)}</p>
                        </div>
                      </div>

                      <div className="p-6 space-y-8">
                        
                        {/* Event & Venue Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h4 className="font-bold text-[#A6955C] uppercase tracking-widest text-[10px] pb-2 border-b border-gray-100 dark:border-gray-800">Event Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 text-xs">Event</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-200 capitalize">{eventType}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Date</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-200">{selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Guests</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-200">{guestCount} Guests</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Timeslot</p>
                                <p className="font-semibold text-gray-900 dark:text-gray-200">{startTime} - {endTime}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-bold text-[#A6955C] uppercase tracking-widest text-[10px] pb-2 border-b border-gray-100 dark:border-gray-800">Hall</h4>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-200 capitalize text-base">{getPackageName(selectedPackage)} Package</p>
                                <p className="text-gray-500 text-sm capitalize">Hall Booking</p>
                              </div>
                              <p className="font-bold text-gray-900 dark:text-gray-200">{formatCurrency(grandTotal - getVendorCost("decorator") - getVendorCost("videographer") - getVendorCost("dj") - getVendorCost("photographer") - getVendorCost("cake") - getVendorCost("florist"))}</p>
                            </div>
                          </div>
                        </div>

                        {/* Vendors List */}
                        {(vendors.decorator !== "none" || vendors.videographer !== "none" || vendors.dj !== "none" || vendors.photographer !== "none" || vendors.cake !== "none" || vendors.florist !== "none") && (
                          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                             <h4 className="font-bold text-[#A6955C] uppercase tracking-widest text-[10px] pb-2 border-b border-gray-100 dark:border-gray-800">Selected Artisans</h4>
                             
                             {([
                               { key: "decorator", label: "Decorator", req: decoratorRequirements },
                               { key: "videographer", label: "Videographer", req: videographerRequirements },
                               { key: "dj", label: "DJ Artist", req: djRequirements },
                               { key: "photographer", label: "Photographer", req: "" },
                               { key: "cake", label: "Cake", req: "" },
                               { key: "florist", label: "Florist", req: "" }
                             ] as const).map((cat) => {
                               const id = vendors[cat.key as keyof typeof vendors];
                               if (!id || id === "none") return null;
                               
                               const v = globalVendors.find((vendor: Vendor) => vendor.id === id || (vendor as any)._id === id);
                               const pkgName = vendors[`${cat.key}Package` as keyof typeof vendors];
                               const cost = getVendorCost(cat.key);
                               const designId = requestedDesigns[cat.key as keyof typeof requestedDesigns];

                               return (
                                 <div key={cat.key} className="bg-[#FAFBF7] dark:bg-white/5 border border-gray-100 dark:border-gray-800 p-4 rounded-md">
                                   <div className="flex justify-between items-start">
                                      <div>
                                        <p className="text-xs font-bold text-[#A6955C] uppercase tracking-widest mb-1">{cat.label}</p>
                                        <p className="text-base font-semibold text-gray-900 dark:text-gray-200">{v ? v.name : "Custom Selected"}</p>
                                        <p className="text-sm text-gray-500 capitalize">{pkgName || "Default Package"}</p>
                                        {designId && <p className="text-[10px] uppercase tracking-widest text-emerald-600 mt-1 font-bold">✓ Specific Design Requested</p>}
                                      </div>
                                      <p className="font-bold text-gray-900 dark:text-gray-200">{formatCurrency(cost)}</p>
                                   </div>
                                   
                                   {cat.req && cat.req.trim() !== "" && (
                                     <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Special request:</p>
                                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">"{cat.req}"</p>
                                     </div>
                                   )}
                                 </div>
                               );
                             })}
                          </div>
                        )}

                        {/* Additional Notes for Manager */}
                        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <label className="block text-[10px] uppercase tracking-widest text-[#A6955C] font-bold mb-2">Additional Notes for Manager</label>
                          <textarea
                            rows={3}
                            placeholder="Any other overall requirements for your event..."
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-3 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors resize-none"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>

                      </div>
                    </div>

                    {/* Vendor Policy Warning */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-md">
                      <div className="flex gap-3">
                        <div className="text-amber-500 mt-0.5 font-bold">⚠️</div>
                        <div>
                          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">Important</h4>
                          <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed font-medium">
                            Your vendor selections are requests only. Vendors will be notified after the hall booking is approved by the manager. If a vendor declines, you will be able to choose a replacement vendor or request a refund/credit according to the applicable policy.
                            {" "}
                            <button 
                              onClick={() => setPolicyModalType("vendor")}
                              className="text-amber-800 dark:text-amber-400 font-bold underline hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
                            >
                              Read full policy
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-[#FAFBF7] dark:bg-[#1A1A1A] px-6 py-4 border-b border-[#E8DFC9] dark:border-gray-800 flex justify-between items-center">
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#A6955C]">
                          Hall Cancellation &amp; Refund Policy
                        </h4>
                        <button
                          onClick={() => setPolicyModalType("cancellation")}
                          className="text-[10px] uppercase tracking-widest font-bold text-[#805D3A] dark:text-[#C9A84C] hover:text-[#A6955C] underline transition-colors"
                        >
                          Read full policy
                        </button>
                      </div>
                      <div className="p-6 space-y-4">
                        {(() => {
                          const tier = venueSettings?.cancellationTiers || "tiered";
                          if (tier === "strict") {
                            return (
                              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Before confirmation:</p>
                                  <p className="text-gray-600">100% refund</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">After confirmation:</p>
                                  <p className="text-gray-600">According to hall cancellation policy (Strictly non-refundable)</p>
                                </div>
                              </div>
                            );
                          }
                          if (tier === "flexible") {
                            return (
                              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Before confirmation:</p>
                                  <p className="text-gray-600">100% refund</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">After confirmation (more than 14 days before):</p>
                                  <p className="text-gray-600">Full refund</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Within 14 days of event:</p>
                                  <p className="text-gray-600">Refund conditions apply (50% partial refund)</p>
                                </div>
                              </div>
                            );
                          }
                          // Default tiered
                          return (
                            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Before confirmation:</p>
                                  <p className="text-gray-600">100% refund</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">After confirmation:</p>
                                  <p className="text-gray-600">According to hall cancellation policy</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">Within 30 days:</p>
                                  <p className="text-gray-600">Refund conditions apply</p>
                                </div>
                            </div>
                          );
                        })()}

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="termsAgree"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="accent-[#C69C6D] h-5 w-5 mt-0.5 cursor-pointer rounded"
                          />
                          <label htmlFor="termsAgree" className="text-sm font-medium text-gray-800 dark:text-gray-200 select-none cursor-pointer">
                            I have read and agree to the cancellation and refund policy.
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary Box */}
                    <div className="bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-2 w-full md:w-auto">
                          <div className="flex justify-between md:justify-start gap-8 items-end">
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Payable Now (Advance)</p>
                              <p className="text-3xl font-serif text-[#1A1512] dark:text-white">{formatCurrency(depositToday)}</p>
                              <div className="mt-2 text-xs text-gray-500 space-y-1">
                                <p className="flex justify-between w-48"><span className="text-gray-400">Hall (30%)</span> <span>{formatCurrency(hallAdvance)}</span></p>
                                {decoratorAdv.advance > 0 && <p className="flex justify-between w-48"><span className="text-gray-400">Decorator ({decoratorAdv.percentage}%)</span> <span>{formatCurrency(decoratorAdv.advance)}</span></p>}
                                {djAdv.advance > 0 && <p className="flex justify-between w-48"><span className="text-gray-400">DJ ({djAdv.percentage}%)</span> <span>{formatCurrency(djAdv.advance)}</span></p>}
                                {videographerAdv.advance > 0 && <p className="flex justify-between w-48"><span className="text-gray-400">Videographer ({videographerAdv.percentage}%)</span> <span>{formatCurrency(videographerAdv.advance)}</span></p>}
                                {photographerAdv.advance > 0 && <p className="flex justify-between w-48"><span className="text-gray-400">Photographer ({photographerAdv.percentage}%)</span> <span>{formatCurrency(photographerAdv.advance)}</span></p>}
                                {cakeAdv.advance > 0 && <p className="flex justify-between w-48"><span className="text-gray-400">Cake ({cakeAdv.percentage}%)</span> <span>{formatCurrency(cakeAdv.advance)}</span></p>}
                                {floristAdv.advance > 0 && <p className="flex justify-between w-48"><span className="text-gray-400">Florist ({floristAdv.percentage}%)</span> <span>{formatCurrency(floristAdv.advance)}</span></p>}
                              </div>
                            </div>
                            <div className="text-right md:text-left self-start">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Remaining Balance</p>
                              <p className="text-lg text-gray-700 dark:text-gray-300">{formatCurrency(balanceDue)}</p>
                              <p className="text-[10px] text-gray-500 mt-1 font-medium">Due 7 days before the event</p>
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-auto">
                          {/* Navigation Buttons inline for final step */}
                          <div className="flex flex-col-reverse md:flex-row items-center gap-4">
                            <button
                              onClick={handleBack}
                              className="w-full md:w-auto px-6 py-4 text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm uppercase font-bold tracking-widest transition-colors"
                            >
                              &larr; Back
                            </button>
                            <button
                              onClick={handleConfirmAndPay}
                              disabled={!termsAccepted || isProcessing}
                              className="w-full md:w-auto px-8 py-4 bg-[#1A1512] hover:bg-[#2C241E] dark:bg-white dark:hover:bg-gray-200 dark:text-[#1A1512] text-white font-bold uppercase tracking-widest text-[11px] rounded-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {isProcessing ? "Processing..." : "SUBMIT BOOKING REQUEST"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 5 && (
                  <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800 mt-8">
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

                    <button
                      onClick={handleNext}
                      className="px-8 py-3 text-white text-sm uppercase font-bold tracking-[0.2em] bg-[#C69C6D] hover:bg-[#B58B5C] transition-colors rounded-sm shadow-md"
                    >
                      Next Step &rarr;
                    </button>
                  </div>
                )}

              </>
            )}

          </div>

          {/* Right Column: Sticky Cost Breakdown / Booking Summary */}
          {/* Right Column: Sidebar */}
          {!activeTab.includes("history") && !successBookingRef && (
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32 hidden lg:block">
              {/* LIVE BOOKING SUMMARY */}
              <div className="bg-white border border-[#E8DFC9] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Booking Summary</h3>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> All changes saved</span>
                </div>
                
                <h4 className="text-xs font-bold text-[#1A1512] mb-4 uppercase tracking-widest">Event Overview</h4>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><div className="w-4 h-4 bg-gray-100 rounded-sm" /> Event Type</span>
                    <span className="font-bold text-[#1A1512]">{eventType || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Event Date</span>
                    <span className="font-bold text-[#1A1512]">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> Event Time</span>
                    <span className="font-bold text-[#1A1512]">{formatTimeStr(startTime)} – {formatTimeStr(endTime)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Guest Count</span>
                    <span className="font-bold text-[#1A1512]">{guestCount} Guests</span>
                  </div>
                </div>

                {selectedPackage && (
                  <>
                    <div className="h-px bg-gray-100 w-full mb-5" />
                    <h4 className="text-xs font-bold text-[#1A1512] mb-3 uppercase tracking-widest">Selected Package</h4>
                    <div className="flex items-center justify-between text-sm bg-[#FAFBF7] p-3 rounded-md border border-[#F2E5C5] mb-6">
                      <span className="font-bold text-[#1A1512] capitalize flex items-center gap-2"><Gift className="w-3.5 h-3.5 text-[#C9A84C]" /> {getPackageName(selectedPackage)} Package</span>
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-wider">Added</span>
                    </div>
                  </>
                )}

                {(vendors.decorator !== 'none' || vendors.dj !== 'none' || vendors.videographer !== 'none' || vendors.photographer !== 'none' || vendors.cake !== 'none' || vendors.florist !== 'none') && (
                  <>
                    <div className="h-px bg-gray-100 w-full mb-5" />
                    <h4 className="text-xs font-bold text-[#1A1512] mb-3 uppercase tracking-widest">Selected Vendors</h4>
                    <div className="space-y-2 mb-6">
                      {['decorator', 'dj', 'videographer', 'photographer', 'cake', 'florist'].map(cat => {
                        const vId = vendors[cat as keyof typeof vendors];
                        if (vId && vId !== 'none') {
                          return (
                            <div key={cat} className="flex flex-col bg-[#FDFBF7] p-3 rounded-md border border-[#E8DFC9]">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{cat}</span>
                                <span className="text-[9px] text-[#C9A84C] font-bold bg-[#FAF9F6] px-2 py-0.5 rounded-sm uppercase tracking-wider">Added</span>
                              </div>
                              <span className="font-bold text-[#1A1512] text-sm">{getVendorName(vId) || vId}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </>
                )}

                {currentStep > 1 && (
                  <>
                    <div className="h-px bg-gray-100 w-full mb-6" />
                    <h4 className="text-xs font-bold text-[#1A1512] mb-4 uppercase tracking-widest">Cost Breakdown</h4>
                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Hall Estimate</span>
                        <span className="font-bold text-[#1A1512]">{formatCurrency(hallBase)}</span>
                      </div>
                      {addonsCost > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Vendor Estimate</span>
                          <span className="font-bold text-[#1A1512]">{formatCurrency(addonsCost)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="text-[#C9A84C] font-bold">Total Estimate</span>
                        <span className="font-bold text-[#C9A84C] text-lg">{formatCurrency(bookingTotal)}</span>
                      </div>
                    </div>
                  </>
                )}
                
                <button 
                  onClick={() => handleStepClick(1)}
                  className="w-full bg-[#FDFBF7] hover:bg-[#F2E5C5] border border-[#E8DFC9] text-[#805D3A] py-3 rounded-md text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-3 h-3" /> Edit Event Details
                </button>
              </div>

              {/* BOOKING JOURNEY */}
              <div className="bg-white border border-[#E8DFC9] rounded-lg p-6 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Booking Journey</h3>
                <div className="space-y-6 relative">
                  <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100 z-0"></div>
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div key={`journey-${step}`} className="flex items-start gap-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${currentStep === step ? 'bg-[#FDFBF7] border-2 border-[#C9A84C] text-[#C9A84C] shadow-sm' : currentStep > step ? 'bg-[#C9A84C] border-2 border-[#C9A84C] text-white' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                        {currentStep > step ? <Check className="w-4 h-4" /> : step}
                      </div>
                      <div className="pt-1">
                        <h4 className={`text-sm font-bold ${currentStep === step ? 'text-[#C9A84C]' : currentStep > step ? 'text-[#1A1512]' : 'text-gray-400'}`}>{STEP_LABELS[step]}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {step === 1 && "Tell us about your event"}
                          {step === 2 && "Choose your package"}
                          {step === 3 && "Select your vendors"}
                          {step === 4 && "Review & confirm"}
                          {step === 5 && "Secure your booking"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEED HELP? */}
              <div className="bg-white border border-[#E8DFC9] rounded-lg p-6 shadow-sm relative overflow-hidden group">
                <div className="relative z-10 w-2/3">
                  <h3 className="text-sm font-bold text-[#1A1512] mb-2">Need Help?</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">Our event specialists are here to help you plan your perfect event.</p>
                  <button className="bg-[#FDFBF7] border border-[#E8DFC9] text-[#805D3A] px-4 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#F2E5C5] transition-colors shadow-sm">
                    <Headphones className="w-3 h-3" /> Contact Us
                  </button>
                </div>
                <div className="absolute -right-4 bottom-0 w-32 h-32 bg-[#FAF9F6] rounded-full mix-blend-multiply opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                <Headphones className="absolute right-4 bottom-4 w-16 h-16 text-[#E8DFC9] opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              {/* TRUST BADGES */}
              <div className="bg-white border border-[#E8DFC9] rounded-lg p-6 shadow-sm relative overflow-hidden">
                <h3 className="text-sm font-bold text-[#1A1512] mb-4">Your Booking is Safe</h3>
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Secure SSL Encryption
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Trusted by 1000+ customers
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    Best price guaranteed
                  </div>
                </div>
                <div className="absolute -right-2 -bottom-2 opacity-10 rotate-12">
                  <ShieldCheck className="w-24 h-24 text-[#C9A84C]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "new" && !successBookingRef && (
            <>
              {/* Mobile Summary Floating Panel / Bottom Sheet */}
              <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-[#111111] border-t-2 border-[#C69C6D] shadow-[0_-5px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
                {/* Collapsed view */}
                {!mobileSummaryExpanded ? (
                  <div 
                    onClick={() => setMobileSummaryExpanded(true)}
                    className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50/50 dark:active:bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      <div>
                        <p className="text-xs font-serif font-bold text-gray-900 dark:text-white">Your Event Summary</p>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                          <span>Pkg {selectedPackage ? '✓' : '✗'}</span>
                          <span>•</span>
                          <span>{[vendors.decorator, vendors.videographer, vendors.dj, vendors.photographer, vendors.cake, vendors.florist].filter(v => v && v !== 'none').length} Vendors ✓</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Total</p>
                        <p className="text-sm font-bold text-[#C69C6D]">
                          <AnimatedPrice value={bookingTotal} format={formatCurrency} />
                        </p>
                      </div>
                      <ChevronUp className="w-5 h-5 text-[#C69C6D] animate-bounce" />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Backdrop */}
                    <div 
                      onClick={() => setMobileSummaryExpanded(false)}
                      className="fixed inset-0 bg-black/40 z-[-1]"
                    />
                    
                    {/* Expanded Bottom Sheet */}
                    <div className="max-h-[80vh] overflow-y-auto rounded-t-[20px] p-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-3">
                        <h3 className="text-lg font-serif font-bold text-[#805D3A] dark:text-[#C9A84C]">Your Live Event Summary</h3>
                        <button 
                          onClick={() => setMobileSummaryExpanded(false)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                          <ChevronDown className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Accordion List */}
                      <div className="space-y-3">
                        

                        {/* Package Accordion */}
                        <div className="border border-[#E8DFC9] dark:border-zinc-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setMobileOpenAccordion(mobileOpenAccordion === "package" ? null : "package")}
                            className="w-full bg-[#FAFBF7] dark:bg-zinc-900/40 p-4 flex items-center justify-between text-xs font-bold"
                          >
                            <span className="flex items-center gap-2">🎁 Package</span>
                            <span className="text-[#C69C6D] capitalize">{selectedPackage ? `${getPackageName(selectedPackage)} ✓` : 'Not Selected ✗'}</span>
                          </button>
                          {mobileOpenAccordion === "package" && (
                            <div className="p-4 bg-white dark:bg-[#111111] text-xs text-gray-600 dark:text-gray-400 space-y-1 border-t border-[#E8DFC9]/40 dark:border-zinc-800/40">
                              <p><strong>Selected Package:</strong> <span className="capitalize">{selectedPackage ? `${getPackageName(selectedPackage)} Package` : "None Selected"}</span></p>
                              <p><strong>Menu Type Included:</strong> Standard catering set menu.</p>
                            </div>
                          )}
                        </div>

                        {/* Vendors Accordion */}
                        <div className="border border-[#E8DFC9] dark:border-zinc-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setMobileOpenAccordion(mobileOpenAccordion === "vendors" ? null : "vendors")}
                            className="w-full bg-[#FAFBF7] dark:bg-zinc-900/40 p-4 flex items-center justify-between text-xs font-bold"
                          >
                            <span className="flex items-center gap-2">🌸 Selected Artisans</span>
                            <span className="text-[#C69C6D]">{[vendors.decorator, vendors.videographer, vendors.dj, vendors.photographer, vendors.cake, vendors.florist].filter(v => v && v !== 'none').length} Selected ✓</span>
                          </button>
                          {mobileOpenAccordion === "vendors" && (
                            <div className="p-4 bg-white dark:bg-[#111111] text-xs space-y-2 border-t border-[#E8DFC9]/40 dark:border-zinc-800/40">
                              {([
                                { id: "decorator", label: "Decorator", icon: "🌸" },
                                { id: "videographer", label: "Videographer", icon: "📹" },
                                { id: "dj", label: "DJ Artist", icon: "🎧" },
                                { id: "photographer", label: "Photographer", icon: "📸" },
                                { id: "cake", label: "Cake", icon: "🎂" },
                                { id: "florist", label: "Florist", icon: "💐" }
                              ] as const).map((cat) => {
                                const vendorId = vendors[cat.id];
                                const isSelected = vendorId && vendorId !== "none";
                                const vObj = globalVendors.find(v => v.id === vendorId || (v as any)._id === vendorId);
                                return (
                                  <div key={cat.id} className="flex justify-between items-center py-1">
                                    <span className="text-gray-500">{cat.icon} {cat.label}</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">
                                      {isSelected ? (vObj ? vObj.name : "Custom Selected") : "Not Added"}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Details/Pricing Accordion */}
                        <div className="border border-[#E8DFC9] dark:border-zinc-800 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setMobileOpenAccordion(mobileOpenAccordion === "pricing" ? null : "pricing")}
                            className="w-full bg-[#FAFBF7] dark:bg-zinc-900/40 p-4 flex items-center justify-between text-xs font-bold"
                          >
                            <span className="flex items-center gap-2">💰 Pricing & Details</span>
                            <span className="text-[#C69C6D]">Breakdown ✓</span>
                          </button>
                          {mobileOpenAccordion === "pricing" && (
                            <div className="p-4 bg-white dark:bg-[#111111] text-xs text-gray-600 dark:text-gray-400 space-y-2 border-t border-[#E8DFC9]/40 dark:border-zinc-800/40">
                              <p><strong>Date:</strong> {selectedDate ? new Date(selectedDate).toLocaleDateString() : "Pending selection"}</p>
                              <p><strong>Time Slot:</strong> {startTime} – {endTime}</p>
                              <p className="flex justify-between"><strong>Hall Base:</strong> <span>{formatCurrency(hallBase)}</span></p>
                              {addonsCost > 0 && <p className="flex justify-between"><strong>Vendors:</strong> <span>{formatCurrency(addonsCost)}</span></p>}
                              <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2" />
                              <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200 mt-1">
                                <span>Estimated Grand Total</span>
                                <span className="text-[#C69C6D]">{formatCurrency(bookingTotal)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
                                <span>Advance Deposit</span>
                                <span className="text-[#C69C6D]">{formatCurrency(depositToday)}</span>
                              </div>
                              <div className="pl-4 pt-1 text-xs text-gray-500 space-y-0.5">
                                <div className="flex justify-between"><span>Hall (30%)</span><span>{formatCurrency(hallAdvance)}</span></div>
                                {decoratorAdv.advance > 0 && <div className="flex justify-between"><span>Decorator ({decoratorAdv.percentage}%)</span><span>{formatCurrency(decoratorAdv.advance)}</span></div>}
                                {djAdv.advance > 0 && <div className="flex justify-between"><span>DJ ({djAdv.percentage}%)</span><span>{formatCurrency(djAdv.advance)}</span></div>}
                                {videographerAdv.advance > 0 && <div className="flex justify-between"><span>Videographer ({videographerAdv.percentage}%)</span><span>{formatCurrency(videographerAdv.advance)}</span></div>}
                                {photographerAdv.advance > 0 && <div className="flex justify-between"><span>Photographer ({photographerAdv.percentage}%)</span><span>{formatCurrency(photographerAdv.advance)}</span></div>}
                                {cakeAdv.advance > 0 && <div className="flex justify-between"><span>Cake ({cakeAdv.percentage}%)</span><span>{formatCurrency(cakeAdv.advance)}</span></div>}
                                {floristAdv.advance > 0 && <div className="flex justify-between"><span>Florist ({floristAdv.percentage}%)</span><span>{formatCurrency(floristAdv.advance)}</span></div>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cost Summary Highlight */}
                      <div className="p-4 bg-[#FAF6EE] dark:bg-amber-950/20 border border-[#C69C6D]/40 rounded-2xl flex justify-between items-center text-sm font-bold">
                        <span className="text-[#805D3A] dark:text-[#C9A84C] font-serif">Estimated Total</span>
                        <span className="text-[#C69C6D] text-base">
                          <AnimatedPrice value={bookingTotal} format={formatCurrency} />
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-3">
                        {currentStep < TOTAL_STEPS ? (
                          <button
                            onClick={() => {
                              handleNext();
                              setMobileSummaryExpanded(false);
                            }}
                            className="w-full py-4 text-white text-xs uppercase font-bold tracking-[0.2em] bg-[#C69C6D] hover:bg-[#B58B5C] rounded-xl shadow-md transition-colors"
                          >
                            Continue Booking &rarr;
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleConfirmAndPay();
                              setMobileSummaryExpanded(false);
                            }}
                            disabled={!termsAccepted || isProcessing}
                            className={`w-full py-4 text-white text-xs uppercase font-bold tracking-[0.2em] rounded-xl shadow-md transition-colors ${
                              !termsAccepted || isProcessing
                                ? "bg-gray-400 cursor-not-allowed opacity-50"
                                : "bg-[#C69C6D] hover:bg-[#B58B5C]"
                            }`}
                          >
                            {isProcessing ? "Processing..." : "Confirm & Pay Deposit"}
                          </button>
                        )}
                        <p className="text-center text-[9px] text-gray-500 uppercase tracking-widest flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-500" /> SECURED BY PAYHERE CENTRAL BANK REGULATED Webhook
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
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

      {paymentPendingNotice && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] dark:bg-[#111111] border-2 border-[#C9A84C] shadow-2xl p-8 max-w-md w-full mx-4 text-center rounded-[20px] space-y-6">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="text-3xl">⚠️</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-[#805D3A] dark:text-[#C9A84C]">
                Payment Not Completed
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Your booking reservation has been saved, but your <strong>30% advance deposit</strong> has not been completed yet.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                ⏳ Please complete your 30% advance payment within <strong>15 minutes</strong> to secure your date.
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                onClick={() => {
                  setPaymentPendingNotice(null);
                  router.push("/customer/myaccount?tab=bookings");
                }}
                className="w-full bg-[#C9A84C] hover:bg-[#B58B5C] text-[#2C1E14] py-3.5 px-6 text-xs font-bold uppercase tracking-widest transition-colors rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <span>Go to My Account & Pay Now</span> &rarr;
              </button>
              
              <button 
                onClick={() => setPaymentPendingNotice(null)}
                className="w-full text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 py-1 transition-colors"
              >
                Close & Stay on Page
              </button>
            </div>
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

      <PolicyModal
        isOpen={policyModalType !== null}
        onClose={() => setPolicyModalType(null)}
        policyType={policyModalType}
        cancellationTier={venueSettings?.cancellationTiers}
      />
    </div>
  );
}