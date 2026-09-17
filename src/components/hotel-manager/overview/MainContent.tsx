"use client";

import React from 'react';
import ManagerHeader from './Header';
import Metrics from './Metrics';
import PendingBookings from './PendingBookings';
import ConfirmedHighlights from './ConfirmedHighlights';
import RejectedBookings from './RejectedBookings';
import ManagerFooter from './Footer';
import { AlertTriangle, Crown, ArrowRight, ShieldAlert, Eye } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

const ManagerMainContent = () => {
  const { user } = useAuthStore();
  const isStandby = user?.role === 'manager' && !user?.isLeadManager;

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      <ManagerHeader />
      <main className="flex-1 px-4 lg:px-8 py-8 overflow-y-auto space-y-8">
        {/* Welcome & Prioritized Alerts */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-900 tracking-tight">
                Welcome Back, {user ? `${user.firstName} ${user.lastName}` : 'Manager'}
              </h2>
              {isStandby && (
                <span className="inline-flex items-center gap-1.5 bg-[#FAF6EE] text-[#7C6A2E] text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-[#B08D2C]/40">
                  <Eye size={12} className="text-[#B08D2C]" />
                  Standby (View-Only)
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1 font-light tracking-wide">
              Centralized oversight for all EASCCA wedding hall operations, bookings, and vendors.
            </p>
          </div>
        </div>

        {/* Standby Mode Notice Banner */}
        {isStandby && (
          <div className="bg-[#FAF6EE] border border-[#B08D2C]/40 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#7C6A2E] text-white rounded-xl shrink-0 shadow-xs">
                <Crown size={22} className="text-[#F9DD76]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-[#7C6A2E] text-base tracking-wide">
                    Standby Operations Mode (View-Only)
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#F9DD76] text-[#5E4F20] rounded-full text-[9px] font-bold uppercase tracking-wider">
                    Read Only
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-1.5 leading-relaxed max-w-3xl">
                  You are logged in as a <strong>Standby Manager</strong>. You have full access to review the calendar, monitor vendor responses, and observe real-time metrics. Operational write authority (booking approvals, venue pricing, package modifications) is handled by the designated <strong>Lead Manager</strong>.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase bg-white px-3 py-1.5 rounded-full border border-[#E0D8C3]">
                Full Read Access Active
              </span>
            </div>
          </div>
        )}

        {/* Prioritized Operational Alerts Banner */}
        <div className="bg-white border border-[#E0D8C3]/60 p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 border border-amber-100/50">
              <AlertTriangle size={18} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 text-sm tracking-wide">Operational Event Feed</span>
                <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Live Status
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1 font-light">
                • Booking hold <span className="font-semibold text-gray-800">#HOLD-8819</span> expires in 1h 45m.
                <span className="mx-2">|</span>
                • Vendor <span className="font-bold">Royal Decorators</span> submitted verification documents for review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/hotel-manager/bookings"
              className="px-5 py-2.5 bg-[#7C6A2E] hover:bg-[#6A5A27] text-white font-bold rounded-full flex items-center gap-2 transition-all duration-300 text-xs uppercase tracking-widest shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Review Pending <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <Metrics />
        <PendingBookings />
        <ConfirmedHighlights />
        <RejectedBookings />
      </main>
      <ManagerFooter />
    </div>
  );
};

export default ManagerMainContent;
