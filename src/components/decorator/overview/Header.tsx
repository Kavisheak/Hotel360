import React from 'react';
import { Star, User } from 'lucide-react';

const Header = ({ name = 'Julian Saint-Clair' }: { name?: string }) => {
  return (
    <div className="border-b border-[#E0D8C3] bg-[#FDF9F1] px-10 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-6">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Overview</p>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#7C6A2E]">4.9</span>
            <Star size={16} className="text-[#7C6A2E]" fill="currentColor" />
            <span className="text-gray-300">|</span>
            <span className="text-sm font-bold"><span className="text-gray-800">52</span> <span className="text-gray-500">Events</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-800">{name}</p>
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Premier Wedding DJ</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#B89B37] flex items-center justify-center text-white shadow-sm">
          <User size={20} />
        </div>
      </div>
    </div>
  );
};

export default Header;
