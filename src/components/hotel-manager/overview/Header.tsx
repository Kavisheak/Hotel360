"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, HelpCircle, Search, Plus, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import NewBookingMain from '../bookings/new/NewBookingMain';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const ManagerHeader = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      await authAPI.signout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearUser();
      router.replace('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0D8C3]/60 flex justify-between items-center px-4 lg:px-8 h-16 w-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all">
        {/* Left: Page title */}
        <div className="flex items-center gap-6 lg:gap-10 pl-10 lg:pl-0">
          <h2 className="font-serif italic text-[#7C6A2E] text-xl lg:text-2xl font-semibold tracking-wide">
            Overview
          </h2>
        </div>

        {/* Right: Search + Icons + Avatar */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Search */}
          <div className={`hidden sm:flex items-center gap-2 border rounded-full px-4 py-1.5 transition-all duration-300 bg-gray-50/50 ${
            isSearchFocused ? 'border-[#B08D2C] ring-2 ring-[#B08D2C]/20 bg-white' : 'border-gray-200'
          }`}>
            <Search size={14} className={isSearchFocused ? "text-[#7C6A2E]" : "text-gray-400"} />
            <input
              type="text"
              placeholder="Search events..."
              className="bg-transparent border-none focus:outline-none text-xs w-28 lg:w-44 text-gray-600 placeholder:text-gray-400"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* New Booking Button */}
          <button 
            onClick={() => setIsNewBookingOpen(true)} 
            className="hidden sm:flex items-center gap-2 bg-[#7C6A2E] hover:bg-[#6A5A27] text-white px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
          >
            <Plus size={16} />
            New Booking
          </button>

          {/* Notifications */}
          <NotificationCenter role="hotel_manager" />
          <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 hover:text-[#7C6A2E] transition-colors hidden sm:block">
            <HelpCircle size={18} />
          </button>

          {/* Avatar */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv0rt5w6JHhyT0aULGsvUTEhH0YGbA1Gd8ZrFx43b_uzbKWemyf_4_Qp48TJQ9vH9iTw-SGP8hB3e93Cq3gbm_IUhqcluJMXvuLBMvDUP0D8FPGXBGIqhu8_RPsBa5rNKXl4yD0YbQ7ozuhMGKOe8oSUXCdtVaxq2h2IcNZqCyDNuQbkTvNSjVNstk0B9_r9AfVTRKYpsOmV2BI5HGSFrE-Q-BOvnTzomP_bXb8jk_Zep4l6sU5VW0SOV3lUdKALmUgU_-mN2eCsU"
                alt="Manager Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#7C6A2E]/30 transition-all"
              />
            </button>
            
            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-fadeIn">
                <Link 
                  href="/hotel-manager/settings" 
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#FDF9F1] hover:text-[#7C6A2E] transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings size={16} />
                  Account Preferences
                </Link>
                <hr className="my-1 border-[#E0D8C3]" />
                <button 
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* New Booking Modal Popup */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDF9F1] w-full max-w-6xl rounded shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#E0D8C3] animate-fadeIn text-left">
            <NewBookingMain 
              onClose={() => setIsNewBookingOpen(false)}
              onSuccess={() => {
                setIsNewBookingOpen(false);
                window.location.href = "/hotel-manager/bookings";
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerHeader;
