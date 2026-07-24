"use client";

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface DeclineReasonModalProps {
  isOpen: boolean;
  clientName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const REASON_OPTIONS = [
  { value: "date_conflict", label: "Date Conflict / Fully Booked" },
  { value: "out_of_budget", label: "Requested Budget Mismatch" },
  { value: "out_of_area", label: "Outside Primary Service Area" },
  { value: "other", label: "Other Operational Reason" },
];

const DeclineReasonModal: React.FC<DeclineReasonModalProps> = ({
  isOpen,
  clientName,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState("date_conflict");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl rounded-xl max-w-md w-full p-6 text-left flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-[#E0D8C3] mb-4">
          <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            Decline Request from {clientName}?
          </h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Please select a reason for declining. Declining will immediately convert the held 30% advance into an active 48-hour booking credit for the customer to pick a replacement vendor.
        </p>

        <div className="space-y-2 mb-6">
          {REASON_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                selectedReason === opt.value
                  ? "border-red-500 bg-red-50/50 font-semibold text-gray-900"
                  : "border-[#E0D8C3] bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="declineReason"
                value={opt.value}
                checked={selectedReason === opt.value}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="accent-red-600"
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-3 border-t border-[#E0D8C3]">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 border border-[#E0D8C3] text-gray-600 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedReason)}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Confirm Decline"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineReasonModal;
