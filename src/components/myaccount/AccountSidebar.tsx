"use client";

import React from "react";
import { LayoutGrid, Calendar, Receipt, Heart, Bell, User, HelpCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export type AccountTab = "overview" | "bookings" | "billing" | "saved_vendors" | "notifications" | "profile" | "help";

interface AccountSidebarProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

const TABS: { id: AccountTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutGrid className="w-5 h-5" /> },
  { id: "bookings", label: "My bookings", icon: <Calendar className="w-5 h-5" /> },
  { id: "billing", label: "Payments & refunds", icon: <Receipt className="w-5 h-5" /> },
  { id: "saved_vendors", label: "Saved vendors", icon: <Heart className="w-5 h-5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
  { id: "profile", label: "Profile & settings", icon: <User className="w-5 h-5" /> },
  { id: "help", label: "Help & support", icon: <HelpCircle className="w-5 h-5" /> },
];

export default function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authAPI.signout();
    } finally {
      useAuthStore.getState().clearUser();
      router.replace('/login');
    }
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden p-3 space-y-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-[#E8F0FE] dark:bg-blue-950/40 text-[#1A73E8] dark:text-blue-400 font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800/40 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <span className={isActive ? "text-[#1A73E8] dark:text-blue-400" : "text-gray-500"}>
              {tab.icon}
            </span>
            <span className="text-[14px] tracking-wide font-sans">{tab.label}</span>
          </button>
        );
      })}

      {/* Sign Out */}
      <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-2 mt-2">
        <button 
          onClick={handleSignOut}
          className="w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[14px] tracking-wide font-sans font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
