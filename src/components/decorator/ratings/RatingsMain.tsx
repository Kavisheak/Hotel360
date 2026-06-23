"use client";

import React, { useState, useEffect } from 'react';
import RatingsHeader from './RatingsHeader';
import RatingsStats from './RatingsStats';
import RecentFeedback from './RecentFeedback';
import Footer from '../my_jobs/Footer';

const RatingsMain = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const { decoratorAPI } = await import('@/lib/api');
      const res = await decoratorAPI.getRatings();
      if (res.ok && res.data?.data) {
        setReviews(res.data.data.reviews || []);
        if (res.data.data.stats) {
          setStats(res.data.data.stats);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        {/* Excellence Reflected / Client Reviews Header */}
        <RatingsHeader />
        
        {loading ? (
          <div className="py-20 text-center text-[#7C6A2E] animate-pulse">Loading verified reviews...</div>
        ) : (
          <>
            {/* Rating score + distribution card summary metrics */}
            <RatingsStats stats={stats} />

            {/* Detailed feedback list block */}
            <RecentFeedback reviews={reviews} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default RatingsMain;
