import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <div className="mb-8 mt-4">
      <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E]">
            <User size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-800 tracking-wide">Videographer Portal</h4>
            <p className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">PROFILE & PREFERENCES</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="border border-[#E0D8C3] bg-[#FAF6EE] px-3 py-1 text-[9px] font-bold tracking-[0.18em] text-[#7C6A2E] uppercase">
            Status: Available
          </span>
          <button className="relative w-8 h-8 rounded-full bg-white border border-[#E0D8C3] flex items-center justify-center text-gray-600 hover:text-[#7C6A2E] hover:border-[#B08D2C] transition-colors">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C75A5A]" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 font-bold tracking-tight leading-none mb-3">
            Professional Settings
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            Manage your videographer profile, booking presence, and account preferences for the season ahead.
          </p>
        </div>

        <button className="flex items-center justify-center space-x-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-6 py-3 font-semibold text-xs tracking-widest transition-colors shadow-md shrink-0 self-start sm:mt-1">
          <span>SAVE CHANGES</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
