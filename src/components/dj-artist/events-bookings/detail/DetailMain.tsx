"use client";

<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> Stashed changes
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../overview/Footer';
<<<<<<< Updated upstream
import { djAPI } from '@/lib/api';
=======
import {
  getClientFullName,
  getClientPhone,
  getClientEmail,
  VENUE_NAME,
} from '@/lib/vendorUtils';
import { djAPI } from '@/lib/api';

const DetailMain = ({ bookingId }: { bookingId: string }) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
>>>>>>> Stashed changes

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

<<<<<<< Updated upstream
const DetailMain = ({ bookingId }: DetailMainProps) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const res = await djAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        const found = res.data.data.find((b: any) => b._id === bookingId);
        setBooking(found);
=======
  const fetchBooking = async () => {
    try {
      const res = await djAPI.getBookingById(bookingId);
      if (res.ok && res.data?.data) {
        setBooking(res.data.data);
>>>>>>> Stashed changes
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream
  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-serif animate-pulse">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="p-12 text-center text-red-500 font-serif">Booking not found.</div>;
  }

  const djStatus = booking.vendors?.dj?.status || 'Pending';
  const djPackageName = booking.package?.name || "Custom DJ Package";
=======
  const handleStatusUpdate = async (status: 'Accepted' | 'Declined') => {
    setStatusUpdating(true);
    try {
      const res = await djAPI.updateBookingStatus(bookingId, status);
      if (res.ok) {
        setToast({ type: 'success', msg: `Booking ${status} successfully!` });
        await fetchBooking();
      } else {
        setToast({ type: 'error', msg: res.data?.message || 'Failed to update status.' });
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        <DetailBanner
          code={booking.bookingRef || `#${booking._id.slice(-6).toUpperCase()}`}
          status={djStatus}
          confirmedDate={new Date(booking.createdAt).toLocaleDateString()}
          djPackage={djPackageName}
        />
        <DetailSummary
          date={new Date(booking.date).toLocaleDateString()}
          guests={`${booking.guests || 'N/A'} Guests`}
          setWindow="06:00 PM – 12:00 AM"
          venue="Venue TBD"
        />
        <DetailMiddle
          clientName={booking.clientName || (booking.customerId ? `${booking.customerId.firstName} ${booking.customerId.lastName}` : "Valued Client")}
          clientSubtitle={booking.eventType || 'Event'}
          phone={booking.phone || booking.contactNumber || (booking.customerId ? booking.customerId.phone : "N/A")}
          email={booking.email || booking.clientEmail || (booking.customerId ? booking.customerId.email : "N/A")}
          clientAvatar={booking.customerId?.avatar}
          venueImage="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
          venueCaption={`"Event Venue — ${djPackageName}"`}
        />
=======
        
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
          <div className="bg-[#FCF6E3] border border-[#F5EAD2] rounded p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#7C6A2E] mb-1">Action Required</p>
              <p className="text-xs text-gray-600">You have been assigned to this event. Please accept or decline to notify the hotel manager.</p>
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
>>>>>>> Stashed changes
        <DetailBottom booking={booking} onRefresh={fetchBooking} />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
