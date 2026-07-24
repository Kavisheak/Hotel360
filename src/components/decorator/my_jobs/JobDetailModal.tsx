"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, MapPin, Calendar, Clock, ShieldCheck, CheckCircle2, Camera, User, Phone, Mail, FileText, Check, Sparkles } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';

interface JobDetailModalProps {
  jobId: string | null;
  onClose: () => void;
  onRefresh?: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ jobId, onClose, onRefresh }) => {
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    if (!jobId) return;
    setIsLoading(true);
    try {
      const res = await decoratorAPI.getJobById(jobId);
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
      const res = await decoratorAPI.markJobComplete(jobId);
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

              {/* Customer Selected Design */}
              {job.vendors?.decorator?.requestedDesignId && (
                <div className="bg-white p-4 rounded-lg border border-[#E0D8C3] space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B08D2C] flex items-center gap-1.5">
                    <Sparkles size={14} /> Customer Selected Design &amp; Package
                  </h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#FFFBF0] p-3 rounded border border-[#E0D8C3]">
                    {job.vendors.decorator.requestedDesignId.coverUrl || job.vendors.decorator.requestedDesignId.media?.[0]?.url ? (
                      <img
                        src={job.vendors.decorator.requestedDesignId.coverUrl || job.vendors.decorator.requestedDesignId.media?.[0]?.url}
                        alt="Selected Design"
                        className="w-24 h-20 object-cover rounded border border-[#E0D8C3] shrink-0"
                      />
                    ) : null}
                    <div className="space-y-1">
                      <h5 className="font-serif font-bold text-gray-900 text-sm">
                        {job.vendors.decorator.requestedDesignId.title || "Custom Selected Design"}
                      </h5>
                      {job.vendors.decorator.requestedDesignId.price ? (
                        <p className="text-xs font-bold text-[#7C6A2E]">
                          Package Price: LKR {Number(job.vendors.decorator.requestedDesignId.price).toLocaleString()}
                        </p>
                      ) : null}
                      {job.vendors.decorator.requestedDesignId.description && (
                        <p className="text-gray-500 text-[11px] line-clamp-2">
                          {job.vendors.decorator.requestedDesignId.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

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
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                          job.escrowBreakdown?.advanceStatus === 'Released'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {job.escrowBreakdown?.advanceStatus || 'Held'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-gray-800">70% Remaining Balance</td>
                      <td className="py-2.5 font-mono">LKR {(job.escrowBreakdown?.balanceHeld || 0).toLocaleString()}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                          job.escrowBreakdown?.balanceStatus === 'Released'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {job.escrowBreakdown?.balanceStatus || 'Held'}
                        </span>
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
                      <p className="text-gray-600 text-xs mt-0.5">Showcase your completed decoration work from this event on your public profile.</p>
                    </div>
                  </div>
                  <Link
                    href={`/decorator/portfolio?linkedBookingId=${job._id}`}
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
          {!job?.vendorConfirmedAttendance ? (
            <button
              onClick={handleMarkComplete}
              disabled={isMarking || isLoading}
              className="px-4 py-2 bg-[#4E411B] hover:bg-[#342b12] text-white font-bold text-xs uppercase tracking-widest rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Check size={14} /> {isMarking ? 'Updating...' : 'Confirm My Attendance'}
            </button>
          ) : (
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded border border-purple-200 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Attendance Confirmed
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
    </div>
  );
};

export default JobDetailModal;
