"use client";

import React from "react";
import { User, Bell, CreditCard, Settings, CalendarDays, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export type AccountTab = "profile" | "security" | "preferences" | "notifications" | "billing" | "bookings";

interface AccountSidebarProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

const TABS: { id: AccountTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  { id: "security", label: "Security", icon: <Settings className="w-4 h-4" /> },
  { id: "bookings", label: "Booking History", icon: <CalendarDays className="w-4 h-4" /> },
  { id: "billing", label: "Payment Methods", icon: <CreditCard className="w-4 h-4" /> },
  { id: "preferences", label: "Preferences", icon: <Settings className="w-4 h-4" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
];

export default function AccountSidebar({ activeTab, onTabChange }: AccountSidebarProps) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#E8DFC9] dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="p-3">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-md transition-all duration-200 btn-interactive mb-1 ${
                isActive
                  ? "bg-[#FAF6EE] dark:bg-[#2C1E14]/40 text-[#C69C6D] shadow-[inset_3px_0_0_#C69C6D] font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-[#FAF6EE]/50 dark:hover:bg-[#1A1A1A]/50 hover:text-[#1A1512] dark:hover:text-white"
              }`}
            >
              <span className={isActive ? "text-[#C69C6D]" : "text-gray-500"}>{tab.icon}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sign Out */}
      <div className="border-t border-[#E8DFC9] dark:border-gray-800 p-3 mt-4">
        <button 
          onClick={handleSignOut}
          className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 btn-interactive"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
