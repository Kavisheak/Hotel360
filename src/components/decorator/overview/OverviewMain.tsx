"use client";

import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { Calendar, CheckCircle2, Star, DollarSign, Clock, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { decoratorAPI } from '@/lib/api';
import { getClientFullName } from '@/lib/vendorUtils';

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
        decoratorAPI.getOverview(),
        decoratorAPI.getProfile(),
      ]);
      if (overviewRes.ok && overviewRes.data?.data) setOverview(overviewRes.data.data);
      if (profileRes.ok && profileRes.data?.user) setProfile(profileRes.data.user);
    } catch (error) {
      console.error("Failed to load overview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const greeting = overview?.greeting || `Welcome back, ${profile?.shopName || profile?.firstName || 'Decorator'}!`;
  const businessName = overview?.businessName || profile?.shopName || `${profile?.firstName || 'Decorator'}'s Studio`;

  const pendingRequestsCount = overview?.pendingRequestsCount ?? 0;
  const upcomingJobsThisMonthCount = overview?.upcomingJobsThisMonthCount ?? 0;
  const avgRating = overview?.averageRating ?? 0;
  const ratingDisplay = avgRating > 0 ? avgRating.toFixed(1) : "—";
  const earningsThisMonth = overview?.earningsThisMonth ?? 0;
  const earningsDisplay = "LKR " + (earningsThisMonth || 0).toLocaleString();

  const recentActivity = overview?.recentActivity ?? [];
  const allMonthlyData: number[] = overview?.monthlyData ?? Array(12).fill(0);

  const alerts = overview?.alerts || {
    requestsExpiringSoon: [],
    newReviewsReceived: [],
    upcomingJobsNext48h: [],
  };

  // Build 6-bar chart: 5 previous months + current month (current is last bar)
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const sixBars = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (currentMonthIdx - 5 + i + 12) % 12;
    return { label: MONTHS[monthIdx], count: allMonthlyData[monthIdx] };
  });
  const maxBar = Math.max(...sixBars.map(b => b.count), 1);

  const statCards = [
    {
      title: "PENDING REQUESTS",
      value: pendingRequestsCount.toString(),
      sub: "Awaiting your response (48h)",
      icon: <Clock size={22} className="text-[#B08D2C]" />,
    },
    {
      title: "UPCOMING (THIS MONTH)",
      value: upcomingJobsThisMonthCount.toString(),
      sub: "Events scheduled this month",
      icon: <Calendar size={22} className="text-[#B08D2C]" />,
    },
    {
      title: "AVERAGE RATING",
      value: ratingDisplay,
      sub: avgRating > 0 ? `${overview?.totalReviews || 0} reviews received` : "No reviews yet",
      icon: <Star size={22} className="text-[#B08D2C]" />,
    },
    {
      title: "EARNINGS THIS MONTH",
      value: earningsDisplay,
      sub: "Net payouts collected",
      icon: <DollarSign size={22} className="text-[#B08D2C]" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1] font-sans">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">

        {/* Page Header: Greeting + Business Name */}
        <div className="mb-8 mt-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-serif italic text-[#A6955C]">Decorator Portal</span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs font-bold text-[#7C6A2E] tracking-wider uppercase">{businessName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-2">
            {isLoading ? "Loading..." : greeting}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl">
            Real-time business performance for <strong className="text-gray-800">{businessName}</strong>. Track pending requests, upcoming events, ratings, and monthly revenue.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
          {statCards.map((card) => (
            <div key={card.title} className="group border border-[#E0D8C3] bg-[#FDF9F1] p-5 shadow-xs hover:shadow-md hover:border-[#B08D2C] transition-all duration-300 flex items-center justify-between min-h-[110px] relative overflow-hidden rounded-md">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#7C6A2E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-600 transition-colors mb-2">{card.title}</p>
                <p className="text-3xl sm:text-4xl font-serif text-[#7C6A2E] font-bold tracking-tight">{card.value}</p>
                <p className="mt-1.5 text-[11px] text-gray-500 font-medium">{card.sub}</p>
              </div>
              <div className="opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10 bg-white p-3 rounded-full border border-[#E0D8C3] shadow-xs">
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ALERTS FEED BANNER */}
        {(alerts.requestsExpiringSoon?.length > 0 || alerts.newReviewsReceived?.length > 0 || alerts.upcomingJobsNext48h?.length > 0) && (
          <div className="mb-8 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Action Required &amp; Recent Alerts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Requests Expiring Soon */}
              {alerts.requestsExpiringSoon?.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-900">
                      {alerts.requestsExpiringSoon.length} Request(s) Expiring Soon!
                    </p>
                    <p className="text-amber-700 mt-0.5">
                      Less than 24 hours left to respond before automatic credit conversion.
                    </p>
                    <Link href="/decorator/bookings" className="mt-2 inline-flex items-center gap-1 font-bold text-amber-900 underline text-[11px]">
                      Respond Now <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Upcoming Jobs in Next 48 Hours */}
              {alerts.upcomingJobsNext48h?.length > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-blue-900">
                      {alerts.upcomingJobsNext48h.length} Job(s) in Next 48 Hours
                    </p>
                    <p className="text-blue-700 mt-0.5">
                      Review inventory &amp; setup preparation checklist.
                    </p>
                    <Link href="/decorator/my-jobs" className="mt-2 inline-flex items-center gap-1 font-bold text-blue-900 underline text-[11px]">
                      View Preparation Checklist <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* New Reviews Received */}
              {alerts.newReviewsReceived?.length > 0 && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-900">
                      {alerts.newReviewsReceived.length} New Review(s) Received
                    </p>
                    <p className="text-emerald-700 mt-0.5">
                      Customer feedback posted in the last 7 days.
                    </p>
                    <Link href="/decorator/ratings" className="mt-2 inline-flex items-center gap-1 font-bold text-emerald-900 underline text-[11px]">
                      See Ratings <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="mt-0 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">

          {/* Monthly Bookings Bar Chart */}
          <article className="min-h-[400px] border border-[#E7DDCC] bg-[#F8F4EC] p-6 lg:p-8 rounded-md shadow-xs">
            <div className="mb-10 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif text-gray-800">Monthly Event Volume</h2>
                <p className="text-xs text-gray-500 mt-0.5">Annual tracking for season {overview?.currentYear ?? new Date().getFullYear()}</p>
              </div>
              <span className="text-xs font-serif italic text-[#7C6A2E]">
                {businessName}
              </span>
            </div>
            <div className="flex h-[200px] items-end gap-3">
              {sixBars.map(({ label, count }, idx) => {
                const isCurrentMonth = idx === 5;
                const pct = maxBar > 0 ? Math.round((count / maxBar) * 100) : 0;
                return (
                  <div key={label + idx} className="flex flex-1 flex-col items-center group cursor-pointer">
                    <div className={`relative h-[175px] w-full rounded-t-lg overflow-hidden border shadow-inner group-hover:bg-[#FDF9F1] transition-colors ${
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
          <article className="border border-[#E0D8C3] bg-[#FDF9F1] p-6 shadow-xs rounded-md">
            <h2 className="mb-2 text-2xl font-serif text-gray-800">Recent Requests &amp; Jobs</h2>
            <div className="mt-5 space-y-4">
              {isLoading ? (
                <div className="py-8 text-center text-sm font-serif italic text-gray-400">Loading activity...</div>
              ) : recentActivity.length === 0 ? (
                <div className="py-8 text-center text-sm font-serif italic text-gray-500">No recent assigned bookings</div>
              ) : recentActivity.map((activity: any) => (
                <div key={activity._id} className="group flex items-start gap-4 border-b border-[#E0D8C3] pb-4 last:border-b-0 cursor-pointer">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-[#E0D8C3] bg-[#FDF9F1] group-hover:bg-[#F2EADA] text-[#7C6A2E] transition-colors rounded-sm shadow-xs">
                    <Calendar size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-800 group-hover:text-[#7C6A2E] transition-colors">
                        {`${activity.eventType} for ${getClientFullName(activity)}`}
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
            <Link href="/decorator/my-jobs" className="mt-5 inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 transition hover:text-[#7C6A2E]">
              View All Assigned Jobs →
            </Link>
          </article>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default OverviewMain;
