import React from 'react';
import Sidebar from '@/components/videographer/shared/Sidebar';
import MainContent from '@/components/videographer/overview/MainContent';

const VideographerDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      {/* On mobile, add top padding so content doesn't hide behind the hamburger button */}
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0">
        <MainContent />
      </div>
    </div>
  );
};

export default VideographerDashboard;
