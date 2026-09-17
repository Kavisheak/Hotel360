"use client";

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, X } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface MaintenanceNotice {
  isActive: boolean;
  scheduledAt: string | null;
  estimatedDuration?: string;
  message?: string;
}

export default function MaintenanceBanner() {
  const [notice, setNotice] = useState<MaintenanceNotice | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/public/system-status?t=${Date.now()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.maintenanceNotice?.isActive && data.maintenanceNotice?.scheduledAt) {
          setNotice(data.maintenanceNotice);
        } else {
          setNotice(null);
        }
      }
    } catch (e) {
      // Non-fatal
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  // Countdown timer tick
  useEffect(() => {
    if (!notice?.scheduledAt || !notice.isActive) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const diff = new Date(notice.scheduledAt!).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(0);
        // Refresh status immediately to trigger full lockout
        fetchStatus();
      } else {
        setTimeLeft(Math.floor(diff / 1000));
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [notice]);

  if (!notice || !notice.isActive || timeLeft === null || isDismissed) {
    return null;
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    hours > 0
      ? `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <aside
      aria-label="Maintenance Announcement"
      className="bg-gradient-to-r from-[#7C6A2E] via-[#947E35] to-[#7C6A2E] text-white px-4 py-2.5 shadow-md sticky top-0 z-[999] border-b border-[#F9DD76]/30 animate-in slide-in-from-top duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[#F9DD76] shrink-0">
            <AlertTriangle size={13} strokeWidth={2.5} />
          </span>
          <span className="font-bold uppercase tracking-wider text-[#F9DD76]">
            Scheduled Maintenance Notice:
          </span>
          <span className="font-light text-white/95">
            System maintenance will commence in
          </span>
          <span className="inline-flex items-center gap-1 font-mono font-bold bg-black/30 border border-white/20 px-2.5 py-0.5 rounded text-white text-xs tracking-wider shadow-inner">
            <Clock size={12} className="text-[#F9DD76]" />
            {formattedTime}
          </span>
          <span className="hidden md:inline text-white/80 font-light italic">
            — Please save active bookings & finalize changes.
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-white/10 rounded text-white/80 hover:text-white transition-colors shrink-0"
          title="Dismiss Banner"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
}
