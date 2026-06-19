"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, CalendarDays, CalendarCheck, CreditCard,
  BarChart3, Settings, LogOut, Menu, X,
  PanelLeftClose, PanelLeftOpen, HelpCircle, Plus, Package
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
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
  const pathname = usePathname();

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
    { icon: <BarChart3 size={20} />,     label: 'REPORTS',    href: '/hotel-manager/reports' },
    { icon: <Settings size={20} />,      label: 'SETTINGS',   href: '/hotel-manager/settings' },
  ];

  const bottomItems = [
    { icon: <HelpCircle size={20} />, label: 'SUPPORT', href: '#' },
    { icon: <LogOut size={20} />,     label: 'LOGOUT',  href: '/login' },
  ];

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
        <div
          className={`flex items-center ${collapsed ? 'justify-center px-0' : 'space-x-3 px-2'} py-1`}
          title={collapsed ? 'Hall Manager' : undefined}
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv0rt5w6JHhyT0aULGsvUTEhH0YGbA1Gd8ZrFx43b_uzbKWemyf_4_Qp48TJQ9vH9iTw-SGP8hB3e93Cq3gbm_IUhqcluJMXvuLBMvDUP0D8FPGXBGIqhu8_RPsBa5rNKXl4yD0YbQ7ozuhMGKOe8oSUXCdtVaxq2h2IcNZqCyDNuQbkTvNSjVNstk0B9_r9AfVTRKYpsOmV2BI5HGSFrE-Q-BOvnTzomP_bXb8jk_Zep4l6sU5VW0SOV3lUdKALmUgU_-mN2eCsU"
            alt="Manager Profile"
            className="w-10 h-10 rounded-full object-cover border border-[#E0D8C3] shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-800 tracking-wide truncate">A. Sattar</span>
              <span className="text-[9px] font-semibold text-gray-400 tracking-[0.1em] uppercase truncate">HALL MANAGER</span>
            </div>
          )}
        </div>
        {/* Support & Logout */}
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={false}
              isCollapsed={collapsed}
              onClick={close}
            />
          ))}
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
