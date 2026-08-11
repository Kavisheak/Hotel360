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
  const [filterSource, setFilterSource] = useState('All');
  const [activeTab, setActiveTab] = useState<'all' | 'disputes'>('all');
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
  const [existingBlocks, setExistingBlocks] = useState<{date: string, reason: string}[]>([]);

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
  }, [searchTerm, filterStatus, filterSource]);

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
            date: new Date(b.date).toLocaleDateString(),
            createdAt: b.createdAt || new Date(0).toISOString(),
            eventType: b.eventType,
            status: b.status,
            packageId: b.packageId,
            depositAmount: b.depositAmount || 0,
            balanceAmount: b.balanceAmount || 0,
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
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || b.bookingRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const matchesSource = filterSource === 'All' || b.bookingSource === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
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
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="border border-[#E0D8C3] py-2 px-4 rounded text-sm text-gray-700 bg-white focus:outline-none focus:border-[#7C6A2E]"
              >
                <option value="All">All Sources</option>
                <option value="Customer">Online (Customer)</option>
                <option value="Manual">Manual (Manager)</option>
              </select>
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
                        <span className="font-mono text-xs text-gray-700 font-bold block">{b.bookingRef}</span>
                        {b.bookingSource === 'Manual' ? (
                          <span className="text-[9px] uppercase tracking-wider bg-[#E0D8C3] text-[#7C6A2E] px-1.5 py-0.5 rounded mt-1 inline-block font-bold">Manual</span>
                        ) : (
                          <span className="text-[9px] uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mt-1 inline-block font-bold">Online</span>
                        )}
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
                        const isPast = new Date(dateStr).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                        
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
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-[11px] transition-colors ${
                              isExisting && !isUnblocking ? 'bg-red-500 text-white font-bold shadow-sm cursor-pointer hover:bg-red-600' :
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
