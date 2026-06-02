"use client";

import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationSettings = () => {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    bookingNotifications: true,
    eventReminders: true,
    systemAlerts: false,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Bell size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">NOTIFICATION SETTINGS</h3>
      </div>

      <div className="space-y-4">
        {[
          ['emailNotifications', 'Email notifications'],
          ['bookingNotifications', 'Booking notifications'],
          ['eventReminders', 'Event reminders'],
          ['systemAlerts', 'System alerts'],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center justify-between gap-4 cursor-pointer select-none border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
            <span className="text-xs font-semibold text-gray-700">{label}</span>
            <button
              type="button"
              onClick={() => toggle(key as keyof typeof prefs)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                prefs[key as keyof typeof prefs] ? 'bg-[#7C6A2E]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${
                  prefs[key as keyof typeof prefs] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        ))}
      </div>
    </article>
  );
};

export default NotificationSettings;
