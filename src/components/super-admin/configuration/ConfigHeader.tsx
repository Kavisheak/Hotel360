import React from 'react';
import { Search, HelpCircle } from 'lucide-react';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const ConfigHeader = () => {
  return (
    <div className="border-b border-[#E0D8C3] bg-[#FDF9F1] px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-10 w-full relative">
      {/* Left (Empty to balance flex layout) */}
      <div></div>

      {/* Right: Portal indicator + Action Icons */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-serif font-semibold text-[#7C6A2E] hidden sm:block">Admin Portal</span>
        <div className="hidden sm:block w-px h-5 bg-[#E0D8C3]" />

        <NotificationCenter role="super_admin" />

        <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <HelpCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfigHeader;
