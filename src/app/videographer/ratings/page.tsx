import React from 'react';
import Sidebar from '@/components/videographer/shared/Sidebar';
import RatingsMain from '@/components/videographer/ratings/RatingsMain';

const VideographerRatingsPage = () => {
  return (
    <div className="flex min-h-screen bg-[#FDF9F1] font-sans text-gray-800">
      <Sidebar />
      <div className="flex-1 pt-14 lg:pt-0 min-w-0">
        <RatingsMain />
      </div>
    </div>
  );
};

export default VideographerRatingsPage;
