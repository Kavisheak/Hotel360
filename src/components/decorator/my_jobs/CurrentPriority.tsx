"use client";

import React, { useState } from 'react';
import { MapPin, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { decoratorAPI } from '@/lib/api';
import { getClientDisplayName, getPackageName, VENUE_NAME } from '@/lib/vendorUtils';

interface CurrentPriorityProps {
  booking: any;
  onRefresh?: () => void;
}

const CurrentPriority = ({ booking, onRefresh }: CurrentPriorityProps) => {
  const dateObj = new Date(booking.date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const packageBadge = getPackageName(booking, 'decorator');
  const progress = booking.vendors?.decorator?.progress || 0;
  const status = booking.vendors?.decorator?.status || 'Pending';
  const isPending = status === 'Pending';

  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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

  return (
    <div className="bg-white border border-[#E0D8C3] flex overflow-hidden shadow-sm relative">
      <div className="bg-[#4A463B] text-white w-32 flex flex-col justify-center items-center py-8 shrink-0">
        <span className="text-5xl font-bold font-serif mb-1 tracking-tight">{day}</span>
        <span className="text-xs font-bold tracking-widest text-gray-300">{month}</span>
      </div>
      <div className="p-8 flex-1">
        <div className="flex justify-between items-start mb-4 gap-4">
          <h2 className="text-4xl font-serif text-gray-800 tracking-tight leading-none">{getClientDisplayName(booking)}</h2>
          <div className="flex items-center gap-2 shrink-0">
            {isPending && (
              <>
                <button onClick={() => { setModalStatus('Accepted'); setShowModal(true); }} className="px-3 py-1 bg-[#7C6A2E] hover:bg-[#685724] text-white text-[9px] font-bold tracking-widest uppercase">Accept</button>
                <button onClick={() => { setModalStatus('Declined'); setShowModal(true); }} className="px-3 py-1 border border-red-300 text-red-500 hover:bg-red-50 text-[9px] font-bold tracking-widest uppercase">Decline</button>
              </>
            )}
            <div className="bg-[#F9DD76] px-3 py-1.5 border border-[#E0D8C3]">
              <p className="text-[9px] font-bold tracking-widest text-[#7C6A2E] leading-tight text-center">{packageBadge}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6 text-xs font-bold tracking-widest text-gray-500 mb-6 uppercase">
          <div className="flex items-center space-x-2"><MapPin size={14} className="text-[#A6955C]" /><span>{VENUE_NAME}</span></div>
          <div className="flex items-center space-x-2"><Users size={14} className="text-[#A6955C]" /><span>{booking.guests} GUESTS</span></div>
        </div>
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-2">
              <span>SETUP PROGRESS</span><span className="text-[#7C6A2E] pr-6">{progress}%</span>
            </div>
            <div className="w-11/12 bg-[#E0D8C3] h-1"><div className="bg-[#7C6A2E] h-1" style={{ width: `${progress}%` }} /></div>
          </div>
          <Link href={`/decorator/bookings/${booking._id}`} className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">
            <span>View Details</span><ArrowRight size={14} />
          </Link>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-2xl font-serif mb-4">{modalStatus === 'Accepted' ? 'Accept Job?' : 'Decline Job?'}</h3>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 border py-3 text-xs font-bold uppercase">Cancel</button>
              <button onClick={confirmStatusChange} disabled={isUpdating} className={`flex-1 py-3 text-white text-xs font-bold uppercase ${modalStatus === 'Accepted' ? 'bg-[#7C6A2E]' : 'bg-red-500'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPriority;
