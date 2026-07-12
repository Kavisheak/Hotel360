"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { decoratorAPI } from '@/lib/api';
import { getClientDisplayName, VENUE_NAME } from '@/lib/vendorUtils';

interface UpcomingJobsProps {
  booking: any;
  onRefresh?: () => void;
  onMakePriority?: (id: string) => void;
}

const UpcomingJobs = ({ booking, onRefresh, onMakePriority }: UpcomingJobsProps) => {
  const dateObj = new Date(booking.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const status = booking.vendors?.decorator?.status === 'NotRequired' ? booking.status : booking.vendors?.decorator?.status || 'Pending';
  const isPending = status === 'Pending';

  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setModalStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      setIsUpdating(true);
      const res = await decoratorAPI.updateBookingStatus(booking._id, modalStatus);
      if (res.ok) {
        setShowModal(false);
        onRefresh?.();
      } else {
        alert(res.data?.message || 'Failed to update status');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const progressPercent = booking.vendors?.decorator?.progress || 0;
  let progressDots = 0;
  if (progressPercent > 0) progressDots = 1;
  if (progressPercent >= 50) progressDots = 2;
  if (progressPercent === 100) progressDots = 3;

  return (
    <>
      <div
        className={`border px-4 py-3 hover:bg-[#FDF9F1] transition-colors ${
          isPending ? 'border-[#C69C6D] bg-[#FCF6E3]' : 'border-[#E0D8C3] bg-white'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-[#4A463B] text-white w-10 h-11 flex flex-col justify-center items-center shrink-0">
              <span className="text-sm font-bold font-serif leading-none">{day}</span>
              <span className="text-[7px] font-bold tracking-widest">{month}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="font-serif font-bold text-gray-900 text-sm truncate">
                  {getClientDisplayName(booking)} · {booking.eventType}
                </p>
                <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">{status}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-[#A6955C] shrink-0" />
                  {VENUE_NAME}
                </span>
                <span>{booking.guests} guests</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isPending ? (
              <>
                <button
                  onClick={() => handleStatusChange('Accepted')}
                  className="px-3 py-1 bg-[#7C6A2E] hover:bg-[#685724] text-white text-[9px] font-bold tracking-widest uppercase transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusChange('Declined')}
                  className="px-3 py-1 border border-red-300 text-red-500 hover:bg-red-50 text-[9px] font-bold tracking-widest uppercase transition-colors"
                >
                  Decline
                </button>
              </>
            ) : (
              <>
                <div className="hidden sm:flex space-x-1 mr-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < progressDots ? 'bg-[#7C6A2E]' : 'bg-[#E0D8C3]'}`} />
                  ))}
                </div>
                {onMakePriority && (
                  <button
                    onClick={() => onMakePriority(booking._id)}
                    className="px-2 py-1 text-[9px] border border-[#E0D8C3] text-gray-500 hover:text-[#7C6A2E] hover:border-[#7C6A2E] font-bold tracking-widest uppercase"
                    title="Make this your current priority"
                  >
                    Priority
                  </button>
                )}
              </>
            )}
            <Link
              href={`/decorator/bookings/${booking._id}`}
              className="flex items-center gap-1 px-2 py-1 text-[9px] font-bold tracking-widest text-gray-400 hover:text-[#7C6A2E] uppercase"
            >
              Details
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modalStatus === 'Accepted' ? 'bg-[#7C6A2E]/10 text-[#7C6A2E]' : 'bg-red-50 text-red-500'}`}>
              {modalStatus === 'Accepted' ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <h3 className="text-2xl font-serif text-gray-800 tracking-tight mb-2">
              {modalStatus === 'Accepted' ? 'Accept Event Request?' : 'Decline Event Request?'}
            </h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              You are about to {modalStatus === 'Accepted' ? 'accept' : 'decline'} the request for{' '}
              <strong className="text-gray-800">{getClientDisplayName(booking)}</strong>.
            </p>
            <div className="flex w-full gap-3">
              <button onClick={() => setShowModal(false)} disabled={isUpdating} className="flex-1 border border-[#E0D8C3] text-gray-500 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={confirmStatusChange} disabled={isUpdating} className={`flex-1 py-3 text-white text-xs font-bold tracking-widest uppercase ${modalStatus === 'Accepted' ? 'bg-[#7C6A2E]' : 'bg-red-500'}`}>
                {isUpdating ? 'Processing...' : `Confirm ${modalStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingJobs;
