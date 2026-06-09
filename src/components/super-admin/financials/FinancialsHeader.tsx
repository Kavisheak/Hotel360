import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

const FinancialsHeader = () => {
  return (
    <div className="border-b border-[#E0D8C3] bg-[#FDF9F1] px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Left: Search */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-white border border-[#E0D8C3] rounded-sm px-3 py-2 w-56 lg:w-80">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Transactions..."
            className="bg-transparent text-xs text-gray-600 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <HelpCircle size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-3 border-l border-[#E0D8C3] pl-4">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800 leading-none">Admin Portal</p>
            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">System Administration</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80"
            alt="Admin Portal"
            className="w-9 h-9 rounded-full object-cover border border-[#E0D8C3]"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialsHeader;
