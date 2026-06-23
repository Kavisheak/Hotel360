"use client";

import React, { useEffect, useState } from 'react';
import DetailHeader from './DetailHeader';
import DetailBanner from './DetailBanner';
import DetailSummary from './DetailSummary';
import DetailMiddle from './DetailMiddle';
import DetailBottom from './DetailBottom';
import Footer from '../../my_jobs/Footer';

const DetailMain = ({ bookingId }: { bookingId: string }) => {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { decoratorAPI } = await import('@/lib/api');
      const res = await decoratorAPI.getAssignedBookings();
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

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Breadcrumb & Action Button Header */}
        <DetailHeader />
        
        {/* Hero banner for event */}
        <DetailBanner 
          code={booking.bookingRef} 
          status={booking.vendors?.decorator?.status || 'PENDING'} 
          confirmedDate={new Date(booking.date).toLocaleDateString()} 
          clientEmail={booking.email}
        />

        {/* 4 Summary Stats Cards */}
        <DetailSummary 
          date={new Date(booking.date).toLocaleDateString()} 
          guests={`${booking.guests} Guests`} 
          window={booking.timeslot || "08:00 AM - 02:00 PM"} 
          venue="Grand Majestic Hall" 
        />

        {/* Client details & Visuals */}
        <DetailMiddle 
          clientName={booking.clientName} 
          clientSubtitle={booking.eventType} 
          phone={booking.phone} 
          email={booking.email} 
          inspirationImage="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80" 
          inspirationCaption={`“${booking.menuType} package.”`} 
        />

        {/* Package components checklist & tasks */}
        <DetailBottom booking={booking} onRefresh={fetchBooking} />
      </div>
      <Footer />
    </div>
  );
};

export default DetailMain;
