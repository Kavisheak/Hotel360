import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, CalendarDays, Clock, Users, Package, 
  MapPin, Phone, Mail, User, Receipt,
  CheckCircle2, AlertCircle, CreditCard,
  Music, Camera, Paintbrush
} from "lucide-react";
import type { Booking } from "@/store/bookingStore";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  confirmed: { bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  completed: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  pending: { bg: "bg-amber-50 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  rejected: { bg: "bg-red-50 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
};

export default function BookingDetailsModal({ isOpen, onClose, booking }: BookingDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!mounted || !isOpen || !booking) return null;

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();
  const statusKey = booking.status ? booking.status.toLowerCase() : "pending";
  const status = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;

  const createdDate = new Date(booking.createdAt || new Date());
  
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#FDFBF7] dark:bg-[#111111] border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 border-b border-[#E8DFC9] dark:border-gray-800 p-6 flex items-start justify-between bg-white dark:bg-[#1A1A1A] z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm border ${status.bg} ${status.text} ${status.border}`}>
                  {booking.status}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-sm">
                  Ref: {booking.bookingRef || (booking._id ? booking._id.slice(-6) : "N/A")}
                </span>
              </div>
              <h2 className="text-2xl font-serif text-[#1A1512] dark:text-white">
                {booking.eventName || booking.eventType || "Event Booking"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Booked on: {createdDate.toLocaleDateString()} at {createdDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#FAF6EE] dark:hover:bg-white/5 text-gray-500 hover:text-[#1A1512] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Left Column (Event Details) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Event Info Card */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Event Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Date</p>
                      <p className="font-medium text-[#1A1512] dark:text-white flex items-center gap-2">
                        {new Date(booking.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Timeslot</p>
                      <p className="font-medium text-[#1A1512] dark:text-white capitalize">{booking.timeslot}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Duration</p>
                      <p className="font-medium text-[#1A1512] dark:text-white">
                        {booking.durationHours} Hours {booking.extraHours > 0 && <span className="text-[#C9A84C]">(+{booking.extraHours} Extra)</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Guests</p>
                      <p className="font-medium text-[#1A1512] dark:text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" /> {booking.guests}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Venue</p>
                      <p className="font-medium text-[#1A1512] dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" /> Grand Ballroom, EASCC
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package & Menu */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Package & Menu
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Package</p>
                      <p className="font-medium text-[#1A1512] dark:text-white">{booking.packageName || booking.package || "Custom"}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Menu Type</p>
                      <p className="font-medium text-[#1A1512] dark:text-white capitalize">{booking.menuType || "Standard"}</p>
                    </div>
                    {booking.customMenuItems && booking.customMenuItems.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Custom Menu Items</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.customMenuItems.map((item, idx) => (
                            <span key={idx} className="bg-[#FAF6EE] dark:bg-white/5 border border-[#E8DFC9] dark:border-white/10 px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vendors */}
                {booking.vendors && (
                  <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Service Vendors
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: "decorator", icon: Paintbrush, label: "Decorator" },
                        { key: "dj", icon: Music, label: "DJ & Entertainment" },
                        { key: "videographer", icon: Camera, label: "Photography & Videography" }
                      ].map(({ key, icon: Icon, label }) => {
                        const vendor = booking.vendors[key as keyof typeof booking.vendors] as any;
                        if (!vendor || vendor.status === "NotRequired") return null;
                        
                        const vStatus = vendor.status || "Pending";
                        const isDeclined = vStatus === "Declined";
                        const isAccepted = vStatus === "Accepted";
                        
                        return (
                          <div key={key} className={`flex items-center justify-between p-3 rounded-md border ${isDeclined ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-gray-50 border-gray-100 dark:bg-[#222] dark:border-gray-800'}`}>
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${isDeclined ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-white dark:bg-[#111] shadow-sm text-gray-500'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#1A1512] dark:text-gray-200">{label}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{vendor.packageName || "Custom Service"}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] uppercase tracking-widest font-bold ${isDeclined ? 'text-red-600' : isAccepted ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {vStatus}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {(!booking.vendors.decorator || booking.vendors.decorator.status === "NotRequired") && 
                       (!booking.vendors.dj || booking.vendors.dj.status === "NotRequired") && 
                       (!booking.vendors.videographer || booking.vendors.videographer.status === "NotRequired") && (
                        <p className="text-sm text-gray-500 italic">No external vendors selected for this event.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Client & Pricing) */}
              <div className="space-y-6">
                
                {/* Client Info */}
                <div className="bg-white dark:bg-[#1A1A1A]/50 border border-[#E8DFC9] dark:border-gray-800 rounded-lg p-5 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Contact Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Client Name</p>
                        <p className="font-medium text-[#1A1512] dark:text-gray-200">{booking.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Email</p>
                        <p className="font-medium text-[#1A1512] dark:text-gray-200 break-all">{booking.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Phone</p>
                        <p className="font-medium text-[#1A1512] dark:text-gray-200">{booking.phone}</p>
                        {booking.alternativePhone && <p className="text-xs text-gray-500 mt-0.5">{booking.alternativePhone} (Alt)</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-[#FAF6EE] dark:bg-[#151515] border border-[#E8DFC9] dark:border-[#C9A84C]/20 rounded-lg p-5 shadow-[0_4px_20px_-4px_rgba(201,168,76,0.1)]">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#C9A84C] mb-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4" /> Pricing Summary
                  </h3>
                  
                  {booking.pricingBreakdown && (
                    <div className="space-y-2.5 text-xs border-b border-[#E8DFC9] dark:border-gray-800 pb-4 mb-4">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Hall Rental</span>
                        <span className="font-medium">{formatCurrency(booking.pricingBreakdown.hallFixedPrice)}</span>
                      </div>
                      {(booking.pricingBreakdown.extraHoursPremium || 0) > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Extra Hours Premium</span>
                          <span className="font-medium">{formatCurrency(booking.pricingBreakdown.extraHoursPremium)}</span>
                        </div>
                      )}
                      {(booking.pricingBreakdown.timeslotPremium || 0) > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Timeslot Premium</span>
                          <span className="font-medium">{formatCurrency(booking.pricingBreakdown.timeslotPremium)}</span>
                        </div>
                      )}
                      {(booking.pricingBreakdown.foodCost || 0) > 0 && (
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Food & Catering</span>
                          <span className="font-medium">{formatCurrency(booking.pricingBreakdown.foodCost)}</span>
                        </div>
                      )}
                      
                      {/* Vendor costs if they exist */}
                      {((booking.pricingBreakdown.decoratorCost || 0) + (booking.pricingBreakdown.djCost || 0) + (booking.pricingBreakdown.videographerCost || 0)) > 0 && (
                        <div className="pt-2 mt-2 border-t border-dashed border-[#E8DFC9] dark:border-gray-800">
                          {(booking.pricingBreakdown.decoratorCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500">
                              <span>Decorator</span>
                              <span>{formatCurrency(booking.pricingBreakdown.decoratorCost)}</span>
                            </div>
                          )}
                          {(booking.pricingBreakdown.djCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 mt-1">
                              <span>DJ / Entertainment</span>
                              <span>{formatCurrency(booking.pricingBreakdown.djCost)}</span>
                            </div>
                          )}
                          {(booking.pricingBreakdown.videographerCost || 0) > 0 && (
                            <div className="flex justify-between text-gray-500 mt-1">
                              <span>Photography</span>
                              <span>{formatCurrency(booking.pricingBreakdown.videographerCost)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-[#1A1512] dark:text-white">Total Amount</span>
                      <span className="font-serif font-bold text-[#1A1512] dark:text-white text-base">{formatCurrency(booking.totalCost)}</span>
                    </div>
                    
                    <div className="bg-white/50 dark:bg-black/20 p-3 rounded border border-[#E8DFC9]/50 dark:border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Deposit Paid</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(booking.depositAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-[#E8DFC9] dark:border-white/5">
                        <span className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">Balance Due</span>
                        <span className="font-bold text-red-500">{formatCurrency(booking.balanceAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {booking.balanceAmount > 0 && booking.status !== "Completed" && booking.status !== "Cancelled" && (
                    <button className="w-full mt-4 bg-[#C9A84C] text-white py-2.5 rounded text-[10px] uppercase tracking-widest font-bold hover:bg-[#B58A59] transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <CreditCard className="w-4 h-4" /> Pay Balance
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
