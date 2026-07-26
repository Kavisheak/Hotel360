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
  const [activeTab, setActiveTab] = useState<'all' | 'disputes'>('all');
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Maintenance Block Form State
  const [blockHallName, setBlockHallName] = useState('Grand Royal Ballroom');
  const [blockReason, setBlockReason] = useState('Scheduled Ceiling Maintenance & AC Servicing');
  const [blockStartDate, setBlockStartDate] = useState('2026-08-01');
  const [blockEndDate, setBlockEndDate] = useState('2026-08-03');

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
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    setIsClient(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getAllBookings();
      if (res.ok && res.data?.data) {
        // Map backend booking schema to frontend expected format
        const mappedBookings = res.data.data.map((b: any) => ({
          id: b._id,
          bookingRef: b.bookingRef || b._id,
          clientName: b.clientName,
          date: new Date(b.date).toLocaleDateString(),
          createdAt: b.createdAt || new Date(0).toISOString(),
          eventType: b.eventType,
          status: b.status,
          packageId: b.packageId,
          depositAmount: b.depositAmount || 0,
          balanceAmount: b.balanceAmount || 0,
          vendors: b.vendors,
        }));
        setBookings(mappedBookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const paginatedBookings = filteredBookings.slice(0, visibleCount);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Held':
      case 'HOLD':
        return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
      case 'Pending Hall Confirmation':
      case 'Pending Confirmation':
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
      case 'Confirmed':
      case 'DepositPaid':
      case 'BalancePaid':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border border-rose-200 font-bold';
      case 'Completed':
        return 'bg-gray-100 text-gray-700 font-bold';
      default:
        return 'bg-gray-100 text-gray-700 font-bold';
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex justify-between items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
        <div className="flex items-center gap-4">
          <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">Bookings Control Center</h2>
          <div className="flex bg-gray-200/60 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'all' ? 'bg-white text-[#1E56A0] font-bold shadow-xs' : 'text-gray-600'}`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${activeTab === 'disputes' ? 'bg-white text-rose-700 font-bold shadow-xs' : 'text-gray-600'}`}
            >
              <ShieldAlert size={13} />
              Disputes ({disputes.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsBlockModalOpen(true)}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded text-xs font-bold tracking-wider transition-colors shadow-xs"
          >
            <Lock size={14} /> Block Hall
          </button>
          <button 
            onClick={() => setIsNewBookingOpen(true)}
            className="flex items-center gap-2 bg-[#1E56A0] hover:bg-[#15417E] text-white px-4 py-2 rounded text-xs font-bold tracking-widest uppercase transition-colors shadow-xs"
          >
            <Plus size={14} /> New Booking
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-6 py-6 w-full max-w-[1400px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Booking Directory</h1>
          <p className="text-gray-500 text-sm">Manage all event requests, track payments, and assign workflows.</p>
        </div>

        <div className="bg-white border border-[#E0D8C3] shadow-sm rounded-sm mb-8">
          <div className="p-6 border-b border-[#E0D8C3] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAF6EE]">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by client name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E0D8C3] rounded text-sm focus:outline-none focus:border-[#7C6A2E] bg-white"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-gray-400" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-[#E0D8C3] py-2 px-4 rounded text-sm text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending Hall Confirmation">Pending Hall Confirmation</option>
                <option value="Pending">Pending Approval</option>
                <option value="Confirmed">Confirmed</option>
                <option value="DepositPaid">Deposit Paid</option>
                <option value="BalancePaid">Balance Paid</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-[#A48F40] text-white text-[10px] uppercase tracking-widest">
                  <th className="px-6 py-4 font-bold">Booking ID</th>
                  <th className="px-6 py-4 font-bold">Client Name</th>
                  <th className="px-6 py-4 font-bold">Event Date</th>
                  <th className="px-6 py-4 font-bold">Event Type</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0D8C3]">
                {!isClient || isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Loading bookings...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No bookings found matching your criteria.</td>
                  </tr>
                ) : (
                  paginatedBookings.map((b, idx) => (
                    <tr key={b.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE] hover:bg-[#F2EADA] transition-colors'}>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-700 font-bold">{b.bookingRef}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {b.clientName}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={14} className="text-[#B08D2C]" />
                          {b.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#7C6A2E]">
                        {b.eventType}
                      </td>
                      <td className="px-6 py-4 flex flex-col gap-1 items-start">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded ${getStatusBadge(b.status)}`}>
                          {b.status === "DepositPaid" ? "DEPOSIT PAID" : b.status === "BalancePaid" ? "BALANCE PAID" : b.status}
                        </span>
                        {(b.vendors?.decorator?.status === 'Declined' || 
                          b.vendors?.dj?.status === 'Declined' || 
                          b.vendors?.videographer?.status === 'Declined') && (
                          <span className="inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded bg-red-500/90 text-white animate-pulse shadow-red-500/50">
                            Vendor Declined
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/hotel-manager/bookings/${b.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#7C6A2E] hover:text-[#4E411B] transition-colors"
                        >
                          View Details <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Load More Button */}
          {filteredBookings.length > visibleCount && (
            <div className="p-6 border-t border-[#E0D8C3] bg-white flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-6 py-2 border border-[#7C6A2E] text-[#7C6A2E] text-[10px] font-bold uppercase tracking-widest hover:bg-[#FAF6EE] transition-colors rounded-sm"
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

            <form onSubmit={(e) => { e.preventDefault(); alert('Hall availability blocked successfully!'); setIsBlockModalOpen(false); }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Hall / Space</label>
                <select 
                  value={blockHallName}
                  onChange={(e) => setBlockHallName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-xs"
                >
                  <option value="Grand Royal Ballroom">Grand Royal Ballroom</option>
                  <option value="Executive Conference Suite">Executive Conference Suite</option>
                  <option value="Courtyard Garden Terrace">Courtyard Garden Terrace</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={blockStartDate} onChange={e => setBlockStartDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">End Date</label>
                  <input type="date" value={blockEndDate} onChange={e => setBlockEndDate(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-xs" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason / Notes</label>
                <textarea rows={2} value={blockReason} onChange={e => setBlockReason(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-xs" />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button type="button" onClick={() => setIsBlockModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg">
                  Confirm Hall Lock
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
