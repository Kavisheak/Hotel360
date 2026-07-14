import React from 'react';
import { ChevronRight, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getImageUrl } from '@/lib/utils';

const navItems = [
  { id: 'profile', label: 'PERSONAL PROFILE' },
  { id: 'security', label: 'SECURITY' },
  { id: 'notifications', label: 'NOTIFICATIONS' },
  { id: 'venue', label: 'VENUE CONFIGURATION' },
];

const SettingsSidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { user } = useAuthStore();

  const handleClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col items-center">
      {user?.avatar ? (
        <img
          src={getImageUrl(user.avatar)}
          alt={user.firstName}
          className="w-20 h-20 rounded-full object-cover border-2 border-[#E0D8C3] mb-4"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#7C6A2E] border-2 border-[#E0D8C3] mb-4">
          <User className="w-8 h-8" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="font-serif text-xl text-gray-800 mb-1">
        {user?.firstName} {user?.lastName}
      </h3>
      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-8 text-center break-all">
        {user?.email || "MANAGER@GMAIL.COM"}
      </p>

      <div className="w-full space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors border-l-2 ${
              activeTab === item.id
                ? 'bg-[#FDF9F1] border-[#B08D2C] text-[#7C6A2E]'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            {item.label}
            <ChevronRight size={14} className={activeTab === item.id ? 'text-[#B08D2C]' : 'text-gray-300'} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsSidebar;
