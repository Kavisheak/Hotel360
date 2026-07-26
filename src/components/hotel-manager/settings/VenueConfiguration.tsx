"use client";

import React, { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { Clock } from 'lucide-react';

const VenueConfiguration = () => {
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Venue configuration updated successfully!");
    }, 1000);
  };

  return (
    <div className="mb-12">
    <SectionTitle title="Venue Configuration" />
    <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Max Capacity</label>
          <div className="relative">
            <input type="text" defaultValue="1200" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">Guests</span>
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Base Pricing</label>
          <div className="relative">
            <input type="text" defaultValue="750,000" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">PKR</span>
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Deposit Required (%)</label>
          <input type="text" defaultValue="30" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
        </div>
      </div>

      {/* Business Policy Rules */}
      <div className="mb-8 border-t border-b border-[#E0D8C3] py-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-800">Business Policy Rules & Cancellation Tiers</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Booking Hold Duration</label>
            <div className="relative">
              <input type="text" defaultValue="48" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">Hours</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-1">Unpaid holds auto-expire after this duration.</p>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Vendor Commission Rate</label>
            <div className="relative">
              <input type="text" defaultValue="10" className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">% Fee</span>
            </div>
            <p className="text-[9px] text-gray-400 mt-1">Commission deducted from vendor payouts.</p>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Cancellation Refund Tiers</label>
            <select className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]">
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
                <input type="text" defaultValue="09:00 AM" className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">to</span>
              <div className="relative">
                <input type="text" defaultValue="04:00 PM" className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 w-24">Evening Shift</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input type="text" defaultValue="06:00 PM" className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">to</span>
              <div className="relative">
                <input type="text" defaultValue="01:00 AM" className="w-24 bg-white border border-[#E0D8C3] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
                <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleUpdate}
          disabled={isSaving}
          className="bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? "Updating..." : "Update Venue"}
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
