"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, MapPin, Camera, CheckCircle, ShieldCheck, 
  ChevronDown, ChevronUp, Clock, FileText, Sparkles, CheckCircle2, Check, X, AlertCircle, User, ChevronLeft, ChevronRight
} from 'lucide-react';
import { decoratorAPI } from '@/lib/api';
import { useToastStore } from '@/store/toastStore';
import { getApiImageUrl } from '@/lib/vendorUtils';

interface JobCardProps {
  job: any;
  onRefresh: () => void;
  isExpanded?: boolean;
  onToggleExpand?: (isExpanded: boolean) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job: initialJob, onRefresh, isExpanded: propIsExpanded, onToggleExpand }) => {
  const { addToast } = useToastStore();
  
  // State
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = propIsExpanded !== undefined ? propIsExpanded : internalIsExpanded;
  const [fullJobData, setFullJobData] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Action States
  const [isConfirmingReceipt, setIsConfirmingReceipt] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Derived properties from initial job
  const dateObj = new Date(initialJob.date || Date.now());
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = dateObj.getFullYear();

  const isCompleted = initialJob.status === 'completed';
  const isCancelled = initialJob.status === 'cancelled';
  const isUpcoming = initialJob.status === 'upcoming';
  const showPortfolioCTA = isCompleted && initialJob.readyForPortfolioLink && !initialJob.linkedAlbumId;

  // Escrow Chip styling
  const advanceStatus = initialJob.escrow?.advanceStatus || 'Unpaid';
  const balanceStatus = initialJob.escrow?.balanceStatus || 'Unpaid';
  
  let escrowChipLabel = `Advance: ${advanceStatus}`;
  let escrowChipClass = "bg-amber-50 text-amber-800 border-amber-200";
  if (advanceStatus === 'Released' && balanceStatus === 'Released') {
    escrowChipLabel = "Escrow: Fully Released";
    escrowChipClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
  } else if (advanceStatus === 'Released') {
    escrowChipLabel = "Advance Released • Balance Held";
    escrowChipClass = "bg-blue-50 text-blue-800 border-blue-200";
  } else if (isCancelled) {
    escrowChipLabel = `Escrow: ${advanceStatus === 'Refunded' ? 'Refunded' : 'Cancelled'}`;
    escrowChipClass = "bg-red-50 text-red-700 border-red-200";
  }

  // Handle Expansion & Fetching
  const toggleExpand = () => {
    if (!isExpanded && !fullJobData) {
      fetchJobDetails();
    }
    if (onToggleExpand) {
      onToggleExpand(!isExpanded);
    } else {
      setInternalIsExpanded(!isExpanded);
    }
  };

  const fetchJobDetails = async () => {
    setIsLoadingDetails(true);
    try {
      const res = await decoratorAPI.getJobById(initialJob._id);
      if (res.ok && res.data?.data) {
        setFullJobData(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load full job details:", e);
    } finally {
      setIsLoadingDetails(false);
    }
  };



  const submitConfirmReceipt = async () => {
    setIsConfirmingReceipt(true);
    try {
      const res = await decoratorAPI.confirmReceipt(initialJob._id);
      if (res.ok && res.data?.success) {
        addToast({ message: 'Receipt confirmed successfully.', type: 'success' });
        setShowReceiptModal(false);
        fetchJobDetails(); 
        onRefresh();
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

  // Active job data to render (prefer full data if available)
  const job = fullJobData || initialJob;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDesignModal) return;
      const media = job.requestedDesignId?.media || [];
      if (media.length <= 1) return;

      if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDesignModal, job.requestedDesignId]);

  return (
    <div className={`group border transition-all duration-500 bg-white rounded-xl shadow-xs overflow-hidden ${isExpanded ? 'border-[#B08D2C] ring-4 ring-[#FEF9E8]' : 'border-[#E0D8C3] hover:shadow-md hover:border-[#B08D2C]'}`}>
      
      {/* ========================================== */}
      {/* BASE CARD SUMMARY (Always Visible)         */}
      {/* ========================================== */}
      <div 
        onClick={toggleExpand}
        className="p-5 cursor-pointer relative"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-b from-[#4A463B] to-[#2A2721] text-white w-14 h-14 rounded-lg flex flex-col justify-center items-center shrink-0 shadow-md border border-[#5A5548]">
              <span className="text-xl font-bold font-serif leading-none">{day}</span>
              <span className="text-[9px] font-bold tracking-widest uppercase mt-0.5 text-[#E0D8C3]">{month}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.bookingRef}</span>
                <span className="text-gray-300 shrink-0">•</span>
                <span className="text-[11px] font-serif italic text-[#9B8544] truncate">{job.eventType}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-[#7C6A2E] transition-colors break-words">
                {job.clientName}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
              isUpcoming ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-inner' :
              isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-inner' :
              'bg-red-50 text-red-700 border-red-200 shadow-inner'
            }`}>
              {job.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 mb-2 mt-4 ml-[72px]">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={14} className="text-[#B08D2C] shrink-0" />
            <span className="font-semibold text-gray-800 truncate">{job.venueName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 min-w-0 flex-wrap">
            <span className="truncate">Requested Decoration: <strong className="text-gray-700">{job.packageName}</strong></span>
            <span className="shrink-0">•</span>
            <span className="shrink-0">{job.guests} Guests</span>
            {(job.requestedDesignId?.coverUrl || job.requestedDesignId?.media?.[0]?.url) && (
              <>
                <span className="shrink-0">•</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(0); setShowDesignModal(true); }}
                  className="shrink-0 text-[#7C6A2E] hover:text-[#5E4F20] font-bold text-[10px] uppercase tracking-wider underline flex items-center gap-1"
                >
                  <Camera size={12} /> View Design
                </button>
              </>
            )}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-[#F2EADA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 ml-[72px]">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${escrowChipClass}`}>
              <ShieldCheck size={13} /> {escrowChipLabel}
            </span>
            {job.vendorConfirmedAttendance && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                <CheckCircle size={13} /> Attended
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showPortfolioCTA && (
              <Link
                href={`/decorator/portfolio?linkedBookingId=${job._id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7C6A2E] to-[#9B8544] hover:from-[#685724] hover:to-[#7C6A2E] text-white text-[10px] font-bold tracking-widest uppercase rounded shadow-md transition-all"
              >
                <Camera size={14} /> Add Photos
              </Link>
            )}
            <button
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all ${isExpanded ? 'bg-[#FEF9E8] text-[#7C6A2E]' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* EXPANDED DETAILS SECTION                   */}
      {/* ========================================== */}
      <div 
        className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="p-6 pt-2 border-t border-[#E0D8C3] bg-[#FCFAF5]">
          {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="w-8 h-8 border-4 border-[#E0D8C3] border-t-[#7C6A2E] rounded-full animate-spin"></div>
              <p className="text-sm font-serif italic text-gray-400">Loading deep details...</p>
            </div>
          ) : !fullJobData ? (
            <div className="py-8 text-center text-sm text-red-500 font-bold">Failed to load details.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* Detailed Customer & Venue Meta */}
                <div className="bg-white p-5 rounded-xl border border-[#E0D8C3] shadow-sm flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5 mb-2">
                      <MapPin size={14} className="shrink-0" /> Event Venue Details
                    </span>
                    <p className="font-bold text-gray-900 break-words">{job.venueName}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed break-words">{job.venueAddress}</p>
                  </div>
                  <div className="md:border-l md:border-[#F2EADA] md:pl-6 flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5 mb-2">
                      <Calendar size={14} className="shrink-0" /> Timeline Summary
                    </span>
                    <p className="font-bold text-gray-900 break-words">{new Date(job.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-gray-500 text-xs mt-1">Status: {job.status}</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-[#E0D8C3] shadow-sm flex flex-col gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5">
                    <User size={14} className="shrink-0" /> Client Contact Info
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 break-words">{job.clientName}</p>
                    {job.phone && <p className="text-gray-500 text-xs mt-1 leading-relaxed break-words">📞 {job.phone}</p>}
                    {job.email && <p className="text-gray-500 text-xs mt-1 leading-relaxed break-words">✉️ {job.email}</p>}
                    {!job.phone && !job.email && <p className="text-gray-400 text-xs mt-1 italic">Contact info restricted.</p>}
                  </div>
                </div>

                {/* Requested Design Module */}
                {job.requestedDesignId && (
                  <div className="bg-gradient-to-br from-white to-[#FFFCF5] p-5 rounded-xl border border-[#E0D8C3] shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5 mb-4">
                      <Sparkles size={14} /> Requested Design Inspiration
                    </span>
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <h4 className="font-serif text-lg font-bold text-gray-900 leading-tight break-words">
                          {job.requestedDesignId.title || "Custom Event Package"}
                        </h4>
                        {job.requestedDesignId.price > 0 && (
                          <div className="inline-block px-3 py-1 bg-[#FEF9E8] border border-[#E0D8C3] rounded text-xs font-bold text-[#7C6A2E] truncate max-w-full">
                            LKR {Number(job.requestedDesignId.price).toLocaleString()}
                          </div>
                        )}
                        {job.requestedDesignId.description && (
                          <p className="text-gray-600 text-xs leading-relaxed italic break-words">
                            {job.requestedDesignId.description}
                          </p>
                        )}
                      </div>
                      
                      {(job.requestedDesignId.coverUrl || job.requestedDesignId.media?.[0]?.url) && (
                        <button
                          onClick={() => { setCurrentImageIndex(0); setShowDesignModal(true); }}
                          className="self-start px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow transition-colors flex items-center gap-2"
                        >
                          <Camera size={14} /> View Design
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Customer Notes */}
                <div className="bg-white p-5 rounded-xl border border-[#E0D8C3] shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5 mb-3">
                    <FileText size={14} /> Customer Notes & Special Requests
                  </span>
                  <div className="bg-[#FAF6EE] p-4 rounded-lg border border-[#F2EADA]">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-serif italic break-words">
                      "{job.customerNotes || "No special requests provided."}"
                    </p>
                  </div>
                </div>
                


                {/* Escrow Breakdown Panel */}
                <div className="bg-white p-5 rounded-xl border border-[#E0D8C3] shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5 mb-4">
                    <ShieldCheck size={14} /> Payment Escrow
                  </span>
                  
                  <div className="space-y-4">
                    {/* Advance */}
                    <div className="p-3 bg-gray-50 rounded border border-gray-100 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-gray-800">30% Advance</span>
                          <span className="block text-xs font-mono text-gray-500 mt-0.5">LKR {(job.escrowBreakdown?.advanceHeld || 0).toLocaleString()}</span>
                        </div>
                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded border ${
                          job.escrowBreakdown?.advanceStatus === 'Released' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          job.escrowBreakdown?.advanceStatus === 'ReceiptUploaded' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {job.escrowBreakdown?.advanceStatus === 'ReceiptUploaded' ? 'Awaiting Confirmation' : (job.escrowBreakdown?.advanceStatus === 'PendingTransfer' ? 'Pending Transfer' : (job.escrowBreakdown?.advanceStatus || 'Held'))}
                        </span>
                      </div>
                      
                      {job.escrowBreakdown?.advanceStatus === 'ReceiptUploaded' && (
                        <button
                          onClick={() => setShowReceiptModal(true)}
                          className="w-full mt-1 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md transition-all flex justify-center items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Review & Confirm Receipt
                        </button>
                      )}
                    </div>

                    {/* Balance */}
                    <div className="p-3 bg-gray-50 rounded border border-gray-100 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-gray-800">70% Balance</span>
                          <span className="block text-xs font-mono text-gray-500 mt-0.5">LKR {(job.escrowBreakdown?.balanceHeld || 0).toLocaleString()}</span>
                        </div>
                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded border ${
                          job.escrowBreakdown?.balanceStatus === 'Released' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          job.escrowBreakdown?.balanceStatus === 'ReceiptUploaded' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {job.escrowBreakdown?.balanceStatus === 'ReceiptUploaded' ? 'Awaiting Confirmation' : (job.escrowBreakdown?.balanceStatus === 'PendingTransfer' ? 'Pending Transfer' : (job.escrowBreakdown?.balanceStatus || 'Held'))}
                        </span>
                      </div>

                      {job.escrowBreakdown?.balanceStatus === 'ReceiptUploaded' && (
                        <button
                          onClick={() => setShowReceiptModal(true)}
                          className="w-full mt-1 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md transition-all flex justify-center items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Review & Confirm Receipt
                        </button>
                      )}
                    </div>
                  </div>
                </div>



              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* CONFIRM RECEIPT MODAL (Overlay)            */}
      {/* ========================================== */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn transform scale-100">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> Confirm Bank Transfer
              </h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                Hotel 360 has released your payout and uploaded a transaction receipt. Please review it carefully. By confirming, you acknowledge receipt of funds into your bank account.
              </div>
              
              {job.escrowBreakdown?.payoutReference && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Bank Reference Notes</span>
                  <p className="text-sm text-gray-900 font-mono font-medium break-all">{job.escrowBreakdown.payoutReference}</p>
                </div>
              )}

              {job.escrowBreakdown?.payoutReceiptUrl ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Bank Receipt Document</span>
                  <a href={job.escrowBreakdown.payoutReceiptUrl} target="_blank" rel="noreferrer" className="block w-full h-48 border-2 border-gray-200 rounded-xl overflow-hidden relative group shadow-inner">
                    <img src={getApiImageUrl(job.escrowBreakdown.payoutReceiptUrl)} alt="Receipt" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <span className="text-white text-xs font-bold px-4 py-2 border border-white/40 rounded-full shadow-lg flex items-center gap-2">
                        Click to Enlarge
                      </span>
                    </div>
                  </a>
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-200 text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} /> No receipt image was provided.
                </div>
              )}
            </div>
            
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowReceiptModal(false)} 
                className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors uppercase tracking-wider"
              >
                Not Yet
              </button>
              <button 
                onClick={submitConfirmReceipt}
                disabled={isConfirmingReceipt}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2 uppercase tracking-wider"
              >
                {isConfirmingReceipt ? (
                  <>Processing...</>
                ) : (
                  <><Check size={16} /> I Confirm Receipt</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW DESIGN MODAL (Overlay)                */}
      {/* ========================================== */}
      {showDesignModal && job.requestedDesignId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowDesignModal(false)}>
          <div className="relative max-w-3xl w-full flex flex-col items-center animate-fadeIn" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowDesignModal(false)}
              className="absolute top-2 right-2 md:-right-12 md:-top-1 text-white hover:text-gray-300 bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-50"
            >
              <X size={24} />
            </button>
            
            {job.requestedDesignId.media && job.requestedDesignId.media.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === 0 ? job.requestedDesignId.media.length - 1 : prev - 1); }}
                  className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-50"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === job.requestedDesignId.media.length - 1 ? 0 : prev + 1); }}
                  className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-50"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <img 
              src={getApiImageUrl(job.requestedDesignId.media?.[currentImageIndex]?.url || job.requestedDesignId.coverUrl)}
              alt="Requested Design"
              className="w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            
            {job.requestedDesignId.media && job.requestedDesignId.media.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {job.requestedDesignId.media.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)]' : 'bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            )}
            
            <div className="mt-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl text-white text-center border border-white/10 shadow-lg">
              <h4 className="font-serif text-lg font-bold">{job.requestedDesignId.title || "Custom Event Package"}</h4>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobCard;
