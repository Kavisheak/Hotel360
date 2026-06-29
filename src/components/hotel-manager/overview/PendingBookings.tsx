"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { bookingAPI } from '@/lib/api';

const PendingBookings = () => {
  const [isClient, setIsClient] = useState(false);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [successDetails, setSuccessDetails] = useState<string | null>(null);

  const fetchPending = async () => {
    const res = await bookingAPI.getAllBookings();
    if (res.ok && res.data?.data) {
      setPendingBookings(res.data.data.filter((b: any) => b.status === "Pending"));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsClient(true);
    fetchPending();
  }, []);

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await bookingAPI.updateBookingStatus(id, { status: 'Confirmed' });
    if (res.ok) {
      setSuccessDetails(`Booking has been successfully approved!`);
      fetchPending();
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
      fetchPending();
    }
  };

  return (
  <section className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h3 className="flex items-center gap-2 text-base lg:text-lg font-serif font-semibold text-[#7C6A2E]">
        <BookOpen size={18} className="text-[#B08D2C]" />
        Pending Bookings
      </h3>
      <a href="/hotel-manager/bookings" className="bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-semibold tracking-widest uppercase px-4 py-2 rounded-md transition-colors whitespace-nowrap ml-4">
        View All Queue
      </a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isClient && pendingBookings.length === 0 ? (
        <div className="col-span-full py-16 text-center bg-white border border-[#E0D8C3] rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 font-light italic">No pending bookings in the queue.</p>
        </div>
      ) : isClient ? (
        pendingBookings.map((row, i) => {
          // Provide some high-quality distinct images based on index
          const images = [
            'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505368581691-382a52efc674?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1530103862676-de88b43e67bc?auto=format&fit=crop&w=800&q=80',
          ];
          const bgImg = images[i % images.length];

          return (
            <div
              key={(row.id || row._id || i).toString()}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#E0D8C3]"
            >
              {/* Background Image with Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${bgImg})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <span className="bg-white/90 backdrop-blur-md text-[#7C6A2E] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                  Pending
                </span>
                <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-mono tracking-wider px-2 py-1 rounded">
                  {((row.id || row._id) as string).split('-')[1] || (row.id || row._id)}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-500">
                <p className="text-[10px] font-bold text-amber-200 uppercase tracking-[0.2em] mb-1">
                  {row.eventType}
                </p>
                <h4 className="text-2xl font-serif text-white leading-tight mb-2 group-hover:text-amber-100 transition-colors">
                  {row.clientName}
                </h4>
                
                <div className="flex items-center gap-3 text-xs text-gray-300 font-light mb-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {row.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {row.guests} Guests
                  </span>
                </div>

                <div className="flex flex-col gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 w-full" onClick={(e) => e.stopPropagation()}>
                  {rejectingId === (row.id || row._id) ? (
                    <div className="bg-black/60 backdrop-blur-md p-2 rounded-md border border-red-500/50">
                      <p className="text-[9px] text-red-300 uppercase tracking-widest font-bold mb-1">Reason for Rejection:</p>
                      <textarea 
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="State reason here..."
                        className="w-full bg-black/40 text-white text-xs p-1.5 rounded border border-white/20 focus:outline-none focus:border-red-400 mb-1 resize-none h-12"
                      />
                      {rejectError && <p className="text-[9px] text-red-400 mb-1">{rejectError}</p>}
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.preventDefault(); setRejectingId(null); setRejectError(""); }}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-[9px] font-bold uppercase tracking-widest py-1.5 rounded transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={(e) => handleRejectSubmit(row.id || row._id, e)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold uppercase tracking-widest py-1.5 rounded transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <a 
                        href={`/hotel-manager/bookings/${row.id || row._id}`}
                        className="flex-1 text-center bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors"
                      >
                        Review
                      </a>
                      <button 
                        onClick={(e) => handleApprove(row.id || row._id, e)}
                        className="flex-1 bg-green-700 hover:bg-green-800 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); setRejectingId(row.id || row._id); setRejectReason(""); setRejectError(""); }}
                        className="flex-1 bg-white/10 hover:bg-red-500/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-colors border border-white/20"
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

    {/* Premium Success Modal */}
    {successDetails && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <BookOpen size={32} className="text-[#7C6A2E]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Success</h3>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            {successDetails}
          </p>
          <button 
            onClick={() => setSuccessDetails(null)}
            className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
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
