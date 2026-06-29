"use client";

import React, { useState, useEffect } from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../overview/Footer';
import { djAPI } from '@/lib/api';

interface DetailMainProps {
  bookingId: string;
}

const DetailMain = ({ bookingId }: DetailMainProps) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const res = await djAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        const found = res.data.data.find((b: any) => b._id === bookingId);
        setBooking(found);
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

  const djStatus = booking.vendors?.dj?.status || 'Pending';
  const djPackageName = booking.package?.name || "Custom DJ Package";

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <DetailHeader />
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
          clientName={booking.clientName || 'Valued Client'}
          clientSubtitle={booking.eventType || 'Event'}
          phone={booking.contactNumber || 'N/A'}
          email={booking.clientEmail || 'N/A'}
          venueImage="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
          venueCaption={`"Event Venue — ${djPackageName}"`}
        />
        <DetailBottom booking={booking} onRefresh={fetchBooking} />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
