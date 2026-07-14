"use client";

import React, { useEffect, useState } from "react";
import { customerBookingAPI } from "@/lib/api";
import { Loader2, Calendar, Clock, Users, MapPin, SearchX, ChevronDown, ChevronUp, Receipt, Package, Music, Video, Palette, Phone, Mail, RefreshCw, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVendorStore } from "@/store/vendorStore";

interface Booking {
  _id: string;
  eventName: string;
  eventType: string;
  date: string;
  timeslot: string;
  guests: number;
  status: string;
  totalCost: number;
  packageName?: string;
  menuType?: string;
  paymentMethod?: string;
  depositAmount?: number;
  balanceAmount?: number;
  bookingCredit?: number;
  vendors?: {
    decorator?: { status: string };
    dj?: { status: string };
    videographer?: { status: string };
  };
  pricingBreakdown?: {
    hallFixedPrice: number;
    foodCost: number;
    decoratorCost: number;
    djCost: number;
    videographerCost: number;
  };
}

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Vendor swapping state
  const [swappingService, setSwappingService] = useState<{ bookingId: string, service: string } | null>(null);
  const [selectedNewVendor, setSelectedNewVendor] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);

  const { vendors, fetchVendors } = useVendorStore();

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const fetchBookings = async () => {
    try {
      const { ok, data } = await customerBookingAPI.getMyBookings();
      if (ok && data.success) {
        setBookings(data.data || []);
      } else {
        setError(data.message || "Failed to load bookings");
      }
    } catch (err: any) {
      setError("Error fetching booking history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchVendors();
  }, []);

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
      const { ok, data } = await customerBookingAPI.swapVendor(bookingId, { service, newVendorId: selectedNewVendor });
      if (ok && data.success) {
        alert("Vendor swap requested successfully!");
        setSwappingService(null);
        setSelectedNewVendor("");
        await fetchBookings();
      } else {
        alert(data.message || "Failed to swap vendor");
      }
    } catch (e) {
      alert("An error occurred while swapping vendor.");
    } finally {
      setIsSwapping(false);
    }
  };

  const handleCancelClick = async (booking: Booking) => {
    const today = new Date();
    const eventDate = new Date(booking.date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let confirmMsg = "";
    if (diffDays < 14) {
      alert("This event is less than 14 days away and cannot be cancelled online. Please contact the hotel directly.");
      return;
    } else if (diffDays >= 14 && diffDays <= 30) {
      confirmMsg = `Your event is ${diffDays} days away. Cancellation requires review and approval by the Hotel Manager. Would you like to submit a cancellation request?`;
    } else {
      confirmMsg = `Your event is ${diffDays} days away. Are you sure you want to cancel this booking? This will cancel all hall and vendor allocations immediately.`;
    }

    if (confirm(confirmMsg)) {
      try {
        const res = await customerBookingAPI.cancelBooking(booking._id);
        const data = res.data;
        if (res.ok && data.success) {
          alert(data.message || "Action processed successfully!");
          await fetchBookings();
        } else {
          alert(data.message || "Failed to process cancellation request.");
        }
      } catch (e) {
        alert("An error occurred while processing cancellation.");
      }
    }
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
                        const { ok, data } = await customerBookingAPI.swapVendor(bookingId, { service: serviceKey, newVendorId: "none" });
                        if (ok && data.success) {
                          alert("Vendor removed successfully!");
                          await fetchBookings();
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
    <div className="space-y-6 animate-fadeIn">
      {bookings.map((booking, index) => (
        <motion.div 
          key={booking._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
        >
          {/* Decorative left border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C69C6D]"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-serif text-[#1A1512] dark:text-white">
                  {booking.eventName}
                </h3>
                <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-sm border ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-[#A6955C] font-medium tracking-wide uppercase mb-4">
                {booking.eventType}
              </p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 text-[#C69C6D]" />
                  <span>{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-[#C69C6D]" />
                  <span>{booking.timeslot}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 text-[#C69C6D]" />
                  <span>{booking.guests} Guests</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-[#C69C6D]" />
                  <span>EASCC Grand Hall</span>
                </div>
              </div>
            </div>
            
            <div className="md:text-right mt-4 md:mt-0 pt-4 md:pt-0 border-t border-[#E8DFC9] dark:border-gray-800 md:border-0 w-full md:w-auto flex flex-col items-start md:items-end">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Total Cost</p>
              <p className="text-2xl font-serif text-[#1A1512] dark:text-white mb-4">
                LKR {booking.totalCost ? booking.totalCost.toLocaleString() : "N/A"}
              </p>
              <button 
                onClick={() => toggleExpand(booking._id)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C69C6D] hover:text-[#A6955C] transition-colors"
              >
                {expandedId === booking._id ? "Hide Details" : "View Details"}
                {expandedId === booking._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expandedId === booking._id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-dashed border-[#E8DFC9] dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: Package & Setup */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#A6955C]">Package & Services</h4>
                    
                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-[#1A1A1A] p-3 rounded-sm">
                      <Package className="w-4 h-4 text-[#C69C6D] mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Selected Package</p>
                        <p className="text-sm font-medium text-[#1A1512] dark:text-white capitalize">{booking.packageName || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-[#1A1A1A] p-3 rounded-sm">
                      <Receipt className="w-4 h-4 text-[#C69C6D] mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Food Menu & Payment</p>
                        <p className="text-sm font-medium text-[#1A1512] dark:text-white capitalize">
                          {booking.menuType || "N/A"} Menu • {booking.paymentMethod || "Card"}
                        </p>
                      </div>
                    </div>

                    {booking.vendors && (
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 border-b border-gray-100 dark:border-gray-800 pb-2">Assigned Vendors</p>
                        <div className="space-y-0">
                          {renderVendorRow(booking._id, "decorator", booking.vendors.decorator, <Palette className="w-3.5 h-3.5 text-gray-400" />, "Decorator", "decorators")}
                          {renderVendorRow(booking._id, "dj", booking.vendors.dj, <Music className="w-3.5 h-3.5 text-gray-400" />, "DJ Artist", "djs")}
                          {renderVendorRow(booking._id, "videographer", booking.vendors.videographer, <Video className="w-3.5 h-3.5 text-gray-400" />, "Videographer", "videographers")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Pricing Breakdown */}
                  {booking.pricingBreakdown && (
                    <div className="space-y-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-[2px] text-[#A6955C]">Pricing Breakdown</h4>
                      <div className="bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-sm space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Hall Fixed Price</span>
                          <span className="font-medium text-[#1A1512] dark:text-white">LKR {booking.pricingBreakdown.hallFixedPrice?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Food & Catering</span>
                          <span className="font-medium text-[#1A1512] dark:text-white">LKR {booking.pricingBreakdown.foodCost?.toLocaleString() || 0}</span>
                        </div>
                        {booking.pricingBreakdown.decoratorCost > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Decorator</span>
                            <span className="font-medium text-[#1A1512] dark:text-white">LKR {booking.pricingBreakdown.decoratorCost.toLocaleString()}</span>
                          </div>
                        )}
                        {booking.pricingBreakdown.djCost > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">DJ Artist</span>
                            <span className="font-medium text-[#1A1512] dark:text-white">LKR {booking.pricingBreakdown.djCost.toLocaleString()}</span>
                          </div>
                        )}
                        {booking.pricingBreakdown.videographerCost > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Videographer</span>
                            <span className="font-medium text-[#1A1512] dark:text-white">LKR {booking.pricingBreakdown.videographerCost.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="border-t border-[#E8DFC9] dark:border-gray-800 pt-3 mt-3 flex justify-between font-serif text-lg">
                          <span className="text-[#1A1512] dark:text-white">Total</span>
                          <span className="text-[#C69C6D]">LKR {booking.totalCost?.toLocaleString()}</span>
                        </div>
                        
                        <div className="pt-3 border-t border-dashed border-[#E8DFC9] dark:border-gray-800 text-xs space-y-1.5 text-gray-500 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Deposit (30%):</span>
                            <span className={booking.depositAmount && booking.depositAmount > 0 ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                              {booking.depositAmount && booking.depositAmount > 0 
                                ? `Paid: LKR ${booking.depositAmount.toLocaleString()}` 
                                : `Pending: LKR ${(booking.totalCost * 0.3).toLocaleString()}`
                              }
                            </span>
                          </div>
                          
                          {booking.bookingCredit && booking.bookingCredit > 0 ? (
                            <div className="flex justify-between font-bold text-emerald-600">
                              <span>Booking Credit:</span>
                              <span>LKR {booking.bookingCredit.toLocaleString()}</span>
                            </div>
                          ) : null}

                          <div className="flex justify-between">
                            <span>Remaining Balance:</span>
                            <span className={booking.balanceAmount && booking.balanceAmount > 0 ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                              {booking.balanceAmount && booking.balanceAmount > 0 
                                ? `Paid: LKR ${booking.balanceAmount.toLocaleString()}` 
                                : `Pending: LKR ${Math.max(0, booking.totalCost - (booking.depositAmount || 0) - (booking.balanceAmount || 0) - (booking.bookingCredit || 0)).toLocaleString()}`
                              }
                            </span>
                          </div>

                          {booking.status !== "Completed" && booking.status !== "Cancelled" && booking.status !== "CancellationRequested" && (
                            <button 
                              onClick={() => handleCancelClick(booking)}
                              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-[10px] uppercase tracking-widest font-bold transition-colors shadow-sm text-center"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
