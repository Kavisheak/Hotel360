import React, { use } from 'react';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import BookingsMain from '@/components/hotel-manager/bookings/BookingsMain';

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0 flex flex-col">
        <BookingsMain bookingId={unwrappedParams.id} />
      </div>
    </div>
  );
}
