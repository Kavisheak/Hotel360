"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutGrid, CalendarCheck, CreditCard,
  Settings, LogOut, Menu, X,
  PanelLeftClose, PanelLeftOpen, HelpCircle, CheckSquare, Heart
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
        ? 'bg-[#C69C6D] text-black shadow-sm font-bold'
        : 'text-[#1A1512]/70 hover:bg-[#C69C6D]/10 hover:text-[#1A1512]'
    }`}
  >
    <span className={active ? 'text-black' : 'text-[#1A1512]/60'}>{icon}</span>
    {!isCollapsed && (
      <span className={`text-xs uppercase tracking-widest font-semibold ${active ? 'font-bold' : ''}`}>
        {label}
      </span>
    )}
  </Link>
);

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('customer-sidebar-collapsed');
    if (saved === 'true') setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('customer-sidebar-collapsed', String(next));
  };

  const navItems = [
    { icon: <LayoutGrid size={18} />,    label: 'Overview', href: '/customer' },
    { icon: <CalendarCheck size={18} />, label: 'My Booking',  href: '/customer/bookings' },
    { icon: <CheckSquare size={18} />, label: 'Checklist',  href: '/customer/checklist' },
    { icon: <CreditCard size={18} />,    label: 'Payments',  href: '/customer/payments' },
    { icon: <Heart size={18} />,     label: 'Booked Vendors',   href: '/customer/vendors' },
    { icon: <Settings size={18} />,      label: 'Settings',  href: '/customer/settings' },
  ];

  const bottomItems = [
    { icon: <HelpCircle size={18} />, label: 'Concierge Help', href: '#' },
    { icon: <LogOut size={18} />,     label: 'Logout Portal',  href: '/login' },
  ];

  const close = () => setMobileOpen(false);

  const sidebarBody = (collapsed: boolean) => (
    <div className="flex flex-col justify-between h-full bg-[#FAF6EE] text-[#1A1512]">
      <div>
        {/* Header */}
        <div className={`mb-10 flex ${collapsed ? 'flex-col items-center gap-4' : 'items-start justify-between'}`}>
          {!collapsed ? (
            <div>
              <h1 className="text-2xl font-serif italic text-[#1A1512] font-semibold tracking-wide leading-tight">
                Union Suite
              </h1>
              <p className="text-[9px] font-bold tracking-[0.2.5em] text-[#C69C6D] mt-1 uppercase">
                Customer Portal
              </p>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-sm bg-[#1A1512] flex items-center justify-center text-[#C69C6D] font-serif font-bold text-lg">
              U
            </div>
          )}
          
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-sm border border-[#E8DFC9] hover:bg-[#C69C6D]/10 text-[#1A1512]/60 hover:text-[#1A1512] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        {/* Navigation list */}
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

      {/* Profile & bottom */}
      <div className="border-t border-[#E8DFC9] pt-6 space-y-4">
        <div
          className={`flex items-center ${collapsed ? 'justify-center px-0' : 'space-x-3 px-2'} py-1`}
          title={collapsed ? 'Couple Profile' : undefined}
        >
          <div className="w-10 h-10 rounded-full bg-[#C69C6D] flex items-center justify-center font-serif text-black font-semibold shrink-0 shadow-sm border border-[#1A1512]/10">
            F&Z
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-800 tracking-wide truncate">Farhan & Zainab</span>
              <span className="text-[8px] font-bold text-[#C69C6D] tracking-[0.1em] uppercase truncate">Wedding Account</span>
            </div>
          )}
        </div>

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
    <div className="flex min-h-screen bg-[#FAF6EE] font-sans text-[#1A1512]">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#151210] border-b border-[#C69C6D]/20 text-white z-40 px-4 flex items-center justify-between">
        <Link href="/" className="font-serif tracking-widest text-sm uppercase">
          EASCC
        </Link>
        <button
          className="bg-[#1A1512] border border-[#C69C6D]/20 p-2 rounded-sm"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={18} className="text-[#C69C6D]" />
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={close} />
      )}

      {/* Mobile drawer container */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-[#FAF6EE] border-r border-[#E8DFC9] z-50 p-6 transition-transform duration-300 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button className="absolute top-4 right-4 text-gray-500 hover:text-[#1A1512]" onClick={close}>
          <X size={18} />
        </button>
        {sidebarBody(false)}
      </div>

      {/* Desktop sidebar */}
      <div
        className={`hidden lg:flex border-r border-[#E8DFC9] bg-[#FAF6EE] flex-col p-6 h-screen sticky top-0 overflow-y-auto transition-all duration-300 ${
          mounted && isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarBody(mounted && isCollapsed)}
      </div>

      {/* Main viewport */}
      <div className="flex-1 lg:pl-0 pt-14 lg:pt-0 min-w-0 flex flex-col">
        <main className="flex-grow p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
