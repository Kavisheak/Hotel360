"use client";

import React, { useState } from 'react';
import { MapPin, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { djAPI } from '@/lib/api';
import { getClientDisplayName, getPackageName, VENUE_NAME } from '@/lib/vendorUtils';
import DjJobDetailModal from './DjJobDetailModal';

interface CurrentPriorityProps {
  booking: any;
  onRefresh?: () => void;
}

const CurrentPriority = ({ booking, onRefresh }: CurrentPriorityProps) => {
  const dateObj = new Date(booking.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const packageBadge = getPackageName(booking, 'dj');
  const progress = booking.vendors?.dj?.progress || 0;
  const status = booking.vendors?.dj?.status || 'Pending';
  const isPending = status === 'Pending';

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalStatus, setModalStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setModalStatus(newStatus);
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      setIsUpdating(true);
      const res = await djAPI.updateBookingStatus(booking._id, modalStatus);
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

  return (
    <div className="bg-white border border-[#E0D8C3] flex overflow-hidden shadow-sm relative">
      <div className="bg-[#4A463B] text-white w-32 flex flex-col justify-center items-center py-8 shrink-0">
        <span className="text-5xl font-bold font-serif mb-1 tracking-tight">{day}</span>
        <span className="text-xs font-bold tracking-widest text-gray-300">{month}</span>
      </div>

      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h2 className="text-4xl font-serif text-gray-800 tracking-tight leading-none">
            {getClientDisplayName(booking)}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            {isPending && (
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
            )}
            <div className="bg-[#F9DD76] px-3 py-1.5 border border-[#E0D8C3]">
              <p className="text-[9px] font-bold tracking-widest text-[#7C6A2E] leading-tight text-center">
                {packageBadge.split(' ').map((word: string, i: number) => (
                  <React.Fragment key={i}>{word}{i === 0 && <br />}</React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs font-bold tracking-widest text-gray-500 mb-6 uppercase">
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-[#A6955C]" />
            <span>{VENUE_NAME}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={14} className="text-[#A6955C]" />
            <span>{booking.guests} GUESTS</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">
                <span>SETUP PROGRESS</span>
                <span className="text-[#7C6A2E] pr-6">{progress}%</span>
              </div>
              <div className="w-11/12 bg-[#E0D8C3] h-1">
                <div className="bg-[#7C6A2E] h-1" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(true)}
              className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase hover:text-[#5E4F20] transition-colors"
            >
              <span>View Details</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modalStatus === 'Accepted' ? 'bg-[#7C6A2E]/10 text-[#7C6A2E]' : 'bg-red-50 text-red-500'}`}>
              {modalStatus === 'Accepted' ? <CheckCircle size={32} /> : <XCircle size={32} />}
            </div>
            <h3 className="text-2xl font-serif text-gray-800 mb-2">
              {modalStatus === 'Accepted' ? 'Accept Event Request?' : 'Decline Event Request?'}
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              You are about to {modalStatus === 'Accepted' ? 'accept' : 'decline'} the request for{' '}
              <strong>{getClientDisplayName(booking)}</strong>.
            </p>
            <div className="flex w-full gap-3">
              <button onClick={() => setShowModal(false)} disabled={isUpdating} className="flex-1 border border-[#E0D8C3] text-gray-500 py-3 text-xs font-bold tracking-widest uppercase">
                Cancel
              </button>
              <button onClick={confirmStatusChange} disabled={isUpdating} className={`flex-1 py-3 text-white text-xs font-bold tracking-widest uppercase ${modalStatus === 'Accepted' ? 'bg-[#7C6A2E]' : 'bg-red-500'}`}>
                {isUpdating ? 'Processing...' : `Confirm ${modalStatus}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <DjJobDetailModal 
          jobId={booking._id}
          onClose={() => setShowDetailModal(false)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default CurrentPriority;
