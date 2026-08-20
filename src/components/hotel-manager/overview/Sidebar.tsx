"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, CalendarCheck, Building2, Users, Package,
  Receipt, BarChart3, Image as ImageIcon, Settings, LogOut, Menu, X,
  PanelLeftClose, PanelLeftOpen, HelpCircle, User, Shield
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
    className={`relative flex items-center rounded-lg transition-all duration-300 ${
      isCollapsed ? 'justify-center p-2.5' : 'space-x-3.5 px-3.5 py-2.5'
    } ${
      active
        ? 'bg-[#FAF6EE] text-[#7C6A2E] shadow-sm ring-1 ring-[#E0D8C3]/50'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {active && !isCollapsed && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#B08D2C] rounded-r-full" />
    )}
    <span className={`transition-colors ${active ? 'text-[#B08D2C]' : 'text-gray-400 group-hover:text-gray-600'}`}>{icon}</span>
    {!isCollapsed && (
      <span className={`text-sm tracking-wide ${active ? 'font-bold text-[#7C6A2E]' : 'font-medium text-gray-600'}`}>
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    { icon: <LayoutGrid size={20} />,    label: 'Overview',           href: '/hotel-manager' },
    { icon: <CalendarCheck size={20} />, label: 'Bookings',           href: '/hotel-manager/bookings' },
    { icon: <Users size={20} />,         label: 'Vendors',            href: '/hotel-manager/vendors' },
    { icon: <Package size={20} />,       label: 'Packages',           href: '/hotel-manager/packages' },
    { icon: <Receipt size={20} />,       label: 'Payout',             href: '/hotel-manager/payments' },
    { icon: <Settings size={20} />,      label: 'Settings',           href: '/hotel-manager/settings' },
  ];

  const handleLogout = async (e: any) => {
    if (e) e.preventDefault();
    try {
      await authAPI.signout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearUser();
      router.replace('/login');
    }
  };

  const close = () => setMobileOpen(false);

  const sidebarBody = (collapsed: boolean) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className={`mb-10 flex ${collapsed ? 'flex-col items-center gap-4' : 'items-start justify-between'}`}>
          {!collapsed ? (
            <div className="flex flex-col items-start">
              <h2 className="text-xl font-serif font-bold text-[#7C6A2E] mb-1">
                ELITE
              </h2>
              <div className="w-12 h-[2px] bg-gradient-to-r from-[#B08D2C] to-[#E0D8C3] rounded-full mt-1" />
              <p className="text-[9px] font-bold tracking-[0.25em] text-[#A6955C]/80 mt-2 uppercase">
                Manager Portal
              </p>
            </div>
          ) : (
              <h2 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2">
                E
              </h2>
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
                className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]/50 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FAF6EE] flex items-center justify-center border border-[#E0D8C3]/50 shrink-0 text-[#7C6A2E]">
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
            <div className={`absolute ${collapsed ? 'left-14 bottom-0 w-48' : 'bottom-full left-0 mb-2 w-full'} bg-white rounded-lg shadow-xl py-1.5 z-50 border border-[#E0D8C3]/50 animate-fadeIn`}>
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
                onClick={(e) => { e.preventDefault(); setIsProfileMenuOpen(false); close(); setShowLogoutModal(true); }}
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
            href="#"
            isCollapsed={collapsed}
            onClick={(e) => { e?.preventDefault(); close(); setShowLogoutModal(true); }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-[#E0D8C3]/60 p-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
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
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-[#E0D8C3]/60 z-50 p-6 transition-transform duration-300 overflow-y-auto shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors" onClick={close}>
          <X size={20} />
        </button>
        {sidebarBody(false)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex border-r border-[#E0D8C3]/60 bg-white flex-col p-6 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ${
          mounted && isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarBody(mounted && isCollapsed)}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fadeIn">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <LogOut className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-sm text-center text-gray-500">
                Are you sure you want to log out of the manager portal? You will need to sign in again to access the dashboard.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerSidebar;
