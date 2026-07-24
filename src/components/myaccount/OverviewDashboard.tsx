"use client";

import React from "react";
import Link from "next/link";
import { Calendar, CheckCircle2, AlertCircle, Shield, ChevronRight, LayoutGrid, Heart, Crown, Clock } from "lucide-react";
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
      <div className="relative overflow-hidden bg-gradient-to-r from-[#2C1E14] to-[#1A110B] dark:from-[#111] dark:to-[#050505] p-8 border border-[#C9A84C]/20 shadow-lg rounded-xl text-left">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
        <h2 className="font-serif text-3xl text-white mb-2">Welcome Back, {user?.firstName || "Guest"}!</h2>
        <p className="text-gray-300 text-sm font-light max-w-lg leading-relaxed">
          Manage your luxury event arrangements, review payments, and customize your preferences from one central interface.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: totalBookings.toString().padStart(2, "0"), icon: Calendar, color: "text-blue-500" },
          { label: "Completed", value: completedEvents.toString().padStart(2, "0"), icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Pending Review", value: pendingEvents.toString().padStart(2, "0"), icon: AlertCircle, color: "text-amber-500" },
          { label: "Saved Partners", value: (favoriteVendors?.length || 0).toString().padStart(2, "0"), icon: Heart, color: "text-red-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-5 rounded-xl shadow-sm text-left">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-serif font-bold text-gray-900 dark:text-white leading-none">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid: Active Reservation & Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Next Active Reservation Card */}
        <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-6 rounded-xl shadow-sm flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#C9A84C]" />
              <h3 className="font-serif text-lg text-gray-900 dark:text-white">Active Reservation</h3>
            </div>
            {upcomingBooking ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-[#C9A84C] text-sm capitalize">{upcomingBooking.eventName || upcomingBooking.eventType}</h4>
                  <p className="text-xs text-gray-400 mt-1">Ref: {upcomingBooking.bookingRef}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 dark:border-zinc-800/80 pt-3">
                  <div>
                    <span className="text-gray-500 block">Date</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {new Date(upcomingBooking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Timeslot</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{upcomingBooking.timeslot}</span>
                  </div>
                </div>
                <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded border mt-2
                  ${upcomingBooking.status?.toLowerCase() === "confirmed" 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400" 
                    : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400"}`}
                >
                  {upcomingBooking.status}
                </span>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm font-light italic">
                No active bookings found. Get started on booking your next elite event!
              </div>
            )}
          </div>

          <div className="pt-6 mt-4 border-t border-gray-100 dark:border-zinc-800/80">
            <Link href="?tab=bookings" className="text-xs text-[#C9A84C] hover:text-black dark:hover:text-white font-bold uppercase tracking-wider flex items-center gap-1">
              View All Bookings <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Shortcuts Panel */}
        <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-6 rounded-xl shadow-sm text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-[#C9A84C]" />
              <h3 className="font-serif text-lg text-gray-900 dark:text-white">Quick Tasks</h3>
            </div>
            <div className="space-y-3">
              {[
                { title: "Book a New Event", desc: "Initiate our guided hall booking workflow.", href: "/book" },
                { title: "Browse Partners", desc: "Discover premium catering and entertainment.", href: "/customer/vendors" },
                { title: "General Settings", desc: "Update your name, contact fields or security.", href: "?tab=profile" }
              ].map((link, idx) => (
                <Link key={idx} href={link.href} className="group block p-3 rounded-lg border border-gray-50 dark:border-zinc-800/30 hover:border-[#C9A84C]/30 bg-gray-50/50 dark:bg-zinc-800/20 hover:bg-white dark:hover:bg-[#1A1A1A] transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-[#C9A84C] transition-colors">{link.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{link.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C9A84C] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
