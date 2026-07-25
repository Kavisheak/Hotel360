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
        b.status === "Pending"
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
    const res = await bookingAPI.updateBookingStatus(id, { status: 'Rejected', rejectionReason: rejectReason });
    if (res.ok) {
      setRejectingId(null);
      setRejectReason("");
      setSuccessDetails("Hall request rejected. 100% advance deposit refunded to customer.");
      fetchBookings();
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
        <div className="flex bg-[#FAF6EE] border border-[#E0D8C3] p-1 rounded-lg text-xs font-bold shadow-xs">
          <button
            onClick={() => setActiveTab('hall')}
            className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
              activeTab === 'hall' 
                ? 'bg-[#7C6A2E] text-white shadow-xs' 
                : 'text-[#7C6A2E] hover:bg-white/50'
            }`}
          >
            <Clock size={14} />
            Pending Hall Confirmations ({pendingHallBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
              activeTab === 'vendors' 
                ? 'bg-[#7C6A2E] text-white shadow-xs' 
                : 'text-[#7C6A2E] hover:bg-white/50'
            }`}
          >
            <Users size={14} />
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
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-[#E0D8C3]"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${bgImg})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className="bg-amber-500/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                      Awaiting Hall Confirmation
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-mono tracking-wider px-2 py-1 rounded">
                      {row.bookingRef || ((row.id || row._id) as string).slice(-6).toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] font-bold text-amber-300 uppercase tracking-[0.2em] mb-1">
                      {row.eventType} &bull; 30% Advance Paid
                    </p>
                    <h4 className="text-xl font-serif text-white leading-tight mb-2">
                      {row.clientName}
                    </h4>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-300 font-light mb-4">
                      <span>📅 {new Date(row.date).toLocaleDateString()}</span>
                      <span>👥 {row.guests} Guests</span>
                    </div>

                    <div className="flex flex-col gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                      {rejectingId === (row.id || row._id) ? (
                        <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-red-500/50">
                          <p className="text-[9px] text-red-300 uppercase tracking-widest font-bold mb-1">Reason for Rejection:</p>
                          <textarea 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="State reason (100% refund will be issued)..."
                            className="w-full bg-black/50 text-white text-xs p-2 rounded border border-white/20 focus:outline-none focus:border-red-400 mb-1 resize-none h-14"
                          />
                          {rejectError && <p className="text-[9px] text-red-400 mb-1">{rejectError}</p>}
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { e.preventDefault(); setRejectingId(null); setRejectError(""); }}
                              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-[9px] font-bold uppercase tracking-widest py-1.5 rounded transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={(e) => handleRejectSubmit(row.id || row._id, e)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold uppercase tracking-widest py-1.5 rounded transition-colors"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-full">
                          <a 
                            href={`/hotel-manager/bookings/${row.id || row._id}`}
                            className="flex-1 text-center bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded backdrop-blur-sm transition-colors border border-white/20"
                          >
                            Review
                          </a>
                          <button 
                            onClick={(e) => handleApproveHall(row.id || row._id, e)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors shadow-sm"
                          >
                            Approve Hall
                          </button>
                          <button 
                            onClick={(e) => { e.preventDefault(); setRejectingId(row.id || row._id); setRejectReason(""); setRejectError(""); }}
                            className="flex-1 bg-red-600/80 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors"
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
                  className="bg-white border border-[#E0D8C3] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        Hall Approved ✓
                      </span>
                      <span className="font-mono text-xs text-gray-500 font-bold">
                        {row.bookingRef || row._id?.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-lg font-serif font-bold text-[#1A1512] leading-snug">
                      {row.clientName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{row.eventType} &bull; {new Date(row.date).toLocaleDateString()}</p>
                  </div>

                  {/* Vendor Item Response Status List */}
                  <div className="bg-[#FAF6EE] p-3 rounded-lg border border-[#E0D8C3]/60 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-[#7C6A2E] tracking-wider mb-1">
                      Assigned Vendors (24h Window Active)
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
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            isAccepted 
                              ? "bg-emerald-100 text-emerald-700" 
                              : isDeclined 
                              ? "bg-red-100 text-red-700" 
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}>
                            {isPending ? "Awaiting Response (Pending)" : v.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <a 
                    href={`/hotel-manager/bookings/${row.id || row._id}`}
                    className="w-full text-center bg-[#7C6A2E] hover:bg-[#655523] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors"
                  >
                    View Booking Details
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
