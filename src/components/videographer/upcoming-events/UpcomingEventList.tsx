"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";
import { videographerAPI } from "@/lib/api";
import { VENUE_NAME, getClientFirstName } from "@/lib/vendorUtils";
import AdvanceRequestModal from '@/components/vendor/bookings/AdvanceRequestModal';

interface UpcomingEventListProps {
  searchTerm?: string;
  statusFilter?: string;
  externalBookings?: any[];
  loadingExternal?: boolean;
  onRefresh?: () => void;
}

function statusClass(status: string = "") {
  const upper = status.toUpperCase();
  if (upper === "CONFIRMED" || upper === "ACCEPTED") return "bg-[#EAF4EC] text-[#2E7A3E] border-[#D8EBD9]";
  if (upper === "PENDING") return "bg-[#FCF6E3] text-[#7C6A2E] border-[#F5EAD2]";
  return "bg-[#EAF0F6] text-[#3F6897] border-[#DCE6EE]";
}

const UpcomingEventList = ({ searchTerm = "", statusFilter = "All", externalBookings, loadingExternal, onRefresh }: UpcomingEventListProps) => {
  const [internalEvents, setInternalEvents] = useState<any[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [declineReason, setDeclineReason] = useState("");

  const fetchUpcomingEvents = async () => {
    try {
      const { ok, data } = await videographerAPI.getAssignedBookings();
      if (ok && data.success) {
        setInternalEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    if (!externalBookings) {
      fetchUpcomingEvents();
    }
  }, [externalBookings]);

  const rawBookings = externalBookings || internalEvents;
  const isLoading = loadingExternal !== undefined ? loadingExternal : internalLoading;

  const events = rawBookings
    .filter((b: any) => {
      const status = b.vendors?.videographer?.status;
      const isFuture = new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0));
      return status !== 'Declined' && status !== 'NotRequired' && isFuture;
    })
    .map((b: any) => ({
      _id: b._id,
      title: (`${b.eventType} for ${getClientFirstName(b)}`).toUpperCase(),
      type: b.vendors?.videographer?.packageName || "Custom Package",
      date: new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time: b.timeslot || "TBD",
      venue: VENUE_NAME,
      status: b.vendors?.videographer?.status || "Pending",
      clientName: b.clientName,
      eventType: b.eventType
    }));

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      statusFilter === "All Status" ||
      event.status === statusFilter ||
      (statusFilter === "Confirmed" && event.status === "Accepted");
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (eventId: string, newStatus: string) => {
    setSelectedEventId(eventId);
    setModalStatus(newStatus);
    setDeclineReason("");
    setShowModal(true);
  };

  const confirmStatusChange = async (advanceAmount?: number, advanceDeadline?: string) => {
    try {
      setIsUpdating(true);
      const res = await videographerAPI.updateBookingStatus(selectedEventId, modalStatus, { 
        declineReason,
        advanceRequestedAmount: advanceAmount,
        advanceDeadline: advanceDeadline
      });
      if (res.ok) {
        setShowModal(false);
        if (onRefresh) onRefresh();
        else fetchUpcomingEvents();
      } else {
        if (res.status === 409 || res.data?.code === "EXPIRED") {
          alert("This request just expired.");
        } else {
          alert(res.data?.message || 'Failed to update status');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm h-full">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Upcoming Shoots
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#7C6A2E]" />
        </div>
      ) : (
        <div className="space-y-2">
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming shoots assigned by the manager.</p>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className={`border px-4 py-3 hover:bg-[#FDF9F1] transition-colors ${
                  event.status === 'Pending' ? 'border-[#C69C6D] bg-[#FCF6E3]' : 'border-[#E0D8C3] bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-serif font-bold text-gray-900 text-sm truncate">{event.title}</p>
                      <span className={`text-[9px] font-bold tracking-widest px-2 py-0.5 border shrink-0 ${statusClass(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold tracking-widest text-[#A6955C] uppercase mt-0.5">{event.type}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} className="text-[#A6955C] shrink-0" />
                        {event.date} · {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} className="text-[#A6955C] shrink-0" />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  {event.status === 'Pending' && (
                    <div className="flex items-center gap-1.5 shrink-0 self-center">
                      <button
                        onClick={() => handleStatusChange(event._id, 'Accepted')}
                        className="px-3 py-1 bg-[#7C6A2E] hover:bg-[#685724] text-white text-[9px] font-bold tracking-widest uppercase transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(event._id, 'Declined')}
                        className="px-3 py-1 border border-red-300 text-red-500 hover:bg-red-50 text-[9px] font-bold tracking-widest uppercase transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Confirmation Modals */}
      {showModal && modalStatus === 'Accepted' && (
        <AdvanceRequestModal
          isOpen={true}
          onClose={() => setShowModal(false)}
          onSubmit={confirmStatusChange}
          isSubmitting={isUpdating}
          offeredPrice={rawBookings.find(b => b._id === selectedEventId)?.pricingBreakdown?.videographerCost || 0}
        />
      )}

      {showModal && modalStatus === 'Declined' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-50 text-red-500`}>
                <XCircle size={32} />
             </div>
             <h3 className="text-2xl font-serif text-gray-800 tracking-tight mb-2">
                Decline Event Request?
             </h3>
             <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                You are about to decline the request. This action cannot be undone.
             </p>

             {modalStatus === 'Declined' && (
                <div className="w-full mb-8 text-left">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Decline Reason</label>
                  <select 
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="w-full p-3 border border-[#E0D8C3] bg-white text-sm focus:outline-none focus:border-[#7C6A2E] text-gray-700"
                  >
                    <option value="" disabled>Select a reason...</option>
                    <option value="date_conflict">Date Conflict</option>
                    <option value="out_of_budget">Out of Budget</option>
                    <option value="out_of_area">Out of Area</option>
                    <option value="other">Other</option>
                  </select>
                </div>
             )}

             <div className="flex w-full gap-3">
               <button 
                 onClick={() => setShowModal(false)}
                 disabled={isUpdating}
                 className="flex-1 border border-[#E0D8C3] text-gray-500 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={() => confirmStatusChange()}
                 disabled={isUpdating || (modalStatus === 'Declined' && !declineReason)}
                 className={`flex-1 py-3 text-white text-xs font-bold tracking-widest uppercase transition-colors flex justify-center items-center disabled:opacity-50 bg-red-500 hover:bg-red-600`}
               >
                 {isUpdating ? (
                   <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Processing...</span>
                 ) : (
                   'Confirm Decline'
                 )}
               </button>
             </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default UpcomingEventList;
