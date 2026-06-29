"use client";

import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { Music, CheckCircle2, Star, Calendar } from 'lucide-react';
import { djAPI } from '@/lib/api';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function statusClass(status: string) {
  if (status === 'Accepted') return 'bg-[#E6F4EA] text-[#2E7A3E] border-[#D7ECD8]';
  if (status === 'Pending')  return 'bg-[#F7EBD6] text-[#7C6A2E] border-[#EDE3C8]';
  if (status === 'Completed') return 'bg-[#EAF0F6] text-[#3F6897] border-[#DCE6EE]';
  if (status === 'Declined') return 'bg-[#FDE8E8] text-[#9B3434] border-[#F5D4D4]';
  return 'bg-[#FFF4E6] text-[#C27D2C] border-[#F2E4C9]';
}

const OverviewMain = () => {
  const [overview, setOverview] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, profileRes] = await Promise.all([
        djAPI.getOverview(),
        djAPI.getProfile(),
      ]);
      if (overviewRes.ok && overviewRes.data?.data) setOverview(overviewRes.data.data);
      if (profileRes.ok && profileRes.data?.user) setProfile(profileRes.data.user);
    } catch (error) {
      console.error("Failed to load overview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalBookings = overview?.totalBookings ?? 0;
  const upcomingCount = overview?.upcomingCount ?? 0;
  const completedCount = overview?.completedCount ?? 0;
  const recentActivity = overview?.recentActivity ?? [];
  const allMonthlyData: number[] = overview?.monthlyData ?? Array(12).fill(0);

  // Build 6-bar chart: 5 previous months + current month (current is last bar)
  const now = new Date();
  const currentMonthIdx = now.getMonth(); // 0-based
  const sixBars = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (currentMonthIdx - 5 + i + 12) % 12;
    return { label: MONTHS[monthIdx], count: allMonthlyData[monthIdx] };
  });
  const maxBar = Math.max(...sixBars.map(b => b.count), 1);

  const displayName = isLoading ? '...' : profile ? `${profile.firstName} ${profile.lastName}` : 'DJ Artist';

  const statCards = [
    { title: "TOTAL BOOKINGS",  value: totalBookings.toString(),  sub: "All time jobs",         icon: <Music        size={22} className="text-[#B08D2C]" /> },
    { title: "UPCOMING EVENTS", value: upcomingCount.toString(),  sub: "Needs preparation",     icon: <Calendar     size={22} className="text-[#B08D2C]" /> },
    { title: "COMPLETED SETS",  value: completedCount.toString(), sub: "Successfully finished", icon: <CheckCircle2 size={22} className="text-[#B08D2C]" /> },
    { title: "AVERAGE RATING",  value: "4.9",                    sub: "★★★★★",               icon: <Star         size={22} className="text-[#B08D2C]" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">

        {/* Page Header */}
        <div className="mb-8 mt-4">
          <p className="text-sm font-serif italic text-[#A6955C] mb-1">DJ Artist Dashboard</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Welcome back, {isLoading ? "..." : displayName}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            Your curated schedule for the season ahead. Track bookings, reviews, and upcoming performances.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-10">
          {statCards.map((card) => (
            <div key={card.title} className="group border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm hover:shadow-md hover:border-[#B08D2C] transition-all duration-300 flex items-center justify-between min-h-[110px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#7C6A2E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600 transition-colors mb-3">{card.title}</p>
                <p className="text-4xl font-serif text-[#7C6A2E] font-bold tracking-tight">{card.value}</p>
                <p className="mt-2 text-[11px] text-gray-500 font-medium">{card.sub}</p>
              </div>
              <div className="opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10 bg-white p-3 rounded-full border border-[#E0D8C3] shadow-inner">
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="mt-0 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">

          {/* Monthly Bookings Bar Chart - Dynamic */}
          <article className="min-h-[420px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8">
            <div className="mb-12 flex items-start justify-between gap-4">
              <h2 className="mb-2 text-[28px] font-serif text-gray-800">Monthly Bookings</h2>
              <span className="mt-2 text-[15px] font-serif text-gray-500">
                Annual View ({overview?.currentYear ?? new Date().getFullYear()})
              </span>
            </div>
            <div className="flex h-[210px] items-end gap-3">
              {sixBars.map(({ label, count }, idx) => {
                const isCurrentMonth = idx === 5; // last bar is current month
                const pct = maxBar > 0 ? Math.round((count / maxBar) * 100) : 0;
                return (
                  <div key={label + idx} className="flex flex-1 flex-col items-center group cursor-pointer">
                    <div className={`relative h-[185px] w-full rounded-t-lg overflow-hidden border shadow-inner group-hover:bg-[#FDF9F1] transition-colors ${
                      isCurrentMonth ? 'bg-[#FEF9E8] border-[#D4B553]' : 'bg-[#FAF6EE] border-[#E7DDCC]'
                    }`}>
                      {pct > 0 && (
                        <div
                          className={`absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-700 ease-in-out group-hover:opacity-90 ${
                            isCurrentMonth
                              ? 'bg-gradient-to-t from-[#B08D2C] to-[#F0C040]'
                              : pct > 60
                              ? 'bg-gradient-to-t from-[#5E4F20] to-[#7C6A2E]'
                              : 'bg-gradient-to-t from-[#B08D2C] to-[#D4B553]'
                          }`}
                          style={{ height: `${pct}%` }}
                          title={`${count} booking${count !== 1 ? 's' : ''}`}
                        />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest mt-2 ${
                      isCurrentMonth ? 'text-[#B08D2C] underline underline-offset-2' : 'text-[#7C6A2E]'
                    }`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Recent Activity */}
          <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-sm">
            <h2 className="mb-2 text-[28px] font-serif text-gray-800">Recent Activity</h2>
            <div className="mt-5 space-y-4">
              {isLoading ? (
                <div className="py-8 text-center text-sm font-serif italic text-gray-400">Loading...</div>
              ) : recentActivity.length === 0 ? (
                <div className="py-8 text-center text-sm font-serif italic text-gray-500">No recent activity</div>
              ) : recentActivity.map((activity: any) => (
                <div key={activity._id} className="group flex items-start gap-4 border-b border-[#E0D8C3] pb-4 last:border-b-0 cursor-pointer">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[#E0D8C3] bg-[#FDF9F1] group-hover:bg-[#F2EADA] text-[#7C6A2E] transition-colors rounded-sm shadow-sm">
                    <Calendar size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-800 group-hover:text-[#7C6A2E] transition-colors">
                        {activity.clientName ? `${activity.clientName}'s ${activity.eventType}` : activity.eventType}
                      </p>
                      <span className={`whitespace-nowrap border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] rounded-sm ${statusClass(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-gray-500 font-medium">{activity.packageName}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-gray-400">
                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#7C6A2E]">
              View all activity
            </button>
          </article>
        </div>

        {/* Spotlight Banner */}
        <div className="mt-10">
          <section className="relative overflow-hidden border border-[#E0D8C3] bg-[#3E2D16] text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80')" }}
            />
            <div className="relative flex min-h-[190px] flex-col justify-end p-8 md:max-w-[70%]">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-[#D7B85F]">Featured Performance</p>
              <h3 className="max-w-xl font-serif text-[32px] leading-tight">
                Your Summer Wedding Season Mix is Ready.
              </h3>
              <button className="mt-5 w-fit bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2A2112] transition hover:bg-[#F6E9C6]">
                Download Mix
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OverviewMain;
