"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, CheckSquare, CreditCard, Sparkles, 
  ArrowRight, Users, Bell, Heart, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';

import MainNavbar from "@/components/landing/shared/MainNavbar";

export default function CustomerDashboard() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Target date is June 4, 2026
    const targetDate = new Date("2026-06-04T16:00:00").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown({ days: d, hours: h, minutes: m });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Checklist Progress",
      value: "72%",
      subtext: "13 of 18 completed",
      icon: <CheckSquare className="w-5 h-5 text-[#C69C6D]" />,
      link: "#"
    },
    {
      label: "Payments Cleared",
      value: "50%",
      subtext: "LKR 1.85M of LKR 3.70M",
      icon: <CreditCard className="w-5 h-5 text-[#C69C6D]" />,
      link: "#"
    },
    {
      label: "Creative Team",
      value: "3 Secured",
      subtext: "Decorator, DJ & Venue",
      icon: <Heart className="w-5 h-5 text-[#C69C6D]" />,
      link: "/customer/vendors"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Catering Menu Confirmation Required",
      desc: "Please review and finalize your selected menu options with your concierge by tomorrow evening.",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Bank Installment Receipt Vetted",
      desc: "Concierge office has approved your installment payment of LKR 1,200,000.",
      time: "Yesterday"
    }
  ];

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      <MainNavbar />
      <div className="space-y-8 animate-fadeIn text-[#1A1512] px-6 py-10 max-w-7xl mx-auto">
        {/* Top Welcome Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8DFC9]">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#C69C6D] flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#C69C6D] animate-pulse" /> Welcome back, Farhan & Zainab
          </span>
          <h2 className="text-3xl font-serif text-gray-900 leading-tight">
            Your Forever <span className="italic text-[#C69C6D]">Begins Soon</span>
          </h2>
          <p className="text-xs text-gray-500 font-light mt-1">
            Orchestrating your dream gala at EASCC Grand Ballroom.
          </p>
        </div>

        {/* Real-time Ticker Countdown Card */}
        <div className="bg-[#1A1512] text-white px-5 py-3 rounded-sm border border-[#C69C6D]/20 shadow-md flex items-center gap-6">
          <div className="text-center">
            <span className="block text-2xl font-serif font-bold text-[#C69C6D]">{countdown.days}</span>
            <span className="text-[8px] uppercase tracking-wider text-gray-400">Days</span>
          </div>
          <span className="text-gray-600 font-light text-xl">:</span>
          <div className="text-center">
            <span className="block text-2xl font-serif font-bold text-[#C69C6D]">{countdown.hours}</span>
            <span className="text-[8px] uppercase tracking-wider text-gray-400">Hrs</span>
          </div>
          <span className="text-gray-600 font-light text-xl">:</span>
          <div className="text-center">
            <span className="block text-2xl font-serif font-bold text-[#C69C6D]">{countdown.minutes}</span>
            <span className="text-[8px] uppercase tracking-wider text-gray-400">Mins</span>
          </div>
          <div className="border-l border-white/10 pl-4 text-xs font-light text-gray-400 max-w-[90px] leading-tight">
            Until Auspicious Ceremony
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Link 
            key={idx} 
            href={stat.link}
            className="bg-white border border-[#E8DFC9] p-5 shadow-sm rounded-sm hover:border-[#C69C6D] transition-all hover:translate-y-[-2px] duration-300 block"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{stat.label}</span>
                <span className="block text-2xl font-serif font-bold text-gray-900 mt-1">{stat.value}</span>
                <span className="block text-[10px] text-gray-500 font-light mt-1.5">{stat.subtext}</span>
              </div>
              <div className="bg-[#FAF6EE] p-2.5 rounded-sm border border-[#E8DFC9]/40">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#FAF6EE] flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#C69C6D]">
              <span>Manage Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Booking Preview & Concierge messages */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm">
            <h3 className="text-lg font-serif text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C69C6D]" /> Ceremony Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-light">
                <div className="bg-[#FAF6EE] p-3 rounded-sm">
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Venue Reserved</span>
                  <p className="font-semibold text-gray-900 mt-1">EASCC Grand Ballroom</p>
                </div>
                <div className="bg-[#FAF6EE] p-3 rounded-sm">
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Wedding Date</span>
                  <p className="font-semibold text-gray-900 mt-1">June 4, 2026</p>
                </div>
                <div className="bg-[#FAF6EE] p-3 rounded-sm">
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Timeslot Schedule</span>
                  <p className="font-semibold text-gray-900 mt-1">Evening Soiree (4pm - 10pm)</p>
                </div>
                <div className="bg-[#FAF6EE] p-3 rounded-sm">
                  <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Celebration Package</span>
                  <p className="font-semibold text-gray-900 mt-1">Gold Package (380 Pax)</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-4 flex gap-3 rounded-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Date Hold Vetted</h4>
                  <p className="text-[11px] text-gray-600 font-light mt-0.5 leading-relaxed">
                    EASCC Estate holds a 100% reservation guarantee for June 4, 2026. No other events are scheduled on this date.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <Link 
                href="/customer/book"
                className="text-[10px] uppercase font-bold tracking-widest text-[#C69C6D] hover:text-[#1A1512] transition-colors"
              >
                View Detailed Booking Statement &rarr;
              </Link>
            </div>
          </div>

          {/* Quick Tasks Shortlist */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm">
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="text-lg font-serif text-gray-900">Pending Preparation Tasks</h3>
              <Link href="#" className="text-[9px] uppercase tracking-widest font-bold text-[#C69C6D]">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-gray-100 hover:border-[#C69C6D]/20 rounded-sm">
                <input type="checkbox" className="accent-[#C69C6D] cursor-pointer" readOnly checked={false} />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-900">Submit Auspicious Oils & Traditional Oil Lamp Requirements</span>
                  <span className="block text-[9px] text-[#C69C6D] uppercase font-bold tracking-wider mt-0.5">Setup Team Directive</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-100 hover:border-[#C69C6D]/20 rounded-sm">
                <input type="checkbox" className="accent-[#C69C6D] cursor-pointer" readOnly checked={false} />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-900">Confirm Catering Menu Customizations</span>
                  <span className="block text-[9px] text-red-500 uppercase font-bold tracking-wider mt-0.5">Urgent due tomorrow</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-100 hover:border-[#C69C6D]/20 rounded-sm">
                <input type="checkbox" className="accent-[#C69C6D] cursor-pointer" readOnly checked={false} />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-gray-900">Submit Guest List Count Variance (If above 380 baseline)</span>
                  <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">Concierge Directive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Concierge Messages & Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notifications Card */}
          <div className="bg-[#1A1512] text-white border border-[#C69C6D]/20 p-6 shadow-2xl rounded-sm">
            <h3 className="text-lg font-serif text-[#C69C6D] mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 animate-bounce" /> Concierge Directives
            </h3>

            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} className="pb-4 border-b border-white/10 last:border-0 last:pb-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="text-xs font-bold text-[#FAF6EE]">{notif.title}</h4>
                    <span className="text-[8px] text-gray-500 font-semibold shrink-0 uppercase tracking-wider">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-light mt-1.5 leading-normal">
                    {notif.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Resources / Tips */}
          <div className="bg-[#FAF6EE] border border-[#E8DFC9] p-5 rounded-sm">
            <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#C69C6D] block mb-1">Planning Guide</span>
            <h4 className="text-sm font-serif font-semibold text-gray-900 mb-2">Did you know?</h4>
            <p className="text-xs font-light text-gray-500 leading-normal">
              EASCC collaborates directly with premium verified decorators, photographers, and local florists. You can select your creative team directly through your dashboard to link catering and setup timelines seamlessly.
            </p>
            <div className="mt-4">
              <Link 
                href="/customer/vendors"
                className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-[#C69C6D] hover:text-black transition-colors"
              >
                <span>Browse Creative Vendors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
