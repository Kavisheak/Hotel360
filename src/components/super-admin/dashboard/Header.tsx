import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Search, HelpCircle } from 'lucide-react';

const Header = () => {
  return (
    <div className="border-b border-[#E0D8C3] bg-[#FDF9F1] px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-10">
      {/* Left: Portal Title + Search */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5">Admin Portal</p>
          <h2 className="text-xl font-serif font-bold text-[#7C6A2E] leading-none">Admin Portal</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white border border-[#E0D8C3] rounded-sm px-3 py-2 w-56 lg:w-72">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search staff or records..."
            className="bg-transparent text-xs text-gray-600 placeholder-gray-400 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right: Notification, Help, Profile */}
      <div className="flex items-center gap-3">
        <NotificationCenter role="super_admin" />
        <button className="p-2 rounded-md hover:bg-[#F2EADA] text-gray-500 transition-colors">
          <HelpCircle size={18} />
        </button>
        {/* Profile */}
        <div className="hidden sm:flex items-center gap-3 border-l border-[#E0D8C3] pl-4">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-800 leading-none">Super Admin</p>
            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-0.5">Chief Operations</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80"
            alt="Super Admin"
            className="w-9 h-9 rounded-full object-cover border border-[#E0D8C3]"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
