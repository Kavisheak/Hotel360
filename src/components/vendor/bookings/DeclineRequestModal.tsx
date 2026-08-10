"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DeclineRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting: boolean;
}

const DECLINE_REASONS = [
  { id: 'date_conflict', label: 'Date Conflict' },
  { id: 'out_of_budget', label: 'Out of Budget' },
  { id: 'out_of_area', label: 'Out of Area' },
  { id: 'no_response', label: 'No Response from Client' },
  { id: 'other', label: 'Other' },
];

const DeclineRequestModal: React.FC<DeclineRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    setError('');
    
    if (!reason) {
      setError('Please select a reason for declining.');
      return;
    }

    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-serif font-bold text-gray-900">Decline Request</h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mb-2">
            You are about to decline this booking request. This action cannot be undone.
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Select Reason for Declining *
              </label>
              <div className="space-y-2">
                {DECLINE_REASONS.map((r) => (
                  <label key={r.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="declineReason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="text-red-600 focus:ring-red-500 w-4 h-4"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">{r.label}</span>
                  </label>
                ))}
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
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-wider uppercase rounded shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Confirm Decline"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineRequestModal;
