"use client";

import React, { useEffect, useState } from 'react';
import StatCards from './StatCards';
import MonthlyPerformance from './MonthlyPerformance';
import RecentActivity from './RecentActivity';
import SpotlightBanner from './SpotlightBanner';
import Footer from '../shared/Footer';
import { useAuthStore } from '@/store/authStore';

export default function MainContent() {
  const { user, fetchUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  if (!mounted) return null;

  const displayName = user ? (user.shopName || `${user.firstName} ${user.lastName}`) : 'Videographer';

  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col bg-[#FDF9F1]">
      <div className="px-10 py-10">
        <div className="mb-10">
          <h1 className="text-5xl font-serif tracking-tight text-[#7C6A2E]">Welcome back, {displayName}</h1>
          <p className="mt-2 font-serif text-lg italic text-gray-500">
            Your curated itinerary for the cinematic season ahead.
          </p>
        </div>

        <StatCards />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <MonthlyPerformance />
          <RecentActivity />
        </div>

        <div className="mt-10">
          <SpotlightBanner />
        </div>
      </div>
      <Footer />
    </main>
  );
}
