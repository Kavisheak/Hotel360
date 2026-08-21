"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, DollarSign, Check, X, AlertTriangle, Sparkles } from 'lucide-react';
import DeclineReasonModal from './DeclineReasonModal';
import RequestedDesignModal from './RequestedDesignModal';
import AdvanceRequestModal from '@/components/vendor/bookings/AdvanceRequestModal';
import { getApiImageUrl } from '@/lib/vendorUtils';

interface RequestCardProps {
  request: any;
  onAccept: (id: string, advanceAmount?: number, advanceDeadline?: string) => Promise<{ ok: boolean; status?: number; data?: any }>;
  onDecline: (id: string, reason: string) => Promise<{ ok: boolean; status?: number; data?: any }>;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onDecline }) => {
  const [timeLeftStr, setTimeLeftStr] = useState("");
  const [urgencyLevel, setUrgencyLevel] = useState<"neutral" | "warning" | "urgent">("neutral");
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expiredError, setExpiredError] = useState<string | null>(null);

  const respondByMs = new Date(request.respondBy || Date.now() + 24 * 60 * 60 * 1000).getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const nowMs = Date.now();
      const diffMs = respondByMs - nowMs;

      if (diffMs <= 0) {
        setTimeLeftStr("Expired");
        setUrgencyLevel("urgent");
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeftStr(`${hours}h ${mins}m ${secs}s left`);

      if (hours < 2) {
        setUrgencyLevel("urgent");
      } else if (hours < 6) {
        setUrgencyLevel("warning");
      } else {
        setUrgencyLevel("neutral");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [respondByMs]);

  const handleAcceptConfirm = async (advanceAmount?: number, advanceDeadline?: string) => {
    setIsSubmitting(true);
    setExpiredError(null);

    const res = await onAccept(request._id, advanceAmount, advanceDeadline);
    setIsSubmitting(false);

    if (!res.ok) {
      if (res.status === 409 || res.data?.code === "EXPIRED") {
        setExpiredError("This request just expired.");
        setIsAdvanceModalOpen(false);
      } else {
        alert(res.data?.message || "Failed to accept request.");
      }
    } else {
      setIsAdvanceModalOpen(false);
    }
  };

  const handleDeclineConfirm = async (reason: string) => {
    setIsSubmitting(true);
    const res = await onDecline(request._id, reason);
    setIsSubmitting(false);
    setIsDeclineModalOpen(false);

    if (!res.ok) {
      alert(res.data?.message || "Failed to decline request.");
    }
  };

  const dateObj = new Date(request.date || Date.now());
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="border border-[#E0D8C3] bg-white rounded-lg p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Header & Live Countdown */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{request.bookingRef}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-serif italic text-[#7C6A2E]">{request.eventType}</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mt-0.5">
                {request.clientName}
              </h3>
            </div>

            {/* Color-Shifting Countdown Badge */}
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
              urgencyLevel === 'urgent'
                ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                : urgencyLevel === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              <Clock size={13} className={urgencyLevel === 'urgent' ? 'text-red-600' : 'text-gray-500'} />
              <span>{timeLeftStr}</span>
            </div>
          </div>

          {/* 409 Race Condition Error Alert */}
          {expiredError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{expiredError} This request can no longer be accepted.</span>
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 mb-4 bg-[#FAF6EE] p-3.5 rounded-md border border-[#E0D8C3]">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#A6955C] shrink-0" />
              <span>Event Date: <strong className="text-gray-800">{formattedDate}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#A6955C] shrink-0" />
              <span className="truncate">{request.venueName}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-600 shrink-0" />
              <span>Offered Venue Payout: <strong className="text-emerald-700 font-mono text-sm">LKR {request.offeredPrice.toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Package: <strong className="text-gray-800">{request.packageName}</strong> ({request.guests} guests)</span>
            </div>
          </div>

          {/* Selected Customer Design */}
          {request.requestedDesign && (
            <div className="mb-4 bg-[#FFFBF0] p-3.5 rounded-md border border-[#E0D8C3] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B08D2C] flex items-center gap-1.5 mb-2">
                <Sparkles size={14} className="text-[#B08D2C]" /> Customer Selected Design &amp; Package
              </span>
              <div className="flex items-center gap-3 bg-white p-2.5 rounded border border-[#F2EADA]">
                {(request.requestedDesign.coverUrl || request.requestedDesign.media?.[0]?.url) && (
                  <img
                    src={getApiImageUrl(request.requestedDesign.coverUrl || request.requestedDesign.media?.[0]?.url)}
                    alt={request.requestedDesign.title || "Requested Design"}
                    className="w-20 h-16 object-cover rounded border border-[#E0D8C3] shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-gray-900 text-xs sm:text-sm">
                    {request.requestedDesign.title}
                  </h4>
                  {request.requestedDesign.price > 0 ? (
                    <span className="text-xs font-bold text-[#7C6A2E] block mt-0.5">
                      Package Price: LKR {Number(request.requestedDesign.price).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-gray-500 block mt-0.5">
                      {request.packageName || "Custom Decor Design"}
                    </span>
                  )}
                </div>
                
                {/* View Details Button */}
                <button
                  onClick={() => setIsDesignModalOpen(true)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#E0D8C3] text-[#7C6A2E] text-[10px] font-bold uppercase tracking-wider rounded shadow-xs shrink-0 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )}

          {/* Customer Requirements */}
          <div className="mb-4 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Customer Requirements</span>
            <p className="text-gray-700 italic bg-white p-2.5 rounded border border-[#E0D8C3] line-clamp-2">
              "{request.customerNotes}"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#F2EADA] flex items-center justify-end gap-3 mt-2">
          <button
            onClick={() => setIsDeclineModalOpen(true)}
            disabled={isSubmitting || !!expiredError}
            className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold tracking-wider uppercase rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <X size={14} /> Decline
          </button>

          <button
            onClick={() => setIsAdvanceModalOpen(true)}
            disabled={isSubmitting || !!expiredError}
            className="px-5 py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold tracking-wider uppercase rounded shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Check size={14} /> {isSubmitting ? "Processing..." : "Accept Job Request"}
          </button>
        </div>
      </div>

      {/* Decline Reason Modal */}
      <DeclineReasonModal
        isOpen={isDeclineModalOpen}
        clientName={request.clientName}
        isSubmitting={isSubmitting}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleDeclineConfirm}
      />

      {/* Requested Design Modal */}
      <RequestedDesignModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        design={request.requestedDesign}
      />

      {/* Advance Request Modal */}
      <AdvanceRequestModal
        isOpen={isAdvanceModalOpen}
        onClose={() => setIsAdvanceModalOpen(false)}
        onSubmit={handleAcceptConfirm}
        isSubmitting={isSubmitting}
        offeredPrice={request.offeredPrice}
      />
    </>
  );
};

export default RequestCard;
