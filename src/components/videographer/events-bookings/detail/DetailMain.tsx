"use client";

import React, { useState, useEffect } from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../shared/Footer';
import { videographerAPI } from '@/lib/api';
import {
  getClientFullName,
  getClientPhone,
  getClientEmail,
  getPackageName,
  getBookingRef,
  formatTimeslot,
  VENUE_NAME,
  getVendorStatus,
} from '@/lib/vendorUtils';

interface DetailMainProps {
  bookingId: string;
}

const DetailMain = ({ bookingId }: DetailMainProps) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await videographerAPI.getBookingById(bookingId);
      if (res.ok && res.data?.data) setBooking(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const handleStatusUpdate = async (status: 'Accepted' | 'Declined') => {
    setStatusUpdating(true);
    try {
      const res = await videographerAPI.updateBookingStatus(bookingId, status);
      if (res.ok) {
        await fetchBooking();
      } else {
        alert(res.data?.message || 'Failed to update status.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-[#7C6A2E] animate-pulse">Loading booking details...</div>;
  if (!booking) return <div className="p-12 text-center text-red-500">Booking not found.</div>;

  const vgStatus = getVendorStatus(booking, 'videographer');
  const vgPackageName = getPackageName(booking, 'videographer');

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <DetailHeader />
        <DetailBanner code={getBookingRef(booking)} status={vgStatus} confirmedDate={new Date(booking.createdAt).toLocaleDateString()} videoPackage={vgPackageName} />

        {vgStatus === 'Pending' && (
          <div className="bg-[#FCF6E3] border border-[#F5EAD2] rounded p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#7C6A2E] mb-1">Action Required</p>
              <p className="text-xs text-gray-600">You have been assigned to this shoot. Accept or decline to notify the manager.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => handleStatusUpdate('Accepted')}
                disabled={statusUpdating}
                className="px-6 py-2.5 bg-[#7C6A2E] hover:bg-[#5C4E1E] text-white text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {statusUpdating ? 'Updating...' : 'Accept'}
              </button>
              <button
                onClick={() => handleStatusUpdate('Declined')}
                disabled={statusUpdating}
                className="px-6 py-2.5 border border-red-400 hover:bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        <DetailSummary date={new Date(booking.date).toLocaleDateString()} guests={`${booking.guests || 'N/A'} Guests`} shootWindow={formatTimeslot(booking)} venue={VENUE_NAME} />
        <DetailMiddle
          clientName={getClientFullName(booking)}
          clientSubtitle={booking.eventType || 'Event'}
          phone={getClientPhone(booking)}
          email={getClientEmail(booking)}
          clientAvatar={booking.customerId?.avatar}
          coverImage="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80"
          coverCaption={`${VENUE_NAME} — ${vgPackageName}`}
        />
        <DetailBottom booking={booking} onRefresh={fetchBooking} />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
