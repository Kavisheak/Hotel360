"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Sparkles, Calendar, Clock, Users, Building, Gift, Check, Plus, ChevronUp, ChevronDown, Lock } from "lucide-react";
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
import { customerBookingAPI, packageAPI } from "@/lib/api";

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

  // Step 2 Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
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

  useEffect(() => {
    fetchVendors();
    packageAPI.getAllPackages().then((res) => {
      if (res.ok && res.data?.data) {
        setDbPackages(res.data.data);
      }
    });
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
  }>({
    decorator: "none",
    decoratorPackage: "none",
    dj: "none",
    djPackage: "none",
    videographer: "none",
    videographerPackage: "none",
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

  const getVendorCost = (category: "decorator" | "dj" | "videographer") => {
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
  const extraHoursPremium = Math.max(0, durationHours - 7) * 5000;
  const timeslotPremium = 0;

  let addonsCost = 
    getVendorCost("decorator") + 
    getVendorCost("dj") + 
    getVendorCost("videographer");

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
        }
      },
    };

    try {
      const res = await customerBookingAPI.createBooking(bookingPayload);
      if (res.ok && res.data.success) {
        clearCart();
        return res.data.data?._id || res.data.data?.id || true;
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
    alert("Your 10-minute event hold has expired and the date has been released. Your package, vendor choices, and guest details have been preserved — please pick a new date to re-reserve!");
    if (selectedDate) {
      const dateString = new Date(selectedDate).toISOString();
      try {
        await customerBookingAPI.releaseHold({ date: dateString });
      } catch (e) {}
    }
    setSelectedDate(0);
    setHoldExpiresAt(null);
    setTimeLeft(0);
    setCurrentStep(1);
  };

  const handleConfirmAndPay = async () => {
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }
    // Pre-checkout validation: re-check hold expiration immediately before initiating payment
    if (holdExpiresAt && Date.now() >= holdExpiresAt) {
      alert("Your temporary event date hold has expired. The reservation date has been released. Returning to Step 1 to select a date.");
      handleHoldExpired();
      return;
    }
    setIsProcessing(true);
    const bookingResult = await handleFinalizeBooking({
      firstName,
      lastName,
      email,
      phone,
      alternativePhone,
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
                return;
              }
            }
            // Fallback
            setSuccessBookingRef(`LG-${new Date().getFullYear()}-${bookingResult.slice(-4).toUpperCase()}`);
            setSuccessAdvancePaid(depositToday);
            setSuccessRemainingBalance(balanceDue);
            setSuccessBookingId(bookingResult);
            setIsProcessing(false);
          }).catch(() => {
            setSuccessBookingRef(`LG-${new Date().getFullYear()}-${bookingResult.slice(-4).toUpperCase()}`);
            setSuccessAdvancePaid(depositToday);
            setSuccessRemainingBalance(balanceDue);
            setSuccessBookingId(bookingResult);
            setIsProcessing(false);
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
          }
        }
      });
    } else if (bookingResult) {
      setIsProcessing(false);
      setShowSuccessModal(true);
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

    if (currentStep === 2 && !selectedPackage) {
      alert("Please select a venue package before proceeding to the next step.");
      return;
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
                  <td>Extra Hours Premium (${durationHours - 6} hrs)</td>
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
              <p style="margin:0 0 5px 0; font-size:12px; color:gray; text-transform:uppercase;">Advance Deposit Paid (30%)</p>
              <h3 style="margin:0 0 10px 0; color:#805d3a; font-size:24px;">${formatCurrency(successAdvancePaid)}</h3>
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
    5: "Final Review",
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

      <main className="flex-grow">
        <BookHero />

        <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">

          {/* Left Column: Booking Form Steps */}
          <div className={`${activeTab === "history" || successBookingRef ? "lg:col-span-12" : "lg:col-span-8"} space-y-12 transition-all duration-500`}>

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

                {/* Stepper Indicator */}
                <div className="flex items-center justify-between border-b border-[#E8DFC9] dark:border-gray-800 pb-6 mb-12 relative">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#E8DFC9] dark:bg-gray-800 -z-10 -translate-y-1/2" />
                  {[1, 2, 3, 4, 5].map((step) => (
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

                {/* Step 1: Date & Guests */}
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
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-4">
                      <h3 className="text-sm font-bold tracking-widest text-[#805D3A] dark:text-[#C9A84C] uppercase">
                        Guest Count
                      </h3>
                      <GuestCounter count={guestCount} onChange={setGuestCount} min={100} max={600} />
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
                      <PackageSelector selectedPackage={selectedPackage} onSelectPackage={setSelectedPackage} dbPackages={dbPackages} />
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
                      <BookingVendorSelector vendors={vendors} onChange={setVendors} />
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
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Special Requests / Notes</label>
                          <input
                            type="text"
                            placeholder="e.g. wheelchair access, specific theme color"
                            className="w-full bg-[#FAFBF7] dark:bg-[#1A1A1A] border border-[#D4C9A8] dark:border-[#C9A84C]/30 px-4 py-2.5 rounded-md text-sm outline-none focus:border-[#C9A84C] transition-colors"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Details */}
                    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm space-y-6">
                      <h3 className="text-lg font-serif font-semibold text-[#2C1E14] dark:text-white">
                        Billing Details
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
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Postal code</label>
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
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Country</label>
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

                      {/* PayHere Security & PCI-DSS Guarantee Banner */}
                      <div className="bg-[#FAF6EE]/50 dark:bg-zinc-900/60 border border-[#E8DFC9] dark:border-zinc-800 p-4 rounded-lg flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-base">🔒</span>
                        </div>
                        <div className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            PayHere Secure Hosted Checkout
                          </p>
                          <p className="leading-relaxed text-[11px]">
                            Upon clicking <strong>Confirm &amp; Proceed to Payment</strong>, you will be securely redirected to the official <strong>PayHere Hosted Checkout Page</strong> to process your 30% advance of <strong>{formatCurrency(depositToday)}</strong>. No card information, bank credentials, or OTP details are entered or stored on our servers.
                          </p>
                        </div>
                      </div>

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
          {activeTab === "new" && !successBookingRef && (
            <>
              {/* Desktop Sticky Live Event Summary */}
              <div className="hidden md:block md:col-span-4 space-y-6 sticky top-24 section-reveal stagger-2">
                <div className="bg-white dark:bg-[#111111] p-6 border-2 border-[#E8DFC9] dark:border-[#C9A84C]/20 rounded-[20px] shadow-[0_4px_30px_rgba(0,0,0,0.05)] space-y-6">
                  {/* Event Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <span>Live Event Summary</span>
                      <span>Step {currentStep} of {TOTAL_STEPS}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#C69C6D] transition-all duration-500" 
                        style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-[#E8DFC9] dark:bg-gray-800/80" />


                  {/* Package Section */}
                  <div className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedPackage 
                      ? `bg-[#FAF6EE]/40 dark:bg-amber-950/5 border-[#C69C6D]/40 ${glowPackage ? 'animate-gold-glow' : ''}` 
                      : 'bg-gray-50/50 dark:bg-zinc-900/40 border-gray-100 dark:border-zinc-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Gift className="w-4 h-4 text-[#C69C6D]" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">Package</p>
                          <p className={`text-xs font-bold ${selectedPackage ? 'text-[#1A1512] dark:text-white capitalize' : 'text-gray-400'}`}>
                            {selectedPackage === "silver" ? "Classic Silver Package" : selectedPackage === "diamond" ? "Luxury Diamond Gala" : selectedPackage === "gold" ? "Grand Gold Celebration" : "Choose Package"}
                          </p>
                        </div>
                      </div>
                      {selectedPackage ? (
                        <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-350 rounded">
                          ✓ Selected
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStepClick(2)}
                          className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 border border-dashed border-[#C69C6D] text-[#C69C6D] hover:bg-[#FAF6EE] rounded"
                        >
                          + Select
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vendors Section */}
                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">Selected Artisans</p>
                    <div className="space-y-2">
                      {([
                        { id: "decorator", label: "Decorator", icon: "🌸", glow: glowDecorator },
                        { id: "videographer", label: "Videographer", icon: "📹", glow: glowVideographer },
                        { id: "dj", label: "DJ Artist", icon: "🎧", glow: glowDj }
                      ] as const).map((cat) => {
                        const vendorId = vendors[cat.id];
                        const isSelected = vendorId && vendorId !== "none";
                        const vObj = globalVendors.find(v => v.id === vendorId || (v as any)._id === vendorId);
                        
                        if (isSelected) {
                          return (
                            <div key={cat.id} className={`p-3 bg-[#FAFBF7] dark:bg-zinc-900/30 border border-[#E8DFC9] dark:border-zinc-800/80 rounded-xl flex items-center justify-between transition-all duration-350 ${cat.glow ? 'animate-gold-glow' : ''}`}>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{cat.icon}</span>
                                <div>
                                  <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">{cat.label}</p>
                                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                    {vObj ? vObj.name : "Custom Selected"}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[8px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Selected
                              </span>
                            </div>
                          );
                        } else {
                          return (
                            <button
                              key={cat.id}
                              onClick={() => handleStepClick(3)}
                              className="w-full border border-dashed border-[#C69C6D]/45 text-[#C69C6D] hover:bg-[#FAF6EE] dark:hover:bg-[#C69C6D]/5 py-2.5 rounded-xl text-[10px] tracking-wider uppercase font-bold text-center transition-all duration-200"
                            >
                              + Add {cat.label}
                            </button>
                          );
                        }
                      })}
                    </div>
                  </div>

                  <div className="h-px bg-[#E8DFC9] dark:bg-gray-800/80" />

                  {/* Event Details */}
                  <div className="space-y-2 bg-[#FAF6EE]/20 dark:bg-zinc-900/20 p-4 border border-[#E8DFC9]/40 dark:border-zinc-800/60 rounded-xl text-xs space-y-3">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-3.5 h-3.5 text-[#C69C6D]" />
                      <span>
                        <strong>Date:</strong> {selectedDate ? new Date(selectedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : <span className="text-gray-400 font-normal">Not selected</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-[#C69C6D]" />
                      <span>
                        <strong>Time:</strong> {formatTimeStr(startTime)} – {formatTimeStr(endTime)} ({durationHours} hrs)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Users className="w-3.5 h-3.5 text-[#C69C6D]" />
                      <span>
                        <strong>Guests:</strong> {guestCount} Guests
                      </span>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="space-y-3 text-xs">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-sans">Cost breakdown</p>
                    <div className="space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hall Hold & Time Slot</span>
                        <span className="font-medium">{formatCurrency(extraHoursPremium + timeslotPremium)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Package {selectedPackage ? `(${selectedPackage.toUpperCase()})` : "(Not Selected)"}</span>
                        <span className="font-medium">{formatCurrency(basePrice)}</span>
                      </div>
                      {addonsCost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Selected Artisans</span>
                          <span className="font-medium">{formatCurrency(addonsCost)}</span>
                        </div>
                      )}

                      
                      <div className="p-3.5 bg-[#FAF6EE] dark:bg-amber-950/20 border border-[#C69C6D]/40 rounded-xl flex justify-between items-center text-sm font-bold mt-2">
                        <span className="text-[#805D3A] dark:text-[#C9A84C] font-serif">Estimated Total</span>
                        <span className="text-[#C69C6D] text-base">
                          <AnimatedPrice value={bookingTotal} format={formatCurrency} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deposit Today */}
                  <div className="bg-[#FAFBF7] dark:bg-zinc-900/40 p-4 border border-[#E8DFC9] dark:border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">30% Advance Deposit</p>
                      <p className="text-lg font-serif font-bold text-[#805D3A] dark:text-[#C9A84C] mt-0.5">
                        <AnimatedPrice value={depositToday} format={formatCurrency} />
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider block">
                        Ready for Payment
                      </span>
                      <span className="text-[8px] text-gray-400 mt-1 block">Protected by Escrow</span>
                    </div>
                  </div>
                </div>
                <TrustDivider />
              </div>

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
                          <span>{[vendors.decorator, vendors.videographer, vendors.dj].filter(v => v && v !== 'none').length} Vendors ✓</span>
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
                            <span className="text-[#C69C6D] capitalize">{selectedPackage ? `${selectedPackage} ✓` : 'Not Selected ✗'}</span>
                          </button>
                          {mobileOpenAccordion === "package" && (
                            <div className="p-4 bg-white dark:bg-[#111111] text-xs text-gray-600 dark:text-gray-400 space-y-1 border-t border-[#E8DFC9]/40 dark:border-zinc-800/40">
                              <p><strong>Selected Package:</strong> <span className="capitalize">{selectedPackage ? `${selectedPackage} Package` : "None Selected"}</span></p>
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
                            <span className="text-[#C69C6D]">{[vendors.decorator, vendors.videographer, vendors.dj].filter(v => v && v !== 'none').length} Selected ✓</span>
                          </button>
                          {mobileOpenAccordion === "vendors" && (
                            <div className="p-4 bg-white dark:bg-[#111111] text-xs space-y-2 border-t border-[#E8DFC9]/40 dark:border-zinc-800/40">
                              {([
                                { id: "decorator", label: "Decorator", icon: "🌸" },
                                { id: "videographer", label: "Videographer", icon: "📹" },
                                { id: "dj", label: "DJ Artist", icon: "🎧" }
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
                              <p><strong>Guests:</strong> {guestCount} Guests</p>
                              <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2" />
                              <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200 mt-1">
                                <span>Estimated Total</span>
                                <span className="text-[#C69C6D]">{formatCurrency(bookingTotal)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-gray-800 dark:text-gray-200">
                                <span>30% Deposit Today</span>
                                <span className="text-[#C69C6D]">{formatCurrency(depositToday)}</span>
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
    </div>
  );
}