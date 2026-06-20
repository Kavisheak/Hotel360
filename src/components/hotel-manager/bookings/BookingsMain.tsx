'use client';
import React, { useState, useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import BookingsHeader from './BookingsHeader';
import VenueImage from './VenueImage';
import ClientInfo from './ClientInfo';
import SelectedPackage from './SelectedPackage';
import AssignedArtisans from './AssignedArtisans';
import ManagerActions from './ManagerActions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const BookingsMain = ({ bookingId }: { bookingId?: string }) => {
  const [isClient, setIsClient] = useState(false);
  const bookings = useBookingStore(state => state.bookings);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const booking = bookingId ? bookings.find(b => b.id === bookingId) : bookings[0];

  if (!booking) {
    return (
      <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1] p-10 text-center items-center justify-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">Booking Not Found</h2>
        <Link href="/hotel-manager/bookings" className="text-[#7C6A2E] underline font-bold tracking-widest text-[10px] uppercase">Return to Bookings</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
        <Link href="/hotel-manager/bookings" className="mr-4 text-gray-500 hover:text-[#7C6A2E] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-px h-6 bg-[#E0D8C3] mr-4 hidden sm:block" />
        <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Booking Details</h2>
      </header>

      <main className="flex-1 px-4 lg:px-6 py-6 max-w-[1400px] mx-auto w-full">
        <BookingsHeader booking={booking} />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <VenueImage booking={booking} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
              <ClientInfo booking={booking} />
              <SelectedPackage booking={booking} />
            </div>

            <AssignedArtisans booking={booking} />
          </div>

          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <ManagerActions booking={booking} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingsMain;
