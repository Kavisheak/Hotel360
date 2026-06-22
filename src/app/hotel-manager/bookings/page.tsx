import React from 'react';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import BookingsListMain from '@/components/hotel-manager/bookings/BookingsListMain';
import ManagerFooter from '@/components/hotel-manager/overview/Footer';

const HotelManagerBookingsPage = () => (
  <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
    <Sidebar />
    <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0 flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <BookingsListMain />
      </main>
      <ManagerFooter />
    </div>
  </div>
);

export default HotelManagerBookingsPage;
