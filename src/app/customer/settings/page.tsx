"use client";

import React, { useState } from "react";
import MainNavbar from "@/components/Landing/shared/MainNavbar";
import AccountOverview from "@/components/myaccount/AccountOverview";
import ProfileSettings from "@/components/myaccount/ProfileSettings";
import SecuritySettings from "@/components/myaccount/SecuritySettings";
import NotificationsSettings from "@/components/myaccount/NotificationsSettings";
import PaymentMethods from "@/components/myaccount/PaymentMethods";
import Preferences from "@/components/myaccount/Preferences";

const TABS = [
  "Overview",
  "Profile",
  "Security",
  "Notifications",
  "Payments",
  "Preferences",
];

export default function CustomerSettingsPage() {
  const [tab, setTab] = useState<string>("Overview");

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      <MainNavbar />
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif text-gray-900">My Account</h1>
          <div className="text-sm text-gray-500">Manage your account settings</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <AccountOverview />

            <div className="bg-white border border-[#E8DFC9] p-4 rounded-sm">
              <nav className="space-y-2">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`w-full text-left px-3 py-2 rounded-sm text-sm font-medium ${tab === t ? "bg-[#FAF6EE] border border-[#E8DFC9] text-[#C69C6D]" : "text-gray-700 hover:bg-[#FAF6EE]"}`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            {tab === "Overview" && (
              <div className="space-y-6">
                <AccountOverview />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileSettings />
                  <SecuritySettings />
                </div>
              </div>
            )}

            {tab === "Profile" && <ProfileSettings />}
            {tab === "Security" && <SecuritySettings />}
            {tab === "Notifications" && <NotificationsSettings />}
            {tab === "Payments" && <PaymentMethods />}
            {tab === "Preferences" && <Preferences />}
          </main>
        </div>
      </div>
    </div>
  );
}
