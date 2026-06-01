import React from 'react';
import Sidebar from '@/components/hotel-manager/overview/Sidebar';
import SettingsMain from '@/components/hotel-manager/settings/SettingsMain';

const HotelManagerSettingsPage = () => (
  <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
    <Sidebar />
    <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
      <SettingsMain />
    </div>
  </div>
);

export default HotelManagerSettingsPage;
