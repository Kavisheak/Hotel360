import React from 'react';
import Sidebar from '@/components/videographer/shared/Sidebar';
import BookingDetailMain from '@/components/videographer/events-bookings/detail/DetailMain';

interface PageProps {
  params: Promise<{ id: string }>;
}

const VideographerBookingDetailPage = async ({ params }: PageProps) => {
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

export default VideographerBookingDetailPage;

// Pre-render known booking IDs
export async function generateStaticParams() {
  return [
    { id: 'VG-2241' },
    { id: 'VG-2298' },
    { id: 'VG-2354' },
    { id: 'VG-2381' },
  ];
}
