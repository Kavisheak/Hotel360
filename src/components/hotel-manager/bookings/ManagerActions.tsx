"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Circle, Flag, Send } from 'lucide-react';

const statusHistory = [
  { label: 'Pending Approval', date: 'Today, 09:42 AM', note: 'Review initiated by Venue Manager', active: true },
  { label: 'Deposit Paid', date: 'Oct 12, 2023', note: null, active: false },
  { label: 'Initial Inquiry', date: 'Oct 01, 2023', note: null, active: false },
];

const ManagerActions = ({ booking }: { booking: any }) => {
  const [status, setStatus] = useState<'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED'>(
    booking.status ? booking.status.toUpperCase() : 'PENDING'
  );
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');

  const handleApprove = () => {
    setStatus('CONFIRMED');
    setShowRejectForm(false);
  };

  const handleRejectSubmit = () => {
    if (rejectReason.trim().length < 10) {
      setRejectError('Please provide a detailed reason (min 10 chars).');
      return;
    }
    setRejectError('');
    setStatus('REJECTED');
    setShowRejectForm(false);
  };

  const handleComplete = () => {
    setStatus('COMPLETED');
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
          Manager Actions
        </h4>

        {status === 'PENDING' && !showRejectForm && (
          <>
            <button
              onClick={handleApprove}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest mb-3 transition-all bg-[#B08D2C] hover:bg-[#9B7A20] text-white shadow-sm"
            >
              <CheckCircle2 size={16} /> Approve Booking
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border bg-white border-[#E0D8C3] text-gray-600 hover:border-red-400 hover:text-red-500 hover:bg-red-50"
            >
              <XCircle size={16} /> Reject Request
            </button>
          </>
        )}

        {showRejectForm && status === 'PENDING' && (
          <div className="bg-[#FAF6EE] border border-[#E0D8C3] p-4 rounded-lg animate-fadeIn">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Mandatory Rejection Reason</h5>
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="State the reason for rejection (e.g., date conflict, capacity limit)..."
              className="w-full border border-[#E0D8C3] px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-red-400 bg-white rounded mb-2 resize-none h-20"
            />
            {rejectError && <p className="text-[9px] text-red-500 mb-2 font-bold">{rejectError}</p>}
            <div className="flex gap-2">
              <button 
                onClick={() => setShowRejectForm(false)}
                className="flex-1 py-2 border border-[#E0D8C3] text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSubmit}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-700 shadow-sm"
              >
                <Send size={12} /> Submit
              </button>
            </div>
          </div>
        )}

        {status === 'CONFIRMED' && (
          <>
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
              <CheckCircle2 size={16} /> Booking Confirmed
            </div>
            <button
              onClick={handleComplete}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all bg-[#4E411B] hover:bg-[#342b12] text-white shadow-sm"
            >
              <Flag size={16} /> Mark as Completed
            </button>
            <p className="text-[9px] text-center mt-2 text-gray-500 italic">Only mark completed after the event has successfully concluded.</p>
          </>
        )}

        {status === 'REJECTED' && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-2">
              <XCircle size={16} /> Booking Rejected
            </div>
            <p className="text-[10px] text-center italic text-red-600">Reason: "{rejectReason}"</p>
          </div>
        )}

        {status === 'COMPLETED' && (
          <div className="bg-[#FDF9F1] border border-[#B08D2C] text-[#7C6A2E] p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-2">
              <Flag size={16} /> Event Completed
            </div>
            <p className="text-[10px] text-center italic text-gray-600">This event has been archived successfully.</p>
          </div>
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
