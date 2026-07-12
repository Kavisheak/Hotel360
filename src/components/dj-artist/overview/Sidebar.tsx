"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, Calendar, BookOpen, Star, ImageIcon, Settings, HelpCircle, LogOut, Menu, X, Plus,
  PanelLeftClose, PanelLeftOpen, User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

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
      className={`flex items-center rounded-md transition-all duration-200 ${isCollapsed ? 'justify-center p-3' : 'space-x-4 px-4 py-3'
        } ${active
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

const DjSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authAPI.signout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearUser();       // ← clear Zustand store so navbar updates
      router.push('/');
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'OVERVIEW', href: '/dj-artist/overview' },
    { icon: <User size={20} />, label: 'MY JOBS', href: '/dj-artist/my-jobs' },
    { icon: <Calendar size={20} />, label: 'SCHEDULE', href: '/dj-artist/performance' },
    { icon: <BookOpen size={20} />, label: 'BOOKINGS', href: '/dj-artist/events-bookings' },
    { icon: <Star size={20} />, label: 'RATINGS', href: '/dj-artist/ratings' },
    { icon: <ImageIcon size={20} />, label: 'GALLERY', href: '/dj-artist/gallery' },
    { icon: <Settings size={20} />, label: 'SETTINGS', href: '/dj-artist/settings' },
  ];

  const bottomItems = [
    { icon: <HelpCircle size={20} />, label: 'SUPPORT', href: '/dj-artist/support' },
  ];

  const close = () => setMobileOpen(false);

  const sidebarBody = (collapsedState: boolean) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className={`mb-10 flex ${collapsedState ? 'flex-col items-center gap-4' : 'items-start justify-between'}`}>
          {!collapsedState ? (
            <div>
              <h1 className="text-3xl font-serif italic text-[#7C6A2E] font-semibold tracking-wide leading-tight">
                {user ? `${user.firstName} ${user.lastName}` : "DJ Artist"}
              </h1>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#A6955C] mt-1">DJ ARTIST PORTAL</p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] font-serif font-bold text-xl">D</div>
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
              active={pathname === item.href}
              isCollapsed={collapsedState}
              onClick={close}
            />
          ))}
        </nav>


      </div>

      <div className="border-t border-[#E0D8C3] pt-6 space-y-4">
        <div
          className={`flex items-center ${collapsedState ? 'justify-center px-0' : 'space-x-3 px-2'} py-1`}
          title={collapsedState ? `${user?.firstName} ${user?.lastName} — Premier Wedding DJ` : undefined}
        >
          <img
            src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${user.avatar}`) : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100"}
            alt="DJ Profile"
            className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]"
          />
          {!collapsedState && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-800 tracking-wide truncate">{user ? `${user.firstName} ${user.lastName}` : "DJ Artist"}</span>
              <span className="text-[9px] font-semibold text-gray-400 tracking-[0.1em] uppercase truncate">DJ ARTIST</span>
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
              active={pathname === item.href}
              isCollapsed={collapsedState}
              onClick={close}
            />
          ))}
          {/* Logout — calls signout API first to destroy session cookie */}
          <button
            onClick={() => { close(); handleLogout(); }}
            title={collapsedState ? 'LOGOUT' : undefined}
            className={`w-full flex items-center rounded-md transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 ${collapsedState ? 'justify-center p-3' : 'space-x-4 px-4 py-3'
              }`}
          >
            <span><LogOut size={20} /></span>
            {!collapsedState && (
              <span className="text-sm font-bold tracking-wide">LOGOUT</span>
            )}
          </button>
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

export default DjSidebar;

