"use client";

import React, { useState } from 'react';
import { CheckCircle2, Plus, Video, Film, Aperture, Trash2, Camera, CheckSquare, ShieldCheck, X } from 'lucide-react';
import { videographerAPI } from '@/lib/api';
import { getApiImageUrl, getPackageName } from '@/lib/vendorUtils';

interface DetailBottomProps {
  booking?: any;
  onRefresh?: () => void;
  onViewPackage?: () => void;
}

const DetailBottom = ({ booking, onRefresh, onViewPackage }: DetailBottomProps) => {
  const vgVendor = booking?.vendors?.videographer;
  const packageName = getPackageName(booking, 'videographer');

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [successDetails, setSuccessDetails] = useState<string | null>(null);
  const [showcasePrompt, setShowcasePrompt] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isConfirmingReceipt, setIsConfirmingReceipt] = useState(false);

  const isJobCompleted = vgVendor?.status === 'Completed';

  let canMarkComplete = false;
  if (booking?.date) {
    const eventDate = new Date(booking.date);
    eventDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    canMarkComplete = today.getTime() >= eventDate.getTime();
  }

  React.useEffect(() => {
    // No checklist/photos setup needed
  }, [booking?._id, booking?.vendors?.videographer]);



  const handleComplete = () => {
    setShowcasePrompt(true);
  };

  const submitCompletion = async (publishToPortfolio: boolean) => {
    setShowcasePrompt(false);
    setIsUpdating(true);
    try {
      const res = await videographerAPI.updateBookingStatus(booking._id, "Completed", { publishToPortfolio });
      if (res.ok) {
        setSuccessDetails("Job marked as complete. Portfolio has been updated.");
        onRefresh?.();
      } else {
        setErrorDetails(res.data?.message || "Failed to mark as complete.");
      }
    } catch (err) {
      console.error(err);
      setErrorDetails("Failed to mark as complete.");
    } finally {
      setIsUpdating(false);
    }
  };

  const submitConfirmReceipt = async () => {
    if (!booking?._id) return;
    setIsConfirmingReceipt(true);
    try {
      const res = await videographerAPI.confirmReceipt(booking._id);
      if (res.ok && res.data?.success) {
        setSuccessDetails('Payment receipt confirmed successfully.');
        setShowReceiptModal(false);
        onRefresh?.();
      } else {
        setErrorDetails(res.data?.message || 'Failed to confirm receipt.');
      }
    } catch (e) {
      console.error(e);
      setErrorDetails('Error confirming receipt.');
    } finally {
      setIsConfirmingReceipt(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
      {/* Cinematic Package Details (3/5 width) */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
            <h3 className="text-xl font-serif font-bold text-gray-900">{packageName}</h3>
            <span className="text-[8px] font-bold tracking-widest border border-[#B08D2C] text-[#7C6A2E] px-2 py-0.5 uppercase">
              PREMIUM TIER
            </span>
          </div>

          <div className="mb-8">
            <button
              onClick={onViewPackage}
              className="px-6 py-3 border-2 border-[#7C6A2E] text-[#7C6A2E] hover:bg-[#7C6A2E] hover:text-white text-xs font-bold uppercase tracking-widest transition-colors w-full"
            >
              View Package Detail
            </button>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm lg:col-span-2 flex flex-col justify-center items-center">
        {!isJobCompleted && canMarkComplete ? (
          <button 
            onClick={handleComplete}
            disabled={isUpdating}
            className="w-full bg-[#685724] hover:bg-[#4A463B] disabled:opacity-50 text-white py-4 font-semibold text-xs tracking-[0.2em] transition-colors shadow-md"
          >
            {isUpdating ? 'PROCESSING...' : 'MARK JOB COMPLETE'}
          </button>
        ) : !isJobCompleted && !canMarkComplete ? (
          <div className="text-center p-6 border border-dashed border-[#E0D8C3] bg-gray-50 w-full h-full flex flex-col justify-center">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">Job Completion</h4>
            <p className="text-[11px] text-gray-500">You can mark this job as complete on the event date ({new Date(booking?.date).toLocaleDateString()}).</p>
          </div>
        ) : (
          <div className="text-center p-6 bg-emerald-50 border border-emerald-200 w-full h-full flex flex-col justify-center">
             <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-3" />
             <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Job Completed</h4>
          </div>
        )}
      </div>

      {/* Escrow Breakdown Table (Full width) */}
      <div className="bg-white p-6 shadow-sm border border-[#E0D8C3] lg:col-span-5">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-4 flex items-center gap-1.5">
          <ShieldCheck size={16} /> Escrow Breakdown Table
        </h4>
        
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E0D8C3] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3">Line Item</th>
              <th className="py-3">Amount</th>
              <th className="py-3 text-right">Escrow Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-4 font-semibold text-gray-800">30% Advance Payment</td>
              <td className="py-4 font-mono">LKR {(booking?.escrowBreakdown?.advanceHeld || 0).toLocaleString()}</td>
              <td className="py-4 text-right flex flex-col items-end gap-1.5">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                  booking?.escrowBreakdown?.advanceStatus === 'Released'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : booking?.escrowBreakdown?.advanceStatus === 'ReceiptUploaded'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : booking?.escrowBreakdown?.advanceStatus === 'PendingTransfer'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {booking?.escrowBreakdown?.advanceStatus === 'ReceiptUploaded' ? 'Awaiting Confirmation' : booking?.escrowBreakdown?.advanceStatus || 'Held'}
                </span>
                {booking?.escrowBreakdown?.advanceStatus === 'ReceiptUploaded' && (
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="text-[9px] px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold tracking-wider uppercase transition-colors"
                  >
                    View & Confirm
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td className="py-4 font-semibold text-gray-800">70% Remaining Balance</td>
              <td className="py-4 font-mono">LKR {(booking?.escrowBreakdown?.balanceHeld || 0).toLocaleString()}</td>
              <td className="py-4 text-right flex flex-col items-end gap-1.5">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                  booking?.escrowBreakdown?.balanceStatus === 'Released'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : booking?.escrowBreakdown?.balanceStatus === 'ReceiptUploaded'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : booking?.escrowBreakdown?.balanceStatus === 'PendingTransfer'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {booking?.escrowBreakdown?.balanceStatus === 'ReceiptUploaded' ? 'Awaiting Confirmation' : booking?.escrowBreakdown?.balanceStatus || 'Held'}
                </span>
                {booking?.escrowBreakdown?.balanceStatus === 'ReceiptUploaded' && (
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="text-[9px] px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold tracking-wider uppercase transition-colors"
                  >
                    View & Confirm
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Premium Success Modal */}
      {successDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-[#FAF6EE] border border-[#E0D8C3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckSquare size={32} className="text-[#7C6A2E]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Success</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {successDetails}
            </p>
            <button 
              onClick={() => setSuccessDetails(null)}
              className="w-full bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Premium Error Modal */}
      {errorDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-red-200 shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 tracking-wide">
              Action Required
            </h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              {errorDetails}
            </p>
            <button 
              onClick={() => setErrorDetails(null)}
              className="w-full bg-white border border-[#E0D8C3] hover:bg-gray-50 text-gray-800 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Showcase Prompt Modal */}
      {showcasePrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full mx-4 text-center">
            <h3 className="text-xl font-serif font-bold text-[#7C6A2E] mb-2 tracking-wide">Publish to Portfolio?</h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Would you like to automatically showcase this completed project in your public portfolio for future clients to see?
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => submitCompletion(false)}
                className="flex-1 bg-white hover:bg-gray-50 border border-[#E0D8C3] text-gray-800 px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
              >
                No, Keep Private
              </button>
              <button 
                onClick={() => submitCompletion(true)}
                className="flex-1 bg-[#7C6A2E] hover:bg-[#5E4F20] text-white px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
              >
                Yes, Showcase It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" /> Confirm Payment Receipt
              </h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                The manager has uploaded a payment receipt for your payout. Please review the details below and confirm if you have received the funds.
              </p>
              
              {booking?.escrowBreakdown?.payoutReference && (
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Bank Reference / Notes</span>
                  <p className="text-sm text-gray-800 font-medium">{booking.escrowBreakdown.payoutReference}</p>
                </div>
              )}

              {booking?.escrowBreakdown?.payoutReceiptUrl ? (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Uploaded Receipt</span>
                  <a href={booking.escrowBreakdown.payoutReceiptUrl} target="_blank" rel="noreferrer" className="block w-full h-48 border border-gray-200 rounded overflow-hidden relative group">
                    <img src={booking.escrowBreakdown.payoutReceiptUrl} alt="Receipt" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold px-3 py-1.5 border border-white/30 rounded backdrop-blur-sm">Click to Enlarge</span>
                    </div>
                  </a>
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 p-3 rounded border border-amber-200 text-sm">
                  No receipt image was uploaded by the manager.
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowReceiptModal(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                Cancel
              </button>
              <button 
                onClick={submitConfirmReceipt}
                disabled={isConfirmingReceipt}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isConfirmingReceipt ? "Confirming..." : "Yes, I Confirm Receipt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailBottom;
