"use client";

import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface AdvanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (advanceAmount?: number, advanceDeadline?: string) => void;
  isSubmitting: boolean;
  offeredPrice: number;
}

const AdvanceRequestModal: React.FC<AdvanceRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  offeredPrice
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    // Pass undefined/0 to indicate no advance is being requested
    onSubmit(0, new Date().toISOString());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl p-8 max-w-md w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
         <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-green-50 text-green-600`}>
            <CheckCircle size={32} />
         </div>
         <h3 className="text-2xl font-serif text-gray-800 tracking-tight mb-2">
            Accept Event Request?
         </h3>
         <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            You are about to accept this job. This will notify the customer and hotel manager.
         </p>

         <div className="w-full mb-6 text-left">
           <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
             Total Offered Price
           </label>
           <div className="text-sm font-mono font-bold text-gray-900 bg-white px-3 py-2 rounded border border-[#E0D8C3]">
             LKR {offeredPrice.toLocaleString()}
           </div>
         </div>

         <div className="flex w-full gap-3">
           <button 
             onClick={onClose}
             disabled={isSubmitting}
             className="flex-1 border border-[#E0D8C3] text-gray-500 py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleSubmit}
             disabled={isSubmitting}
             className={`flex-1 py-3 bg-[#7C6A2E] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#685724] transition-colors flex justify-center items-center disabled:opacity-50`}
           >
             {isSubmitting ? "Processing..." : "Confirm & Accept"}
           </button>
         </div>
      </div>
    </div>
  );
};

export default AdvanceRequestModal;
