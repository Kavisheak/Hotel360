import React from 'react';
import ManagerHeader from './Header';
import Metrics from './Metrics';
import PendingBookings from './PendingBookings';
import ConfirmedHighlights from './ConfirmedHighlights';
import ManagerFooter from './Footer';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const ManagerMainContent = () => (
  <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
    <ManagerHeader />
    <main className="flex-1 px-4 lg:px-8 py-8 overflow-y-auto space-y-8">
      {/* Welcome & Prioritized Alerts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-900 tracking-tight">Welcome Back, Manager</h2>
          <p className="text-sm text-gray-500 mt-1 font-light tracking-wide">
            Centralized control for all EASCCA operations, bookings, halls, and vendors.
          </p>
        </div>
      </div>

      {/* Prioritized Operational Alerts Banner */}
      <div className="bg-white border border-[#E0D8C3]/60 p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 border border-amber-100/50">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 text-sm tracking-wide">Prioritized Manager Alerts</span>
              <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">2 Action Required</span>
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
    </main>
    <ManagerFooter />
  </div>
);

export default ManagerMainContent;
