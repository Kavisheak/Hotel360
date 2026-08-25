import React from 'react';
import Sidebar from '@/components/dj-artist/overview/Sidebar';
import BookingDetailMain from '@/components/dj-artist/events-bookings/detail/DetailMain';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

const DjBookingDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <BookingDetailMain bookingId={id} />
      </div>
    </div>
  );
};

export default DjBookingDetailPage;
