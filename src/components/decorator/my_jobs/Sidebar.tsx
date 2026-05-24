"use client";

import React from 'react';
import { LayoutGrid, Calendar, FolderHeart, BarChart3, Clock, Settings, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 border-r border-[#E0D8C3] bg-[#FDF9F1] flex flex-col justify-between p-6 h-screen sticky top-0">
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-serif italic text-[#7C6A2E] font-semibold tracking-wide leading-tight">
            Elite Dashboard
          </h1>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#A6955C] mt-1">
            DECORATOR PORTAL
          </p>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<LayoutGrid size={20} />} label="MY JOBS" active={true} />
          <NavItem icon={<Calendar size={20} />} label="SCHEDULE" />
          <NavItem icon={<FolderHeart size={20} />} label="MY PORTFOLIO" />
          <NavItem icon={<BarChart3 size={20} />} label="RATINGS" />
          <NavItem icon={<Clock size={20} />} label="HISTORY" />
          <NavItem icon={<Settings size={20} />} label="SETTINGS" />
        </nav>
      </div>

      <div className="border-t border-[#E0D8C3] pt-6 space-y-4">
        <NavItem icon={<HelpCircle size={20} />} label="SUPPORT" />
        <NavItem icon={<LogOut size={20} />} label="LOGOUT" />
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active = false }: NavItemProps) => {
  return (
    <Link href="#" className={`flex items-center space-x-4 px-4 py-3 rounded-md transition-colors ${active ? 'bg-[#F9DD76] text-[#7C6A2E] shadow-sm' : 'text-gray-600 hover:bg-[#F2EADA]'}`}>
      <span className={active ? 'text-[#7C6A2E]' : 'text-gray-500'}>{icon}</span>
      <span className={`text-sm font-medium tracking-wide ${active ? 'font-bold' : ''}`}>{label}</span>
    </Link>
  );
};

export default Sidebar;
