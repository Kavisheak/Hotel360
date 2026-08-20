"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Calendar, MapPin, Video, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { videographerAPI } from "@/lib/api";
import {
  getClientDisplayName,
  getVendorStatus,
  getBookingRef,
  formatTimeslot,
  getPackageName,
  VENUE_NAME,
  getApiImageUrl,
} from "@/lib/vendorUtils";
import AdvanceRequestModal from '@/components/vendor/bookings/AdvanceRequestModal';
import DeclineRequestModal from '@/components/vendor/bookings/DeclineRequestModal';

const BookingsGrid = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortFilter, setSortFilter] = useState("Earliest Date");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [acceptEvent, setAcceptEvent] = useState<any | null>(null);
  const [declineEvent, setDeclineEvent] = useState<any | null>(null);

  const [hiddenBookings, setHiddenBookings] = useState<string[]>([]);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hiddenVideographerBookings');
    if (saved) {
      setHiddenBookings(JSON.parse(saved));
    }
  }, []);

  const hideBooking = (id: string) => {
    const updated = [...hiddenBookings, id];
    setHiddenBookings(updated);
    localStorage.setItem('hiddenVideographerBookings', JSON.stringify(updated));
    setBookingToDelete(null);
  };

  const clearAll = () => {
    const allIds = bookings.map(b => b._id);
    const updated = [...new Set([...hiddenBookings, ...allIds])];
    setHiddenBookings(updated);
    localStorage.setItem('hiddenVideographerBookings', JSON.stringify(updated));
    setShowClearAllModal(false);
  };

  const loadBookings = () => {
    videographerAPI.getAssignedBookings().then(({ ok, data }) => {
      if (ok && data?.data) setBookings(data.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, status: 'Accepted' | 'Declined', reason?: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await videographerAPI.updateBookingStatus(bookingId, status, { declineReason: reason });
      if (res.ok) {
        setDeclineEvent(null);
        loadBookings();
      } else {
        alert(res.data?.message || 'Failed to update status.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAcceptConfirm = async (advanceAmount: number, advanceDeadline: string) => {
    if (!acceptEvent) return;
    setUpdatingId(acceptEvent._id);
    try {
      const res = await videographerAPI.updateBookingStatus(acceptEvent._id, "Accepted", {
        advanceRequestedAmount: advanceAmount,
        advanceDeadline: advanceDeadline
      });
      if (res.ok) {
        setAcceptEvent(null);
        loadBookings();
      } else {
        if (res.status === 409 || res.data?.code === "EXPIRED") {
          alert("This request just expired.");
        } else {
          console.error("Failed to accept booking:", res.data?.message);
        }
      }
    } catch (e) {
      console.error("Error accepting booking:", e);
    } finally {
      setUpdatingId(null);
      setAcceptEvent(null);
    }
  };

  let filtered = bookings.filter((b) => {
    if (hiddenBookings.includes(b._id)) return false;
    const title = getClientDisplayName(b).toLowerCase();
    const matchSearch = title.includes(searchTerm.toLowerCase()) || (b.eventType || "").toLowerCase().includes(searchTerm.toLowerCase());
    const status = getVendorStatus(b, "videographer");
    const matchStatus = statusFilter === "All" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (sortFilter === "Earliest Date") {
    filtered = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortFilter === "Latest Date") {
    filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortFilter === "Status") {
    filtered = [...filtered].sort((a, b) => getVendorStatus(a, "videographer").localeCompare(getVendorStatus(b, "videographer")));
  }

  const statusBadge = (status: string) => {
    if (status === "Accepted") return "bg-[#EAF0F6] text-[#3F6897] border border-[#DCE6EE]";
    if (status === "Completed") return "bg-[#EAF4EC] text-[#2E7A3E] border border-[#D8EBD9]";
    if (status === "Declined") return "bg-[#FDE8E8] text-[#9B3434] border border-[#F5D4D4]";
    return "bg-[#FCF6E3] text-[#7C6A2E] border border-[#F5EAD2]";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by event or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-[#E0D8C3] bg-white focus:outline-none focus:border-[#B08D2C]"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowClearAllModal(true)}
            className="px-4 py-2.5 bg-white border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors shrink-0"
          >
            Clear All
          </button>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="md:w-48 bg-white border border-[#E0D8C3] px-4 py-2.5 text-xs">
            <option value="All">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
            <option value="Declined">Declined</option>
          </select>
          <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)} className="md:w-48 bg-white border border-[#E0D8C3] px-4 py-2.5 text-xs">
            <option value="Earliest Date">Sort: Earliest Date</option>
            <option value="Latest Date">Latest Date</option>
            <option value="Status">Status</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-sm text-[#7C6A2E] animate-pulse">Loading assigned bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500 italic">No bookings found.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filtered.map((booking) => {
            const status = getVendorStatus(booking, "videographer");
            const imgUrl = getApiImageUrl(booking.vendors?.videographer?.completionPhotos?.[0]) ||
              "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80";
            return (
              <div key={booking._id} className="bg-white border border-[#E0D8C3] overflow-hidden shadow-sm flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-[42%] h-56 sm:h-auto shrink-0 overflow-hidden">
                  <img src={imgUrl} alt={booking.eventType} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between relative">
                  <button 
                    onClick={() => setBookingToDelete(booking._id)}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors z-10"
                    title="Hide Booking"
                  >
                    <Trash2 size={15} />
                  </button>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-sm ${statusBadge(status)}`}>
                        {status === "Pending" ? "ACTION REQUIRED" : status.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">{getBookingRef(booking)}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">{getClientDisplayName(booking)}</h3>
                    <div className="space-y-1.5 mb-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2"><Calendar size={13} className="text-[#A6955C]" /><span>{new Date(booking.date).toLocaleDateString()} · {formatTimeslot(booking)}</span></div>
                      <div className="flex items-center gap-2"><MapPin size={13} className="text-[#A6955C]" /><span>{VENUE_NAME}</span></div>
                    </div>
                    <p className="text-xs font-serif italic text-gray-500 border-l-2 border-[#E0D8C3] pl-3 mb-4">{getPackageName(booking, "videographer")}</p>
                  </div>
                  {status === "Pending" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setAcceptEvent(booking)}
                        disabled={updatingId === booking._id}
                        className="px-3 py-1 bg-[#7C6A2E] hover:bg-[#685724] text-white text-[9px] font-bold tracking-widest uppercase disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setDeclineEvent(booking)}
                        disabled={updatingId === booking._id}
                        className="px-3 py-1 border border-red-300 text-red-500 hover:bg-red-50 text-[9px] font-bold tracking-widest uppercase disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                  <button
                    onClick={() => router.push(`/videographer/events-bookings/${booking._id}`)}
                    className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest uppercase"
                  >
                    VIEW DETAILS
                  </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {acceptEvent && (
        <AdvanceRequestModal
          isOpen={!!acceptEvent}
          onClose={() => setAcceptEvent(null)}
          onSubmit={handleAcceptConfirm}
          isSubmitting={updatingId === acceptEvent._id}
          offeredPrice={acceptEvent.pricingBreakdown?.videographerCost || 0}
        />
      )}

      {declineEvent && (
        <DeclineRequestModal
          isOpen={!!declineEvent}
          onClose={() => setDeclineEvent(null)}
          onSubmit={(reason) => handleStatusUpdate(declineEvent._id, "Declined", reason)}
          isSubmitting={updatingId === declineEvent._id}
        />
      )}

      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 w-full max-w-sm border border-[#E0D8C3] shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hide Booking</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove this booking from your view? It will not be deleted from the system.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setBookingToDelete(null)} className="px-4 py-2 border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-50">Cancel</button>
              <button onClick={() => hideBooking(bookingToDelete)} className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700">Yes, Hide</button>
            </div>
          </div>
        </div>
      )}

      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 w-full max-w-sm border border-[#E0D8C3] shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear All Bookings</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to hide all bookings from your view? They will not be deleted from the system.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowClearAllModal(false)} className="px-4 py-2 border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-gray-50">Cancel</button>
              <button onClick={() => clearAll()} className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700">Clear All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsGrid;
