import React from 'react';
import { ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'profile', label: 'PERSONAL PROFILE' },
  { id: 'security', label: 'SECURITY' },
  { id: 'notifications', label: 'NOTIFICATIONS' },
  { id: 'venue', label: 'VENUE CONFIGURATION' },
];

const SettingsSidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const handleClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Account for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm flex flex-col items-center">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv0rt5w6JHhyT0aULGsvUTEhH0YGbA1Gd8ZrFx43b_uzbKWemyf_4_Qp48TJQ9vH9iTw-SGP8hB3e93Cq3gbm_IUhqcluJMXvuLBMvDUP0D8FPGXBGIqhu8_RPsBa5rNKXl4yD0YbQ7ozuhMGKOe8oSUXCdtVaxq2h2IcNZqCyDNuQbkTvNSjVNstk0B9_r9AfVTRKYpsOmV2BI5HGSFrE-Q-BOvnTzomP_bXb8jk_Zep4l6sU5VW0SOV3lUdKALmUgU_-mN2eCsU"
        alt="Ahmed Sattar"
        className="w-20 h-20 rounded-full object-cover border-2 border-[#E0D8C3] mb-4"
      />
      <h3 className="font-serif text-xl text-gray-800 mb-1">Ahmed Sattar</h3>
      <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mb-8 text-center break-all">
        AHMED.SATTAR@SATTARELITE.COM
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
