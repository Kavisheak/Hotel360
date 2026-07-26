"use client";

import React, { useState } from 'react';
import { X, Calendar, AlertTriangle, Lock } from 'lucide-react';

interface BlockDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onBlockSubmit: (body: { startDate: string; endDate: string; reason: string }) => Promise<{ ok: boolean; status?: number; data?: any }>;
}

const REASON_OPTIONS = [
  { value: "personal", label: "Personal Time / Day Off" },
  { value: "vacation", label: "Vacation / Out of Town" },
  { value: "maintenance", label: "Equipment / Studio Maintenance" },
  { value: "other", label: "Other Private Block" },
];

const BlockDateModal: React.FC<BlockDateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onBlockSubmit,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [reason, setReason] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg("End date cannot be before start date.");
      return;
    }

    setIsSubmitting(true);
    const res = await onBlockSubmit({ startDate, endDate, reason });
    setIsSubmitting(false);

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      if (res.status === 409 || res.data?.code === "OVERLAP_BOOKING") {
        setErrorMsg("You have a confirmed job on this date.");
      } else {
        setErrorMsg(res.data?.message || "Failed to create availability block.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="bg-[#FDF9F1] border border-[#E0D8C3] shadow-2xl rounded-xl max-w-md w-full p-6 text-left flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-[#E0D8C3] mb-4">
          <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
            <Lock size={18} className="text-[#7C6A2E]" />
            Block Calendar Dates
          </h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Select a date range to mark your studio as unavailable. Dates with confirmed bookings cannot be blocked.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                min={todayStr}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full border border-[#E0D8C3] bg-white p-2.5 rounded text-xs text-gray-800 focus:border-[#7C6A2E] outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full border border-[#E0D8C3] bg-white p-2.5 rounded text-xs text-gray-800 focus:border-[#7C6A2E] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-[#E0D8C3] bg-white p-2.5 rounded text-xs text-gray-800 focus:border-[#7C6A2E] outline-none"
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#E0D8C3] mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 border border-[#E0D8C3] text-gray-600 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-[#7C6A2E] hover:bg-[#685724] text-white font-bold text-xs uppercase tracking-wider rounded shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Confirm Block"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockDateModal;
