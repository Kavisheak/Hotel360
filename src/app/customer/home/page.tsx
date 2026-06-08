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

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Submit Auspicious Oils & Traditional Oil Lamp Requirements",
      subtext: "Setup Team Directive",
      color: "text-[#C9A84C]",
      completed: false
    },
    {
      id: 2,
      title: "Confirm Catering Menu Customizations",
      subtext: "Urgent due tomorrow",
      color: "text-red-500",
      completed: false
    },
    {
      id: 3,
      title: "Submit Guest List Count Variance (If above 380 baseline)",
      subtext: "Concierge Directive",
      color: "text-gray-400",
      completed: false
    }
  ]);

  const [notifications, setNotifications] = useState([
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
  ]);

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDismissNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const baseCompleted = 13;
  const totalTasks = 16;
  const visibleCompleted = tasks.filter(t => t.completed).length;
  const totalCompleted = baseCompleted + visibleCompleted;
  const progressPercent = Math.round((totalCompleted / totalTasks) * 100);

  const stats = [
    {
      label: "Checklist Progress",
      value: `${progressPercent}%`,
      subtext: `${totalCompleted} of ${totalTasks} completed`,
      icon: <CheckSquare className="w-5 h-5 text-[#C9A84C]" />,
      link: "#"
    },
    {
      label: "Payments Cleared",
      value: "50%",
      subtext: "LKR 1.85M of LKR 3.70M",
      icon: <CreditCard className="w-5 h-5 text-[#C9A84C]" />,
      link: "/customer/myaccount"
    },
    {
      label: "Creative Team",
      value: "3 Secured",
      subtext: "Decorator, DJ & Venue",
      icon: <Heart className="w-5 h-5 text-[#C9A84C]" />,
      link: "/customer/vendors"
    }
  ];

  return (
    <div className="bg-[#F0E6D0] min-h-screen">
      <MainNavbar />
      <div className="space-y-8 animate-fadeIn text-[#2C1E14] px-6 py-10 max-w-7xl mx-auto">
        {/* Top Welcome Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4C9A8]">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A84C] flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#C9A84C] animate-pulse" /> Welcome back, Farhan &amp; Zainab
            </span>
            <h2 className="text-3xl font-serif text-gray-900 leading-tight">
              Your Forever <span className="italic text-[#C9A84C]">Begins Soon</span>
            </h2>
            <p className="text-xs text-gray-500 font-light mt-1">
              Orchestrating your dream gala at EASCC Grand Ballroom.
            </p>
          </div>

          {/* Real-time Ticker Countdown Card */}
          <div className="pulse-glow bg-[#2C1E14] text-white px-5 py-3 rounded-sm border border-[#C9A84C]/25 shadow-md flex items-center gap-6">
            <div className="text-center">
              <span className="block text-2xl font-serif font-bold text-[#C9A84C]">{countdown.days}</span>
              <span className="text-[8px] uppercase tracking-wider text-gray-400">Days</span>
            </div>
            <span className="text-gray-600 font-light text-xl">:</span>
            <div className="text-center">
              <span className="block text-2xl font-serif font-bold text-[#C9A84C]">{countdown.hours}</span>
              <span className="text-[8px] uppercase tracking-wider text-gray-400">Hrs</span>
            </div>
            <span className="text-gray-600 font-light text-xl">:</span>
            <div className="text-center">
              <span className="block text-2xl font-serif font-bold text-[#C9A84C]">{countdown.minutes}</span>
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
              className={`bg-white border border-[#D4C9A8] p-5 shadow-sm rounded-sm hover:border-[#C9A84C] hover-lift hover-glow transition-all duration-300 block card-entrance stagger-${idx + 1}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{stat.label}</span>
                  <span className="block text-2xl font-serif font-bold text-gray-900 mt-1">{stat.value}</span>
                  <span className="block text-[10px] text-gray-500 font-light mt-1.5">{stat.subtext}</span>
                </div>
                <div className="bg-[#F0E6D0] p-2.5 rounded-sm border border-[#D4C9A8]/40">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F0E6D0] flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-[#C9A84C]">
                <span>Manage Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Booking Preview & Concierge messages */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#D4C9A8] p-6 shadow-sm rounded-sm hover-glow transition-all duration-300">
              <h3 className="text-lg font-serif text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A84C]" /> Ceremony Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-light">
                  <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
                    <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Venue Reserved</span>
                    <p className="font-semibold text-gray-900 mt-1">EASCC Grand Ballroom</p>
                  </div>
                  <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
                    <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Wedding Date</span>
                    <p className="font-semibold text-gray-900 mt-1">June 4, 2026</p>
                  </div>
                  <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
                    <span className="text-gray-400 uppercase text-[9px] tracking-wider font-bold">Timeslot Schedule</span>
                    <p className="font-semibold text-gray-900 mt-1">Evening Soiree (4pm - 10pm)</p>
                  </div>
                  <div className="bg-[#F0E6D0] p-3 rounded-sm hover:bg-[#E4D8BD] transition-colors">
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
                  className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] hover:text-[#2C1E14] transition-colors"
                >
                  View Detailed Booking Statement &rarr;
                </Link>
              </div>
            </div>

            {/* Quick Tasks Shortlist */}
            <div className="bg-white border border-[#D4C9A8] p-6 shadow-sm rounded-sm">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-lg font-serif text-gray-900">Pending Preparation Tasks</h3>
                <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                  {tasks.filter(t => !t.completed).length} Remaining
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-center gap-3 p-3 border hover:border-[#C9A84C]/30 hover:bg-[#F0E6D0]/40 rounded-sm transition-all duration-200 cursor-pointer ${task.completed ? 'border-emerald-100 bg-emerald-50/50' : 'border-gray-100'}`}
                  >
                    <input 
                      type="checkbox" 
                      className="accent-[#C9A84C] cursor-pointer" 
                      checked={task.completed} 
                      onChange={() => handleToggleTask(task.id)}
                    />
                    <div className={`flex-1 transition-all ${task.completed ? 'opacity-50 line-through' : ''}`}>
                      <span className="text-xs font-semibold text-gray-900">{task.title}</span>
                      <span className={`block text-[9px] uppercase font-bold tracking-wider mt-0.5 ${task.color}`}>
                        {task.subtext}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Concierge Messages & Alerts */}
          <div className="lg:col-span-5 space-y-6">
            {/* Notifications Card */}
            <div className="bg-[#2C1E14] text-white border border-[#C9A84C]/20 p-6 shadow-2xl rounded-sm hover-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif text-[#C9A84C] flex items-center gap-2">
                  <Bell className="w-4 h-4 animate-bounce" /> Concierge Directives
                </h3>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-6 text-center border-t border-white/10 text-gray-400">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-light">All caught up! No new directives.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="pb-4 border-b border-white/10 last:border-0 last:pb-0 p-2 rounded-sm transition-colors duration-200 -mx-2 group relative">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="text-xs font-bold text-[#F0E6D0] pr-6">{notif.title}</h4>
                        <span className="text-[8px] text-gray-500 font-semibold shrink-0 uppercase tracking-wider">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 font-light mt-1.5 leading-normal pr-4">
                        {notif.desc}
                      </p>
                      <button 
                        onClick={() => handleDismissNotif(notif.id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all btn-interactive"
                        title="Dismiss"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Resources / Tips */}
            <div className="bg-[#F0E6D0] border border-[#D4C9A8] p-5 rounded-sm hover-glow transition-all duration-300">
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#C9A84C] block mb-1">Planning Guide</span>
              <h4 className="text-sm font-serif font-semibold text-gray-900 mb-2">Did you know?</h4>
              <p className="text-xs font-light text-gray-500 leading-normal">
                EASCC collaborates directly with premium verified decorators, photographers, and local florists. You can select your creative team directly through your dashboard to link catering and setup timelines seamlessly.
              </p>
              <div className="mt-4">
                <Link 
                  href="/customer/vendors"
                  className="inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-[#C9A84C] hover:text-[#2C1E14] transition-colors"
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
