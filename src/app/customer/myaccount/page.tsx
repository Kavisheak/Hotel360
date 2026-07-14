"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, MoreVertical, Crown, Bell, Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import AccountOverview from "@/components/myaccount/AccountOverview";
import AccountSidebar, { type AccountTab } from "@/components/myaccount/AccountSidebar";
import ProfileSettings from "@/components/myaccount/ProfileSettings";
import SecuritySettings from "@/components/myaccount/SecuritySettings";
import NotificationsSettings from "@/components/myaccount/NotificationsSettings";
import PaymentMethods from "@/components/myaccount/PaymentMethods";
import Preferences from "@/components/myaccount/Preferences";
import BookingHistory from "@/components/myaccount/BookingHistory";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useRouter, useSearchParams } from "next/navigation";

const TAB_TITLES: Record<AccountTab, { title: string; subtitle: string }> = {
  profile: { title: "Personal Information", subtitle: "Update your name, email, phone and address." },
  security: { title: "Security Settings", subtitle: "Manage your password and two-factor authentication." },
  bookings: { title: "Booking History", subtitle: "View all your past and upcoming events at EASCC." },
  billing: { title: "Payment Methods", subtitle: "Manage your saved cards and billing details." },
  preferences: { title: "General Preferences", subtitle: "Customize your language, timezone and display settings." },
  notifications: { title: "Notification Preferences", subtitle: "Control how and when you receive alerts." },
};

export default function MyAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tabParam = searchParams.get("tab") as AccountTab;
  const activeTab = (tabParam && Object.keys(TAB_TITLES).includes(tabParam)) ? tabParam : "profile";
  
  const currentSection = TAB_TITLES[activeTab];
  
  const { user, fetchUser, isLoading } = useAuthStore();
  const fetchUserBookings = useBookingStore(state => state.fetchUserBookings);

  const setActiveTab = (tab: AccountTab) => {
    router.push(`?tab=${tab}`);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && user) {
      fetchUserBookings();
    }
  }, [isLoading, user, router, fetchUserBookings]);

  if (!user) {
    return (
      <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C69C6D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white transition-colors duration-300">
      <MainNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 section-reveal">
        {/* Page Header */}
        <div className="mb-8 stagger-1">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1512] dark:text-white">My Account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-500 font-light mt-1">Manage your profile, security, bookings and preferences.</p>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 stagger-2">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <AccountOverview />
            <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Center Content */}
          <div className="lg:col-span-6">
            {/* Dynamic Content */}
            <div className="space-y-8 card-entrance" key={activeTab}>
              {activeTab === "profile" && <ProfileSettings />}
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "bookings" && <BookingHistory />}
              {activeTab === "billing" && <PaymentMethods />}
              {activeTab === "preferences" && <Preferences />}
              {activeTab === "notifications" && <NotificationsSettings />}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Upcoming Reservation */}
            <div className="bg-white border border-[#E8DFC9] rounded shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#1A1512]">
                  <Calendar className="w-4 h-4 text-[#C9A84C]" />
                  <h4 className="font-serif text-[15px]">Upcoming Reservation</h4>
                </div>
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </div>
              <div className="relative h-[110px] rounded overflow-hidden mb-4">
                <Image src="/luxury_ballroom_bg.png" alt="Venue" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <h5 className="font-bold text-[14px] text-[#1A1512] mb-1">Grand Ballroom</h5>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4 font-medium tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>June 22, 2026 • 6:00 PM</span>
              </div>
              <span className="inline-block px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[9px] font-bold uppercase tracking-widest rounded mb-5">
                Confirmed
              </span>
              <button className="w-full py-2.5 border border-[#E8DFC9] rounded text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#FAF6EE] transition-colors flex items-center justify-center gap-2">
                View Reservation <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Account Summary */}
            <div className="bg-white border border-[#E8DFC9] rounded shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6">
              <h4 className="font-serif text-[18px] text-[#1A1512] mb-6">Account Summary</h4>
              <div className="space-y-4 text-[12px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Calendar className="w-4 h-4 text-[#C9A84C]" />
                    <span>Total Bookings</span>
                  </div>
                  <span className="font-bold text-[#1A1512] text-[14px]">05</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Calendar className="w-4 h-4 text-[#C9A84C]" />
                    <span>Completed Events</span>
                  </div>
                  <span className="font-bold text-[#1A1512] text-[14px]">03</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Crown className="w-4 h-4 text-[#C9A84C]" />
                    <span>Favorite Venues</span>
                  </div>
                  <span className="font-bold text-[#1A1512] text-[14px]">12</span>
                </div>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#E8DFC9]/50">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Crown className="w-4 h-4 text-[#C9A84C]" />
                    <span>Membership</span>
                  </div>
                  <span className="font-bold text-[#1A1512] text-[14px]">Gold</span>
                </div>
              </div>
              <button className="mt-6 text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] flex items-center gap-2 hover:opacity-80 transition-opacity">
                View All Bookings <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Need assistance? */}
            <div className="bg-white border border-[#E8DFC9] rounded shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 opacity-20 pointer-events-none">
                <Image src="/luxury_ballroom_bg.png" alt="bg" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-[#FAF6EE] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8DFC9]">
                  <Bell className="w-6 h-6 text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <h4 className="font-serif text-[18px] text-[#1A1512] mb-2">Need assistance?</h4>
                <p className="text-[11px] text-gray-500 mb-6 px-2 tracking-wide leading-relaxed">Our concierge team is here to help you plan your perfect event.</p>
                <button className="w-full py-2.5 border border-[#C9A84C] rounded text-[10px] font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#FAF6EE] transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-3 h-3" /> Contact Concierge
                </button>
              </div>
            </div>
          </div>
        </div>


      </main>

      <Footer />
    </div>
  );
}
