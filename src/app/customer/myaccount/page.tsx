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
    <div className="bg-[#F0E6D0] min-h-screen flex flex-col font-sans text-[#2C1E14]">
      <MainNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 section-reveal">
        {/* Page Header */}
        <div className="mb-8 stagger-1">
          <Link
            href="/customer/home"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#2C1E14] transition-colors mb-4 btn-interactive"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2C1E14]">My Account</h1>
          <p className="text-sm text-gray-500 font-light mt-1">Manage your profile, security, bookings and preferences.</p>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 stagger-2">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <AccountOverview />
            <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-9">
            {/* Section Title Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4C9A8]">
              <div>
                <h2 className="text-xl font-serif text-[#2C1E14]">{currentSection.title}</h2>
                <p className="text-[10px] text-gray-400 font-light mt-0.5">{currentSection.subtitle}</p>
              </div>
            </div>

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
