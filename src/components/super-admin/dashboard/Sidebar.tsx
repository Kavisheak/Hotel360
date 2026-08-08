"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, Users, BarChart3,
  Settings, HelpCircle, LogOut, Menu, X,
  PanelLeftClose, PanelLeftOpen, ShieldCheck, Sparkles
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

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authAPI.signout();
    } catch (e) {
      console.error(e);
    } finally {
      clearUser();
      router.replace('/login');
    }
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('admin-sidebar-collapsed', String(nextState));
  };

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Global Overview', href: '/super-admin' },
    { icon: <Users size={20} />, label: 'Staff Management', href: '/super-admin/staff' },
    { icon: <BarChart3 size={20} />, label: 'Financial Records', href: '/super-admin/financials' },
    { icon: <ShieldCheck size={20} />, label: 'AI Sentiment Analytics', href: '/super-admin/sentiment-analytics' },
    { icon: <Settings size={20} />, label: 'System Configuration', href: '/super-admin/configuration' },
  ];

  const bottomItems = [
    { icon: <HelpCircle size={20} />, label: 'Support', href: '/super-admin/support' },
  ];

  const close = () => setMobileOpen(false);

  const sidebarBody = (collapsedState: boolean) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Top Header Row with Logo and Toggle Button */}
        <div className={`mb-10 flex ${collapsedState ? 'flex-col items-center gap-4' : 'items-start justify-between'}`}>
          {!collapsedState ? (
            <div>
              <h1 className="text-2xl font-serif italic text-[#7C6A2E] font-semibold tracking-wide leading-tight">
                Elite Excellence
              </h1>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#A6955C] mt-1">
                SYSTEM ADMINISTRATION
              </p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E]">
              <ShieldCheck size={18} />
            </div>
          )}

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md border border-[#E0D8C3] hover:bg-[#F2EADA] text-gray-500 hover:text-gray-800 transition-colors"
            title={collapsedState ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsedState ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Nav links */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={
                item.href === '/super-admin'
                  ? pathname === '/super-admin'
                  : pathname?.startsWith(item.href)
              }
              isCollapsed={collapsedState}
              onClick={close}
            />
          ))}
        </nav>


      </div>

      {/* Bottom Profile & Navigation */}
      <div className="border-t border-[#E0D8C3] pt-6 space-y-4">
        {/* Admin Profile Block */}
        <div
          className={`flex items-center ${collapsedState ? 'justify-center px-0' : 'space-x-3 px-2'} py-1`}
          title={collapsedState ? "Alex Mercer (Super Admin)" : undefined}
        >
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"
            alt="Alex Mercer Profile"
            className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3]"
          />
          {!collapsedState && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-800 tracking-wide truncate">Alex Mercer</span>
              <span className="text-[9px] font-semibold text-gray-400 tracking-[0.1em] uppercase truncate">SUPER ADMIN</span>
            </div>
          )}
        </div>

        {/* Support & Logout links */}
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
          <button
            onClick={() => { close(); handleLogout(); }}
            title={collapsedState ? 'LOGOUT' : undefined}
            className={`w-full flex items-center rounded-md transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 ${collapsedState ? 'justify-center p-3' : 'space-x-4 px-4 py-3'
              }`}
          >
            <span><LogOut size={20} /></span>
            {!collapsedState && (
              <span className="text-sm font-semibold tracking-wide">LOGOUT</span>
            )}
          </button>
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
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#FDF9F1] border-r border-[#E0D8C3] z-50 p-6 transition-transform duration-300 overflow-y-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={close}
        >
          <X size={20} />
        </button>
        {sidebarBody(false)}
      </div>

      {/* Desktop sidebar with smooth collapse */}
      <div
        className={`hidden lg:flex border-r border-[#E0D8C3] bg-[#FDF9F1] flex-col p-6 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ${mounted && isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        {sidebarBody(mounted && isCollapsed)}
      </div>
    </>
  );
};

export default Sidebar;
