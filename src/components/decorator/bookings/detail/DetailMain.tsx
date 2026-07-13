"use client";

import React, { useState, useEffect } from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../my_jobs/Footer';
import {
  getClientFullName,
  getClientPhone,
  getClientEmail,
  VENUE_NAME,
} from '@/lib/vendorUtils';
import { decoratorAPI } from '@/lib/api';

interface DetailMainProps {
  bookingId: string;
}

const DetailMain = ({ bookingId }: DetailMainProps) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await decoratorAPI.getBookingById(bookingId);
      if (res.ok && res.data?.data) {
        setBooking(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: 'Accepted' | 'Declined') => {
    setStatusUpdating(true);
    try {
      const res = await decoratorAPI.updateBookingStatus(bookingId, status);
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

  const vendorStatus = booking.vendors?.decorator?.status || 'Pending';

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Action Button Header */}
        <DetailHeader />
        
        {/* Hero banner for event */}
        <DetailBanner 
          code={booking.bookingRef || `#${(booking._id || '').slice(-6).toUpperCase()}`} 
          status={vendorStatus} 
          confirmedDate={new Date(booking.date).toLocaleDateString()} 
          clientEmail={getClientEmail(booking)}
          clientPhone={getClientPhone(booking)}
        />

        {/* 4 Summary Stats Cards */}
        <DetailSummary 
          date={new Date(booking.date).toLocaleDateString()} 
          guests={`${booking.guests || 'N/A'} Guests`} 
          window={booking.timeslot || "08:00 AM - 02:00 PM"} 
          venue={VENUE_NAME} 
        />

        {/* Client details & Visuals */}
        <DetailMiddle 
          clientName={getClientFullName(booking)} 
          clientSubtitle={booking.eventType || 'Event'} 
          phone={getClientPhone(booking)} 
          email={getClientEmail(booking)} 
          clientAvatar={booking.customerId?.avatar}
          inspirationImage="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80" 
          inspirationCaption={`${booking.packageName || 'Custom'} package at ${VENUE_NAME}.`}
        />

        {/* Package components checklist & tasks */}
        <DetailBottom />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
