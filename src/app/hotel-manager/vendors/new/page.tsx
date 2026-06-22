import React from 'react';
import NewVendorMain from '@/components/hotel-manager/vendors/NewVendorMain';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';

export default function NewVendorPage() {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0 flex flex-col">
        <NewVendorMain />
      </div>
    </div>
  );
}
