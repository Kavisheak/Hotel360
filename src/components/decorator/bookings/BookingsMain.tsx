"use client";

import React, { useState, useEffect } from 'react';
import BookingsHeader from './BookingsHeader';
import BookingsStats from './BookingsStats';
import BookingsGrid from './BookingsGrid';
import Footer from '../my_jobs/Footer';
import { decoratorAPI } from '@/lib/api';

const BookingsMain = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await decoratorAPI.getAssignedBookings();
      if (res.ok && res.data?.data) {
        setBookings(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <BookingsHeader />
        <BookingsStats bookings={bookings} />
        <BookingsGrid bookings={bookings} loading={loading} />
      </div>
      <Footer />
    </div>
  );
};

export default BookingsMain;
