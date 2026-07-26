"use client";

import React, { useState, useEffect, Suspense } from "react";
import MainNavbar from "@/components/landing/shared/MainNavbar";
import Footer from "@/components/landing/shared/Footer";
import AccountOverview from "@/components/myaccount/AccountOverview";
import AccountSidebar, { type AccountTab } from "@/components/myaccount/AccountSidebar";
import OverviewDashboard from "@/components/myaccount/OverviewDashboard";
import BookingHistory from "@/components/myaccount/BookingHistory";
import PaymentMethods from "@/components/myaccount/PaymentMethods";
import SavedVendors from "@/components/myaccount/SavedVendors";
import NotificationsSettings from "@/components/myaccount/NotificationsSettings";
import ProfileSettings from "@/components/myaccount/ProfileSettings";
import SecuritySettings from "@/components/myaccount/SecuritySettings";
import HelpSupport from "@/components/myaccount/HelpSupport";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useRouter, useSearchParams } from "next/navigation";

const TAB_TITLES: Record<AccountTab, { title: string; subtitle: string }> = {
  overview: { title: "Account Overview", subtitle: "A quick summary of your account metrics, recent bookings, and shortcuts." },
  bookings: { title: "My Bookings", subtitle: "View all your past and upcoming events at EASCC." },
  billing: { title: "Payments & Refunds", subtitle: "Manage your payments, transaction receipts, and refunds." },
  saved_vendors: { title: "Saved Vendors", subtitle: "Review and manage the service providers you favorited." },
  notifications: { title: "Notifications", subtitle: "Control how and when you receive alerts and communications." },
  profile: { title: "Profile & Settings", subtitle: "Update your personal credentials, contact info, and passwords." },
  help: { title: "Help & Support", subtitle: "Find answers to frequently asked questions or contact our concierge." },
};

function MyAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const tabParam = searchParams.get("tab") as AccountTab;
  const activeTab = (tabParam && Object.keys(TAB_TITLES).includes(tabParam)) ? tabParam : "overview";
  
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
    <div className="bg-[#FAF8F5] dark:bg-[#0A0A0A] min-h-screen flex flex-col font-sans text-[#1A1512] dark:text-white transition-colors duration-300">
      <MainNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 section-reveal">
        {/* Page Header */}
        <div className="mb-8 text-left">
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1512] dark:text-white">My Account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-500 font-light mt-1">Manage your profile, security, bookings and preferences.</p>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 stagger-2">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <AccountOverview />
            <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Right Center Content Panel */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header section of the tab */}
            <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 p-6 rounded-xl shadow-sm text-left">
              <h2 className="text-2xl font-serif text-gray-900 dark:text-white">{currentSection.title}</h2>
              <p className="text-xs text-gray-500 mt-1 font-light">{currentSection.subtitle}</p>
            </div>

            {/* Dynamic Content Panel */}
            <div className="card-entrance" key={activeTab}>
              {activeTab === "overview" && <OverviewDashboard />}
              {activeTab === "bookings" && <BookingHistory />}
              {activeTab === "billing" && <PaymentMethods />}
              {activeTab === "saved_vendors" && <SavedVendors />}
              {activeTab === "notifications" && <NotificationsSettings />}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <ProfileSettings />
                  <SecuritySettings />
                </div>
              )}
              {activeTab === "help" && <HelpSupport />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function MyAccountPage() {
  return (
    <Suspense fallback={
      <div className="bg-white dark:bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C69C6D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MyAccountContent />
    </Suspense>
  );
}
