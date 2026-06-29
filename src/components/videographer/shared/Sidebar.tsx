"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, Calendar, BookOpen, Star, ImageIcon,
  Settings, HelpCircle, LogOut, Menu, X,
  PanelLeftClose, PanelLeftOpen, CalendarClock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, href, active = false, isCollapsed = false, onClick }: NavItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`flex items-center rounded-md transition-all duration-200 ${
        isCollapsed ? 'justify-center p-3' : 'space-x-4 px-4 py-3'
      } ${
        active
          ? 'bg-[#F9DD76] text-[#7C6A2E] shadow-sm'
          : 'text-gray-600 hover:bg-[#F2EADA]'
      }`}
    >
      <span className={active ? 'text-[#7C6A2E]' : 'text-gray-500'}>{icon}</span>
      {!isCollapsed && (
        <span className={`text-sm font-semibold tracking-wide ${active ? 'font-bold' : ''}`}>
          {label}
        </span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('videographer-sidebar-collapsed');
    if (saved === 'true') setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('videographer-sidebar-collapsed', String(next));
  };

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await authAPI.signout();
    clearUser();
    window.location.href = '/';
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'OVERVIEW',  href: '/videographer' },
    { icon: <Calendar size={20} />,   label: 'SCHEDULE',  href: '/videographer/performance' },
    { icon: <BookOpen size={20} />,   label: 'BOOKINGS',  href: '/videographer/events-bookings' },
    { icon: <Star size={20} />,       label: 'RATINGS',   href: '/videographer/ratings' },
    { icon: <ImageIcon size={20} />,  label: 'GALLERY',   href: '/videographer/gallery' },
    { icon: <Settings size={20} />,   label: 'SETTINGS',  href: '/videographer/settings' },
  ];

  const bottomItems = [
    { icon: <HelpCircle size={20} />, label: 'SUPPORT',   href: '/videographer/support' },
  ];

  const close = () => setMobileOpen(false);

  const isActive = (href: string) => {
    if (href === '/videographer') {
      return pathname === '/videographer' || pathname === '/videographer/overview';
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const sidebarBody = (collapsedState: boolean) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className={`mb-10 flex ${collapsedState ? 'flex-col items-center gap-4' : 'items-start justify-between'}`}>
          {!collapsedState ? (
            <div>
              <h1 className="text-3xl font-serif italic text-[#7C6A2E] font-semibold tracking-wide leading-tight">Frame Story</h1>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#A6955C] mt-1">VIDEOGRAPHER PORTAL</p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] font-serif font-bold text-xl">F</div>
          )}

          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-500 hover:text-gray-800 transition-colors"
            title={collapsedState ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsedState ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={isActive(item.href)}
              isCollapsed={collapsedState}
              onClick={close}
            />
          ))}
        </nav>

        <Link
          href="/videographer/upcoming-events"
          onClick={close}
          title={collapsedState ? 'Upcoming Events' : undefined}
          className={`mt-6 flex items-center justify-center bg-[#B08D2C] hover:bg-[#9B7A20] text-white rounded-md font-semibold transition-all duration-200 shadow-md ${
            collapsedState ? 'p-3 w-full' : 'space-x-2 px-4 py-3 w-full text-xs tracking-widest'
          }`}
        >
          <CalendarClock size={16} />
          {!collapsedState && <span>UPCOMING EVENTS</span>}
        </Link>
      </div>

      <div className="border-t border-[#E0D8C3] pt-6 space-y-4">
        <div
          className={`flex items-center ${collapsedState ? 'justify-center px-0' : 'space-x-3 px-2'} py-1`}
          title={collapsedState ? `${user?.firstName} ${user?.lastName} — Lead Videographer` : undefined}
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]"
          />
          {!collapsedState && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-800 tracking-wide truncate">{user ? `${user.firstName} ${user.lastName}` : "A. Malik"}</span>
              <span className="text-[9px] font-semibold text-gray-400 tracking-[0.1em] uppercase truncate">LEAD VIDEOGRAPHER</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={isActive(item.href)}
              isCollapsed={collapsedState}
              onClick={close}
            />
          ))}
          <a
            href="#"
            onClick={handleSignOut}
            title={collapsedState ? 'SIGN OUT' : undefined}
            className={`flex items-center rounded-md transition-all duration-200 ${
              collapsedState ? 'justify-center p-3' : 'space-x-4 px-4 py-3'
            } text-gray-600 hover:bg-[#F2EADA]`}
          >
            <span className="text-gray-500"><LogOut size={20} /></span>
            {!collapsedState && (
              <span className="text-sm font-semibold tracking-wide">
                SIGN OUT
              </span>
            )}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#FDF9F1] border border-[#E0D8C3] p-2 rounded-md shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} className="text-[#7C6A2E]" />
      </button>

      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={close} />}

      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#FDF9F1] border-r border-[#E0D8C3] z-50 p-6 transition-transform duration-300 overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={close}><X size={20} /></button>
        {sidebarBody(false)}
      </div>

      <div className={`hidden lg:flex border-r border-[#E0D8C3] bg-[#FDF9F1] flex-col p-6 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ${mounted && isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebarBody(mounted && isCollapsed)}
      </div>
    </>
  );
};

export default Sidebar;
