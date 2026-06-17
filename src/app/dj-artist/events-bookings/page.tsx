import React from 'react';
import Sidebar from '@/components/dj-artist/overview/Sidebar';
import BookingsMain from '@/components/dj-artist/events-bookings/BookingsMain';

const DjEventsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
        <BookingsMain />
      </div>
    </div>
  );
};

export default DjEventsPage;
