"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, CalendarDays, CalendarCheck, CreditCard,
  BarChart3, Settings, LogOut, Menu, X,
  PanelLeftClose, PanelLeftOpen, HelpCircle, Plus, Package, Users, Shield, User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { getImageUrl } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: (e?: any) => void;
}

const NavItem = ({ icon, label, href, active = false, isCollapsed = false, onClick }: NavItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={`flex items-center rounded-md transition-all duration-200 ${
      isCollapsed ? 'justify-center p-3' : 'space-x-4 px-4 py-3'
    } ${
      active
        ? 'bg-[#F9DD76] text-[#7C6A2E] shadow-sm font-bold'
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

const ManagerSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('manager-sidebar-collapsed');
    if (saved === 'true') setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('manager-sidebar-collapsed', String(next));
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />,    label: 'DASHBOARD',  href: '/hotel-manager' },
    { icon: <CalendarCheck size={20} />, label: 'BOOKINGS',   href: '/hotel-manager/bookings' },
    { icon: <CalendarDays size={20} />,  label: 'CALENDAR',   href: '/hotel-manager/calendar' },
    { icon: <CreditCard size={20} />,    label: 'PAYMENTS',   href: '/hotel-manager/payments' },
    { icon: <Package size={20} />,       label: 'PACKAGES',   href: '/hotel-manager/packages' },
    { icon: <Users size={20} />,         label: 'VENDORS',    href: '/hotel-manager/vendors' },
    { icon: <BarChart3 size={20} />,     label: 'REPORTS',    href: '/hotel-manager/reports' },
  ];

  const handleLogout = async (e: any) => {
    if (e) e.preventDefault();
    try {
      await authAPI.signout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearUser();
      window.location.replace('/login');
    }
  };

  const close = () => setMobileOpen(false);

  const sidebarBody = (collapsed: boolean) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className={`mb-10 flex ${collapsed ? 'flex-col items-center gap-4' : 'items-start justify-between'}`}>
          {!collapsed ? (
            <div>
              <h1 className="text-3xl font-serif italic text-[#7C6A2E] font-semibold tracking-wide leading-tight">
                Elite Dashboard
              </h1>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#A6955C] mt-1">
                MANAGER PORTAL
              </p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E] font-serif font-bold text-xl">
              E
            </div>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-500 hover:text-gray-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              isCollapsed={collapsed}
              onClick={close}
            />
          ))}
        </nav>


      </div>

      {/* Bottom */}
      <div className="border-t border-[#E0D8C3] pt-6 space-y-4">
        {/* Profile block */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'space-x-3 px-2'} py-2 rounded-md hover:bg-[#F2EADA] transition-colors text-left`}
            title={collapsed ? 'Hall Manager' : 'Profile Options'}
          >
            {user?.avatar ? (
              <img
                src={getImageUrl(user.avatar)}
                alt="Manager Profile"
                className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3] shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FAF6EE] flex items-center justify-center border border-[#E0D8C3] shrink-0 text-[#7C6A2E]">
                <User size={20} />
              </div>
            )}
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-800 tracking-wide truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'A. Sattar'}
                </span>
                <span className="text-[9px] font-semibold text-gray-400 tracking-[0.1em] uppercase truncate">PROFILE SERVICES</span>
              </div>
            )}
          </button>

          {/* Instagram-style popup menu */}
          {isProfileMenuOpen && (
            <div className={`absolute ${collapsed ? 'left-14 bottom-0 w-48' : 'bottom-full left-0 mb-2 w-full'} bg-white rounded-md shadow-lg py-1 z-50 border border-[#E0D8C3] animate-fadeIn`}>
              <Link 
                href="/hotel-manager/settings" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#FDF9F1] hover:text-[#7C6A2E] transition-colors font-semibold"
                onClick={() => { setIsProfileMenuOpen(false); close(); }}
              >
                <User size={16} />
                Edit Profile
              </Link>
              <Link 
                href="/hotel-manager/settings" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#FDF9F1] hover:text-[#7C6A2E] transition-colors font-semibold"
                onClick={() => { setIsProfileMenuOpen(false); close(); }}
              >
                <Shield size={16} />
                Security Options
              </Link>
              <hr className="my-1 border-[#E0D8C3]" />
              <button 
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                onClick={(e) => { setIsProfileMenuOpen(false); close(); handleLogout(e); }}
              >
                <LogOut size={16} />
                Switch Account
              </button>
            </div>
          )}
        </div>
        {/* Support & Logout */}
        <div className="space-y-1">
          <NavItem
            icon={<HelpCircle size={20} />}
            label="SUPPORT"
            href="#"
            isCollapsed={collapsed}
            onClick={close}
          />
          <NavItem
            icon={<LogOut size={20} />}
            label="LOGOUT"
            href="/login"
            isCollapsed={collapsed}
            onClick={(e) => { close(); handleLogout(e); }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#FDF9F1] border border-[#E0D8C3] p-2 rounded-md shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} className="text-[#7C6A2E]" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={close} />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#FDF9F1] border-r border-[#E0D8C3] z-50 p-6 transition-transform duration-300 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={close}>
          <X size={20} />
        </button>
        {sidebarBody(false)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex border-r border-[#E0D8C3] bg-[#FDF9F1] flex-col p-6 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ${
          mounted && isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarBody(mounted && isCollapsed)}
      </div>
    </>
  );
};

export default ManagerSidebar;
