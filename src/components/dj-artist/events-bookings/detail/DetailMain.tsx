"use client";

import React, { useState, useEffect } from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../overview/Footer';
import { djAPI } from '@/lib/api';
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

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-serif animate-pulse">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="p-12 text-center text-red-500 font-serif">Booking not found.</div>;
  }

  const djStatus = getVendorStatus(booking, 'dj');
  const djPackageName = getPackageName(booking, 'dj');

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <DetailHeader />
        <DetailBanner
          code={getBookingRef(booking)}
          status={djStatus}
          confirmedDate={new Date(booking.createdAt).toLocaleDateString()}
          djPackage={djPackageName}
        />
        <DetailSummary
          date={new Date(booking.date).toLocaleDateString()}
          guests={`${booking.guests || 'N/A'} Guests`}
          setWindow={formatTimeslot(booking)}
          venue={VENUE_NAME}
        />
        <DetailMiddle
          clientName={getClientFullName(booking)}
          clientSubtitle={booking.eventType || 'Event'}
          phone={getClientPhone(booking)}
          email={getClientEmail(booking)}
          clientAvatar={booking.customerId?.avatar}
          venueImage="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
          venueCaption={`${VENUE_NAME} — ${djPackageName}`}
        />
        <DetailBottom booking={booking} onRefresh={fetchBooking} />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
