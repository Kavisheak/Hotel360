import React from 'react';
import { Bell, HelpCircle, Search } from 'lucide-react';

const Header = () => {
  return (
    <div className="border-b border-[#E0D8C3] bg-[#FDF9F1] px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Left: Portal Title + Search */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Admin Portal</p>
          <h2 className="text-xl font-serif font-bold text-[#7C6A2E] leading-none">Admin Portal</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white border border-[#E0D8C3] rounded-md px-3 py-2 w-56 lg:w-72">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search system records..."
            className="bg-transparent text-xs text-gray-600 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right: Notification, Help, System Health */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <HelpCircle size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-2 border-l border-[#E0D8C3] pl-4">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">System Health:</span>
          <span className="text-[10px] font-bold text-green-600 tracking-wide">Optimal</span>
          <span className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
    </div>
  );
};

export default Header;
