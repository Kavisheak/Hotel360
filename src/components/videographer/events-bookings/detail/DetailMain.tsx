"use client";

import React, { useState, useEffect } from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../shared/Footer';
import { videographerAPI } from '@/lib/api';

interface DetailMainProps {
  bookingId: string;
}

const DetailMain = ({ bookingId }: DetailMainProps) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      const res = await videographerAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        const found = res.data.data.find((b: any) => b._id === bookingId);
        setBooking(found);
      }
    } catch (e) {
      console.error("Error fetching booking details:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="p-12 text-center text-[#7C6A2E] font-serif animate-pulse">Loading booking details...</div>;
  }

  if (!booking) {
    return <div className="p-12 text-center text-red-500 font-serif">Booking not found.</div>;
  }

  const vgStatus = booking.vendors?.videographer?.status || 'Pending';
  const vgPackageName = booking.vendors?.videographer?.packageName || "Custom Video Package";

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Action Header */}
        <DetailHeader />

        {/* Hero Banner */}
        <DetailBanner
          code={booking.bookingRef || `#${booking._id.slice(-6).toUpperCase()}`}
          status={vgStatus}
          confirmedDate={new Date(booking.createdAt).toLocaleDateString()}
          videoPackage={vgPackageName}
        />

        {/* 4 Summary Stat Cards */}
        <DetailSummary
          date={new Date(booking.date).toLocaleDateString()}
          guests={`${booking.guests || 'N/A'} Guests`}
          shootWindow={booking.timeslot || "10:00 AM – 10:00 PM"}
          venue={booking.location || "Venue TBD"}
        />

        {/* Client Profile & Event Scene */}
        <DetailMiddle
          clientName={booking.clientName || (booking.customerId ? `${booking.customerId.firstName} ${booking.customerId.lastName}` : "Valued Client")}
          clientSubtitle={booking.eventType || 'Event'}
          phone={booking.phone || booking.contactNumber || 'N/A'}
          email={booking.email || booking.clientEmail || 'N/A'}
          clientAvatar={booking.customerId?.avatar}
          coverImage="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80"
          coverCaption={`"Event Venue — ${vgPackageName}"`}
        />

        {/* Package Details & Shoot Checklist */}
        <DetailBottom booking={booking} onRefresh={fetchBooking} />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
