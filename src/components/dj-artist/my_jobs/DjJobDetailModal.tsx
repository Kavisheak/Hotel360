"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, MapPin, Calendar, Clock, ShieldCheck, CheckCircle2, Camera, User, Phone, Mail, FileText, Check, Sparkles } from 'lucide-react';
import { djAPI } from '@/lib/api';
import { useToastStore } from '@/store/toastStore';

interface DjJobDetailModalProps {
  jobId: string | null;
  onClose: () => void;
  onRefresh?: () => void;
}

const DjJobDetailModal: React.FC<DjJobDetailModalProps> = ({ jobId, onClose, onRefresh }) => {
  const { addToast } = useToastStore();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);
  const [isConfirmingReceipt, setIsConfirmingReceipt] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    if (!jobId) return;
    setIsLoading(true);
    try {
      const res = await djAPI.getJobById(jobId);
      if (res.ok && res.data?.data) {
        setJob(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load job details:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!jobId) return;
    setIsMarking(true);
    try {
      const res = await djAPI.updateBookingStatus(jobId, "Completed");
      if (res.ok) {
        setJob((prev: any) => ({ ...prev, vendorConfirmedAttendance: true }));
        onRefresh?.();
      } else {
        alert(res.data?.message || 'Failed to mark attendance.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsMarking(false);
    }
  };

  const submitConfirmReceipt = async () => {
    if (!jobId) return;
    setIsConfirmingReceipt(true);
    try {
      const res = await djAPI.confirmReceipt(jobId);
      if (res.ok && res.data?.success) {
        addToast({ message: 'Receipt confirmed successfully.', type: 'success' });
        setShowReceiptModal(false);
        fetchJobDetails(); // Refresh job details
        onRefresh?.();
      } else {
        alert(res.data?.message || 'Failed to confirm receipt.');
      }
    } catch (e) {
      console.error(e);
      alert('Error confirming receipt.');
    } finally {
      setIsConfirmingReceipt(false);
    }
  };

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E0D8C3] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job?.bookingRef || 'JOB DETAILS'}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-serif italic text-[#7C6A2E]">{job?.eventType}</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900">
              {isLoading ? 'Loading...' : job?.clientName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {isLoading ? (
            <div className="py-12 text-center text-sm font-serif italic text-gray-400">
              Loading full job details...
            </div>
          ) : !job ? (
            <div className="py-12 text-center text-sm text-red-500 font-bold">
              Failed to load job details.
            </div>
          ) : (
            <>
              {/* Event Quick Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white p-4 rounded-lg border border-[#E0D8C3]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Event Date</span>
                  <div className="font-semibold text-gray-800 flex items-center gap-1">
                    <Calendar size={13} className="text-[#A6955C]" />
                    {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Guest Count</span>
                  <div className="font-semibold text-gray-800">{job.guests} Guests</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Job Status</span>
                  <span className="inline-block font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase border border-blue-200">
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Venue Address */}
              <div className="bg-white p-4 rounded-lg border border-[#E0D8C3]">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-2 flex items-center gap-1.5">
                  <MapPin size={14} /> Venue &amp; Location
                </h4>
                <p className="font-bold text-gray-800 text-sm">{job.venueName}</p>
                <p className="text-gray-500 text-xs mt-0.5">{job.venueAddress}</p>
              </div>

              {/* Customer Selected Package */}
              <div className="bg-white p-4 rounded-lg border border-[#E0D8C3] space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5">
                  <Sparkles size={14} /> Customer Selected Package
                </h4>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#FFFBF0] p-3 rounded border border-[#E0D8C3]">
                  <div className="space-y-1">
                    <h5 className="font-serif font-bold text-gray-900 text-sm">
                      {job.vendors?.dj?.packageName || "Standard DJ Package"}
                    </h5>
                    {job.pricingBreakdown?.djCost ? (
                      <p className="text-xs font-bold text-[#7C6A2E]">
                        Package Price: LKR {Number(job.pricingBreakdown.djCost).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="bg-white p-4 rounded-lg border border-[#E0D8C3]">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-2 flex items-center gap-1.5">
                  <FileText size={14} /> Customer Requirements &amp; Notes
                </h4>
                <p className="text-gray-700 italic leading-relaxed bg-[#FFFBF0] p-3 rounded border border-[#E0D8C3]">
                  "{job.customerNotes}"
                </p>
              </div>

              {/* Event Timeline */}
              <div className="bg-white p-4 rounded-lg border border-[#E0D8C3]">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-3 flex items-center gap-1.5">
                  <Clock size={14} /> Schedule &amp; Setup Timeline
                </h4>
                <div className="space-y-2">
                  {(job.eventTimeline || []).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 border-b border-[#F2EADA] pb-2 last:border-b-0">
                      <span className="font-mono font-bold text-[#7C6A2E] text-xs shrink-0">{item.time}</span>
                      <span className="text-gray-700">{item.task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escrow Breakdown Table */}
              <div className="bg-white p-4 rounded-lg border border-[#E0D8C3]">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Escrow Breakdown Table
                </h4>
                
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E0D8C3] text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2">Line Item</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2 text-right">Escrow Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-2.5 font-semibold text-gray-800">30% Advance Payment</td>
                      <td className="py-2.5 font-mono">LKR {(job.escrowBreakdown?.advanceHeld || 0).toLocaleString()}</td>
                      <td className="py-2.5 text-right flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                          job.escrowBreakdown?.advanceStatus === 'Released'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : job.escrowBreakdown?.advanceStatus === 'ReceiptUploaded'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : job.escrowBreakdown?.advanceStatus === 'PendingTransfer'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {job.escrowBreakdown?.advanceStatus === 'ReceiptUploaded' ? 'Awaiting Confirmation' : job.escrowBreakdown?.advanceStatus || 'Held'}
                        </span>
                        {job.escrowBreakdown?.advanceStatus === 'ReceiptUploaded' && (
                          <button
                            onClick={() => setShowReceiptModal(true)}
                            className="text-[9px] px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold tracking-wider uppercase"
                          >
                            View & Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-gray-800">70% Remaining Balance</td>
                      <td className="py-2.5 font-mono">LKR {(job.escrowBreakdown?.balanceHeld || 0).toLocaleString()}</td>
                      <td className="py-2.5 text-right flex flex-col items-end gap-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                          job.escrowBreakdown?.balanceStatus === 'Released'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : job.escrowBreakdown?.balanceStatus === 'ReceiptUploaded'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : job.escrowBreakdown?.balanceStatus === 'PendingTransfer'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {job.escrowBreakdown?.balanceStatus === 'ReceiptUploaded' ? 'Awaiting Confirmation' : job.escrowBreakdown?.balanceStatus || 'Held'}
                        </span>
                        {job.escrowBreakdown?.balanceStatus === 'ReceiptUploaded' && (
                          <button
                            onClick={() => setShowReceiptModal(true)}
                            className="text-[9px] px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold tracking-wider uppercase"
                          >
                            View & Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Post-Event Portfolio Link Prompt */}
              {job.readyForPortfolioLink && !job.linkedAlbumId && (
                <div className="p-4 bg-[#FEF9E8] border border-[#D4B553] rounded-lg flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Camera className="w-6 h-6 text-[#7C6A2E] shrink-0" />
                    <div>
                      <h5 className="font-serif font-bold text-gray-900 text-sm">Add Job Photos to Portfolio</h5>
                      <p className="text-gray-600 text-xs mt-0.5">Showcase your completed DJ work from this event on your public profile.</p>
                    </div>
                  </div>
                  <Link
                    href={`/dj-artist/portfolio?linkedBookingId=${job._id}`}
                    className="px-4 py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white font-bold tracking-wider uppercase text-[10px] rounded shadow-xs shrink-0"
                  >
                    + Add Album
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E0D8C3] bg-white flex items-center justify-between gap-4">
          {job?.vendors?.dj?.status !== "Completed" ? (
            <button
              onClick={handleMarkComplete}
              disabled={isMarking || isLoading}
              className="px-4 py-2 bg-[#4E411B] hover:bg-[#342b12] text-white font-bold text-xs uppercase tracking-widest rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Check size={14} /> {isMarking ? 'Updating...' : 'Mark Job Complete'}
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Job Completed
            </span>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 border border-[#E0D8C3] text-gray-600 hover:bg-gray-50 font-bold text-xs uppercase tracking-widest rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Confirm Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
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
              
              {job.escrowBreakdown?.payoutReference && (
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Bank Reference / Notes</span>
                  <p className="text-sm text-gray-800 font-medium">{job.escrowBreakdown.payoutReference}</p>
                </div>
              )}

              {job.escrowBreakdown?.payoutReceiptUrl ? (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Uploaded Receipt</span>
                  <a href={job.escrowBreakdown.payoutReceiptUrl} target="_blank" rel="noreferrer" className="block w-full h-48 border border-gray-200 rounded overflow-hidden relative group">
                    <img src={job.escrowBreakdown.payoutReceiptUrl} alt="Receipt" className="w-full h-full object-cover" />
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

export default DjJobDetailModal;
