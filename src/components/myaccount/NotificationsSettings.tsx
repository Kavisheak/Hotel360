"use client";

import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone, Save } from "lucide-react";
import { NOTIFICATION_PREFS, type NotificationPref } from "./types";

export default function NotificationsSettings() {
  const [prefs, setPrefs] = useState<NotificationPref[]>(NOTIFICATION_PREFS);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string, channel: "email" | "sms" | "push") => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [channel]: !p[channel] } : p))
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-gradient-to-br dark:from-[#382B14] dark:via-[#1A1610] dark:to-[#0D0B08] border border-[#D4C9A8] dark:border-[#C9A84C]/40 rounded-sm shadow-md dark:shadow-[#C9A84C]/5 hover-glow transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/20 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
          <Bell className="w-4 h-4 text-[#C9A84C]" />
        </div>
        <div>
          <h4 className="text-sm font-serif text-[#2C1E14] dark:text-white">Notification Preferences</h4>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light">Choose how and when you receive alerts.</p>
        </div>
      </div>

      <div className="p-6">
        {/* Channel Legend */}
        <div className="flex items-center gap-6 mb-5 pb-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/20">
          <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 w-full">Notification Type</span>
          <div className="flex items-center gap-6 flex-shrink-0">
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 w-14 justify-center">
              <Mail className="w-3 h-3" /> Email
            </span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 w-14 justify-center">
              <MessageSquare className="w-3 h-3" /> SMS
            </span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 w-14 justify-center">
              <Smartphone className="w-3 h-3" /> Push
            </span>
          </div>
        </div>

        {/* Notification Rows */}
        <div className="space-y-1">
          {prefs.map((pref) => (
            <div
              key={pref.id}
              className="flex items-center gap-6 p-3 -mx-3 rounded-sm hover:bg-[#F0E6D0]/50 dark:hover:bg-[#C9A84C]/5 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">{pref.title}</p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5 truncate">{pref.description}</p>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                {(["email", "sms", "push"] as const).map((ch) => (
                  <div key={ch} className="w-14 flex justify-center">
                    <button
                      onClick={() => toggle(pref.id, ch)}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${
                        pref[ch] ? "bg-[#C9A84C]" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                          pref[ch] ? "translate-x-[18px]" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-5 mt-4 border-t border-[#D4C9A8] dark:border-[#C9A84C]/20 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#C9A84C] text-[#2C1E14] dark:text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#B89238] dark:hover:bg-white transition-colors btn-interactive flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
          {saved && (
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest animate-fadeIn">
              ✓ Preferences saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
