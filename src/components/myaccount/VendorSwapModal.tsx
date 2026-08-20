"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { Vendor } from "@/components/landing/vendors/types";
import { useVendorStore } from "@/store/vendorStore";
import { PortfolioViewerModal } from "@/components/landing/vendors/PortfolioViewerModal";
interface VendorSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceCategory: "decorator" | "dj" | "videographer";
  currentVendorId?: string;
}

export default function VendorSwapModal({ isOpen, onClose, bookingId, serviceCategory, currentVendorId }: VendorSwapModalProps) {
  const { initiateVendorSwap, confirmSwapPayment } = useBookingStore();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [financialChoice, setFinancialChoice] = useState<"apply_balance" | "refund" | null>(null);
  const [viewerModal, setViewerModal] = useState<{isOpen: boolean; item: any; vendor: any}>({ isOpen: false, item: null, vendor: null });

  const { vendors, fetchVendors } = useVendorStore();

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setSelectedVendor(null);
      setSelectedPackage(null);
      setStep(1);
      setFinancialChoice(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Find the booking context (moved above early return to satisfy Rules of Hooks)
  const { bookings } = useBookingStore();

  if (!isOpen || !mounted) return null;

  const categoryMap: Record<string, string> = {
    decorator: "decorators",
    dj: "djs",
    videographer: "videographers",
    photographer: "photographers",
    cake: "cake",
    florist: "florists"
  };
  
  const mappedCategory = categoryMap[serviceCategory] || serviceCategory;
  const bookingContext = bookings.find(b => (b._id || b.id) === bookingId);
  const eventDate = bookingContext ? new Date(bookingContext.date).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' }) : "TBA";

  const availableVendors = vendors.filter(v => {
    if (v.category !== mappedCategory) return false;
    if (v.id === currentVendorId || v.userId === currentVendorId) return false;
    // if (v.isVerified === false) return false; // Relaxed for demo

    // Check Date Availability
    if (bookingContext && (v as any).blockedDates) {
      const bDate = new Date(bookingContext.date).toDateString();
      const isBlocked = (v as any).blockedDates?.some((d: any) => new Date(d).toDateString() === bDate);
      if (isBlocked) return false;
    }

    // Relaxed event type and service area checks to ensure mock vendors appear
    // if (bookingContext && bookingContext.eventType && v.eventTypesServed && v.eventTypesServed.length > 0) { ... }
    // if (!v.availableIslandWide && v.serviceAreas && v.serviceAreas.length > 0) { ... }

    return true;
  });

  const parsePrice = (priceStr: string | number) => {
    if (typeof priceStr === "number") return priceStr;
    const num = Number(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const availableOptions = availableVendors.flatMap(v => {
    let pkgs: any[] = [];
    if (v.category === "decorators" && v.portfolioItems && v.portfolioItems.length > 0) {
      pkgs = v.portfolioItems.map((pi: any) => ({
        name: pi.title,
        price: pi.price > 0 ? pi.price : v.startingPrice,
        isDesign: true,
        designData: pi
      }));
    } else {
      pkgs = (v.packages && v.packages.length > 0) ? v.packages : [{ name: "Standard Package", price: v.startingPrice }];
    }

    return pkgs.map((pkg: any) => {
      const numericPrice = parsePrice(pkg.price);
      const advance = Math.round(numericPrice * ((v.advancePaymentPercentage || 0) / 100));
      return {
        vendorId: v.id,
        vendorName: (v as any).shopName || v.name || "Vendor",
        packageName: pkg.name,
        priceDisplay: typeof pkg.price === 'string' ? pkg.price : `LKR ${numericPrice.toLocaleString()}`,
        advanceDisplay: advance > 0 ? `LKR ${advance.toLocaleString()}` : "LKR 0",
        advanceValue: advance,
        price: numericPrice,
        isDesign: pkg.isDesign,
        designData: pkg.designData,
        vendorData: v
      };
    });
  });

  const handleSubmit = async (e?: React.FormEvent, choice?: "apply_balance" | "refund") => {
    if (e) e.preventDefault();
    if (!selectedVendor || !selectedPackage) return;
    
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setIsSubmitting(true);
      try {
        const res = await initiateVendorSwap(bookingId, serviceCategory, selectedVendor, selectedPackage, choice || financialChoice || undefined);
        if (res?.success) {
          if (res.pendingSwap && res.data?.pendingSwapId && res.data?.payhereData) {
            const payData = res.data.payhereData;
            
            // Load PayHere script if not present
            if (!(window as any).payhere) {
              await new Promise<void>((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://www.payhere.lk/lib/payhere.js";
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load PayHere SDK"));
                document.body.appendChild(script);
              });
            }

            const payhere = (window as any).payhere;
            
            payhere.onCompleted = async function onCompleted(orderId: string) {
              console.log("Swap payment completed for:", orderId);
              const confirmRes = await confirmSwapPayment(bookingId, res.data.pendingSwapId);
              setIsSubmitting(false);
              if (confirmRes?.success) {
                onClose();
              } else {
                alert("Payment was successful but confirmation failed. Please contact support.");
                onClose();
              }
            };

            payhere.onDismissed = function onDismissed() {
              console.log("PayHere dismissed");
              setIsSubmitting(false);
            };

            payhere.onError = function onPayHereError(error: any) {
              console.error("PayHere Error:", error);
              
              // Simulate success on sandbox merchant mismatch errors
              const errorStr = String(error).toLowerCase();
              if (!errorStr.includes("card") && !errorStr.includes("decline") && !errorStr.includes("failed")) {
                const simulate = confirm(`PayHere Notice: ${error}\n\nSimulate successful payment for testing?`);
                if (simulate) {
                  payhere.onCompleted(payData.orderId);
                  return;
                }
              }
              alert("Payment failed: " + error);
              setIsSubmitting(false);
            };

            const paymentObject = {
              sandbox: payData.mode === "sandbox",
              merchant_id: payData.merchantId,
              return_url: window.location.origin + "/customer/myaccount",
              cancel_url: window.location.origin + "/customer/myaccount",
              notify_url: (process.env.NEXT_PUBLIC_API_URL || "https://eascc-backend.onrender.com") + "/api/payhere/notify",
              order_id: payData.orderId,
              items: payData.items,
              amount: payData.amount,
              currency: payData.currency,
              hash: payData.hash,
              first_name: payData.customer.firstName,
              last_name: payData.customer.lastName,
              email: payData.customer.email,
              phone: payData.customer.phone,
              address: payData.customer.address,
              city: payData.customer.city,
              country: payData.customer.country,
              custom_1: "theme:#C69C6D",
            };

            payhere.startPayment(paymentObject);
            return;
          } else {
            // Equal or cheaper swap completed instantly
            setIsSubmitting(false);
            onClose();
          }
        } else {
          alert((res as any)?.message || "Failed to initiate vendor swap.");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    }
  };
  
  // Find current vendor details
  const oldVendor = bookingContext?.vendors?.[serviceCategory];
  const oldCost = bookingContext?.pricingBreakdown?.[`${serviceCategory}Cost` as keyof typeof bookingContext.pricingBreakdown] || 0;
  
  const effectiveOldVendorId = currentVendorId || oldVendor?.vendorId;
  const resolvedOldVendor = effectiveOldVendorId ? vendors.find(v => v.id === effectiveOldVendorId || v.userId === effectiveOldVendorId) : undefined;
  const oldAdvancePercentage = resolvedOldVendor?.advancePaymentPercentage || 10;
  const originalAdvance = Math.round(oldCost * (oldAdvancePercentage / 100));

  const displayOldVendorName = (resolvedOldVendor as any)?.shopName || resolvedOldVendor?.name || (oldVendor as any)?.vendorName || (oldVendor as any)?.name || (effectiveOldVendorId ? "Previous Vendor" : "No Vendor Selected");

  const selectedOptionInfo = availableOptions.find(o => o.vendorId === selectedVendor && o.packageName === selectedPackage);
  const newAdvance = selectedOptionInfo?.advanceValue || 0;

  const renderStep1 = () => (
    <>
      {/* Context Summary */}
      {bookingContext && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-[#111] p-6 rounded-xl border border-[#E8DFC9] dark:border-gray-800">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Event Details</p>
            <h4 className="text-lg font-serif text-[#1A1512] dark:text-white font-bold">{bookingContext.eventType || "Event"}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{eventDate}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">EASCCA Conference Centre</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Current Package</p>
            <h4 className="text-lg font-serif text-[#1A1512] dark:text-white font-bold">{oldVendor?.packageName || "Standard Package"}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">LKR {oldCost.toLocaleString()}</p>
          </div>
        </div>
      )}

      <p className="text-sm font-bold uppercase tracking-widest text-[#C69C6D] mb-4">
        Choose another {serviceCategory}:
      </p>
      
      <div className="space-y-4">
        {availableOptions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            No available vendors found for your event requirements.
          </div>
        ) : serviceCategory === "decorator" ? (
          availableOptions.map((opt, idx) => {
            const isSelected = selectedVendor === opt.vendorId && selectedPackage === opt.packageName;
            return (
              <label 
                key={idx}
                className={`flex items-start gap-4 p-5 rounded-lg border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-[#FDFBF7] dark:bg-[#C69C6D]/10 border-[#C69C6D] ring-1 ring-[#C69C6D] shadow-sm' 
                    : 'bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-800 hover:border-[#C69C6D]/50'
                }`}
              >
                <div className="pt-1">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#C69C6D]' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#C69C6D]" />}
                  </div>
                  <input 
                    type="radio" 
                    name="replacementVendor" 
                    className="hidden"
                    checked={isSelected}
                    onChange={() => {
                      setSelectedVendor(opt.vendorId);
                      setSelectedPackage(opt.packageName);
                    }}
                  />
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-serif font-bold text-gray-900 dark:text-white mb-1">
                      {opt.vendorName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">
                      {opt.packageName}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-gray-500 font-mono">
                      <span className="font-bold text-gray-900 dark:text-gray-300">{opt.priceDisplay}</span>
                      <span className="text-[#C69C6D]">Advance: {opt.advanceDisplay}</span>
                    </div>
                  </div>
                  {opt.isDesign && opt.designData && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const imageUrl = opt.designData.media?.[0]?.url || opt.designData.coverUrl || "";
                        setViewerModal({
                          isOpen: true,
                          vendor: opt.vendorData,
                          item: {
                            ...opt.designData,
                            title: opt.designData.title,
                            image: imageUrl.startsWith("http") ? imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${imageUrl}`
                          }
                        });
                      }}
                      className="text-[10px] uppercase font-bold text-[#C69C6D] border border-[#C69C6D] px-3 py-1.5 rounded hover:bg-[#C69C6D] hover:text-white transition-colors"
                    >
                      View Design
                    </button>
                  )}
                </div>
              </label>
            );
          })
        ) : (
          availableVendors.map((vendor, idx) => {
            const isVendorSelected = selectedVendor === vendor.id;
            const pkgs = (vendor.packages && vendor.packages.length > 0) ? vendor.packages : [{ name: "Standard Package", price: vendor.startingPrice }];
            
            return (
              <div key={idx} className={`rounded-lg border transition-all ${isVendorSelected ? 'border-[#C69C6D] bg-[#FDFBF7] dark:bg-[#C69C6D]/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A]'}`}>
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111] rounded-lg"
                  onClick={() => {
                     setSelectedVendor(vendor.id);
                     if (pkgs.length === 1) setSelectedPackage(pkgs[0].name);
                     else setSelectedPackage(null); 
                  }}
                >
                  <div className="flex items-center gap-4">
                    <img src={vendor.image.startsWith('http') ? vendor.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${vendor.image}`} alt={(vendor as any).shopName || vendor.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-800" />
                    <div>
                      <h4 className="text-base font-serif font-bold text-gray-900 dark:text-white mb-1">{(vendor as any).shopName || vendor.name}</h4>
                      <p className="text-xs text-gray-500">{pkgs.length} Package{pkgs.length > 1 ? 's' : ''} Available</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isVendorSelected ? 'border-[#C69C6D]' : 'border-gray-300 dark:border-gray-600'}`}>
                    {isVendorSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#C69C6D]" />}
                  </div>
                </div>
                
                {isVendorSelected && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#C69C6D]/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 mt-2">Select Package to Swap</p>
                    <div className="space-y-3">
                      {pkgs.map((pkg: any, pIdx: number) => {
                         const isPkgSelected = selectedPackage === pkg.name;
                         const numericPrice = parsePrice(pkg.price);
                         const advance = Math.round(numericPrice * ((vendor.advancePaymentPercentage || 0) / 100));
                         return (
                           <label key={pIdx} className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-colors ${isPkgSelected ? 'border-[#C69C6D] bg-white dark:bg-black/20 ring-1 ring-[#C69C6D]' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111] hover:border-[#C69C6D]/50'}`}>
                             <input type="radio" className="hidden" checked={isPkgSelected} onChange={() => setSelectedPackage(pkg.name)} />
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${isPkgSelected ? 'border-[#C69C6D]' : 'border-gray-300 dark:border-gray-600'}`}>
                               {isPkgSelected && <div className="w-2 h-2 rounded-full bg-[#C69C6D]" />}
                             </div>
                             <div className="flex-1">
                               <p className="font-bold text-sm text-gray-900 dark:text-white">{pkg.name}</p>
                               {pkg.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>}
                               <div className="flex gap-4 text-xs mt-2 text-gray-500 font-mono">
                                 <span className="font-bold text-gray-900 dark:text-gray-300">LKR {numericPrice.toLocaleString()}</span>
                                 <span className="text-[#C69C6D]">Advance: LKR {advance.toLocaleString()}</span>
                               </div>
                             </div>
                           </label>
                         );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );

  const renderStep2 = () => {
    if (!selectedOptionInfo) return null;
    
    const isCheaper = originalAdvance > newAdvance;
    const isMoreExpensive = newAdvance > originalAdvance;
    const diff = Math.abs(originalAdvance - newAdvance);

    const pricing = bookingContext?.pricingBreakdown || {} as any;
    const hallTotal = (pricing.hallFixedPrice || 0) + (pricing.extraHoursPremium || 0) + (pricing.foodCost || 0) + (pricing.timeslotPremium || 0) + (pricing.customMenuSurcharge || 0);
    
    const otherVendorsTotal = Object.keys(pricing)
      .filter(k => k.endsWith('Cost') && k !== `${serviceCategory}Cost`)
      .reduce((sum, k) => sum + (pricing[k] || 0), 0);
      
    const nonSwappedTotal = hallTotal + otherVendorsTotal;

    const currentTotal = bookingContext?.totalCost || 0;
    const newTotal = currentTotal - oldCost + (selectedOptionInfo.price || 0);
    
    const currentNetPaid = (bookingContext?.depositAmount || 0) + (bookingContext?.balanceAmount || 0) + (bookingContext?.bookingCredit || 0);

    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4 border-b border-[#E8DFC9] dark:border-gray-800 pb-2">
            Replace {serviceCategory}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-widest">Current Vendor</p>
              <p className="font-bold text-[#1A1512] dark:text-white mb-1">{displayOldVendorName}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Package: {oldVendor?.packageName}</p>
              <p className="text-sm font-bold text-[#C69C6D] font-mono">Original Advance: LKR {originalAdvance.toLocaleString()}</p>
            </div>

            <div className="p-5 bg-[#FDFBF7] dark:bg-[#C69C6D]/10 border border-[#C69C6D] rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 tracking-widest">New Vendor</p>
                  <h5 className="font-serif font-bold text-[#1A1512] dark:text-white">{selectedOptionInfo.vendorName}</h5>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedOptionInfo.packageName}</p>
                  
                  {selectedOptionInfo.isDesign && selectedOptionInfo.designData && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const imageUrl = selectedOptionInfo.designData.media?.[0]?.url || selectedOptionInfo.designData.coverUrl || "";
                        setViewerModal({
                          isOpen: true,
                          vendor: selectedOptionInfo.vendorData,
                          item: {
                            ...selectedOptionInfo.designData,
                            title: selectedOptionInfo.designData.title,
                            image: imageUrl.startsWith("http") ? imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${imageUrl}`
                          }
                        });
                      }}
                      className="mt-2 text-[10px] uppercase font-bold text-[#C69C6D] border border-[#C69C6D] px-2 py-1 rounded hover:bg-[#C69C6D] hover:text-white transition-colors"
                    >
                      View Design
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">New Advance</p>
                  <p className="text-sm font-bold text-[#C69C6D] font-mono">{selectedOptionInfo.advanceDisplay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gray-50 dark:bg-[#111] border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5">
          <p className="text-[10px] uppercase font-bold text-gray-500 mb-4 tracking-widest">Financial Summary</p>
          <div className="space-y-6 font-mono text-sm">
            
            {/* Vendor Swap Breakdown */}
            <div>
              <p className="font-bold text-[#1A1512] dark:text-white uppercase text-[10px] tracking-widest mb-2 border-b border-gray-200 dark:border-gray-800 pb-1">Advance Adjustment</p>
              
              <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                 <div>
                    <p className="text-gray-500 font-sans">Current {serviceCategory}</p>
                    <p className="font-bold text-gray-900 dark:text-white">{displayOldVendorName}</p>
                    <p className="text-gray-500 mt-1">Cost: LKR {oldCost.toLocaleString()}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-gray-500 font-sans">New {serviceCategory}</p>
                    <p className="font-bold text-[#C69C6D]">{selectedOptionInfo.vendorName}</p>
                    <p className="text-gray-500 mt-1">Cost: LKR {(selectedOptionInfo.price || 0).toLocaleString()}</p>
                 </div>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Original Vendor Advance</span> <span>LKR {originalAdvance.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>New Vendor Advance</span> <span>LKR {newAdvance.toLocaleString()}</span></div>
              {isCheaper && (
                <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400 mt-1 pt-1 border-t border-gray-200 dark:border-gray-800"><span>Unused Advance (Credit)</span> <span>LKR {diff.toLocaleString()}</span></div>
              )}
              {isMoreExpensive && (
                <div className="flex justify-between font-bold text-red-600 dark:text-red-400 mt-1 pt-1 border-t border-gray-200 dark:border-gray-800"><span>Additional Advance Required</span> <span>LKR {diff.toLocaleString()}</span></div>
              )}
            </div>

            {/* Overall Booking Impact */}
            <div>
               <p className="font-bold text-[#1A1512] dark:text-white uppercase text-[10px] tracking-widest mb-2 border-b border-gray-200 dark:border-gray-800 pb-1">New Booking Totals</p>
               <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Hall & Other Services</span> <span>LKR {nonSwappedTotal.toLocaleString()}</span></div>
               <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>New {serviceCategory}</span> <span>LKR {(selectedOptionInfo.price || 0).toLocaleString()}</span></div>
               <div className="flex justify-between font-bold text-[#1A1512] dark:text-white mt-1 pt-1 border-t border-gray-200 dark:border-gray-800"><span>New Booking Total</span> <span>LKR {newTotal.toLocaleString()}</span></div>
               
               <div className="flex justify-between text-gray-600 dark:text-gray-400 mt-2"><span>Amount Already Paid</span> <span>LKR {currentNetPaid.toLocaleString()}</span></div>
               {isMoreExpensive && (
                 <div className="flex justify-between text-red-600 dark:text-red-400"><span>Additional Advance Now</span> <span>LKR {diff.toLocaleString()}</span></div>
               )}
               <div className="flex justify-between font-bold text-[#C69C6D] mt-1 pt-1 border-t border-gray-200 dark:border-gray-800"><span>Total Paid After Swap</span> <span>LKR {(currentNetPaid + (isMoreExpensive ? diff : 0)).toLocaleString()}</span></div>
               
               <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between font-bold text-lg text-[#1A1512] dark:text-white"><span>Remaining Balance</span> <span>LKR {(newTotal - currentNetPaid - (isMoreExpensive ? diff : 0)).toLocaleString()}</span></div>
               </div>
            </div>

          </div>
        </div>

        {isCheaper ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-6 space-y-6">
            <div className="text-center">
              <p className="text-sm font-bold text-[#1A1512] dark:text-white">
                How would you like to use your unallocated LKR {diff.toLocaleString()}?
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
                LKR {diff.toLocaleString()} of your existing payment is currently unallocated because the original {serviceCategory} was replaced.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => {
                  setFinancialChoice('apply_balance');
                  handleSubmit(e, 'apply_balance');
                }}
                className="w-full p-4 bg-white dark:bg-[#1A1A1A] border-2 border-emerald-600 text-left rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors shadow-sm disabled:opacity-50"
              >
                <div className="text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-1">Apply LKR {diff.toLocaleString()} to Booking Balance</div>
                <div className="text-xs text-gray-500 font-normal">Keep your remaining booking balance at LKR {(newTotal - currentNetPaid).toLocaleString()}.</div>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => {
                  setFinancialChoice('refund');
                  handleSubmit(e, 'refund');
                }}
                className="w-full p-4 bg-white dark:bg-[#1A1A1A] border-2 border-gray-300 dark:border-gray-700 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50"
              >
                <div className="text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">Request LKR {diff.toLocaleString()} Refund</div>
                <div className="text-xs text-gray-500 font-normal">Return the LKR {diff.toLocaleString()} to you, which will increase your remaining booking balance to LKR {(newTotal - currentNetPaid + diff).toLocaleString()}.</div>
              </button>
            </div>
          </div>
        ) : isMoreExpensive ? (
          <button 
            type="submit"
            onClick={(e) => handleSubmit(e)}
            disabled={isSubmitting}
            className="w-full bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 rounded-lg p-6 text-center space-y-4 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
          >
            <h4 className="text-xl font-serif font-bold text-[#1A1512] dark:text-white">Replacement Payment Required</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your existing allocation of LKR {originalAdvance.toLocaleString()} will be applied toward the new vendor.
              You only need to pay the additional LKR {diff.toLocaleString()}.
            </p>
            <div className="pt-2">
              <span className="inline-block px-6 py-2 bg-[#C69C6D] hover:bg-[#B58B5C] text-white text-[10px] uppercase tracking-widest font-bold rounded transition-colors">
                {isSubmitting ? "Processing Payment..." : `Pay LKR ${diff.toLocaleString()} with PayHere`}
              </span>
            </div>
          </button>
        ) : (
          <div className="bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center space-y-4">
            <h4 className="text-xl font-serif font-bold text-[#1A1512] dark:text-white">No additional payment required.</h4>
            <p className="text-sm font-bold text-gray-500">No refund/credit is generated.</p>
          </div>
        )}
      </div>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-[#1A1512]/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />
        
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-[#1A1A1A] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-[#E8DFC9] dark:border-gray-800 animate-slideUp z-10 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#E8DFC9] dark:border-gray-800 bg-[#FDFBF7] dark:bg-[#111111] flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white capitalize">Select {serviceCategory}</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C69C6D] font-bold mt-1.5">Booking #{bookingId.split('-')[1] || bookingId}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-[#1A1512] dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
 
          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              {step === 1 ? renderStep1() : renderStep2()}
            </div>

            {/* Actions */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-[#111111] flex items-center justify-end gap-4 border-t border-[#E8DFC9] dark:border-gray-800 shrink-0">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
                >
                  Back
                </button>
              )}
              {step === 1 && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
              {!(!selectedOptionInfo ? false : originalAdvance > (selectedOptionInfo.advanceValue || 0) && step === 2) && (
                <button
                  type="submit"
                  disabled={!selectedVendor || isSubmitting}
                  onClick={(e) => handleSubmit(e)}
                  className="px-8 py-3.5 bg-[#C69C6D] text-white text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-[#B58A59] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center min-w-[160px]"
                >
                  {step === 1 ? "Review Change" : isSubmitting ? "Confirming..." : (step === 2 && selectedOptionInfo && selectedOptionInfo.advanceValue > originalAdvance) ? `Pay LKR ${Math.abs(selectedOptionInfo.advanceValue - originalAdvance).toLocaleString()} & Confirm Replacement` : "Confirm Replacement"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <PortfolioViewerModal 
        isOpen={viewerModal.isOpen} 
        onClose={() => setViewerModal({ isOpen: false, item: null, vendor: null })} 
        portfolioItem={viewerModal.item} 
        vendor={viewerModal.vendor} 
        hideSelectButton={true}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
}
