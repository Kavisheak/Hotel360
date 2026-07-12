import React from 'react';
import Sidebar from '@/components/decorator/my_jobs/Sidebar';
import DetailMain from '@/components/decorator/bookings/detail/DetailMain';

interface PageProps {
  params: Promise<{ id: string }>;
}

const BookingDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <DetailMain bookingId={id} />
      </div>
    </div>
  );
};

export default BookingDetailPage;

