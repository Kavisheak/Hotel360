'use client';
import React, { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, FileOutput, Banknote, ArrowRightLeft, CreditCard } from 'lucide-react';

const PremiumCardIcon = () => (
  <svg width="20" height="14" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-sm">
    <rect width="24" height="16" rx="3" fill="url(#goldGradient)" />
    <path d="M3 5H6V9H3V5Z" fill="#FFF3CD" fillOpacity="0.9" />
    <circle cx="15" cy="8" r="3" fill="#FFF" fillOpacity="0.4" />
    <circle cx="19" cy="8" r="3" fill="#FFF" fillOpacity="0.4" />
    <defs>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="24" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D4C9A8" />
        <stop offset="0.5" stopColor="#B08D2C" />
        <stop offset="1" stopColor="#7C6A2E" />
      </linearGradient>
    </defs>
  </svg>
);

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'border-green-600 text-green-800 bg-green-50';
    case 'RefundRequested':
      return 'border-orange-600 text-orange-800 bg-orange-50';
    case 'Refunded':
      return 'border-red-600 text-red-800 bg-red-50';
    case 'Pending':
      return 'border-gray-400 text-gray-600 bg-gray-50';
    default:
      return 'border-gray-200 text-gray-800';
  }
};

const FinancialsTable = ({ transactions = [] }: { transactions: any[] }) => {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [methodFilter, setMethodFilter] = useState('All Methods');
  const [visibleCount, setVisibleCount] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const handleFilterChange = (setter: any, value: string) => {
    setter(value);
    setVisibleCount(10); // Reset pagination on filter change
  };
  
  const filteredTransactions = transactions.filter(t => {
    if (statusFilter !== 'All Statuses' && t.status !== statusFilter) return false;
    if (methodFilter !== 'All Methods' && t.method !== methodFilter) return false;
    return true;
  });

  const visibleTransactions = filteredTransactions.slice(0, visibleCount);

  const subtotal = visibleTransactions.reduce((acc, t) => t.status === 'Paid' ? acc + t.amount : acc, 0);
  const adjustments = visibleTransactions.reduce((acc, t) => t.status === 'Refunded' ? acc + t.amount : acc, 0);
  const netRevenue = subtotal - adjustments;

  return (
    <div className="bg-white border border-[#E0D8C3] shadow-sm mb-8">
      {/* Filters & Pagination */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#E0D8C3]">
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-40">
            <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)} className="w-full border border-[#E0D8C3] text-xs py-2 px-3 text-gray-700 bg-transparent focus:outline-none">
              <option>All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="RefundRequested">Refund Requested</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Method</label>
            <select value={methodFilter} onChange={(e) => handleFilterChange(setMethodFilter, e.target.value)} className="w-full border border-[#E0D8C3] text-xs py-2 px-3 text-gray-700 bg-transparent focus:outline-none">
              <option>All Methods</option>
              <option value="Card">Card</option>
              <option value="Transfer">Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>Showing {visibleTransactions.length} of {filteredTransactions.length} entries</span>
          <div className="flex border border-[#E0D8C3] rounded-sm">
            <button className="p-1 border-r border-[#E0D8C3] hover:bg-[#FAF6EE]"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-[#FAF6EE]"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-[#A48F40] text-white text-[10px] uppercase tracking-widest">
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Transaction ID</th>
              <th className="px-6 py-4 font-bold">Client / Event</th>
              <th className="px-6 py-4 font-bold">Method</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Amount</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0D8C3]">
            {visibleTransactions.map((txn, idx) => (
              <tr key={txn.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE]'}>
                <td className="px-6 py-4 text-gray-500 text-xs">{txn.date}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-700">{txn.transactionId}</td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800 text-sm">{txn.clientName}</p>
                  <p className="text-[10px] text-gray-500">{txn.event}</p>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-gray-700 flex items-center gap-2 mt-2">
                  {txn.method === 'Cash' ? (
                    <Banknote size={18} className="text-green-600 shrink-0" />
                  ) : txn.method === 'Transfer' || txn.method === 'Bank Transfer' ? (
                    <ArrowRightLeft size={18} className="text-blue-600 shrink-0" />
                  ) : (
                    <PremiumCardIcon />
                  )}
                  {txn.method}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(txn.status)}`}>
                    {txn.status}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${txn.status === 'Refunded' ? 'text-red-600' : 'text-gray-900'}`}>
                  {txn.status === 'Refunded' ? '-' : ''}LKR {Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-right relative">
                  {txn.status === 'Refunded' ? (
                    <button className="text-gray-400 hover:text-[#7C6A2E]"><FileOutput size={16} /></button>
                  ) : (
                    <>
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === txn.id ? null : txn.id)}
                        className="text-gray-400 hover:text-[#7C6A2E]"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeDropdown === txn.id && (
                        <div className="absolute right-8 top-8 w-40 bg-white border border-[#E0D8C3] shadow-lg rounded-sm py-1 z-10 text-left">
                          <button className="w-full px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-gray-700 hover:bg-[#FAF6EE] text-left" onClick={() => setActiveDropdown(null)}>View Receipt</button>
                          <button className="w-full px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-gray-700 hover:bg-[#FAF6EE] text-left" onClick={() => setActiveDropdown(null)}>Download PDF</button>
                          <button className="w-full px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-gray-700 hover:bg-[#FAF6EE] text-left" onClick={() => setActiveDropdown(null)}>Contact Client</button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {visibleCount < filteredTransactions.length && (
        <div className="flex justify-center p-4 border-t border-[#E0D8C3] bg-white">
          <button 
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="border border-[#7C6A2E] text-[#7C6A2E] font-bold text-[10px] tracking-widest uppercase px-6 py-2 hover:bg-[#FAF6EE] transition-colors"
          >
            Load Next 20
          </button>
        </div>
      )}

      {/* Summary Footer */}
      <div className="bg-[#FDF9F1] p-6 border-t border-[#E0D8C3] flex flex-col sm:flex-row justify-end items-end gap-8 sm:gap-16">
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Subtotal (Page)</p>
          <p className="text-xl font-serif text-gray-800">LKR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase mb-1">Adjustments/Refunds</p>
          <p className="text-xl font-serif text-red-600">(-LKR {adjustments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-1">Net Revenue</p>
          <p className="text-2xl font-serif font-bold text-[#7C6A2E]">LKR {netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTable;
