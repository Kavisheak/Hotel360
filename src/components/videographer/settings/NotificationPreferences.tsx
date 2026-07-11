"use client";

import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationPreferences = () => {
  const [prefs, setPrefs] = useState({
    newReservations: true,
    modifications: true,
    lowStock: false,
    vendorDelivery: true,
    trendReports: true,
    productUpdates: false,
  });

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      {/* Title */}
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Bell size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
          NOTIFICATION PREFERENCES
        </h3>
      </div>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Booking Alerts */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-4">
            BOOKING ALERTS
          </p>
          <div className="space-y-3.5">
            <label className="flex items-center space-x-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={prefs.newReservations}
                onChange={() => handleToggle('newReservations')}
                className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                New reservation requests
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={prefs.modifications}
                onChange={() => handleToggle('modifications')}
                className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                Modifications to current events
              </span>
            </label>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-4">
            INVENTORY ALERTS
          </p>
          <div className="space-y-3.5">
            <label className="flex items-center space-x-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={prefs.lowStock}
                onChange={() => handleToggle('lowStock')}
                className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                Low stock reminders
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={prefs.vendorDelivery}
                onChange={() => handleToggle('vendorDelivery')}
                className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                Vendor delivery confirmations
              </span>
            </label>
          </div>
        </div>

        {/* Platform Communication */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-4">
            PLATFORM COMMUNICATION
          </p>
          <div className="space-y-3.5">
            <label className="flex items-center space-x-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={prefs.trendReports}
                onChange={() => handleToggle('trendReports')}
                className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                Elite Network trend reports
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={prefs.productUpdates}
                onChange={() => handleToggle('productUpdates')}
                className="rounded border-[#E0D8C3] text-[#7C6A2E] focus:ring-[#7C6A2E] cursor-pointer"
              />
              <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                Product updates and newsletters
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
