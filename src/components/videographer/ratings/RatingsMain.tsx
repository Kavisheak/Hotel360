"use client";

import React, { useState, useEffect } from 'react';
import RatingsHeader from './RatingsHeader';
import RatingsStats from './RatingsStats';
import RecentFeedback from './RecentFeedback';
import Footer from '../shared/Footer';
import { videographerAPI } from '@/lib/api';

const RatingsMain = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await videographerAPI.getRatings();
        if (res.ok && res.data?.data) {
          setReviews(res.data.data.reviews || []);
          setStats(res.data.data.stats || {
            averageRating: 0,
            totalReviews: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
          });
        }
      } catch (e) {
        console.error("Error fetching ratings:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRatings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <RatingsHeader />
        <RatingsStats stats={stats} loading={loading} />
        <RecentFeedback reviews={reviews} loading={loading} />
      </div>
      <Footer />
    </div>
  );
};

export default RatingsMain;
