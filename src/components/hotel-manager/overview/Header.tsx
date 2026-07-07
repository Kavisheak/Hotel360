"use client";

import React, { useState } from 'react';
import { Bell, HelpCircle, Search, Plus } from 'lucide-react';
import Link from 'next/link';
import NewBookingMain from '../bookings/new/NewBookingMain';

const ManagerHeader = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex justify-between items-center px-4 lg:px-6 h-16 w-full">
        {/* Left: Page title */}
        <div className="flex items-center gap-6 lg:gap-10 pl-10 lg:pl-0">
          <h2 className="font-serif italic text-[#7C6A2E] text-xl lg:text-2xl font-semibold tracking-wide">
            Overview
          </h2>
        </div>

        {/* Right: Search + Icons + Avatar */}
        <div className="flex items-center gap-3 lg:gap-5">
          {/* Search */}
          <div className={`hidden sm:flex items-center gap-2 border rounded-md px-3 py-1.5 transition-colors bg-white ${
            isSearchFocused ? 'border-[#B08D2C]' : 'border-[#E0D8C3]'
          }`}>
            <Search size={14} className="text-gray-400" />
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
            className="hidden sm:flex items-center gap-2 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-4 py-2 rounded text-xs font-bold tracking-widest uppercase transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            New Booking
          </button>

          {/* Icons */}
          <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 hover:text-[#7C6A2E] transition-colors">
            <Bell size={18} />
          </button>
          <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 hover:text-[#7C6A2E] transition-colors hidden sm:block">
            <HelpCircle size={18} />
          </button>

          {/* Avatar */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv0rt5w6JHhyT0aULGsvUTEhH0YGbA1Gd8ZrFx43b_uzbKWemyf_4_Qp48TJQ9vH9iTw-SGP8hB3e93Cq3gbm_IUhqcluJMXvuLBMvDUP0D8FPGXBGIqhu8_RPsBa5rNKXl4yD0YbQ7ozuhMGKOe8oSUXCdtVaxq2h2IcNZqCyDNuQbkTvNSjVNstk0B9_r9AfVTRKYpsOmV2BI5HGSFrE-Q-BOvnTzomP_bXb8jk_Zep4l6sU5VW0SOV3lUdKALmUgU_-mN2eCsU"
            alt="Manager Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-[#E0D8C3] cursor-pointer hover:border-[#B08D2C] transition-colors"
          />
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
