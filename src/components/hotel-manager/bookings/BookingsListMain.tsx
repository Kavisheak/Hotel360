'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, CalendarDays, ChevronRight, Plus, ShieldAlert, Lock, AlertCircle, RefreshCw, X } from 'lucide-react';
import { bookingAPI } from '@/lib/api';
import NewBookingMain from './new/NewBookingMain';

const BookingsListMain = () => {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterEventType, setFilterEventType] = useState('All');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('All');
  const [filterVendorStatus, setFilterVendorStatus] = useState('All');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Maintenance Block Form State
  const [blockReason, setBlockReason] = useState('Scheduled Ceiling Maintenance & AC Servicing');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [unblockDates, setUnblockDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [existingBlocks, setExistingBlocks] = useState<{ date: string, reason: string }[]>([]);

  useEffect(() => {
    if (isBlockModalOpen) {
      bookingAPI.getAllBlocks().then(res => {
        if (res.ok && res.data?.data) {
          setExistingBlocks(res.data.data.map((b: any) => {
            const d = new Date(b.date);
            const localDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return {
              date: localDate,
              reason: b.reason || 'Blocked'
            };
          }));
        }
      });
    } else {
      setSelectedDates([]);
      setUnblockDates([]);
    }
  }, [isBlockModalOpen]);

  // Customer Disputes Mock Data
  const [disputes, setDisputes] = useState([
    {
      id: 'DISP-101',
      bookingRef: 'LG-2026-0042',
      clientName: 'Saman Perera',
      issue: 'Requested venue package downgrade after deposit payment.',
      status: 'Under Review',
      date: '2026-07-15'
    },
    {
      id: 'DISP-102',
      bookingRef: 'LG-2026-0089',
      clientName: 'Fatimah Nazeer',
      issue: 'Dispute over videographer assignment availability window.',
      status: 'Pending Resolution',
      date: '2026-07-16'
    }
  ]);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm, filterStatus, filterEventType, filterPaymentStatus, filterVendorStatus, filterDateFrom, filterDateTo]);

  useEffect(() => {
    setIsClient(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getAllBookings();
      if (res.ok && res.data?.data) {
        // Map backend booking schema to frontend expected format
        const mappedBookings = res.data.data.map((b: any) => {
          const firstUpdater = b.statusHistory && b.statusHistory.length > 0 ? b.statusHistory[0].updatedBy : "System";
          const bookingSource = ["manager", "hotel_manager", "System"].includes(firstUpdater) ? "Manual" : "Customer";
          return {
            id: b._id,
            bookingRef: b.bookingRef || b._id,
            clientName: b.clientName,
            clientEmail: b.customerEmail || b.clientId?.email || "",
            clientPhone: b.customerPhone || b.clientId?.phone || "",
            date: new Date(b.date).toLocaleDateString(),
            rawDate: b.date,
            createdAt: b.createdAt || new Date(0).toISOString(),
            eventType: b.eventType,
            eventName: b.eventName || b.eventType, // Using eventType as fallback
            status: b.status,
            packageId: b.packageId,
            depositAmount: b.depositAmount || 0,
            balanceAmount: b.balanceAmount || 0,
            totalAmount: b.totalCost || ((b.depositAmount || 0) + (b.balanceAmount || 0)),
            paymentStatus: b.paymentStatus || (b.depositAmount > 0 ? (b.balanceAmount > 0 ? "Balance Paid" : "Deposit Paid") : "Unpaid"),
            vendors: b.vendors,
            bookingSource,
          };
        });
        setBookings(mappedBookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      b.clientName.toLowerCase().includes(searchLower) ||
      b.bookingRef.toLowerCase().includes(searchLower) ||
      b.clientEmail.toLowerCase().includes(searchLower) ||
      b.clientPhone.toLowerCase().includes(searchLower) ||
      b.eventName.toLowerCase().includes(searchLower);

    let matchesStatus = false;
    if (filterStatus === 'All') {
      matchesStatus = true;
    } else if (filterStatus === 'Pending') {
      matchesStatus = ["Pending", "Pending Confirmation", "Pending Hall Confirmation", "DEPOSIT_PAID"].includes(b.status);
    } else {
      matchesStatus = b.status === filterStatus;
    }
    const matchesEventType = filterEventType === 'All' || b.eventType === filterEventType;

    // Vendor Status Logic
    let matchesVendor = true;
    if (filterVendorStatus !== 'All') {
      const vendorCats = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
      const activeVendors = vendorCats.map(cat => b.vendors?.[cat]).filter(v => v && v.vendorId);

      if (activeVendors.length === 0) {
        matchesVendor = filterVendorStatus === 'No Vendors';
      } else {
        if (filterVendorStatus === 'Pending') matchesVendor = activeVendors.some(v => v.status === 'Pending');
        if (filterVendorStatus === 'Accepted') matchesVendor = activeVendors.every(v => v.status === 'Accepted' || v.status === 'Confirmed');
        if (filterVendorStatus === 'Declined') matchesVendor = activeVendors.some(v => v.status === 'Declined');
      }
    }

    // Payment Logic
    let matchesPayment = true;
    if (filterPaymentStatus !== 'All') {
      if (filterPaymentStatus === 'Unpaid') matchesPayment = !b.depositAmount;
      if (filterPaymentStatus === 'Deposit Paid') matchesPayment = b.depositAmount > 0 && !b.balanceAmount;
      if (filterPaymentStatus === 'Balance Paid') matchesPayment = b.balanceAmount > 0;
    }

    // Date Logic
    let matchesDate = true;
    if (filterDateFrom) {
      matchesDate = matchesDate && new Date(b.rawDate) >= new Date(filterDateFrom);
    }
    if (filterDateTo) {
      matchesDate = matchesDate && new Date(b.rawDate) <= new Date(filterDateTo);
    }

    return matchesSearch && matchesStatus && matchesEventType && matchesVendor && matchesPayment && matchesDate;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const paginatedBookings = filteredBookings.slice(0, visibleCount);

  const getStatusBadge = (b: any) => {
    // Check Vendor actions
    const vendorCats = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
    const activeVendors = vendorCats.map(cat => b.vendors?.[cat]).filter(v => v && v.vendorId);
    const hasVendorDeclined = activeVendors.some(v => v.status === 'Declined');

    if (["Pending", "Pending Confirmation", "Pending Hall Confirmation", "DEPOSIT_PAID"].includes(b.status)) {
      return (
        <div className="flex items-center gap-1.5 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          Pending Manager Approval
        </div>
      );
    }
    if (b.status === 'Cancelled' || b.status === 'Cancellation Requested') {
      return (
        <div className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200 shadow-sm w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          Cancelled
        </div>
      );
    }
    if (b.status === 'Rejected') {
      return (
        <div className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200 shadow-sm w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          Rejected
        </div>
      );
    }
    if (b.status === 'Completed') {
      return (
        <div className="flex items-center gap-1.5 text-gray-700 font-bold bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200 shadow-sm w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
          Completed
        </div>
      );
    }
    if (hasVendorDeclined) {
      return (
        <div className="flex items-center gap-1.5 text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 shadow-sm w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
          Replacement Required
        </div>
      );
    }

    // Check if Balance is due (7 days before)
    const getColomboDateStr = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    const todayStr = getColomboDateStr(new Date());
    const eventStr = getColomboDateStr(new Date(b.rawDate));
    const dToday = new Date(todayStr + 'T00:00:00Z');
    const dEvent = new Date(eventStr + 'T00:00:00Z');
    const diffDays = Math.ceil((dEvent.getTime() - dToday.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7 && !b.balanceAmount) {
      return (
        <div className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 shadow-sm w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          Balance Due
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm w-fit">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        Confirmed
      </div>
    );
  };

  const totalBookingsCount = bookings.length;
  const pendingBookingsCount = bookings.filter(b => ["Pending", "Pending Confirmation", "Pending Hall Confirmation", "DEPOSIT_PAID"].includes(b.status)).length;
  const completedBookingsCount = bookings.filter(b => b.status === 'Completed').length;

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0D8C3]/60 flex justify-between items-center px-4 lg:px-8 h-16 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all">
        <div className="flex items-center gap-6">
          <h2 className="font-serif italic text-[#7C6A2E] text-xl lg:text-2xl font-semibold tracking-wide">Bookings Control Center</h2>
          <div className="hidden sm:flex bg-gray-50/80 border border-[#E0D8C3]/50 p-1 rounded-xl text-xs font-semibold shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <button
              className="px-4 py-1.5 rounded-lg transition-all duration-300 bg-white text-[#7C6A2E] font-bold shadow-sm ring-1 ring-[#E0D8C3]/50"
            >
              All Bookings
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-sm"
          >
            <Lock size={14} /> Block Hall
          </button>
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-2 bg-[#7C6A2E] hover:bg-[#6A5A27] text-white px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={16} /> New Booking
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-6 py-6 w-full max-w-[1400px] mx-auto">
        {/* Operational Command Dashboard */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E0D8C3] p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Bookings</h3>
            <span className="text-4xl font-serif text-[#7C6A2E]">{totalBookingsCount.toString().padStart(2, '0')}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-1">Pending Approval</h3>
            <span className="text-4xl font-serif text-amber-600">{pendingBookingsCount.toString().padStart(2, '0')}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-1">Completed Events</h3>
            <span className="text-4xl font-serif text-emerald-600">{completedBookingsCount.toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="bg-white border border-[#E0D8C3]/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl mb-8 overflow-hidden transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
          <div className="p-6 border-b border-[#E0D8C3]/50 flex flex-col gap-4 bg-gray-50/50">
            {/* Top row: Search and Clear Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by Booking ID, Customer Name, Email, Phone, or Event Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7C6A2E] focus:ring-1 focus:ring-[#7C6A2E] bg-white transition-all shadow-sm"
                />
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                  setFilterEventType('All');
                  setFilterPaymentStatus('All');
                  setFilterVendorStatus('All');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
                className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shrink-0"
              >
                <RefreshCw size={14} /> Clear Filters
              </button>
            </div>

            {/* Bottom row: Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-200 py-1.5 px-3 rounded-md text-xs text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E] shadow-sm transition-all"
              >
                <option value="All">Status: All</option>
                <option value="Pending">Pending Manager</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancellation Requested">Cancellation Req</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={filterEventType}
                onChange={(e) => setFilterEventType(e.target.value)}
                className="w-full border border-gray-200 py-1.5 px-3 rounded-md text-xs text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E] shadow-sm transition-all"
              >
                <option value="All">Event Type: All</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Birthday">Birthday</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                className="w-full border border-gray-200 py-1.5 px-3 rounded-md text-xs text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E] shadow-sm transition-all"
              >
                <option value="All">Payment: All</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Deposit Paid">Deposit Paid</option>
                <option value="Balance Paid">Balance Paid</option>
              </select>

              <select
                value={filterVendorStatus}
                onChange={(e) => setFilterVendorStatus(e.target.value)}
                className="w-full border border-gray-200 py-1.5 px-3 rounded-md text-xs text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E] shadow-sm transition-all"
              >
                <option value="All">Vendors: All</option>
                <option value="No Vendors">No Vendors</option>
                <option value="Pending">Action Required (Pending)</option>
                <option value="Accepted">All Accepted</option>
                <option value="Declined">Rejected / Replacement</option>
              </select>

              <div className="flex flex-col xl:flex-row items-center gap-1 w-full col-span-2 md:col-span-1 lg:col-span-1">
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full border border-gray-200 py-1.5 px-2 rounded-md text-xs text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E] shadow-sm"
                  title="Event Date From"
                />
                <span className="text-gray-400 text-xs hidden xl:inline">-</span>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full border border-gray-200 py-1.5 px-2 rounded-md text-xs text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E] shadow-sm"
                  title="Event Date To"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-gray-500 text-[10px] uppercase tracking-widest font-semibold">
                  <th className="px-4 py-4 font-bold">Booking</th>
                  <th className="px-4 py-4 font-bold">Customer</th>
                  <th className="px-4 py-4 font-bold">Event</th>
                  <th className="px-4 py-4 font-bold">Event Date</th>
                  <th className="px-4 py-4 font-bold">Amount</th>
                  <th className="px-4 py-4 font-bold">Payment</th>
                  <th className="px-4 py-4 font-bold text-center">Vendors</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {!isClient || isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400 italic font-light">Loading bookings...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400 italic font-light">No bookings found matching your criteria.</td>
                  </tr>
                ) : (
                  paginatedBookings.map((b, idx) => {
                    const vendorCats = ["decorator", "dj", "videographer", "photographer", "cake", "florist"];
                    const activeVendors = vendorCats.map(cat => b.vendors?.[cat]).filter(v => v && v.vendorId);
                    const acceptedCount = activeVendors.filter(v => v.status === 'Accepted' || v.status === 'Confirmed').length;

                    return (
                      <tr key={b.id} className="bg-white hover:bg-gray-50/50 transition-colors duration-200 group">
                        <td className="px-4 py-4 font-mono text-xs text-gray-800 font-bold hover:text-[#7C6A2E] transition-colors">
                          {b.bookingRef}
                        </td>
                        <td className="px-4 py-4 font-bold text-gray-800">
                          {b.clientName}
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-[#7C6A2E]">
                          {b.eventType}
                        </td>
                        <td className="px-4 py-4 text-gray-600 text-xs">
                          {b.date}
                        </td>
                        <td className="px-4 py-4 text-gray-800 text-xs font-semibold">
                          LKR {(b.totalCost || b.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-xs">
                          <span className={`px-2 py-0.5 rounded font-bold ${b.paymentStatus === 'Balance Paid' ? 'bg-emerald-100 text-emerald-700' : b.paymentStatus === 'Deposit Paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-xs font-bold text-gray-600">
                          {activeVendors.length > 0 ? `${acceptedCount}/${activeVendors.length}` : '-'}
                        </td>
                        <td className="px-4 py-4 text-[10px]">
                          {getStatusBadge(b)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/hotel-manager/bookings/${b.id}`}
                            className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-[#7C6A2E] hover:text-[#5E4F20] bg-[#FAF6EE] hover:bg-[#E0D8C3]/50 px-3 py-1.5 rounded-md transition-all"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredBookings.length > visibleCount && (
            <div className="p-6 border-t border-gray-100 bg-white flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-8 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest transition-colors rounded-xl border border-gray-200"
              >
                Load More Bookings
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Block Hall Availability Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-amber-700">
                <Lock className="w-5 h-5" />
                <h3 className="font-bold text-base text-gray-900">Block Hall Availability</h3>
              </div>
              <button onClick={() => setIsBlockModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-gray-500">Manually lock dates for hall maintenance, structural renovations, or private non-customer events.</p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (selectedDates.length === 0 && unblockDates.length === 0) {
                  alert('Please select dates to block or unblock.');
                  return;
                }
                try {
                  const blockPromises = selectedDates.map(dateStr =>
                    bookingAPI.createBlock({ date: new Date(dateStr).toISOString(), reason: blockReason })
                  );
                  const unblockPromises = unblockDates.map(dateStr =>
                    bookingAPI.releaseBlock({ date: new Date(dateStr).toISOString() })
                  );
                  const results = await Promise.all([...blockPromises, ...unblockPromises]);
                  const failed = results.filter(r => !r.ok || !r.data?.success);

                  if (failed.length > 0) {
                    alert(`Failed to process ${failed.length} date(s). Please try again.`);
                  } else {
                    alert('Changes saved successfully!');
                    setIsBlockModalOpen(false);
                    setSelectedDates([]);
                    setUnblockDates([]);
                    setBlockReason('');
                  }
                } catch (err) {
                  alert('An error occurred while saving the changes');
                }
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Select Dates</label>
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                    <div className="font-semibold text-gray-800 text-sm">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                      className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                      <div key={d} className="text-[10px] font-bold text-gray-400">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                      const days = [];
                      for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
                      for (let d = 1; d <= daysInMonth; d++) {
                        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const isSelected = selectedDates.includes(dateStr);
                        const isExisting = existingBlocks.find(b => b.date === dateStr);
                        const isUnblocking = unblockDates.includes(dateStr);
                        const isPast = new Date(dateStr).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

                        days.push(
                          <button
                            key={d}
                            type="button"
                            disabled={isPast && !isExisting}
                            title={isExisting ? isExisting.reason : ''}
                            onClick={() => {
                              if (isExisting) {
                                setUnblockDates(prev => prev.includes(dateStr) ? prev.filter(x => x !== dateStr) : [...prev, dateStr]);
                              } else {
                                setSelectedDates(prev => prev.includes(dateStr) ? prev.filter(x => x !== dateStr) : [...prev, dateStr]);
                              }
                            }}
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-[11px] transition-colors ${isExisting && !isUnblocking ? 'bg-red-500 text-white font-bold shadow-sm cursor-pointer hover:bg-red-600' :
                              isUnblocking ? 'bg-gray-100 text-gray-400 line-through border border-gray-300 font-bold shadow-inner cursor-pointer hover:bg-gray-200' :
                                isPast ? 'text-gray-300 cursor-not-allowed' :
                                  isSelected ? 'bg-[#1E56A0] text-white font-bold shadow-sm' : 'text-gray-700 hover:bg-gray-200 font-medium'
                              }`}
                          >
                            {d}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>
                {selectedDates.length > 0 && (
                  <div className="mt-2 text-[10px] text-gray-500 font-medium">
                    {selectedDates.length} date(s) selected
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason / Notes</label>
                <textarea rows={2} value={blockReason} onChange={e => setBlockReason(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-xs" placeholder="e.g. Maintenance" required />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsBlockModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedDates.length === 0 && unblockDates.length === 0}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Booking Modal Popup */}
      {isNewBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDF9F1] w-full max-w-6xl rounded shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#E0D8C3] animate-fadeIn">
            <NewBookingMain
              onClose={() => setIsNewBookingOpen(false)}
              onSuccess={() => {
                setIsNewBookingOpen(false);
                fetchBookings();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsListMain;
