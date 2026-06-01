import React from 'react';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import PaymentsMain from '@/components/hotel-manager/payments/PaymentsMain';

const HotelManagerPaymentsPage = () => (
  <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
    <Sidebar />
    <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
      <PaymentsMain />
    </div>
  </div>
);

export default HotelManagerPaymentsPage;
