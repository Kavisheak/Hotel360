"use client";

import React, { useEffect, useState } from "react";
import { customerBookingAPI } from "@/lib/api";
import { Loader2, Calendar, Clock, Users, MapPin, SearchX, ChevronDown, ChevronUp, Receipt, Package, Music, Video, Palette, Phone, Mail, RefreshCw, MessageSquare, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVendorStore } from "@/store/vendorStore";

import BookingDetailView from "@/components/shared/BookingDetailView";
import VendorSwapModal from "@/components/myaccount/VendorSwapModal";
import RefundRequestModal from "@/components/myaccount/RefundRequestModal";
import { useBookingStore, type Booking } from "@/store/bookingStore";

export default function BookingHistory() {
  const { bookings, isLoading, error: storeError, fetchUserBookings: storeFetchBookings } = useBookingStore();
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Vendor swapping state
  const [swappingService, setSwappingService] = useState<{ bookingId: string, service: string } | null>(null);
  const [selectedNewVendor, setSelectedNewVendor] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    bookingId: string;
    service: 'decorator' | 'videographer' | 'dj';
    currentVendorId?: string;
  }>({ isOpen: false, bookingId: "", service: "decorator" });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean, type: 'single' | 'all', bookingId?: string }>({ isOpen: false, type: 'single' });

  const { vendors, fetchVendors } = useVendorStore();


  useEffect(() => {
    storeFetchBookings().catch(() => setError("Failed to load bookings"));
    fetchVendors();
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      const updated = bookings.find(b => (b._id || b.id) === (selectedBooking._id || selectedBooking.id));
      if (updated) setSelectedBooking(updated);
    }
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
        <p className="text-[#A6955C] mt-4 text-sm font-bold uppercase tracking-widest">Loading History...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-md text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#E8DFC9] dark:border-gray-800 rounded-md">
        <SearchX className="w-12 h-12 text-[#A6955C] mb-4 opacity-50" />
        <h3 className="text-xl font-serif text-[#1A1512] dark:text-white mb-2">No Past Bookings</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">You haven't made any bookings with EASCC yet.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "text-green-600 bg-green-500/10 border-green-500/20";
      case "pending": return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      case "cancelled": return "text-red-600 bg-red-500/10 border-red-500/20";
      case "accepted": return "text-green-600 bg-green-500/10 border-green-500/20";
      case "declined": return "text-red-600 bg-red-500/10 border-red-500/20";
      default: return "text-gray-600 bg-gray-500/10 border-gray-500/20";
    }
  };

  const handleSwapSubmit = async (bookingId: string, service: string) => {
    if (!selectedNewVendor) return alert("Please select a vendor");
    setIsSwapping(true);
    try {
      const { ok, data } = await customerBookingAPI.initiateVendorSwap(bookingId, { service, newVendorId: selectedNewVendor, financialChoice: "none" });
      if (ok && data.success) {
        alert("Vendor swap requested successfully!");
        setSwappingService(null);
        setSelectedNewVendor("");
        await storeFetchBookings();
      } else {
        alert(data.message || "Failed to swap vendor");
      }
    } catch (e) {
      alert("An error occurred while swapping vendor.");
    } finally {
      setIsSwapping(false);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    const eventDate = new Date(booking.date);
    const diffTime = eventDate.getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
      alert("This event is less than 2 days away and cannot be cancelled online. Please contact the hotel directly.");
      return;
    }
    
    setSelectedBookingForCancel(booking);
    setShowCancelModal(true);
  };

  const renderVendorRow = (bookingId: string, serviceKey: string, vendorData: any, icon: any, label: string, categoryMatcher: string) => {
    const bookingObj = bookings.find(b => b._id === bookingId);
    const canModifyVendors = bookingObj && !["completed", "cancelled"].includes(bookingObj.status.toLowerCase());
    const isSwappingThis = swappingService?.bookingId === bookingId && swappingService?.service === serviceKey;
    const hasVendor = vendorData && typeof vendorData === 'object' && vendorData.vendorId && vendorData.vendorId !== "none";

    const availableReplacements = vendors.filter(v => v.category === categoryMatcher && (!hasVendor || (v.id !== vendorData.vendorId && v.userId !== vendorData.vendorId)));

    if (!hasVendor) {
      return (
        <div className="flex flex-col text-sm py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">{icon} {label}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400">Not Required</span>
              {canModifyVendors && !isSwappingThis && (
                <button 
                  onClick={() => setSwappingService({ bookingId, service: serviceKey })}
                  className="text-[10px] uppercase font-bold tracking-wider text-[#C9A84C] hover:text-[#B08D2C]"
                >
                  Add Vendor
                </button>
              )}
            </div>
          </div>
          {isSwappingThis && (
            <div className="mt-3 pl-6 bg-gray-50 dark:bg-[#1A1A1A] p-3 rounded-sm border border-[#E8DFC9] dark:border-gray-800">
              <p className="text-[10px] uppercase font-bold text-[#A6955C] mb-2">Select Vendor</p>
              <select 
                value={selectedNewVendor}
                onChange={(e) => setSelectedNewVendor(e.target.value)}
                className="w-full text-xs p-1.5 border border-[#D4C9A8] dark:border-gray-700 bg-white dark:bg-[#111111] mb-2 text-[#1A1512] dark:text-white"
              >
                <option value="">-- Choose Vendor --</option>
                {availableReplacements.map(rv => (
                  <option key={rv.id} value={rv.id}>{rv.name} ({rv.priceLevelLabel})</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setSwappingService(null)}
                  className="text-[10px] uppercase font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSwapSubmit(bookingId, serviceKey)}
                  disabled={isSwapping}
                  className="text-[10px] uppercase font-bold text-white bg-[#C69C6D] hover:bg-[#B58B5C] px-2 py-1 rounded-sm disabled:opacity-50"
                >
                  {isSwapping ? "Adding..." : "Add Vendor"}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    const vDetails = vendors.find(v => v.userId === vendorData.vendorId || v.id === vendorData.vendorId);
    const isPendingOrDeclined = vendorData.status.toLowerCase() === "pending" || vendorData.status.toLowerCase() === "declined";

    return (
      <div className="flex flex-col text-sm py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 font-medium text-[#1A1512] dark:text-white">
            {icon} {label}
          </div>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm border ${getStatusColor(vendorData.status)}`}>
            {vendorData.status}
          </span>
        </div>
        
        <div className="pl-6 space-y-1">
          <p className="text-xs font-medium text-[#C69C6D]">{vDetails ? vDetails.name : "Assigned Vendor"}</p>
          <div className="flex items-center gap-4 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> {vDetails?.contactEmail || (vDetails ? `${vDetails.id}@eascc.com` : "contact@eascc.com")}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> {vDetails?.contactPhone || "+94 77 000 0000"}
            </span>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => alert(`A design change request has been sent to ${vDetails ? vDetails.name : "the vendor"}. They will contact you shortly.`)}
              className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#A6955C] hover:text-[#C69C6D] transition-colors"
            >
              <MessageSquare className="w-3 h-3" /> Request Change
            </button>
            
            {canModifyVendors && (isPendingOrDeclined || vendorData.status.toLowerCase() === "rejected") && !isSwappingThis && (
              <>
                <button 
                  onClick={() => setSwappingService({ bookingId, service: serviceKey })}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#C9A84C] hover:text-[#B08D2C] transition-colors ml-auto"
                >
                  <RefreshCw className="w-3 h-3" /> Change
                </button>
                <button 
                  onClick={async () => {
                    if (confirm(`Are you sure you want to remove this ${serviceKey} vendor?`)) {
                      setIsSwapping(true);
                      try {
                        const { ok, data } = await customerBookingAPI.initiateVendorSwap(bookingId, { service: serviceKey, newVendorId: "none", financialChoice: "none" });
                        if (ok && data.success) {
                          alert("Vendor removed successfully!");
                          await storeFetchBookings();
                        } else {
                          alert(data.message || "Failed to remove vendor");
                        }
                      } catch (e) {
                        alert("Error removing vendor");
                      } finally {
                        setIsSwapping(false);
                      }
                    }
                  }}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-red-500 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </>
            )}
            
            {!canModifyVendors && isPendingOrDeclined && !isSwappingThis && (
              <button 
                onClick={() => setSwappingService({ bookingId, service: serviceKey })}
                className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-red-500 hover:text-red-400 transition-colors ml-auto"
              >
                <RefreshCw className="w-3 h-3" /> Change Vendor
              </button>
            )}
          </div>
        </div>

        {isSwappingThis && (
          <div className="mt-3 pl-6 bg-gray-50 dark:bg-[#1A1A1A] p-3 rounded-sm border border-[#E8DFC9] dark:border-gray-800">
            <p className="text-[10px] uppercase font-bold text-[#A6955C] mb-2">Select Replacement Vendor</p>
            <select 
              value={selectedNewVendor}
              onChange={(e) => setSelectedNewVendor(e.target.value)}
              className="w-full text-xs p-1.5 border border-[#D4C9A8] dark:border-gray-700 bg-white dark:bg-[#111111] mb-2 text-[#1A1512] dark:text-white"
            >
              <option value="">-- Choose New Vendor --</option>
              {availableReplacements.map(rv => (
                <option key={rv.id} value={rv.id}>{rv.name} ({rv.priceLevelLabel})</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setSwappingService(null)}
                className="text-[10px] uppercase font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSwapSubmit(bookingId, serviceKey)}
                disabled={isSwapping}
                className="text-[10px] uppercase font-bold text-white bg-[#C69C6D] hover:bg-[#B58B5C] px-2 py-1 rounded-sm disabled:opacity-50"
              >
                {isSwapping ? "Swapping..." : "Confirm Swap"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      {selectedBooking ? (
        <BookingDetailView 
          booking={selectedBooking} 
          onBack={() => setSelectedBooking(null)} 
          onCancelBooking={(bookingId) => handleCancelBooking(selectedBooking)}
          onAddVendor={(bookingId, serviceKey) => {
            setSwapModalState({
              isOpen: true,
              bookingId,
              service: serviceKey as any,
              currentVendorId: (selectedBooking?.vendors?.[serviceKey as keyof typeof selectedBooking.vendors] as any)?.vendorId || undefined
            });
          }}
        />
      ) : (
      <>
      {bookings.length > 0 && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setDeleteConfirmModal({ isOpen: true, type: 'all' })}
            className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            Clear All History
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {bookings.map((booking, index) => {
        const pricing = booking.pricingBreakdown || {};
        const hallPrice = (pricing.hallFixedPrice || 0) + (pricing.extraHoursPremium || 0) + (pricing.foodCost || 0) + (pricing.timeslotPremium || 0) + (pricing.customMenuSurcharge || 0);
        
        const getVendorAdvanceInfoLocal = (category: string) => {
          const cost = (pricing as any)[`${category}Cost`] || 0;
          if (cost === 0) return 0;
          const vendorId = booking.vendors?.[category as keyof typeof booking.vendors]?.vendorId;
          if (!vendorId || vendorId === "none" || vendorId === "custom_preference") return 0;
          const v = vendors.find(v => v.id === vendorId || (v as any)._id === vendorId || v.userId === vendorId);
          if (!v) return 0;
          const percentage = v.advancePaymentPercentage || 0;
          return Math.round(cost * (percentage / 100));
        };

        const calculatedAdvance = Math.round(hallPrice * 0.30) 
          + getVendorAdvanceInfoLocal("decorator")
          + getVendorAdvanceInfoLocal("dj")
          + getVendorAdvanceInfoLocal("videographer")
          + getVendorAdvanceInfoLocal("photographer")
          + getVendorAdvanceInfoLocal("cake")
          + getVendorAdvanceInfoLocal("florist");

        const actualDepositPaid = (booking.depositAmount || 0) > 0 ? calculatedAdvance : 0;
        const actualTotalPaid = actualDepositPaid + (booking.balanceAmount || 0);

        return (
        <motion.div 
          key={booking._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          {/* Header Row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">Booking #{booking._id?.slice(-6).toUpperCase()}</span>
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: true, type: 'single', bookingId: booking._id })}
                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                booking.status === "Confirmed" || booking.status === "Completed" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : 
                booking.status === "Cancelled" || booking.status === "Rejected" ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800" : 
                "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {booking.status === "CancellationRequested" ? "Cancellation Pending" : booking.status === "Pending Hall Confirmation" ? "Awaiting Hall" : booking.status}
            </span>
          </div>

          {/* Event Details */}
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-serif text-[#1A1512] dark:text-white mb-2 leading-tight">
              {booking.eventType || "Event"}
            </h3>
            <div className="space-y-1.5">
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A84C]" /> 
                {new Date(booking.date).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} {booking.timeslot && `• ${booking.timeslot}`}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#C9A84C]/10 text-[#C9A84C]">📍</span> 
                EASCCA Conference Centre
              </p>
            </div>
          </div>

          {/* Services List */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gray-100 dark:border-zinc-800">
            <p className="text-[10px] font-bold text-[#A6955C] uppercase tracking-wider mb-1">
              {(() => {
                const svcs = ["Hall"];
                if (booking.vendors?.decorator?.status && booking.vendors.decorator.status !== "NotRequired") svcs.push("Decorator");
                if (booking.vendors?.videographer?.status && booking.vendors.videographer.status !== "NotRequired") svcs.push("Videographer");
                if (booking.vendors?.dj?.status && booking.vendors.dj.status !== "NotRequired") svcs.push("DJ");
                return `${svcs.length} Services`;
              })()}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
              {(() => {
                const svcs = ["Hall"];
                if (booking.vendors?.decorator?.status && booking.vendors.decorator.status !== "NotRequired") svcs.push("Decorator");
                if (booking.vendors?.videographer?.status && booking.vendors.videographer.status !== "NotRequired") svcs.push("Videographer");
                if (booking.vendors?.dj?.status && booking.vendors.dj.status !== "NotRequired") svcs.push("DJ");
                return svcs.join(" • ");
              })()}
            </p>
          </div>

          {/* Financials */}
          <div className="space-y-1.5 mb-6 text-xs">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Total</span>
              <span className="font-medium text-[#1A1512] dark:text-white">LKR {(booking.totalCost || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Total Paid</span>
              <span className="font-medium text-emerald-600">LKR {actualTotalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 font-bold border-t border-gray-100 dark:border-zinc-800 pt-3 mt-3">
              <span className="uppercase tracking-widest text-xs mt-0.5">Balance</span>
              <span className="text-[#C9A84C] text-base">LKR {Math.max(0, (booking.totalCost || 0) - actualTotalPaid).toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <button 
            onClick={() => setSelectedBooking(booking)}
            className="w-full py-3 bg-transparent border-2 border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#2C1E14] dark:hover:text-black rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
          >
            View Booking
          </button>

        </motion.div>
        );
      })}
      </div>
      </>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirmModal({ isOpen: false, type: 'single' })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#1A1512] dark:text-white mb-3">
                {deleteConfirmModal.type === 'all' ? 'Clear Booking History?' : 'Remove from History?'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
                {deleteConfirmModal.type === 'all' 
                  ? 'Are you sure you want to remove all bookings from your history? This action cannot be undone, but will not cancel any active bookings.' 
                  : 'Are you sure you want to remove this booking from your history? It will no longer be visible here.'}
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirmModal({ isOpen: false, type: 'single' })}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#1A1512] dark:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (deleteConfirmModal.type === 'all') {
                      const res = await customerBookingAPI.clearBookingHistory();
                      if (res.ok && res.data?.success) {
                        await storeFetchBookings();
                      }
                    } else if (deleteConfirmModal.bookingId) {
                      const res = await customerBookingAPI.deleteBookingHistory(deleteConfirmModal.bookingId);
                      if (res.ok && res.data?.success) {
                        await storeFetchBookings();
                      }
                    }
                    setDeleteConfirmModal({ isOpen: false, type: 'single' });
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {swapModalState.isOpen && (
        <VendorSwapModal
          isOpen={swapModalState.isOpen}
          onClose={async () => {
            setSwapModalState({ ...swapModalState, isOpen: false });
            await storeFetchBookings();
          }}
          bookingId={swapModalState.bookingId}
          serviceCategory={swapModalState.service}
          currentVendorId={swapModalState.currentVendorId}
        />
      )}

      {showCancelModal && selectedBookingForCancel && (
        <RefundRequestModal
          booking={selectedBookingForCancel}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedBookingForCancel(null);
          }}
          onSuccess={async () => {
            await storeFetchBookings();
          }}
        />
      )}
    </div>
  );
}
