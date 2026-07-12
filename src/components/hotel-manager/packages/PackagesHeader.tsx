import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

const PackagesHeader = () => {
  return (
    <div className="border-b border-[#E0D8C3] bg-[#FDF9F1] px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Left: Search */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-transparent w-56 lg:w-80">
          <Search size={16} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search packages or services..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-500 focus:outline-none w-full font-serif italic"
          />
        </div>
      </div>

      {/* Right: Portal indicator + Action Icons */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-serif font-semibold text-[#7C6A2E]">Manager Portal</span>
        <div className="w-px h-5 bg-[#E0D8C3]" />
        <button className="relative p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default PackagesHeader;
