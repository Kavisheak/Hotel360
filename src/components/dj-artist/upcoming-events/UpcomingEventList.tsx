"use client";

import React, { useEffect, useState } from "react";
import { djAPI } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { getClientFullName } from "@/lib/vendorUtils";
import AdvanceRequestModal from '@/components/vendor/bookings/AdvanceRequestModal';
import Link from 'next/link';

const UpcomingEventList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const [declineEventId, setDeclineEventId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [acceptEvent, setAcceptEvent] = useState<any | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await djAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Show future events excluding Declined / NotRequired
        const filtered = res.data.data.filter((b: any) => {
          const status = b.vendors?.dj?.status;
          const eventDate = new Date(b.date);
          return (
            status !== "Declined" &&
            status !== "NotRequired" &&
            eventDate >= today
          );
        });
        setEvents(filtered);
      }
    } catch (e) {
      console.error("Failed to fetch DJ upcoming events:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRespond = async (bookingId: string, status: "Accepted" | "Declined") => {
    if (status === "Declined" && declineEventId !== bookingId) {
      setDeclineEventId(bookingId);
      setDeclineReason("");
      return;
    }

    if (status === "Declined" && !declineReason) {
      alert("Please select a reason for declining.");
      return;
    }

    setUpdatingId(bookingId);
    try {
      const res = await djAPI.updateBookingStatus(bookingId, status, { declineReason });
      if (res.ok) {
        setDeclineEventId(null);
        await fetchEvents();
      } else {
        if (res.status === 409 || res.data?.code === "EXPIRED") {
          alert("This request just expired.");
        } else {
          console.error("Failed to update booking status:", res.data?.message);
        }
      }
    } catch (e) {
      console.error("Error updating booking status:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAcceptConfirm = async (advanceAmount?: number, advanceDeadline?: string) => {
    if (!acceptEvent) return;
    setUpdatingId(acceptEvent._id);
    try {
      const res = await djAPI.updateBookingStatus(acceptEvent._id, "Accepted", {
        advanceRequestedAmount: advanceAmount,
        advanceDeadline: advanceDeadline
      });
      if (res.ok) {
        setAcceptEvent(null);
        await fetchEvents();
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

  return (
    <article className="border border-[#E0D8C3] bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7C6A2E]">
        Upcoming Events
      </h2>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#7C6A2E]" />
          </div>
        ) : events.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 italic">
            No upcoming performances found.
          </div>
        ) : (
          events.map((event) => {
            const status = event.vendors?.dj?.status || "Pending";
            const isUpdating = updatingId === event._id;
            const clientName = getClientFullName(event);

            return (
              <div
                key={event._id}
                className={`border p-4 hover:bg-[#FDF9F1] transition-colors ${
                  status === "Pending"
                    ? "border-[#C69C6D] bg-[#FCF6E3]"
                    : status === "Declined"
                    ? "border-red-200 bg-red-50"
                    : "border-[#E0D8C3]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-800">
                    {clientName} — {event.eventType}
                  </p>
                  {status !== "Pending" && (
                    <Link
                      href={`/dj-artist/events-bookings/${event._id}`}
                      className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-[#7C6A2E] uppercase"
                    >
                      Details
                    </Link>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {event.guests && (
                  <p className="text-xs text-gray-500">{event.guests} Guests</p>
                )}

                <span
                  className={`mt-2 inline-block text-[10px] font-bold uppercase tracking-widest ${
                    status === "Pending"
                      ? "text-[#8C6A11]"
                      : status === "Declined"
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  {status === "Pending" ? "ACTION REQUIRED" : status}
                </span>

                {status === "Pending" && (
                  <div className="mt-4">
                    {declineEventId === event._id ? (
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Decline Reason</label>
                        <select 
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          className="w-full p-2 border border-[#E0D8C3] bg-white text-xs focus:outline-none focus:border-[#7C6A2E]"
                        >
                          <option value="" disabled>Select a reason...</option>
                          <option value="date_conflict">Date Conflict</option>
                          <option value="out_of_budget">Out of Budget</option>
                          <option value="out_of_area">Out of Area</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="flex gap-2 mt-2">
                          <button
                            disabled={isUpdating}
                            onClick={() => setDeclineEventId(null)}
                            className="flex-1 border border-gray-300 text-gray-500 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            disabled={isUpdating || !declineReason}
                            onClick={() => handleRespond(event._id, "Declined")}
                            className="flex-1 bg-red-600 text-white py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {isUpdating ? "..." : "Confirm"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          disabled={isUpdating}
                          onClick={() => setAcceptEvent(event)}
                          className="flex-1 bg-[#1A1A1A] text-white py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Accept"}
                        </button>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleRespond(event._id, "Declined")}
                          className="flex-1 border border-red-600 text-red-600 py-1.5 text-[10px] font-bold tracking-widest uppercase hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {acceptEvent && (
        <AdvanceRequestModal
          isOpen={!!acceptEvent}
          onClose={() => setAcceptEvent(null)}
          onSubmit={handleAcceptConfirm}
          isSubmitting={updatingId === acceptEvent._id}
          offeredPrice={acceptEvent.pricingBreakdown?.djCost || 0}
        />
      )}

    </article>
  );
};

export default UpcomingEventList;
