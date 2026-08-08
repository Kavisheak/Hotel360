"use client";

import React, { useEffect, useState } from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../overview/Footer';
import {
  getClientFullName,
  getClientPhone,
  getClientEmail,
  VENUE_NAME,
} from '@/lib/vendorUtils';
import { djAPI } from '@/lib/api';
import AdvanceRequestModal from '@/components/vendor/bookings/AdvanceRequestModal';

interface DetailMainProps {
  bookingId: string;
}

const DetailMain = ({ bookingId }: DetailMainProps) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await djAPI.getBookingById(bookingId);
      if (res.ok && res.data?.data) {
        setBooking(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: 'Accepted' | 'Declined', advanceAmount?: number, advanceDeadline?: string) => {
    if (status === 'Declined' && !showDeclineReason) {
      setShowDeclineReason(true);
      return;
    }

    if (status === 'Declined' && !declineReason) {
      setToast({ type: 'error', msg: 'Please select a reason for declining.' });
      return;
    }

    setStatusUpdating(true);
    try {
      const res = await djAPI.updateBookingStatus(bookingId, status, { 
        declineReason,
        advanceRequestedAmount: advanceAmount,
        advanceDeadline: advanceDeadline
      });
      if (res.ok) {
        setToast({ type: 'success', msg: `Booking ${status} successfully!` });
        setShowDeclineReason(false);
        setShowAdvanceModal(false);
        await fetchBooking();
      } else {
        if (res.status === 409 || res.data?.code === "EXPIRED") {
          setToast({ type: 'error', msg: 'This request just expired.' });
        } else {
          setToast({ type: 'error', msg: res.data?.message || 'Failed to update status.' });
        }
      }
    } catch (e) {
      setToast({ type: 'error', msg: 'Network error.' });
    } finally {
      setStatusUpdating(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#7C6A2E] animate-pulse">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 italic">Booking not found.</div>
        </div>
      </div>
    );
  }

  const vendorStatus = booking.vendors?.dj?.status || 'Pending';

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 text-sm font-semibold rounded shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Action Button Header */}
        <DetailHeader />
        
        {/* Hero banner for event */}
        <DetailBanner 
          code={booking.bookingRef || `#${(booking._id || '').slice(-6).toUpperCase()}`} 
          status={vendorStatus} 
          confirmedDate={new Date(booking.date).toLocaleDateString()} 
          djPackage={booking.vendors?.dj?.packageName || 'Custom'}
          phone={getClientPhone(booking)}
        />

        {/* Accept / Decline Action Panel */}
        {vendorStatus === 'Pending' && (
          <div className="bg-[#FCF6E3] border border-[#F5EAD2] rounded p-5 mb-8 flex flex-col items-start gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
              <div>
                <p className="text-sm font-bold text-[#7C6A2E] mb-1">Action Required</p>
                <p className="text-xs text-gray-600">You have been assigned to this event. Please accept or decline to notify the hotel manager.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setShowAdvanceModal(true)}
                  disabled={statusUpdating || showDeclineReason}
                  className="px-6 py-2.5 bg-[#7C6A2E] hover:bg-[#5C4E1E] text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {statusUpdating && !showDeclineReason ? 'Updating...' : 'Accept'}
                </button>
                {!showDeclineReason ? (
                  <button
                    onClick={() => setShowDeclineReason(true)}
                    disabled={statusUpdating}
                    className="px-6 py-2.5 border border-red-400 hover:bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    Decline
                  </button>
                ) : (
                  <button
                    onClick={() => setShowDeclineReason(false)}
                    disabled={statusUpdating}
                    className="px-6 py-2.5 border border-gray-400 hover:bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {showDeclineReason && (
              <div className="w-full mt-2 pt-4 border-t border-[#F5EAD2] flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-[#7C6A2E] uppercase tracking-widest mb-2">Select Decline Reason</label>
                  <select 
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="w-full p-2.5 border border-[#E0D8C3] bg-white text-sm focus:outline-none focus:border-[#7C6A2E] text-gray-700"
                  >
                    <option value="" disabled>Select a reason...</option>
                    <option value="date_conflict">Date Conflict</option>
                    <option value="out_of_budget">Out of Budget</option>
                    <option value="out_of_area">Out of Area</option>
                    <option value="no_response">No Response from Client</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button
                  onClick={() => handleStatusUpdate('Declined')}
                  disabled={statusUpdating || !declineReason}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  {statusUpdating ? 'Updating...' : 'Confirm Decline'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4 Summary Stats Cards */}
        <DetailSummary 
          date={new Date(booking.date).toLocaleDateString()} 
          guests={`${booking.guests || 'N/A'} Guests`} 
          setWindow={booking.timeslot || "08:00 AM - 02:00 PM"} 
          venue={VENUE_NAME} 
        />

        {/* Client details & Visuals */}
        <DetailMiddle 
          clientName={getClientFullName(booking)} 
          clientSubtitle={booking.eventType || 'Event'} 
          phone={getClientPhone(booking)} 
          email={getClientEmail(booking)} 
          venueImage="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80" 
          venueCaption={`DJ set at ${VENUE_NAME}.`}
        />

        {/* Package components checklist & tasks */}
        <DetailBottom booking={booking} onRefresh={fetchBooking} />
      </div>
      <Footer />

      {/* Advance Request Modal for Acceptance */}
      <AdvanceRequestModal
        isOpen={showAdvanceModal}
        onClose={() => setShowAdvanceModal(false)}
        onSubmit={(amount, deadline) => handleStatusUpdate('Accepted', amount, deadline)}
        isSubmitting={statusUpdating}
        offeredPrice={booking?.pricingBreakdown?.djCost || 0}
      />
    </div>
  );
};

export default DetailMain;
