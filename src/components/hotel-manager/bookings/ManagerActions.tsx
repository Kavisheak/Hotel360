"use client";

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Circle, Flag, Send } from 'lucide-react';
import { bookingAPI } from '../../../lib/api';

// Hardcoded statusHistory removed.

const ManagerActions = ({ booking, onStatusUpdate }: { booking: any, onStatusUpdate?: () => void }) => {
  const [status, setStatus] = useState<'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED'>(
    booking.status ? booking.status.toUpperCase() : 'PENDING'
  );
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState(booking.rejectionReason || '');
  const [rejectError, setRejectError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  const handleRecordPayment = async (type: 'deposit' | 'balance') => {
    setIsRecordingPayment(true);
    const id = booking.bookingRef || booking._id || booking.id;
    const res = await bookingAPI.recordPayment(id, { paymentType: type });
    setIsRecordingPayment(false);
    if (res.ok) {
      if (onStatusUpdate) onStatusUpdate();
    } else {
      alert(res.data?.message || 'Failed to record payment.');
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    const id = booking.bookingRef || booking._id || booking.id;
    const res = await bookingAPI.updateBookingStatus(id, { status: 'Confirmed' });
    setIsLoading(false);
    if (res.ok) {
      setStatus('CONFIRMED');
      setShowRejectForm(false);
      if (onStatusUpdate) onStatusUpdate();
    } else {
      alert(res.data?.message || 'Failed to approve booking.');
    }
  };

  const handleRejectSubmit = async () => {
    if (rejectReason.trim().length < 10) {
      setRejectError('Please provide a detailed reason (min 10 chars).');
      return;
    }
    setRejectError('');
    setIsLoading(true);
    const id = booking.bookingRef || booking._id || booking.id;
    const res = await bookingAPI.updateBookingStatus(id, { status: 'Rejected', rejectionReason: rejectReason });
    setIsLoading(false);
    if (res.ok) {
      setStatus('REJECTED');
      setShowRejectForm(false);
      if (onStatusUpdate) onStatusUpdate();
    } else {
      alert(res.data?.message || 'Failed to reject booking.');
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    const id = booking.bookingRef || booking._id || booking.id;
    const res = await bookingAPI.updateBookingStatus(id, { status: 'Completed' });
    setIsLoading(false);
    if (res.ok) {
      setStatus('COMPLETED');
      if (onStatusUpdate) onStatusUpdate();
    } else {
      alert(res.data?.message || 'Failed to mark as completed.');
    }
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
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest mb-3 transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B08D2C] hover:bg-[#9B7A20]'} text-white shadow-sm`}
            >
              <CheckCircle2 size={16} /> {isLoading ? 'Processing...' : 'Approve Booking'}
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
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-1 py-2 ${isLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm`}
              >
                <Send size={12} /> {isLoading ? '...' : 'Submit'}
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
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4E411B] hover:bg-[#342b12]'} text-white shadow-sm`}
            >
              <Flag size={16} /> {isLoading ? 'Processing...' : 'Mark as Completed'}
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

      {/* Payment Actions */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
          Payment Status & Actions
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs border-b border-[#E0D8C3] pb-2">
            <span className="text-gray-500">Method:</span>
            <span className="font-bold text-gray-800 uppercase">{booking.paymentMethod || 'Manual'}</span>
          </div>

          <div className="flex justify-between text-xs border-b border-[#E0D8C3] pb-2">
            <span className="text-gray-500">Advance (30%):</span>
            <span className={`font-bold ${booking.depositAmount > 0 ? 'text-green-600' : 'text-amber-600'}`}>
              {booking.depositAmount > 0 
                ? `Paid: LKR ${booking.depositAmount.toLocaleString()}` 
                : `Pending: LKR ${(booking.totalCost * 0.3).toLocaleString()}`
              }
            </span>
          </div>

          <div className="flex justify-between text-xs border-b border-[#E0D8C3] pb-2">
            <span className="text-gray-500">Balance (70%):</span>
            <span className={`font-bold ${booking.balanceAmount > 0 ? 'text-green-600' : 'text-amber-600'}`}>
              {booking.balanceAmount > 0 
                ? `Paid: LKR ${booking.balanceAmount.toLocaleString()}` 
                : `Pending: LKR ${(booking.totalCost * 0.7).toLocaleString()}`
              }
            </span>
          </div>

          {/* Action Button */}
          {!booking.depositAmount || booking.depositAmount === 0 ? (
            <button
              onClick={() => handleRecordPayment('deposit')}
              disabled={isRecordingPayment}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest mt-2 transition-all ${
                isRecordingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white shadow-sm`}
            >
              Record Advance Received
            </button>
          ) : (!booking.balanceAmount || booking.balanceAmount === 0) ? (
            <button
              onClick={() => handleRecordPayment('balance')}
              disabled={isRecordingPayment}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest mt-2 transition-all ${
                isRecordingPayment ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white shadow-sm`}
            >
              Record Balance Received
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-2.5 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest">
              Payment Fully Collected
            </div>
          )}
        </div>
      </div>

      {/* Status History */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
          Status History
        </h4>
        <div className="space-y-4">
          {(booking.statusHistory || []).slice().reverse().map((s: any, i: number) => (
            <div key={i} className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {i === 0
                  ? <Circle size={12} className="fill-[#B08D2C] text-[#B08D2C]" />
                  : <Circle size={12} className="text-gray-300 fill-gray-100" />
                }
              </div>
              <div>
                <p className={`text-xs font-semibold ${i === 0 ? 'text-gray-800' : 'text-gray-500'}`}>
                  {s.status === 'Pending' ? 'Pending Approval' : 
                   s.status === 'Confirmed' ? 'Booking Confirmed' : 
                   s.status === 'Completed' ? 'Event Completed' : 
                   s.status === 'Rejected' ? 'Booking Rejected' : s.status}
                </p>
                <p className="text-[10px] text-gray-400">
                  {new Date(s.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + new Date(s.updatedAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                {s.note && <p className="text-[10px] italic text-gray-400 mt-0.5">{s.note}</p>}
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">By {s.updatedBy}</p>
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
          "{booking.internalNote || 'No internal note provided for this booking.'}"
        </p>
      </div>
    </div>
  );
};

export default ManagerActions;
