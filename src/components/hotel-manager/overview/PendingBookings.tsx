"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Users, ShieldAlert } from 'lucide-react';
import { bookingAPI } from '@/lib/api';

const PendingBookings = () => {
  const [isClient, setIsClient] = useState(false);
  const [pendingHallBookings, setPendingHallBookings] = useState<any[]>([]);
  const [waitingVendorBookings, setWaitingVendorBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'hall' | 'vendors'>('hall');
  const [isLoading, setIsLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [successDetails, setSuccessDetails] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    const res = await bookingAPI.getAllBookings();
    if (res.ok && res.data?.data) {
      const all: any[] = res.data.data;
      
      // 1. Pending Hall Confirmations (Manager action required)
      const hallPending = all.filter((b: any) => 
        b.status === "Pending Hall Confirmation" || 
        b.status === "Pending Confirmation" || 
        b.status === "Pending" ||
        b.status === "DEPOSIT_PAID"
      );

      // 2. Waiting Vendor Responses (Hall confirmed, selected vendors in Pending status)
      const vendorWaiting = all.filter((b: any) => {
        if (b.status !== "Confirmed") return false;
        if (!b.vendors) return false;
        const categories = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
        return categories.some((cat) => b.vendors[cat] && b.vendors[cat].vendorId && b.vendors[cat].status === "Pending");
      });

      setPendingHallBookings(hallPending);
      setWaitingVendorBookings(vendorWaiting);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsClient(true);
    fetchBookings();
  }, []);

  const handleApproveHall = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await bookingAPI.updateBookingStatus(id, { status: 'Confirmed' });
    if (res.ok) {
      setSuccessDetails(`Hall allocation confirmed! Vendor requests have been activated and dispatched.`);
      fetchBookings();
    }
  };

  const handleRejectSubmit = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (rejectReason.trim().length < 10) {
      setRejectError("Min 10 chars required.");
      return;
    }
    const res = await bookingAPI.rejectBooking(id, { 
      reason: 'other', 
      note: `Manager Rejected Booking: ${rejectReason}` 
    });
    
    if (res.ok) {
      setRejectingId(null);
      setRejectReason("");
      setSuccessDetails("Hall request rejected. 100% advance deposit refunded to customer.");
      fetchBookings();
    } else {
      setRejectError(res.data?.message || "Failed to reject booking.");
    }
  };

  const categories = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];

  return (
    <section className="mb-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-serif font-bold text-[#7C6A2E]">
            <BookOpen size={20} className="text-[#B08D2C]" />
            Manager Booking Approvals & Queue
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Separate hall allocation approvals from active vendor response tracking.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-gray-50/80 border border-[#E0D8C3]/50 p-1 rounded-xl text-sm font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
          <button
            onClick={() => setActiveTab('hall')}
            className={`px-5 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'hall' 
                ? 'bg-white text-[#7C6A2E] shadow-sm ring-1 ring-[#E0D8C3]/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            <Clock size={16} className={activeTab === 'hall' ? 'text-[#B08D2C]' : ''} />
            Pending Hall Confirmations ({pendingHallBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-5 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'vendors' 
                ? 'bg-white text-[#7C6A2E] shadow-sm ring-1 ring-[#E0D8C3]/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            <Users size={16} className={activeTab === 'vendors' ? 'text-[#B08D2C]' : ''} />
            Waiting Vendor Responses ({waitingVendorBookings.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Pending Hall Confirmations */}
      {activeTab === 'hall' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isClient && pendingHallBookings.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-[#E0D8C3] rounded-xl shadow-sm">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="text-sm font-semibold text-gray-700">No pending hall confirmations.</p>
              <p className="text-xs text-gray-400 mt-1">All incoming advance payments have been reviewed by management.</p>
            </div>
          ) : isClient ? (
            pendingHallBookings.map((row, i) => {
              const images = [
                'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1505368581691-382a52efc674?auto=format&fit=crop&w=800&q=80',
              ];
              const bgImg = images[i % images.length];

              return (
                <div
                  key={(row.id || row._id || i).toString()}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 border border-[#E0D8C3]/60"
                >
                  {/* Image Header */}
                  <div className="relative h-36 overflow-hidden bg-gray-100 shrink-0">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${bgImg})` }}
                    />
                    <div className="absolute inset-0 bg-black/5" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className="bg-white/95 text-[#7C6A2E] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-[#E0D8C3]/50">
                        Awaiting Hall Confirmation
                      </span>
                      <span className="bg-white/90 text-gray-800 text-[10px] font-mono tracking-wider px-2 py-1 rounded shadow-sm border border-gray-100">
                        {row.bookingRef || ((row.id || row._id) as string).slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#A6955C] uppercase tracking-[0.2em] mb-1">
                        {row.eventType} &bull; 30% Advance Paid
                      </p>
                      <h4 className="text-xl font-serif font-semibold text-gray-900 leading-tight mb-2">
                        {row.clientName}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 font-light mb-6">
                        <span className="flex items-center gap-1.5">📅 {new Date(row.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5">👥 {row.guests} Guests</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-auto" onClick={(e) => e.stopPropagation()}>
                      {rejectingId === (row.id || row._id) ? (
                        <div className="bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                          <p className="text-[10px] text-red-700 uppercase tracking-widest font-bold mb-1.5">Reason for Rejection:</p>
                          <textarea 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="State reason (100% refund will be issued)..."
                            className="w-full bg-white text-gray-800 text-xs p-2.5 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400/20 mb-2 resize-none h-16"
                          />
                          {rejectError && <p className="text-[10px] text-red-500 mb-2">{rejectError}</p>}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.preventDefault(); setRejectingId(null); setRejectError(""); }}
                              className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={(e) => handleRejectSubmit(row.id || row._id, e)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-colors shadow-sm"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-full">
                          <a 
                            href={`/hotel-manager/bookings/${row.id || row._id}`}
                            className="flex-[0.8] text-center bg-white border border-[#E0D8C3] hover:bg-gray-50 text-gray-700 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors"
                          >
                            Review
                          </a>
                          <button 
                            onClick={(e) => handleApproveHall(row.id || row._id, e)}
                            className="flex-1 bg-[#7C6A2E] hover:bg-[#6A5A27] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={(e) => { e.preventDefault(); setRejectingId(row.id || row._id); setRejectReason(""); setRejectError(""); }}
                            className="flex-[0.8] bg-white border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
      )}

      {/* Tab 2: Waiting Vendor Responses */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isClient && waitingVendorBookings.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white border border-[#E0D8C3] rounded-xl shadow-sm">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="text-sm font-semibold text-gray-700">No bookings currently waiting for vendor responses.</p>
              <p className="text-xs text-gray-400 mt-1">All hall-approved bookings have complete vendor responses.</p>
            </div>
          ) : isClient ? (
            waitingVendorBookings.map((row) => {
              const pendingVendorTypes = categories.filter((cat) => 
                row.vendors?.[cat] && row.vendors[cat].vendorId && row.vendors[cat].status === "Pending"
              );

              return (
                <div 
                  key={row._id || row.id}
                  className="bg-white border border-[#E0D8C3]/60 rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-5 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        Hall Approved ✓
                      </span>
                      <span className="font-mono text-[10px] text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        {row.bookingRef || row._id?.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-xl font-serif font-semibold text-gray-900 leading-snug">
                      {row.clientName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-light tracking-wide">{row.eventType} &bull; {new Date(row.date).toLocaleDateString()}</p>
                  </div>

                  {/* Vendor Item Response Status List */}
                  <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 space-y-2.5">
                    <p className="text-[10px] uppercase font-bold text-[#7C6A2E] tracking-wider mb-2">
                      Assigned Vendors (24h Window)
                    </p>
                    {categories.map((cat) => {
                      const v = row.vendors?.[cat];
                      if (!v || !v.vendorId || v.status === "NotRequired") return null;

                      const isPending = v.status === "Pending";
                      const isAccepted = v.status === "Accepted";
                      const isDeclined = v.status === "Declined" || v.status === "Expired";

                      return (
                        <div key={cat} className="flex justify-between items-center text-xs">
                          <span className="capitalize font-medium text-gray-700">{cat}</span>
                          <span className={`text-[9px] uppercase font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                            isAccepted 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : isDeclined 
                              ? "bg-red-50 text-red-700 border-red-100" 
                              : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                          }`}>
                            {isPending ? "Awaiting (Pending)" : v.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <a 
                    href={`/hotel-manager/bookings/${row.id || row._id}`}
                    className="w-full text-center bg-white border border-[#E0D8C3] hover:bg-gray-50 text-gray-700 text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg transition-colors shadow-sm"
                  >
                    View Details
                  </a>
                </div>
              );
            })
          ) : null}
        </div>
      )}

      {/* Success Modal */}
      {successDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center rounded-xl">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Manager Action Processed</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {successDetails}
            </p>
            <button 
              onClick={() => setSuccessDetails(null)}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-sm shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PendingBookings;
