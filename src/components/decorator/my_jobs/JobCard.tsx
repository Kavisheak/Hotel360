"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Camera, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface JobCardProps {
  job: any;
  onOpenDetails: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onOpenDetails }) => {
  const dateObj = new Date(job.date || Date.now());
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = dateObj.getFullYear();

  const isCompleted = job.status === 'completed';
  const isCancelled = job.status === 'cancelled';
  const isUpcoming = job.status === 'upcoming';

  const showPortfolioCTA = isCompleted && job.readyForPortfolioLink && !job.linkedAlbumId;

  // Escrow Chip styling & label
  const advanceStatus = job.escrow?.advanceStatus || 'Unpaid';
  const balanceStatus = job.escrow?.balanceStatus || 'Unpaid';

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

  return (
    <div className="group border border-[#E0D8C3] bg-white rounded-lg p-5 shadow-xs hover:shadow-md hover:border-[#B08D2C] transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top Bar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#4A463B] text-white w-12 h-12 rounded-md flex flex-col justify-center items-center shrink-0 shadow-xs">
              <span className="text-base font-bold font-serif leading-none">{day}</span>
              <span className="text-[8px] font-bold tracking-widest uppercase">{month}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{job.bookingRef}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-serif italic text-[#7C6A2E]">{job.eventType}</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-[#7C6A2E] transition-colors">
                {job.clientName}
              </h3>
            </div>
          </div>

          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
            isUpcoming ? 'bg-blue-50 text-blue-700 border-blue-200' :
            isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            'bg-red-50 text-red-700 border-red-200'
          }`}>
            {job.status}
          </span>
        </div>

        {/* Venue Info */}
        <div className="space-y-1.5 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#A6955C] shrink-0" />
            <span className="font-semibold text-gray-800">{job.venueName}</span>
            <span className="text-gray-400">({job.venueAddress})</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Package: <strong className="text-gray-700">{job.packageName}</strong></span>
            <span>•</span>
            <span>{job.guests} Guests</span>
          </div>
        </div>
      </div>

      {/* Footer / Status Chips & Actions */}
      <div className="pt-3 border-t border-[#F2EADA] flex flex-wrap items-center justify-between gap-3 mt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Escrow Status Chip */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${escrowChipClass}`}>
            <ShieldCheck size={12} />
            {escrowChipLabel}
          </span>

          {job.vendorConfirmedAttendance && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-purple-50 text-purple-700 border border-purple-200">
              <CheckCircle size={10} /> Attended
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Highlighted Portfolio CTA for completed jobs */}
          {showPortfolioCTA && (
            <Link
              href={`/decorator/portfolio?linkedBookingId=${job._id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#7C6A2E] hover:bg-[#685724] text-white text-[10px] font-bold tracking-widest uppercase rounded shadow-xs transition-colors"
            >
              <Camera size={12} />
              Add photos from this job →
            </Link>
          )}

          <button
            onClick={() => onOpenDetails(job._id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#E0D8C3] hover:border-[#7C6A2E] text-gray-700 hover:text-[#7C6A2E] text-[10px] font-bold tracking-widest uppercase rounded transition-colors bg-white"
          >
            Details
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
