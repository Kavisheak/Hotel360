"use client";

import React, { useState } from 'react';
import { X, Mail, Bell, Calendar, Clock, ShieldAlert, Loader2, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { superAdminAPI } from '@/lib/api';

interface MaintenanceBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (notice: any) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const DURATION_PRESETS = [
  { label: '30 Mins', minutes: 30 },
  { label: '45 Mins', minutes: 45 },
  { label: '1 Hour', minutes: 60 },
  { label: '1.5 Hours', minutes: 90 },
  { label: '2 Hours', minutes: 120 },
  { label: '3 Hours', minutes: 180 },
  { label: 'Custom', minutes: -1 },
];

export default function MaintenanceBroadcastModal({
  isOpen,
  onClose,
  onSuccess,
  showToast,
}: MaintenanceBroadcastModalProps) {
  // Helper to format Date to YYYY-MM-DD
  const formatDateToInput = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to format Date to HH:mm
  const formatTimeToInput = (d: Date) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Default date: today
  // Default time: 1 hour in the future rounded up to nearest 15 mins
  const now = new Date();
  const future = new Date(now.getTime() + 60 * 60 * 1000);
  const remainder = future.getMinutes() % 15;
  if (remainder !== 0) {
    future.setMinutes(future.getMinutes() + (15 - remainder));
  }

  const [selectedDate, setSelectedDate] = useState<string>(formatDateToInput(future));
  const [selectedTime, setSelectedTime] = useState<string>(formatTimeToInput(future));
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [customHours, setCustomHours] = useState<string>('2');
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);

  const [message, setMessage] = useState<string>(
    'Routine platform infrastructure upgrade and database optimization.'
  );

  const [recipients, setRecipients] = useState({
    managers: true,
    vendors: true,
    customers: true,
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const todayStr = formatDateToInput(new Date());
  const activeDurationMinutes = isCustomDuration
    ? Math.max(15, Math.round((parseFloat(customHours) || 1) * 60))
    : durationMinutes;

  // Calculate target Start and End Date objects
  let targetStartDate: Date | null = null;
  let targetEndDate: Date | null = null;
  let formattedStartDateString = '';
  let formattedEndDateString = '';
  let timeFromNowDisplay = '';
  let isTargetValidFuture = false;

  if (selectedDate && selectedTime) {
    targetStartDate = new Date(`${selectedDate}T${selectedTime}`);
    if (!isNaN(targetStartDate.getTime())) {
      targetEndDate = new Date(targetStartDate.getTime() + activeDurationMinutes * 60 * 1000);

      formattedStartDateString = targetStartDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      formattedEndDateString = targetEndDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const diff = targetStartDate.getTime() - Date.now();
      if (diff > 0) {
        isTargetValidFuture = true;
        const totalMinutes = Math.floor(diff / (1000 * 60));
        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const mins = totalMinutes % 60;

        const parts: string[] = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        parts.push(`${mins}m`);

        timeFromNowDisplay = `Activates in ${parts.join(' ')}`;
      } else {
        timeFromNowDisplay = 'Selected start time has already passed';
      }
    }
  }

  // Format estimated duration label
  const durationLabel =
    activeDurationMinutes >= 60
      ? `${Math.floor(activeDurationMinutes / 60)} hour${Math.floor(activeDurationMinutes / 60) > 1 ? 's' : ''}${
          activeDurationMinutes % 60 > 0 ? ` ${activeDurationMinutes % 60} mins` : ''
        }`
      : `${activeDurationMinutes} minutes`;

  const handleDispatch = async () => {
    if (!selectedDate || !selectedTime) {
      showToast('Please select both a calendar date and a time.', 'error');
      return;
    }

    if (!targetStartDate || isNaN(targetStartDate.getTime()) || !isTargetValidFuture) {
      showToast('Please select a future date and time.', 'error');
      return;
    }

    if (activeDurationMinutes < 5) {
      showToast('Maintenance duration must be at least 5 minutes.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await superAdminAPI.broadcastMaintenanceNotice({
        scheduledAt: targetStartDate.toISOString(),
        durationMinutes: activeDurationMinutes,
        estimatedDuration: durationLabel,
        customMessage: message,
        recipients,
      });

      if (res.ok && res.data?.success) {
        showToast(
          res.data.message || 'Maintenance scheduled! Gmail advance warning emails dispatched.',
          'success'
        );
        onSuccess(res.data.notice);
        onClose();
      } else {
        showToast(res.data?.message || 'Failed to dispatch maintenance notice.', 'error');
      }
    } catch (err: any) {
      showToast('Error communicating with broadcast service.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#E0D8C3] max-w-xl w-full rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-white border-b border-[#E0D8C3] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E0D8C3] flex items-center justify-center text-[#7C6A2E]">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-[0.2em] text-[#A6955C] uppercase">
                Platform Security & Automation
              </p>
              <h2 className="text-xl font-serif font-bold text-[#3D3000]">
                Schedule Maintenance & Auto-Duration
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-sm hover:bg-[#FAF6EE] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
          <div className="bg-white border border-[#E0D8C3] p-4 rounded-sm flex items-start gap-3">
            <Info size={16} className="text-[#7C6A2E] shrink-0 mt-0.5" />
            <p className="text-gray-600 text-[11px] leading-relaxed">
              When the start time arrives, <strong>Maintenance Mode will automatically turn ON</strong>. Once your selected duration ends, it will <strong>automatically turn OFF</strong> and restore platform access. Warning emails are dispatched via <strong>Gmail</strong> immediately.
            </p>
          </div>

          {/* Calendar Date & Time Selectors */}
          <div className="bg-white border border-[#E0D8C3] p-5 rounded-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Calendar Date Picker */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-1.5 flex items-center gap-1.5">
                  <Calendar size={13} /> Select Calendar Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-[#E0D8C3] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-gray-900 rounded-sm focus:outline-none focus:border-[#7C6A2E] focus:bg-white transition-colors cursor-pointer"
                />
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-1.5 flex items-center gap-1.5">
                  <Clock size={13} /> Select Start Time
                </label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border border-[#E0D8C3] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-semibold text-gray-900 rounded-sm focus:outline-none focus:border-[#7C6A2E] focus:bg-white transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Maintenance Duration Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase">
                  Maintenance Duration (Auto Turn-Off)
                </label>
                <span className="text-[10px] font-bold text-[#7C6A2E]">
                  {durationLabel}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {DURATION_PRESETS.map((preset) => {
                  const isSelected =
                    preset.minutes === -1 ? isCustomDuration : !isCustomDuration && durationMinutes === preset.minutes;

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        if (preset.minutes === -1) {
                          setIsCustomDuration(true);
                        } else {
                          setIsCustomDuration(false);
                          setDurationMinutes(preset.minutes);
                        }
                      }}
                      className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-sm border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#7C6A2E] text-white border-[#7C6A2E] shadow-xs'
                          : 'bg-[#FAF8F5] hover:bg-[#FAF6EE] text-gray-700 border-[#E0D8C3]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {isCustomDuration && (
                <div className="mt-2.5 flex items-center gap-2">
                  <input
                    type="number"
                    min="0.5"
                    max="72"
                    step="0.5"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-28 border border-[#E0D8C3] bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-gray-900 rounded-sm focus:outline-none focus:border-[#7C6A2E]"
                  />
                  <span className="text-xs text-gray-700 font-medium">hours</span>
                  <span className="text-[10px] text-gray-400 italic">
                    ({Math.round((parseFloat(customHours) || 0) * 60)} minutes total)
                  </span>
                </div>
              )}
            </div>

            {/* Live Dual-Phase Activation Preview Banner */}
            {formattedStartDateString && (
              <div
                className={`p-3.5 rounded-sm border text-xs space-y-2 ${
                  isTargetValidFuture
                    ? 'bg-[#FAF6EE] border-[#C9A84C]'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#7C6A2E]">
                    Automatic Schedule Timeline:
                  </span>
                  <span className="font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white border border-[#C9A84C] text-[#7C6A2E]">
                    {timeFromNowDisplay}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#E0D8C3]/60">
                  <div className="bg-white/80 p-2 rounded-sm border border-[#E0D8C3]">
                    <span className="block text-[9px] font-bold text-red-700 uppercase tracking-wider mb-0.5">
                      1. Auto-Lockout Starts:
                    </span>
                    <span className="font-semibold text-gray-900">{formattedStartDateString}</span>
                  </div>

                  <div className="bg-white/80 p-2 rounded-sm border border-[#E0D8C3]">
                    <span className="block text-[9px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                      2. Auto-Restores Access:
                    </span>
                    <span className="font-semibold text-gray-900">{formattedEndDateString}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recipients checkboxes */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-2">
              Audience To Receive Gmail Notice
            </label>
            <div className="space-y-2.5 bg-white border border-[#E0D8C3] p-4 rounded-sm">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recipients.managers}
                  onChange={(e) => setRecipients({ ...recipients, managers: e.target.checked })}
                  className="accent-[#7C6A2E] rounded-sm w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-gray-800">All Registered Hotel Managers</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recipients.vendors}
                  onChange={(e) => setRecipients({ ...recipients, vendors: e.target.checked })}
                  className="accent-[#7C6A2E] rounded-sm w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-gray-800">
                  Service Providers & Artisans (Decorators, DJs, Videographers)
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recipients.customers}
                  onChange={(e) => setRecipients({ ...recipients, customers: e.target.checked })}
                  className="accent-[#7C6A2E] rounded-sm w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-gray-800">
                  Customers with Active or In-Progress Bookings
                </span>
              </label>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-[10px] font-bold tracking-widest text-[#7C6A2E] uppercase mb-1.5">
              Reason / Technical Scope
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide a brief explanation..."
              className="w-full border border-[#E0D8C3] bg-white p-3 text-xs text-gray-800 rounded-sm focus:outline-none focus:border-[#7C6A2E]"
            />
          </div>

          {/* Live Preview Box */}
          <div className="bg-[#FAF6EE] border border-[#E0D8C3] p-4 rounded-sm flex items-start gap-3">
            <Mail size={16} className="text-[#7C6A2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#7C6A2E] text-[11px] mb-0.5">
                Branded Gmail Broadcast Details:
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Official email with scheduled date, start time, expected duration (<span className="font-semibold text-gray-800">{durationLabel}</span>), and completion time will be dispatched immediately via Gmail (<span className="font-mono text-gray-800 font-semibold">easccweddinghall@gmail.com</span>).
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-[#E0D8C3] px-6 py-4 flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 border border-[#E0D8C3] hover:bg-[#FAF6EE] text-gray-700 text-[10px] font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDispatch}
            disabled={loading || !isTargetValidFuture}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7C6A2E] hover:bg-[#635524] text-white text-[10px] font-bold tracking-widest uppercase transition-colors shadow-sm rounded-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Dispatching Gmail Notice...
              </>
            ) : (
              <>
                <Bell size={14} />
                Schedule Maintenance & Send Gmail
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
