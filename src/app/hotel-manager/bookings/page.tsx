import React from 'react';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import BookingsMain from '@/components/hotel-manager/bookings/BookingsMain';

const HotelManagerBookingsPage = () => (
  <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
    <Sidebar />
    {/* On mobile, padding-top clears the hamburger button */}
    <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
      <BookingsMain />
    </div>
  </div>
);

export default HotelManagerBookingsPage;
