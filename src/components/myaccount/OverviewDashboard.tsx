"use client";

import React from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, AlertCircle, Shield, ChevronRight, LayoutGrid, Heart, Crown, Clock, Sparkles, Building2, Gift, HeadphonesIcon, Ticket, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useVendorCartStore } from "@/store/vendorCartStore";
import { useAuthStore } from "@/store/authStore";

export default function OverviewDashboard() {
  const { user } = useAuthStore();
  const { bookings } = useBookingStore();
  const { favoriteVendors } = useVendorCartStore();

  const totalBookings = bookings.length;
  const completedEvents = bookings.filter(b => b.status?.toLowerCase() === "completed").length;
  const pendingEvents = bookings.filter(b => b.status?.toLowerCase() === "pending").length;

  // Find the next upcoming reservation (Confirmed/Pending on a future date)
  const upcomingBooking = bookings
    .filter(b => b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const formatCurrency = (val: number) => "LKR " + (val || 0).toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Welcome Card */}
      <div className="relative overflow-hidden bg-[#FDF8EE] dark:bg-[#111111] p-8 border border-[#E8DFC9] dark:border-[#C9A84C]/20 shadow-sm rounded-xl text-left flex items-center justify-between">
        <div className="flex items-start gap-6 z-10 relative">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-[#C9A84C]/30 flex items-center justify-center shrink-0 shadow-sm">
            <LayoutGrid className="w-8 h-8 text-[#C9A84C]" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-serif text-3xl text-[#1A1512] dark:text-white mb-2">
              {user?.createdAt && (Date.now() - new Date(user.createdAt).getTime() < 1000 * 60 * 60 * 24)
                ? `Welcome to EASCCA, ${user?.firstName || "Guest"}!`
                : `Welcome Back, ${user?.firstName || "Guest"}!`
              }
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-light max-w-md leading-relaxed">
              Manage your luxury event arrangements, review payments, and customize your preferences from one central interface.
            </p>
          </div>
        </div>
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/3 opacity-30 pointer-events-none">
          <Building2 className="w-full h-full text-[#C9A84C] opacity-20 -mr-10 transform scale-150" strokeWidth={0.5} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL BOOKINGS", value: totalBookings.toString().padStart(2, "0"), icon: Calendar, color: "text-[#C9A84C]", bg: "bg-[#FAF6EE] dark:bg-[#C9A84C]/10" },
          { label: "COMPLETED", value: completedEvents.toString().padStart(2, "0"), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "PENDING REVIEW", value: pendingEvents.toString().padStart(2, "0"), icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "SAVED PARTNERS", value: (favoriteVendors?.length || 0).toString().padStart(2, "0"), icon: Heart, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm text-left flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} strokeWidth={2} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</span>
              </div>
              <p className="text-4xl font-serif text-gray-900 dark:text-white leading-none mb-6">
                {stat.value}
              </p>
            </div>
            <Link href={i === 0 || i === 1 || i === 2 ? "?tab=bookings" : "?tab=saved_vendors"} className="text-[11px] text-[#C9A84C] font-bold uppercase tracking-wider flex items-center justify-between w-full hover:text-black dark:hover:text-white transition-colors group">
              View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>

      {/* Main Grid: Active Reservation & Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Next Active Reservation Card */}
        <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-6 rounded-xl shadow-sm flex flex-col text-left">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#C9A84C]" />
              <h3 className="font-serif text-lg text-gray-900 dark:text-white">Active Reservation</h3>
            </div>
            <Link href="?tab=bookings" className="px-3 py-1 bg-[#FAF6EE] text-[#C9A84C] text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#E8DFC9] transition-colors">
              View All
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {upcomingBooking ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#C9A84C] capitalize">{upcomingBooking.eventName || upcomingBooking.eventType || "Classic Silver Package"}</h4>
                  <p className="text-xs text-gray-500 mt-1">Ref: {upcomingBooking.bookingRef || "LG-2026-2750"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm border-t border-b border-gray-100 dark:border-zinc-800/80 py-5">
                  <div>
                    <span className="text-gray-500 block mb-1 text-xs">Date</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {new Date(upcomingBooking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1 text-xs">Timeslot</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100 capitalize">{upcomingBooking.timeslot}</span>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30`}>
                    {upcomingBooking.status || "CONFIRMED"}
                  </span>
                </div>

                <Link href="?tab=bookings" className="block w-full py-3.5 mt-2 border border-[#E8DFC9] dark:border-[#C9A84C]/30 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest text-[#C9A84C] hover:bg-[#FAF6EE] dark:hover:bg-[#C9A84C]/10 transition-colors">
                  VIEW BOOKING DETAILS <ChevronRight className="w-3 h-3 inline ml-1 -mt-0.5" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm font-light italic">
                No active bookings found. Get started on booking your next elite event!
              </div>
            )}
          </div>
        </div>

        {/* Shortcuts Panel */}
        <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-6 rounded-xl shadow-sm text-left flex flex-col">
          <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-zinc-800/80 pb-4 mb-2">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
            <h3 className="font-serif text-lg text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="flex-1 flex flex-col">
            {[
              { title: "Book a New Event", desc: "Initiate our guided hall booking workflow.", href: "/book" },
              { title: "Browse Partners", desc: "Discover premium catering and entertainment.", href: "/packages" },
              { title: "Payment History", desc: "View your transactions and invoices.", href: "?tab=billing" },
              { title: "General Settings", desc: "Update your name, contact fields or security.", href: "?tab=profile" }
            ].map((link, idx) => (
              <Link key={idx} href={link.href} className="group py-4 border-b border-gray-50 dark:border-zinc-800/30 last:border-0 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-all px-2 -mx-2 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#C9A84C] transition-colors mb-0.5">{link.title}</h4>
                    <p className="text-[11px] text-gray-500 font-light">{link.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C9A84C] opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Gold Member Perks Banner */}
      <div className="mt-8 relative overflow-hidden bg-gradient-to-br from-[#FDF8EE] to-[#FAF3E0] dark:from-[#111111] dark:to-[#0A0A0A] p-8 border border-[#E8DFC9] dark:border-[#C9A84C]/30 shadow-sm rounded-xl text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D3F] dark:text-[#C9A84C] mb-1 block">EASCCA</span>
          <h3 className="font-serif text-3xl text-[#1A1512] dark:text-white flex items-center gap-2 mb-3">
            Gold Member <Crown className="w-6 h-6 text-[#C9A84C]" strokeWidth={1.5} />
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
            Thank you for being a valued member. Enjoy exclusive benefits and priority support.
          </p>
        </div>

        <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Priority Booking", icon: CheckCircle2 },
            { label: "Exclusive Offers", icon: Ticket },
            { label: "Dedicated Support", icon: HeadphonesIcon },
            { label: "Member Rewards", icon: Gift }
          ].map((perk, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full border border-[#C9A84C] bg-white dark:bg-[#1A1A1A] flex items-center justify-center shadow-sm">
                <perk.icon className="w-5 h-5 text-[#C9A84C]" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold text-[#2C1E14] dark:text-gray-300">{perk.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
