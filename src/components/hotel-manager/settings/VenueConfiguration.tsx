"use client";

import React, { useState, useEffect } from 'react';
import { SectionTitle } from './SectionTitle';
import { Clock, ShieldAlert } from 'lucide-react';
import { hotelManagerAPI } from '@/lib/api';
import { useToastStore } from '@/store/toastStore';
import { useAuthStore } from '@/store/authStore';

const VenueConfiguration = () => {
  const { user } = useAuthStore();
  const isStandby = user?.role === 'manager' && !user?.isLeadManager;
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToastStore();
  const [settings, setSettings] = useState({
    maxCapacity: 1200,
    depositRequired: 30,
    bookingHoldDuration: 48,
    cancellationTiers: "tiered",
    morningShift: { start: "09:00 AM", end: "04:00 PM" },
    eveningShift: { start: "06:00 PM", end: "01:00 AM" },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await hotelManagerAPI.getVenueSettings();
      if (res.ok && res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch venue settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (isStandby) {
      addToast({ 
        message: "Action restricted: Only the designated Lead Manager can update venue configurations. You are currently in View-Only standby mode.", 
        type: "error" 
      });
      return;
    }
    setIsSaving(true);
    try {
      const res = await hotelManagerAPI.updateVenueSettings(settings);
      if (res.ok) {
        addToast({ message: "Venue configuration updated successfully!", type: "success" });
      } else {
        addToast({ message: res.data?.message || "Failed to update venue configuration.", type: "error" });
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      addToast({ message: error?.message || "Server error. Please try again later.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-sm text-gray-500">Loading settings...</div>;

  return (
    <div className="mb-12">
    <SectionTitle title="Venue Configuration" />
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Max Capacity</label>
          <div className="relative">
            <input 
              type="number" 
              value={settings.maxCapacity} 
              onChange={(e) => setSettings({...settings, maxCapacity: Number(e.target.value)})}
              className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">Guests</span>
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Deposit Required (%)</label>
          <input 
            type="number" 
            value={settings.depositRequired} 
            onChange={(e) => setSettings({...settings, depositRequired: Number(e.target.value)})}
            className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
          />
        </div>
      </div>

      {/* Business Policy Rules */}
      <div className="mb-8 border-t border-b border-[#E0D8C3] py-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-800">Business Policy Rules & Cancellation Tiers</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Booking Hold Duration</label>
            <div className="relative">
              <input 
                type="number" 
                value={settings.bookingHoldDuration} 
                onChange={(e) => setSettings({...settings, bookingHoldDuration: Number(e.target.value)})}
                className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">Hours</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-1">Unpaid holds auto-expire after this duration.</p>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Cancellation Refund Tiers</label>
            <select 
              value={settings.cancellationTiers}
              onChange={(e) => setSettings({...settings, cancellationTiers: e.target.value})}
              className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]"
            >
              <option value="tiered">Tiered (Over 30d: 100%, 14-30d: 50%, Under 14d: 0%)</option>
              <option value="strict">Strict (Over 30d: 50%, Under 30d: 0%)</option>
              <option value="flexible">Flexible (Over 7d: 100%, Under 7d: 50%)</option>
            </select>
            <p className="text-[9px] text-gray-400 mt-1">Refund policy applied upon customer cancellation.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-4">Operating Hours</h4>
        <div className="bg-[#FDF9F1] border border-[#E0D8C3] p-4 flex flex-col xl:flex-row items-start xl:items-center gap-4 xl:gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 w-24">Morning Shift</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  value={settings.morningShift.start}
                  onChange={(e) => setSettings({ ...settings, morningShift: { ...settings.morningShift, start: e.target.value } })}
                  className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
                />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">to</span>
              <div className="relative">
                <input 
                  type="text" 
                  value={settings.morningShift.end}
                  onChange={(e) => setSettings({ ...settings, morningShift: { ...settings.morningShift, end: e.target.value } })}
                  className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
                />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 w-24">Evening Shift</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  value={settings.eveningShift.start}
                  onChange={(e) => setSettings({ ...settings, eveningShift: { ...settings.eveningShift, start: e.target.value } })}
                  className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
                />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">to</span>
              <div className="relative">
                <input 
                  type="text" 
                  value={settings.eveningShift.end}
                  onChange={(e) => setSettings({ ...settings, eveningShift: { ...settings.eveningShift, end: e.target.value } })}
                  className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
                />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isStandby && (
        <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-sm mb-4">
          <ShieldAlert size={16} className="shrink-0 text-[#B08D2C]" />
          <span>Venue configuration modifications are reserved for the designated <strong>Lead Manager</strong>. Your account is currently in <strong>View-Only standby mode</strong>.</span>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleUpdate}
          disabled={isSaving || isStandby}
          className={`text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm transition-colors ${
            isStandby 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' 
              : 'bg-[#7C6A2E] hover:bg-[#635525] text-white disabled:opacity-50'
          }`}
          title={isStandby ? "Venue configuration is restricted to the active Lead Manager" : undefined}
        >
          {isSaving ? "Updating..." : isStandby ? "Update (Lead Only)" : "Update Venue"}
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-600 border border-[#E0D8C3] text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm transition-colors">
          Cancel
        </button>
      </div>
    </div>
  </div>
  );
};

export default VenueConfiguration;
