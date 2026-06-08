"use client";

import React from "react";
import { User, Bell, CreditCard, Settings, CalendarDays, LogOut } from "lucide-react";

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
  return (
    <div className="bg-white border border-[#D4C9A8] rounded-sm shadow-sm overflow-hidden hover-glow transition-all duration-300">
      <div className="p-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 btn-interactive mb-0.5 ${
                isActive
                  ? "bg-[#C9A84C] text-[#2C1E14] shadow-sm font-bold"
                  : "text-gray-500 hover:bg-[#F0E6D0]/50 hover:text-[#2C1E14]"
              }`}
            >
              <span className={isActive ? "text-[#2C1E14]" : "text-gray-400"}>{tab.icon}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sign Out */}
      <div className="border-t border-[#F0E6D0] p-2">
        <button className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 btn-interactive">
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
