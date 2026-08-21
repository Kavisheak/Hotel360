"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Circle, Flag, Send } from 'lucide-react';
import { bookingAPI } from '../../../lib/api';
import HallRejectReasonModal from './HallRejectReasonModal';
import { useToastStore } from '../../../store/toastStore';

// Hardcoded statusHistory removed.

const ManagerActions = ({ booking, onStatusUpdate }: { booking: any, onStatusUpdate?: () => void }) => {
  const [status, setStatus] = useState<string>(
    booking.status ? booking.status.toUpperCase() : 'PENDING'
  );
  const { addToast } = useToastStore();

  useEffect(() => {
    if (booking.status) {
      setStatus(booking.status.toUpperCase());
    }
  }, [booking.status]);

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState(booking.rejectionReason || '');
  const [rejectError, setRejectError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  const eventDate = new Date(booking.date || new Date());
  const deadlineDate = new Date(eventDate);
  // Deadline for balance payment is the event date itself
  const deadlineString = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isPastDeadline = new Date() > deadlineDate;
  const isEventDateReached = new Date().setHours(0, 0, 0, 0) >= new Date(booking.date || new Date()).setHours(0, 0, 0, 0);

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

  const handleRejectConfirm = async (reason: string, note?: string) => {
    setIsLoading(true);
    const id = booking.bookingRef || booking._id || booking.id;
    const res = await bookingAPI.rejectBooking(id, { reason, note });
    setIsLoading(false);
    if (res.ok) {
      setStatus('REJECTED');
      setRejectReason(reason);
      setShowRejectForm(false);
      addToast({ message: "Booking rejected and advance refunded successfully via PayHere.", type: "success" });
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

  const isPendingStatus = 
    status === 'PENDING' || 
    status === 'PENDING CONFIRMATION' || 
    status === 'PENDING HALL CONFIRMATION' || 
    status === 'DEPOSIT_PAID' ||
    booking.status === 'Pending' || 
    booking.status === 'Pending Confirmation' ||
    booking.status === 'Pending Hall Confirmation' ||
    booking.status === 'DEPOSIT_PAID';

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="bg-white border border-[#E0D8C3] rounded-xl p-5 shadow-sm">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4">
          Manager Actions
        </h4>

        {isPendingStatus && (
          <>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest mb-3 transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B08D2C] hover:bg-[#9B7A20]'} text-white shadow-sm`}
            >
              <CheckCircle2 size={16} /> {isLoading ? 'Processing...' : 'Approve Hall & Activate Vendors'}
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all border bg-white border-[#E0D8C3] text-gray-600 hover:border-red-400 hover:text-red-500 hover:bg-red-50"
            >
              <XCircle size={16} /> Reject Hall (100% Refund)
            </button>
          </>
        )}

        <HallRejectReasonModal
          isOpen={showRejectForm}
          clientName={booking.clientName || "Customer"}
          isSubmitting={isLoading}
          paidAdvance={booking.depositAmount || 0}
          onClose={() => setShowRejectForm(false)}
          onConfirm={handleRejectConfirm}
        />

        {status === 'CONFIRMED' && (
          <>
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
              <CheckCircle2 size={16} /> Booking Confirmed
            </div>
            {isEventDateReached ? (
              <>
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4E411B] hover:bg-[#342b12]'} text-white shadow-sm`}
                >
                  <Flag size={16} /> {isLoading ? 'Processing...' : 'Mark as Completed'}
                </button>
                <p className="text-[9px] text-center mt-2 text-gray-500 italic">Only mark completed after the event has successfully concluded.</p>
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-lg text-center mt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Event Date</p>
                <p className="text-[9px] mt-1">The option to mark this booking as completed will unlock on the event date ({deadlineString}).</p>
              </div>
            )}
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
            <span className="text-gray-500">Balance:</span>
            <div className="text-right">
              <span className={`font-bold ${booking.balanceAmount > 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {booking.balanceAmount > 0 
                  ? `Paid: LKR ${booking.balanceAmount.toLocaleString()}` 
                  : `Pending: LKR ${(booking.totalCost - booking.depositAmount).toLocaleString()}`
                }
              </span>
              {(!booking.balanceAmount || booking.balanceAmount === 0) && booking.depositAmount > 0 && (
                <div className={`text-[9px] mt-1 font-semibold ${isPastDeadline ? 'text-red-500' : 'text-gray-400'}`}>
                  Due: {deadlineString} {isPastDeadline && '(Overdue)'}
                </div>
              )}
            </div>
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
                  {s.status === 'Pending' || s.status === 'Pending Hall Confirmation' ? 'Pending Hall Approval' : 
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
