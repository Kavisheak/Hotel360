import React from 'react';
import Sidebar from '@/components/videographer/shared/Sidebar';
import OverviewMain from '@/components/videographer/overview/OverviewMain';

const VideographerHome = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <OverviewMain />
      </div>
    </div>
  );
};

export default VideographerHome;
