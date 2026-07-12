import React from 'react';
import { Star, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Header = ({ name = 'A. Malik' }: { name?: string }) => {
  const { user } = useAuthStore();
  return (
    <div className="border-b border-[#E0D8C3] bg-[#FDF9F1] px-10 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-6">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-1">Overview</p>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#7C6A2E]">4.8</span>
            <Star size={16} className="text-[#7C6A2E]" fill="currentColor" />
            <span className="text-gray-300">|</span>
            <span className="text-sm font-bold"><span className="text-gray-800">64</span> <span className="text-gray-500">Projects</span></span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Lead Videographer</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#B89B37] flex items-center justify-center text-white shadow-sm overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User size={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
