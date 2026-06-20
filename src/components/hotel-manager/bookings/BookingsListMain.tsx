'use client';

import React, { useState, useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import Link from 'next/link';
import { Search, Filter, CalendarDays, ChevronRight } from 'lucide-react';

const BookingsListMain = () => {
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const bookings = useBookingStore(state => state.bookings);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-[#F9DD76] text-[#7C6A2E]';
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-50 text-red-600 border border-red-200';
      case 'Completed': return 'bg-gray-100 text-gray-700';
      case 'DepositPaid': return 'bg-blue-100 text-blue-700';
      case 'BalancePaid': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-screen bg-[#FDF9F1]">
      <header className="sticky top-0 z-30 bg-[#FDF9F1]/90 backdrop-blur-md border-b border-[#E0D8C3] flex items-center px-4 lg:px-6 h-16 pl-14 lg:pl-6">
        <h2 className="font-serif italic text-[#7C6A2E] text-xl font-semibold tracking-wide">All Bookings</h2>
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
                {!isClient ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Loading bookings...</td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No bookings found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredBookings.map((b, idx) => (
                    <tr key={b.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE] hover:bg-[#F2EADA] transition-colors'}>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-700 font-bold">{b.id}</span>
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
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded ${getStatusColor(b.status)}`}>
                          {b.status === "DepositPaid" ? "DEPOSIT PAID" : b.status === "BalancePaid" ? "BALANCE PAID" : b.status}
                        </span>
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
        </div>
      </main>
    </div>
  );
};

export default BookingsListMain;
