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
    <main className="flex-1 px-4 lg:px-6 py-6 overflow-y-auto space-y-6">
      {/* Welcome & Prioritized Alerts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-semibold text-gray-800">Welcome Back, Manager</h2>
          <p className="text-xs italic text-[#A6955C] mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "Centralized control for all EASCCA operations, bookings, halls, and vendors."
          </p>
        </div>
      </div>

      {/* Prioritized Operational Alerts Banner */}
      <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 text-sm">Prioritized Manager Alerts</span>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full text-[10px] font-bold">2 Action Required</span>
            </div>
            <p className="text-amber-800 text-xs mt-0.5">
              • Booking hold <span className="font-bold">#HOLD-8819</span> expires in 1h 45m.
              <span className="mx-2">|</span>
              • Vendor <span className="font-bold">Royal Decorators</span> submitted verification documents for review.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/hotel-manager/bookings"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md flex items-center gap-1 transition text-xs"
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
