"use client";

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface HallRejectReasonModalProps {
  isOpen: boolean;
  clientName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (reason: string, note?: string) => void;
}

const REASON_OPTIONS = [
  { value: "date_unavailable", label: "Date Unavailable / Prior Commitment" },
  { value: "maintenance", label: "Venue Undergoing Maintenance / Repairs" },
  { value: "duplicate_request", label: "Duplicate Booking Request" },
  { value: "other", label: "Other Operational Reason" },
];

const HallRejectReasonModal: React.FC<HallRejectReasonModalProps> = ({
  isOpen,
  clientName,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState("date_unavailable");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl rounded-xl max-w-md w-full p-6 text-left flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-[#E0D8C3] mb-4">
          <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            Reject Hall for {clientName}?
          </h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Please select a reason for rejecting this booking. Rejecting will immediately issue a <strong className="text-red-600">100% full refund</strong> of all held advance payments to the customer and silently cancel all vendor line items without affecting vendor reliability metrics.
        </p>

        <div className="space-y-2 mb-4">
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
                name="rejectReason"
                value={opt.value}
                checked={selectedReason === opt.value}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="accent-red-600"
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
            Optional Manager Note for Audit
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any internal details or instructions..."
            className="w-full border border-[#E0D8C3] px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-red-400 bg-white rounded resize-none h-16"
          />
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
            onClick={() => onConfirm(selectedReason, note)}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? "Processing Refund..." : "Reject & 100% Refund"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallRejectReasonModal;
