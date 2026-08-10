"use client";

import React, { useState } from 'react';
import { X, Calendar, DollarSign } from 'lucide-react';

interface AdvanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (advanceAmount: number, advanceDeadline: string) => void;
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
  const [advanceAmount, setAdvanceAmount] = useState<number | ''>('');
  const [deadline, setDeadline] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError('');
    
    if (!advanceAmount || Number(advanceAmount) <= 0) {
      setError('Please enter a valid advance amount.');
      return;
    }
    if (Number(advanceAmount) > offeredPrice) {
      setError(`Advance cannot exceed the total offered price (LKR ${offeredPrice.toLocaleString()}).`);
      return;
    }
    if (!deadline) {
      setError('Please select a deadline for the advance payment.');
      return;
    }

    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Deadline cannot be in the past.');
      return;
    }

    onSubmit(Number(advanceAmount), deadline);
  };

  const remainingBalance = advanceAmount ? offeredPrice - Number(advanceAmount) : offeredPrice;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-serif font-bold text-gray-900">Request Advance Payment</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-xs text-gray-600 bg-[#FAF6EE] p-3 rounded-lg border border-[#E0D8C3] mb-2">
            You are about to accept this booking. You can optionally request an advance payment from the customer to secure your services.
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Total Offered Price
              </label>
              <div className="text-sm font-mono font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                LKR {offeredPrice.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Advance Amount (LKR) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={14} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A2E] focus:border-transparent transition-all"
                  placeholder="e.g. 50000"
                  min={1}
                  max={offeredPrice}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Payment Deadline *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={14} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#7C6A2E] focus:border-transparent transition-all"
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Remaining Balance (To be paid later)
              </label>
              <div className="text-sm font-mono font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                LKR {remainingBalance.toLocaleString()}
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#7C6A2E] hover:bg-[#685724] text-white text-xs font-bold tracking-wider uppercase rounded shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Confirm & Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvanceRequestModal;
