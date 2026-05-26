import React from 'react';
import RatingsHeader from './RatingsHeader';
import RatingsStats from './RatingsStats';
import RecentFeedback from './RecentFeedback';
import Footer from '../my_jobs/Footer';

const RatingsMain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Excellence Reflected / Client Reviews Header */}
        <RatingsHeader />
        
        {/* Rating score + distribution card summary metrics */}
        <RatingsStats />

        {/* Detailed feedback list block */}
        <RecentFeedback />
      </div>
      <Footer />
    </div>
  );
};

export default RatingsMain;
