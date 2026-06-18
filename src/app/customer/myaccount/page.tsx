"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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

const TAB_TITLES: Record<AccountTab, { title: string; subtitle: string }> = {
  profile: { title: "Personal Information", subtitle: "Update your name, email, phone and address." },
  security: { title: "Security Settings", subtitle: "Manage your password and two-factor authentication." },
  bookings: { title: "Booking History", subtitle: "View all your past and upcoming events at EASCC." },
  billing: { title: "Payment Methods", subtitle: "Manage your saved cards and billing details." },
  preferences: { title: "General Preferences", subtitle: "Customize your language, timezone and display settings." },
  notifications: { title: "Notification Preferences", subtitle: "Control how and when you receive alerts." },
};

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const currentSection = TAB_TITLES[activeTab];

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white transition-colors duration-300">
      <MainNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 section-reveal">
        {/* Page Header */}
        <div className="mb-8 stagger-1">
          <Link
            href="/customer/home"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1512] dark:text-gray-400 dark:hover:text-white transition-colors mb-6 btn-interactive"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1512] dark:text-white">My Account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-500 font-light mt-1">Manage your profile, security, bookings and preferences.</p>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 stagger-2">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <AccountOverview />
            <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8">

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
        </div>
      </main>

      <Footer />
    </div>
  );
}
