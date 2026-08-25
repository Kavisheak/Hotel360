'use client';
import React, { useState, useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { useToastStore } from '@/store/toastStore';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, Building2, CalendarDays, Clock, CheckCircle2, AlertCircle, RefreshCw, Star, X, Users, Trash2 } from 'lucide-react';
import { bookingAPI, staffAPI, vendorAPI } from '../../../lib/api';

const BookingsMain = ({ bookingId }: { bookingId?: string }) => {
  const [isClient, setIsClient] = useState(false);
  const { addToast } = useToastStore();
  const [dbBooking, setDbBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Hall unavailable');
  const [rejectExplanation, setRejectExplanation] = useState('');
  
  // Payment Modal States
  const [payMethod, setPayMethod] = useState('Bank Transfer');
  const [payRef, setPayRef] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payNotes, setPayNotes] = useState('');
  const [payAmount, setPayAmount] = useState<number | ''>('');
  
  // Vendor Management Modal States
  const [vendorToManage, setVendorToManage] = useState<{cat: string, data: any} | null>(null);
  const [availableVendors, setAvailableVendors] = useState<any[]>([]);
  const [selectedReplacementId, setSelectedReplacementId] = useState('');
  const [selectedVendorProfile, setSelectedVendorProfile] = useState<any>(null);
  const [selectedReplacementPackage, setSelectedReplacementPackage] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundModalState, setRefundModalState] = useState<{isOpen: boolean, cat: string, amount: number}>({isOpen: false, cat: '', amount: 0});
  
  const fetchBooking = async () => {
    if (!bookingId) {
      setDbBooking(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await bookingAPI.getBookingById(bookingId);
      if (res.ok && res.data?.data) {
        const backendData = res.data.data;
        setDbBooking({
          ...backendData,
          clientEmail: backendData.customerEmail || backendData.clientId?.email || backendData.email || "",
          clientPhone: backendData.customerPhone || backendData.clientId?.phone || backendData.phone || "",
          id: backendData.bookingRef || backendData._id,
          date: new Date(backendData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          rawDate: backendData.date,
          packageName: backendData.packageId?.name || backendData.packageName || "Custom Package",
          pricingBreakdown: backendData.pricingBreakdown || {}
        });
      }
    } catch (err) {
      console.error("Failed to fetch booking", err);
    } finally {
      setIsLoading(false);
    }
  };

  const [globalVendors, setGlobalVendors] = useState<any[]>([]);
  
  const fetchAllVendors = async () => {
    try {
      const res = await staffAPI.getAllVendors();
      if (res.ok && res.data?.data) {
        setGlobalVendors(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch vendors", e);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchBooking();
    fetchAllVendors();
  }, [bookingId]);

  if (!isClient || isLoading) return <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center">Loading...</div>;

  const booking = dbBooking;

  if (!booking) {
    return (
      <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1] p-10 text-center items-center justify-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Booking Not Found</h2>
        <Link href="/hotel-manager/bookings" className="text-[#7C6A2E] underline font-bold tracking-widest text-[10px] uppercase">Return to Bookings</Link>
      </div>
    );
  }

  // --- Computed Properties ---
  const isPendingManager = ['Pending', 'Pending Hall Confirmation', 'DEPOSIT_PAID'].includes(booking.status);
  
  const hallCost = booking.pricingBreakdown?.hallFixedPrice ?? 300000;
  const foodCost = booking.pricingBreakdown?.foodCost ?? (booking.pricingBreakdown?.foodPerHead ? (booking.pricingBreakdown.foodPerHead * (booking.guests || 250)) : 120000);
  const venueTotal = hallCost + foodCost;
  const venueAdvance = venueTotal * 0.3;

  const vendorCats = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
  const activeVendors = vendorCats.map(cat => ({ cat, data: booking.vendors?.[cat] })).filter(v => v.data && ((v.data.vendorId && v.data.vendorId !== "none") || ["Refund Pending", "Refunded", "Removed"].includes(v.data.status)));
  
  const vendorsTotal = activeVendors.reduce((sum, v) => {
    const isInactive = ["Declined", "Refund Pending", "Refunded", "Removed", "NotRequired"].includes(v.data.status);
    const cost = v.data.cost ?? booking.pricingBreakdown?.[`${v.cat}Cost`] ?? 0;
    return sum + (isInactive ? 0 : cost);
  }, 0);
  const getVendorAdvanceInfo = (cat: string) => {
    const cost = booking.pricingBreakdown?.[`${cat}Cost`] || 0;
    if (cost === 0) return 0;
    const vendorData = booking.vendors?.[cat];
    if (!vendorData || !vendorData.vendorId || vendorData.vendorId === "none" || vendorData.vendorId === "custom_preference") return 0;
    
    // vendorId could be populated or just a string
    const vId = typeof vendorData.vendorId === 'object' ? (vendorData.vendorId._id || vendorData.vendorId.id) : vendorData.vendorId;
    
    const v = globalVendors.find(gv => gv.userId === vId || gv.id === vId || gv._id === vId);
    const pct = v?.advancePaymentPercentage || 20;
    return Math.round(cost * (pct / 100));
  };

  const vendorsAdvance = activeVendors.reduce((sum, v) => {
    const isInactive = ["Declined", "Refund Pending", "Refunded", "Removed", "NotRequired"].includes(v.data.status);
    return sum + (isInactive ? 0 : (v.data.advancePaid ?? getVendorAdvanceInfo(v.cat)));
  }, 0);
  
  const totalCost = venueTotal + vendorsTotal;
  const totalAdvanceReq = booking.depositAmount ?? (venueAdvance + vendorsAdvance);
  
  let totalPaid = booking.depositAmount || 0;
  if (booking.paymentHistory && booking.paymentHistory.length > 0) {
    totalPaid = booking.paymentHistory.reduce((sum: number, p: any) => sum + (p.status === 'Paid' ? p.amount : 0), 0);
  } else {
    totalPaid = (booking.depositAmount || 0) + (booking.balanceAmount || 0);
  }
  
  let refundRequestedAmount = 0;
  let refundedAmount = 0;
  
  activeVendors.forEach(v => {
    if (v.data.status === "Refund Pending") {
      refundRequestedAmount += v.data.refundRequestedAmount || 0;
    } else if (v.data.status === "Refunded") {
      refundedAmount += v.data.refundRequestedAmount || 0;
    }
  });
  
  const netPaid = totalPaid - refundedAmount;
  const remainingBalance = Math.max(0, totalCost - netPaid);
  
  const getColomboDateStr = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
  const eventStr = getColomboDateStr(new Date(booking.rawDate));
  const dEvent = new Date(eventStr + 'T00:00:00Z');
  const dBalanceDue = new Date(dEvent.getTime() - (7 * 24 * 60 * 60 * 1000));
  const balanceDueStr = dBalanceDue.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Balance payable condition: Hall confirmed, Vendors accepted (or no vendors), and balance > 0
  const isBalancePayable = (booking.status === 'Confirmed' || booking.status === 'DepositPaid' || booking.status === 'BalancePaid') && remainingBalance > 0 && activeVendors.every(v => v.data.status === 'Accepted' || v.data.status === 'Confirmed');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Pending Hall Confirmation':
        return <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-xs w-fit"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>PENDING MANAGER APPROVAL</div>;
      case 'Confirmed':
        return <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs w-fit"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>CONFIRMED</div>;
      case 'Completed':
        return <div className="flex items-center gap-1.5 text-gray-700 font-bold bg-gray-50 px-3 py-1 rounded-full border border-gray-200 text-xs w-fit"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>COMPLETED</div>;
      case 'Cancelled':
      case 'Rejected':
        return <div className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200 text-xs w-fit"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>CANCELLED</div>;
      default:
        return <div className="flex items-center gap-1.5 text-gray-700 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs w-fit">{status.toUpperCase()}</div>;
    }
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      const res = await bookingAPI.updateBookingStatus(booking._id, { status: 'Confirmed', note: 'Manager Confirmed Booking' });
      if (res.ok) {
        setIsConfirmModalOpen(false);
        fetchBooking();
        addToast({ message: "Booking confirmed successfully.", type: "success" });
      } else {
        addToast({ message: "Failed to confirm booking.", type: "error" });
      }
    } catch (e) {
      console.error(e);
      addToast({ message: "Error confirming booking.", type: "error" });
    }
    setIsProcessing(false);
  };

  const handleRejectBooking = async () => {
    setIsProcessing(true);
    try {
      const reasonText = rejectReason === 'Other' ? rejectExplanation : `${rejectReason}${rejectExplanation ? ` - ${rejectExplanation}` : ''}`;
      const res = await bookingAPI.rejectBooking(booking._id, { 
        reason: 'other',
        note: `Manager Rejected Booking: ${reasonText}` 
      });
      if (res.ok) {
        setIsRejectModalOpen(false);
        fetchBooking();
        addToast({ message: "Booking rejected and refund processed successfully.", type: "success" });
      } else {
        console.error("EXACT ERROR FINDING - Reject Booking Failed Response:", res);
        addToast({ message: `Failed to reject booking: ${res.data?.message || ""}`, type: "error" });
      }
    } catch (e: any) {
      console.error("EXACT ERROR FINDING - Reject Booking Exception:", e);
      addToast({ message: `Error rejecting booking: ${e?.response?.data?.message || e?.message || "Unknown error"}`, type: "error" });
    }
    setIsProcessing(false);
    setIsProcessing(false);
  };

  const handleCompleteBooking = async () => {
    if (!confirm("Are you sure you want to mark this booking as completed? This action cannot be undone.")) {
      return;
    }
    setIsProcessing(true);
    try {
      const res = await bookingAPI.completeBooking(booking._id);
      if (res.ok) {
        fetchBooking();
        addToast({ message: "Booking marked as completed.", type: "success" });
      } else {
        addToast({ message: `Failed to complete booking: ${res.data?.message || ""}`, type: "error" });
      }
    } catch (e: any) {
      addToast({ message: `Error completing booking: ${e?.response?.data?.message || e?.message || "Unknown error"}`, type: "error" });
    }
    setIsProcessing(false);
  };

  const handleRecordPayment = async () => {
    if (!payRef && payMethod !== 'Cash') {
      alert("Please provide a payment reference.");
      return;
    }
    if (!payAmount || Number(payAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (Number(payAmount) > remainingBalance) {
      alert("Amount cannot exceed the remaining balance.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await bookingAPI.recordPayment(booking._id, {
        paymentType: 'partial',
        amount: Number(payAmount),
        method: payMethod,
        reference: payRef,
        notes: payNotes,
      });
      if (res.ok) {
        setIsRecordPaymentModalOpen(false);
        fetchBooking();
        // Reset modal fields
        setPayRef('');
        setPayNotes('');
      } else {
        alert("Failed to record payment.");
      }
    } catch (e) {
      console.error(e);
      alert("Error recording payment.");
    }
    setIsProcessing(false);
  };

  const openManageVendor = async (cat: string, data: any) => {
    setVendorToManage({ cat, data });
    setSelectedReplacementId('');
    setSelectedVendorProfile(null);
    setSelectedReplacementPackage('');
    
    // Fetch available vendors for this category
    try {
      const res = await staffAPI.getAllVendors();
      if (res.ok && res.data?.data) {
        // map cat 'dj' to 'dj_artist'
        const role = cat === 'dj' ? 'dj_artist' : cat;
        const matchingVendors = res.data.data.filter((v: any) => v.role === role && v.isActive && v._id !== data.vendorId?._id);
        setAvailableVendors(matchingVendors);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDropVendor = async () => {
    if (!vendorToManage) return;
    setIsProcessing(true);
    try {
      const res = await bookingAPI.assignArtisans(booking._id, { [`${vendorToManage.cat}Id`]: 'none' });
      if (res.ok) {
        fetchBooking();
        setVendorToManage(null);
      } else {
        alert("Failed to remove vendor.");
      }
    } catch (e) {
      console.error(e);
      alert("Error removing vendor.");
    }
    setIsProcessing(false);
  };

  const handleReplaceVendor = async () => {
    if (!vendorToManage || !selectedReplacementId) return;
    if (selectedVendorProfile?.packages?.length > 0 && !selectedReplacementPackage) {
      alert("Please select a package/design for the new vendor.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const payload: any = { [`${vendorToManage.cat}Id`]: selectedReplacementId };
      if (selectedReplacementPackage) {
        payload[`${vendorToManage.cat}Package`] = selectedReplacementPackage;
      }
      
      const res = await bookingAPI.assignArtisans(booking._id, payload);
      if (res.ok) {
        fetchBooking();
        setVendorToManage(null);
      } else {
        alert("Failed to replace vendor.");
      }
    } catch (e) {
      console.error(e);
      alert("Error replacing vendor.");
    }
    setIsProcessing(false);
  };

  const handleRefund = (itemType: string, amount: number) => {
    setRefundModalState({ isOpen: true, cat: itemType, amount });
  };

  const confirmRefund = async () => {
    const itemType = refundModalState.cat;
    setIsProcessing(true);
    try {
      const res = await apiFetch(`/api/payments/bookings/${booking._id || booking.id}/items/${itemType}/refund`, {
        method: "POST"
      });
      if (res.ok) {
        addToast({ message: "Refund processed successfully.", type: "success" });
        setRefundModalState({ isOpen: false, cat: '', amount: 0 });
        fetchBooking();
      } else {
        alert(res.data?.message || "Failed to process refund.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while processing the refund.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVendorSelect = async (id: string) => {
    setSelectedReplacementId(id);
    setSelectedVendorProfile(null);
    setSelectedReplacementPackage('');
    
    if (id) {
      setIsProcessing(true);
      try {
        const res = await vendorAPI.getVendorById(id);
        if (res.ok && res.data?.data) {
          setSelectedVendorProfile(res.data.data);
          if (res.data.data.packages?.length === 1) {
             setSelectedReplacementPackage(res.data.data.packages[0].name);
          }
        }
      } catch (e) {
         console.error("Failed to load vendor profile", e);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1] pb-20">
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 shadow-sm">
        <Link href="/hotel-manager/bookings" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#7C6A2E] transition-colors">
          <ArrowLeft size={16} /> Back to Bookings
        </Link>
      </header>

      <main className="flex-1 px-4 lg:px-6 py-8 max-w-[1200px] mx-auto w-full">
        {/* Top Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Booking {booking.id}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              {getStatusBadge(booking.status)}
              <span className="font-bold text-[#7C6A2E] bg-[#F3EFE7] px-2 py-0.5 rounded">{booking.eventType}</span>
              <span className="flex items-center gap-1"><CalendarDays size={14}/> {booking.date}</span>
              <span className="flex items-center gap-1"><Users size={14}/> {booking.guests || 250} Guests</span>
              <span className="flex items-center gap-1"><Building2 size={14}/> EASCCA Conference Centre</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN: Info & Controls */}
          <div className="flex-1 space-y-8">
            
            {/* Customer Box */}
            <div className="border border-[#E0D8C3] rounded-xl p-6 bg-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#7C6A2E]"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Customer Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xl font-serif font-bold text-gray-900">{booking.clientName}</p>
                  {booking.nic && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">NIC: {booking.nic}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14} className="text-[#C9A84C]"/> {booking.clientPhone || 'Not provided'}</p>
                    {booking.alternativePhone && <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {booking.alternativePhone}</p>}
                    <p className="text-sm text-gray-600 flex items-center gap-2"><Mail size={14} className="text-[#C9A84C]"/> {booking.clientEmail || 'Not provided'}</p>
                  </div>
                  
                  {booking.billingAddress && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Billing Address</p>
                      <p className="text-xs text-gray-700">{booking.billingAddress}</p>
                      <p className="text-xs text-gray-700">{booking.billingCity}{booking.billingPostalCode ? `, ${booking.billingPostalCode}` : ''}</p>
                      <p className="text-xs text-gray-700">{booking.billingCountry}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hall Section */}
            <div className="border border-[#E0D8C3] rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-[#FAF7F2] p-4 border-b border-[#E0D8C3] flex items-center gap-2">
                <Building2 className="text-[#7C6A2E]" size={20} />
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">Venue</h3>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-serif font-bold text-gray-900 mb-1">EASCCA Conference Centre</h4>
                <p className="text-sm text-gray-500 mb-6">Package: <span className="font-semibold text-gray-700">{booking.packageName}</span></p>
                
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b pb-2">Hall + Facilities</h5>
                <div className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex justify-between"><span>Hall rental</span><span>LKR {hallCost.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Food ({booking.guests || 250} pax)</span><span>LKR {foodCost.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-500"><span>AC</span><span>Included</span></div>
                  <div className="flex justify-between text-gray-500"><span>Sound system</span><span>Included</span></div>
                  <div className="flex justify-between text-gray-500"><span>Generator</span><span>Included</span></div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center mb-6 border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Venue Total</p>
                    <p className="text-lg font-bold text-gray-900">LKR {venueTotal.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase">Advance</p>
                    <p className="text-lg font-bold text-[#7C6A2E]">LKR {venueAdvance.toLocaleString()}</p>
                  </div>
                </div>

                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 border-b pb-2">Availability</h5>
                <div className="grid grid-cols-2 gap-4 text-sm bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                  <div>
                    <p className="text-gray-500 text-xs">Event Date</p>
                    <p className="font-bold text-gray-800 flex items-center gap-1"><CalendarDays size={14} className="text-emerald-600"/> {booking.date}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Time</p>
                    <p className="font-bold text-gray-800 flex items-center gap-1"><Clock size={14} className="text-emerald-600"/> {booking.timeslot || '18:00 - 23:00'}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-emerald-200/50">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Section */}
            {activeVendors.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-[#7C6A2E]">Requested Vendors</h3>
                {activeVendors.map((v, i) => (
                  <div key={i} className="border border-[#E0D8C3] rounded-xl overflow-hidden bg-white shadow-sm flex flex-col sm:flex-row">
                    <div className="bg-gray-50 p-4 border-r border-[#E0D8C3] sm:w-48 shrink-0 flex flex-col justify-center">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{v.cat}</h4>
                      <p className="font-serif font-bold text-gray-900 leading-tight">{v.data.vendorId?.firstName || v.data.vendorId?.businessName || 'Vendor'}</p>
                    </div>
                    <div className="p-5 flex-1 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-xs text-gray-500">Package/Design</p>
                          <p className="text-sm font-semibold text-gray-800">{v.data.packageName || 'Standard Service'}</p>
                        </div>
                        {v.data.requirements && Object.keys(v.data.requirements).length > 0 && (
                          <div className="bg-amber-50/50 p-3 rounded border border-amber-100 text-xs italic text-gray-600">
                            {JSON.stringify(v.data.requirements)}
                          </div>
                        )}
                        
                        {/* Vendor Rejection UI */}
                        {['Declined', 'declined', 'Cancelled', 'cancelled', 'Rejected', 'rejected', 'Expired', 'expired'].includes(v.data.status) && !v.data.replacement && (
                          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                              <AlertCircle size={16} /> Vendor Rejected
                            </div>
                            <div className="text-xs text-gray-700 mb-2">
                              <span className="font-semibold text-gray-500 block uppercase tracking-wider text-[10px]">Reason:</span>
                              {v.data.rejectionReason || "Unavailable on event date."}
                            </div>
                            <div className="text-xs text-amber-700 font-semibold bg-amber-100/50 p-2 rounded border border-amber-200 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block mb-0.5">Customer Action:</span>
                                Awaiting customer decision
                              </div>
                              <button 
                                onClick={() => openManageVendor(v.cat, v.data)}
                                disabled={isProcessing}
                                className="bg-white border border-red-200 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                              >
                                Manage Vendor
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replacement Request UI */}
                        {v.data.replacement && (
                          <div className="mt-4 p-4 border border-purple-200 bg-purple-50/50 rounded-lg">
                            <div className="flex items-center gap-2 text-purple-700 font-bold mb-3 uppercase tracking-widest text-xs">
                              <RefreshCw size={14} /> Replacement Request
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                              <div>
                                <span className="text-gray-500 uppercase tracking-wider text-[9px] block">Original Vendor</span>
                                <span className="font-bold text-gray-900 block">{v.data.vendorId?.firstName || 'Vendor'}</span>
                                <span className="text-gray-600">LKR {(v.data.cost ?? booking.pricingBreakdown?.[`${v.cat}Cost`] ?? 0).toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-purple-600 uppercase tracking-wider text-[9px] block">Replacement Vendor</span>
                                <span className="font-bold text-purple-900 block">{v.data.replacement.vendorName || 'New Vendor'}</span>
                                <span className="text-purple-700 font-bold">LKR {(v.data.replacement.cost || 0).toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <div className="border-t border-purple-100 pt-3 flex justify-between items-center text-xs">
                              <div>
                                <span className="text-gray-500 uppercase tracking-wider text-[9px] block">Additional Advance</span>
                                <span className="font-bold text-gray-900">LKR {(v.data.replacement.additionalAdvance || 0).toLocaleString()}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-gray-500 uppercase tracking-wider text-[9px] block">Payment</span>
                                {v.data.replacement.paymentStatus === 'Paid' ? (
                                  <span className="font-bold text-emerald-600 flex items-center gap-1 justify-end"><CheckCircle2 size={12} /> Confirmed</span>
                                ) : (
                                  <span className="font-bold text-amber-600">Pending</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto shrink-0 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                        <div className="flex flex-col items-end">
                          <p className="text-lg font-bold text-gray-900">LKR {(v.data.requirements?.historicalCost ?? v.data.cost ?? booking.pricingBreakdown?.[`${v.cat}Cost`] ?? 0).toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Advance: <span className="text-[#7C6A2E]">LKR {(v.data.requirements?.historicalAdvance ?? v.data.advancePaid ?? getVendorAdvanceInfo(v.cat)).toLocaleString()}</span></p>
                        </div>
                        {v.data.status === 'Awaiting Hall Confirmation' ? (
                          <span className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                            <Clock size={10} /> Awaiting Hall Confirmation
                          </span>
                        ) : v.data.status === 'Pending' ? (
                          <span className="flex items-center gap-1.5 text-amber-700 text-[10px] font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Pending Vendor Response
                          </span>
                        ) : v.data.status === 'Accepted' || v.data.status === 'Confirmed' ? (
                          <span className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 size={10} className="text-emerald-500" /> Accepted
                          </span>
                        ) : v.data.status === 'Refund Pending' ? (
                          <div className="flex flex-col items-end gap-2">
                            <span className="flex items-center gap-1.5 text-amber-700 text-[10px] font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <AlertCircle size={10} className="text-amber-500" /> Refund Pending
                            </span>
                            <button
                              onClick={() => handleRefund(v.cat, v.data.refundRequestedAmount || v.data.requirements?.historicalAdvance || v.data.advancePaid || getVendorAdvanceInfo(v.cat))}
                              disabled={isProcessing}
                              className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-[10px] py-2 px-3 rounded transition-colors disabled:opacity-50 shadow-sm"
                            >
                              {isProcessing ? "Processing..." : "Refund Customer"}
                            </button>
                          </div>
                        ) : v.data.status === 'Refunded' ? (
                          <span className="flex items-center gap-1.5 text-blue-700 text-[10px] font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                            <CheckCircle2 size={10} className="text-blue-500" /> Refunded
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-700 text-[10px] font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                            <X size={10} className="text-red-500" /> Declined
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky Financials & Actions */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            
            {/* Payment Summary */}
            <div className="bg-[#1A1512] text-white rounded-xl shadow-lg sticky top-24 overflow-hidden border border-gray-800">
              <div className="p-5 border-b border-gray-800">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C]">Payment Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between"><span>Hall</span><span className="text-white">LKR {venueTotal.toLocaleString()}</span></div>
                  {activeVendors.map((v, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="capitalize">{v.cat}</span>
                      <span className="text-white">LKR {(v.data.cost ?? booking.pricingBreakdown?.[`${v.cat}Cost`] ?? 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-300 uppercase">Total</span>
                  <span className="text-lg font-bold text-[#C9A84C]">LKR {totalCost.toLocaleString()}</span>
                </div>

                <div className="bg-white/5 rounded-lg p-4 space-y-3 border border-white/10 mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 uppercase">Advance Required</span>
                    <span className="font-bold text-white">LKR {totalAdvanceReq.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 uppercase">Original Paid</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12}/> LKR {totalPaid.toLocaleString()}
                    </span>
                  </div>
                  {refundRequestedAmount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-500/80 uppercase">Refund Requested</span>
                      <span className="font-bold text-amber-500">LKR {refundRequestedAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {refundedAmount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-red-400 uppercase">Amount Refunded</span>
                      <span className="font-bold text-red-400">- LKR {refundedAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {(refundRequestedAmount > 0 || refundedAmount > 0) && (
                    <div className="flex justify-between text-xs border-t border-white/10 pt-2 mt-2">
                      <span className="text-white uppercase font-bold">Net Paid</span>
                      <span className="font-bold text-emerald-400">LKR {netPaid.toLocaleString()}</span>
                    </div>
                  )}
                  {refundRequestedAmount > 0 && (
                    <div className="flex items-center gap-2 text-[10px] text-amber-500/60 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending Manager Approval
                    </div>
                  )}
                  {booking.paymentHistory && booking.paymentHistory.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-white/5 space-y-1.5">
                      {booking.paymentHistory.map((p: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-[10px] text-gray-400">
                          <span>{p.paymentType}</span>
                          <span>LKR {p.amount.toLocaleString()} on {new Date(p.timestamp || p.date || new Date()).toLocaleDateString('en-GB')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-1">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-500 uppercase font-bold">Remaining Balance</span>
                    <span className="text-xl font-serif text-white">LKR {remainingBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-medium tracking-wide mt-2">
                    <span className="text-gray-500 uppercase">Payment Status</span>
                    <span className="text-gray-300">
                      {remainingBalance === 0 ? "Fully Paid" : totalPaid > 0 ? "Partially Paid" : "Not Received"}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-amber-500/80 font-medium tracking-wide mt-1">
                    Balance Due: {balanceDueStr}
                  </div>
                </div>
              </div>
              
              {/* Manager Actions block placed right under financials on desktop */}
              {isPendingManager && (
                <div className="bg-[#2A2420] p-5 border-t border-gray-800 flex flex-col gap-3">
                  <button 
                    onClick={() => setIsConfirmModalOpen(true)}
                    className="w-full bg-[#C9A84C] hover:bg-[#B58B5C] text-[#1A1512] font-bold uppercase tracking-widest text-xs py-3 rounded transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                  >
                    Approve & Confirm
                  </button>
                  <button 
                    onClick={() => setIsRejectModalOpen(true)}
                    className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-gray-300 font-bold uppercase tracking-widest text-xs py-3 rounded transition-colors"
                  >
                    Reject Booking
                  </button>
                </div>
              )}

              {/* Payment System Status Indicator */}
              {!isPendingManager && (
                <>
                  {booking.status !== "Completed" && booking.status !== "Cancelled" && booking.status !== "Rejected" && new Date(booking.date).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0) && (
                    <div className="bg-[#2A2420] p-5 border-t border-gray-800 flex flex-col gap-3">
                      <button 
                        onClick={handleCompleteBooking}
                        disabled={isProcessing}
                        className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold uppercase tracking-widest text-xs py-3 rounded transition-colors shadow-sm"
                      >
                        {isProcessing ? "Processing..." : "Mark as Completed"}
                      </button>
                    </div>
                  )}

                  {booking.status === "Cancelled" ? (
                    <div className="bg-[#2A2420] p-5 border-t border-gray-800 flex flex-col gap-3">
                      <div className="w-full font-bold uppercase tracking-widest text-[10px] py-3 rounded border border-red-500/30 bg-red-500/10 text-red-400 flex flex-col items-center justify-center gap-1">
                        <span className="flex items-center gap-2"><X size={14} /> Customer Cancelled the Booking</span>
                      </div>
                    </div>
                  ) : remainingBalance > 0 && isBalancePayable ? (
                    <div className="bg-[#2A2420] p-5 border-t border-gray-800 flex flex-col gap-3">
                      <div className="w-full font-bold uppercase tracking-widest text-[10px] py-2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-500 flex flex-col items-center justify-center gap-1">
                        <span className="flex items-center gap-2"><Clock size={14} /> Awaiting Payment</span>
                        <span className="text-[8px] text-amber-500/70 lowercase tracking-normal font-medium">Customer can pay online via portal</span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setPayAmount(remainingBalance);
                          setIsRecordPaymentModalOpen(true);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs py-3 rounded transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(5,150,105,0.3)]"
                      >
                        <CheckCircle2 size={16} /> Record Offline Payment
                      </button>
                    </div>
                  ) : remainingBalance > 0 && !isBalancePayable ? (
                    <div className="bg-[#2A2420] p-5 border-t border-gray-800 flex flex-col gap-3">
                      <div className="w-full font-bold uppercase tracking-widest text-[10px] py-2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-500 flex flex-col items-center justify-center gap-1 opacity-60">
                        <span className="flex items-center gap-2"><Clock size={14} /> Balance Locked</span>
                        <span className="text-[8px] text-amber-500/70 lowercase tracking-normal font-medium text-center px-2">Awaiting vendor confirmations. Customer cannot pay online.</span>
                      </div>
                      <button 
                        onClick={() => {
                          setPayAmount(remainingBalance);
                          setIsRecordPaymentModalOpen(true);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs py-3 rounded flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(5,150,105,0.3)]"
                      >
                        <CheckCircle2 size={16} /> Record Offline Payment
                      </button>
                    </div>
                  ) : remainingBalance === 0 ? (
                    <div className="bg-[#2A2420] p-5 border-t border-gray-800">
                      <div className="w-full font-bold uppercase tracking-widest text-[10px] py-3 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} /> Full Payment Received
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold text-gray-900">Confirm this booking?</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-600 bg-gray-50">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Event:</span>
                <span className="font-bold text-gray-900">{booking.eventType}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Date:</span>
                <span className="font-bold text-gray-900">{booking.date}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="font-medium">Guests:</span>
                <span className="font-bold text-gray-900">{booking.guests || 250}</span>
              </div>
              
              <div className="flex items-center gap-2 text-emerald-600 pt-2 font-medium">
                <CheckCircle2 size={16} /> Hall: Available
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <CheckCircle2 size={16} /> Advance: Paid (LKR {totalPaid.toLocaleString()})
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-lg text-xs mt-4">
                <AlertCircle size={14} className="inline mr-1 mb-0.5" />
                By confirming, the hall will be permanently blocked and vendor requests will be immediately dispatched to the selected partners.
              </div>
            </div>
            <div className="p-4 bg-white flex gap-3 justify-end border-t border-gray-100">
              <button onClick={() => setIsConfirmModalOpen(false)} disabled={isProcessing} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 rounded transition-colors">Cancel</button>
              <button onClick={handleConfirmBooking} disabled={isProcessing} className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-sm flex items-center gap-2">
                {isProcessing ? <RefreshCw className="animate-spin" size={14}/> : <CheckCircle2 size={14}/>} Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold text-red-600">Reject Booking Request</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-800 bg-gray-50">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Reason *</label>
                <div className="space-y-2">
                  {['Hall unavailable', 'Date conflict', 'Capacity issue', 'Payment issue', 'Customer information issue', 'Other'].map(reason => (
                    <label key={reason} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded transition-colors">
                      <input 
                        type="radio" 
                        name="rejectReason" 
                        value={reason} 
                        checked={rejectReason === reason} 
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      {reason}
                    </label>
                  ))}
                </div>
              </div>

              {rejectReason === 'Other' && (
                <div className="mt-3">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Additional Explanation</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-red-500 focus:border-red-500" 
                    rows={3}
                    value={rejectExplanation}
                    onChange={(e) => setRejectExplanation(e.target.value)}
                    placeholder="Provide details..."
                  ></textarea>
                </div>
              )}

              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs mt-4">
                <AlertCircle size={14} className="inline mr-1 mb-0.5" />
                Rejecting will cancel the event and automatically trigger a <strong>100% Full Refund</strong> of LKR {totalPaid.toLocaleString()} to the customer. Vendor requests will be discarded.
              </div>
            </div>
            <div className="p-4 bg-white flex gap-3 justify-end border-t border-gray-100">
              <button onClick={() => setIsRejectModalOpen(false)} disabled={isProcessing} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 rounded transition-colors">Cancel</button>
              <button onClick={handleRejectBooking} disabled={isProcessing} className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white rounded transition-colors shadow-sm flex items-center gap-2">
                {isProcessing ? <RefreshCw className="animate-spin" size={14}/> : <X size={14}/>} Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-100 bg-[#FAF7F2]">
              <h2 className="text-xl font-serif font-bold text-[#7C6A2E]">Record Offline Payment</h2>
            </div>
            <div className="p-6 space-y-5 text-sm text-gray-800 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Customer</span>
                  <span className="font-bold">{booking.clientName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Booking</span>
                  <span className="font-bold">{booking.id}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-gray-200 mt-2">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Balance Due</span>
                  <span className="text-xl font-bold text-gray-900">LKR {remainingBalance.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Bank Transfer', 'Cash', 'Direct Deposit', 'Other'].map(method => (
                    <label key={method} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${payMethod === method ? 'border-[#7C6A2E] bg-[#FDF9F1]' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="payMethod" 
                        value={method} 
                        checked={payMethod === method} 
                        onChange={(e) => setPayMethod(e.target.value)}
                        className="text-[#7C6A2E] focus:ring-[#7C6A2E]"
                      />
                      <span className="text-xs font-semibold">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Reference *</label>
                  <input 
                    type="text" 
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-[#7C6A2E] focus:border-[#7C6A2E]" 
                    placeholder="Txn ID / Receipt No"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Date *</label>
                  <input 
                    type="date" 
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-[#7C6A2E] focus:border-[#7C6A2E]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Amount Received (LKR) *</label>
                <input 
                  type="number" 
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full border border-[#C9A84C] bg-white text-gray-900 font-bold rounded p-2 text-sm focus:ring-[#7C6A2E] focus:border-[#7C6A2E]" 
                />
                <span className="text-[10px] text-[#7C6A2E] italic mt-1 block font-medium">You can record a partial payment. Remaining Balance: LKR {remainingBalance.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Evidence</label>
                <button className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full text-center text-gray-500 hover:bg-gray-50 transition-colors text-xs font-semibold">
                  + Upload Receipt (Optional)
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Notes</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-[#7C6A2E] focus:border-[#7C6A2E]" 
                  rows={2}
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="Any additional remarks..."
                ></textarea>
              </div>

            </div>
            <div className="p-4 bg-white flex gap-3 justify-end border-t border-gray-100">
              <button onClick={() => setIsRecordPaymentModalOpen(false)} disabled={isProcessing} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 rounded transition-colors">Cancel</button>
              <button onClick={handleRecordPayment} disabled={isProcessing} className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-sm flex items-center gap-2">
                {isProcessing ? <RefreshCw className="animate-spin" size={14}/> : <CheckCircle2 size={14}/>} Confirm Payment Received
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Vendor Modal */}
      {vendorToManage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-gray-100 bg-[#FAF7F2]">
              <h2 className="text-xl font-serif font-bold text-[#7C6A2E]">Manage {vendorToManage.cat}</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-amber-800 mb-1">Current Status: {vendorToManage.data.status}</h3>
                <p className="text-xs text-amber-700">You can either drop this service completely or assign a replacement vendor to fulfill the requirement.</p>
              </div>
              
              <div className="space-y-4">
                {/* Option 1: Drop */}
                <div className="border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-red-700 font-bold text-sm">
                    <Trash2 size={16} /> Option 1: Drop Vendor Completely
                  </div>
                  <p className="text-xs text-gray-600 mb-3">This will remove the {vendorToManage.cat} requirement from this booking, deduct their cost, and unlock the final payment balance.</p>
                  <button 
                    onClick={handleDropVendor} 
                    disabled={isProcessing}
                    className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-bold uppercase tracking-widest text-xs py-2 rounded transition-colors disabled:opacity-50"
                  >
                    Confirm Drop
                  </button>
                </div>
                
                {/* Option 2: Replace */}
                <div className="border border-[#E0D8C3] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 text-[#7C6A2E] font-bold text-sm">
                    <RefreshCw size={16} /> Option 2: Replace Vendor
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Select another available {vendorToManage.cat} to assign to this booking instead.</p>
                  
                  <select 
                    value={selectedReplacementId}
                    onChange={(e) => handleVendorSelect(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm mb-3 focus:ring-[#7C6A2E] focus:border-[#7C6A2E]"
                  >
                    <option value="">-- Select Replacement Vendor --</option>
                    {availableVendors.map(av => (
                      <option key={av._id} value={av.vendorId || av._id}>{av.name} {av.shopName ? `(${av.shopName})` : ''}</option>
                    ))}
                  </select>

                  {selectedVendorProfile && selectedVendorProfile.packages && selectedVendorProfile.packages.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        Select {vendorToManage.cat === 'decorator' ? 'Design' : 'Package'}
                      </label>
                      <select 
                        value={selectedReplacementPackage}
                        onChange={(e) => setSelectedReplacementPackage(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-[#7C6A2E] focus:border-[#7C6A2E]"
                      >
                        <option value="">-- Select {vendorToManage.cat === 'decorator' ? 'Design' : 'Package'} --</option>
                        {selectedVendorProfile.packages.map((pkg: any, idx: number) => (
                          <option key={idx} value={pkg.name}>{pkg.name} (LKR {Number(pkg.price).toLocaleString()})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleReplaceVendor} 
                    disabled={isProcessing || !selectedReplacementId || (selectedVendorProfile?.packages?.length > 0 && !selectedReplacementPackage)}
                    className="w-full bg-[#1E56A0] hover:bg-[#15417E] text-white font-bold uppercase tracking-widest text-xs py-2 rounded transition-colors disabled:opacity-50"
                  >
                    Assign Replacement
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 flex justify-end border-t border-gray-100">
              <button onClick={() => setVendorToManage(null)} disabled={isProcessing} className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-200 rounded transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Refund Confirmation Modal */}
      {refundModalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-500" />
                Confirm Refund
              </h3>
              <button 
                onClick={() => setRefundModalState({ isOpen: false, cat: '', amount: 0 })} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to approve a refund of <strong className="text-gray-900 font-mono text-base">LKR {refundModalState.amount.toLocaleString()}</strong>?
              </p>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex gap-3 items-start">
                <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-800 font-medium">
                  This action will immediately process the refund to the customer's bank account via the PayHere payment gateway. This cannot be undone.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setRefundModalState({ isOpen: false, cat: '', amount: 0 })}
                  className="px-4 py-2 border border-gray-200 rounded text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRefund}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-purple-600 text-white rounded text-sm font-bold hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Confirm Refund"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingsMain;
