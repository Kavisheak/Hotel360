"use client";

import React, { useEffect, useState } from 'react';
import BookingsHeader from './historyHeader';
import StatsCards from './StatsCards';
import BookingsTable from './historyTable';
import VisualArchive from './VisualArchive';
import Footer from '../my_jobs/Footer';
import { decoratorAPI } from '@/lib/api';

const BookingsMain = () => {
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>({ completedCount: 0, averageRating: '0.0', royalPackages: 0, satisfactionRate: '0%' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, ratingsRes] = await Promise.all([
          decoratorAPI.getAssignedBookings(),
          decoratorAPI.getRatings()
        ]);

        let allCompleted: any[] = [];
        let royalCount = 0;

        if (bookingsRes.ok && bookingsRes.data?.data) {
          allCompleted = bookingsRes.data.data.filter((b: any) => 
            b.vendors?.decorator?.status === 'Completed' || b.status === 'Completed'
          ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          royalCount = allCompleted.filter((b: any) => {
            const pkg = (b.vendors?.decorator?.packageName || b.packageName || '').toLowerCase();
            return pkg.includes('premium') || pkg.includes('royal') || pkg.includes('elite');
          }).length;
        }

        let revs = [];
        let avg = '0.0';
        let totalRev = 0;
        let satisfaction = '0%';

        if (ratingsRes.ok && ratingsRes.data?.data) {
          revs = ratingsRes.data.data.reviews || [];
          avg = (ratingsRes.data.data.stats?.averageRating || 0).toFixed(1);
          totalRev = ratingsRes.data.data.stats?.totalReviews || 0;
          
          const highStars = revs.filter((r: any) => r.rating >= 4).length;
          satisfaction = totalRev > 0 ? `${Math.round((highStars / totalRev) * 100)}%` : '0%';
        }

        setCompletedJobs(allCompleted);
        setReviews(revs);
        setStatsData({
          completedCount: allCompleted.length,
          averageRating: avg,
          royalPackages: royalCount,
          satisfactionRate: satisfaction
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
        <div className="flex-1 px-4 py-10 max-w-7xl mx-auto w-full flex justify-center items-center">
          <div className="text-[#7C6A2E] animate-pulse">Loading history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <BookingsHeader />
        <StatsCards statsData={statsData} />
        <BookingsTable events={completedJobs} reviews={reviews} />
        <VisualArchive />
      </div>
      <Footer />
    </div>
  );
};

export default BookingsMain;
