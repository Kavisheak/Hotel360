"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';

const statusHistory = [
  {
    label: 'Pending Approval',
    date: 'Today, 09:42 AM',
    note: 'Review initiated by Venue Manager',
    active: true,
  },
  {
    label: 'Deposit Paid',
    date: 'Oct 12, 2023',
    note: null,
    active: false,
  },
  {
    label: 'Initial Inquiry',
    date: 'Oct 01, 2023',
    note: null,
    active: false,
  },
];

const ManagerActions = () => {
  const [approved, setApproved] = useState<null | boolean>(null);

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
          Manager Actions
        </h4>
        <button
          onClick={() => setApproved(true)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest mb-3 transition-all ${
            approved === true
              ? 'bg-green-600 text-white'
              : 'bg-[#B08D2C] hover:bg-[#9B7A20] text-white'
          }`}
        >
          <CheckCircle2 size={16} />
          Approve Booking
        </button>
        <button
          onClick={() => setApproved(false)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border ${
            approved === false
              ? 'bg-red-50 border-red-400 text-red-600'
              : 'bg-white border-[#E0D8C3] text-gray-600 hover:border-red-400 hover:text-red-500'
          }`}
        >
          <XCircle size={16} />
          Reject Request
        </button>
        {approved !== null && (
          <p className={`text-[10px] text-center mt-2 font-semibold ${approved ? 'text-green-600' : 'text-red-500'}`}>
            {approved ? '✓ Booking approved successfully' : '✗ Request has been rejected'}
          </p>
        )}
      </div>

      {/* Status History */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
          Status History
        </h4>
        <div className="space-y-4">
          {statusHistory.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {s.active
                  ? <Circle size={12} className="fill-[#B08D2C] text-[#B08D2C]" />
                  : <Circle size={12} className="text-gray-300 fill-gray-100" />
                }
              </div>
              <div>
                <p className={`text-xs font-semibold ${s.active ? 'text-gray-800' : 'text-gray-500'}`}>{s.label}</p>
                <p className="text-[10px] text-gray-400">{s.date}</p>
                {s.note && <p className="text-[10px] italic text-gray-400 mt-0.5">{s.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Note */}
      <div className="bg-[#FFFBF0] border-l-4 border-[#B08D2C] rounded-r-xl p-5 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-2">
          Internal Note
        </h4>
        <p className="text-sm italic text-gray-700 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "Client requested extra white floor wrapping for the dance floor. Julian (Decorator) is currently sourcing the premium vinyl."
        </p>
      </div>
    </div>
  );
};

export default ManagerActions;
