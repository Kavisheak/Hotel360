"use client";

import React, { useState, useEffect } from "react";
import { Settings, Globe, Clock, Palette, Save, Moon, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { accountAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function Preferences() {
  const { user, fetchUser } = useAuthStore();
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("asia_colombo");
  const [dateFormat, setDateFormat] = useState("dd_mm_yyyy");
  const [currency, setCurrency] = useState("lkr");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.preferences) {
      if (user.preferences.language) setLanguage(user.preferences.language);
      if (user.preferences.timezone) setTimezone(user.preferences.timezone);
      if (user.preferences.dateFormat) setDateFormat(user.preferences.dateFormat);
      if (user.preferences.currency) setCurrency(user.preferences.currency);
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    const prefs = { language, timezone, dateFormat, currency };
    const { ok } = await accountAPI.updatePreferences(prefs);
    setIsLoading(false);
    
    if (ok) {
      setSaved(true);
      fetchUser();
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="bg-[#FDFBF7] dark:bg-gradient-to-br dark:from-[#382B14] dark:via-[#1A1610] dark:to-[#0D0B08] border border-[#D4C9A8] dark:border-[#C9A84C]/40 rounded-sm shadow-md dark:shadow-[#C9A84C]/5 hover-glow transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/20 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
          <Settings className="w-4 h-4 text-[#C9A84C]" />
        </div>
        <div>
          <h4 className="text-sm font-serif text-[#2C1E14] dark:text-white">General Preferences</h4>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light">Customize your regional and display settings.</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Language */}
        <div className="flex items-center justify-between p-4 border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40 rounded-sm hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/60 transition-colors">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-[#A67C52] dark:text-[#C9A84C]" />
            <div>
              <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">Language</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5">Choose your preferred display language.</p>
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => { setLanguage(e.target.value); setSaved(false); }}
            className="border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/80 p-2.5 rounded-sm text-xs text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-colors input-glow min-w-[140px]"
          >
            <option value="en">English (EN)</option>
            <option value="si">සිංහල (SI)</option>
            <option value="ta">Tamil (TA)</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="flex items-center justify-between p-4 border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40 rounded-sm hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/60 transition-colors">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-[#A67C52] dark:text-[#C9A84C]" />
            <div>
              <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">Timezone</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5">Set your local timezone for event scheduling.</p>
            </div>
          </div>
          <select
            value={timezone}
            onChange={(e) => { setTimezone(e.target.value); setSaved(false); }}
            className="border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/80 p-2.5 rounded-sm text-xs text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-colors input-glow min-w-[140px]"
          >
            <option value="asia_colombo">Asia/Colombo (GMT+5:30)</option>
            <option value="utc">UTC (GMT+0)</option>
            <option value="asia_dubai">Asia/Dubai (GMT+4)</option>
            <option value="asia_singapore">Asia/Singapore (GMT+8)</option>
          </select>
        </div>

        {/* Date Format */}
        <div className="flex items-center justify-between p-4 border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40 rounded-sm hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/60 transition-colors">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 text-[#A67C52] dark:text-[#C9A84C]" />
            <div>
              <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">Date Format</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5">How dates appear across the application.</p>
            </div>
          </div>
          <select
            value={dateFormat}
            onChange={(e) => { setDateFormat(e.target.value); setSaved(false); }}
            className="border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/80 p-2.5 rounded-sm text-xs text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-colors input-glow min-w-[140px]"
          >
            <option value="dd_mm_yyyy">DD/MM/YYYY</option>
            <option value="mm_dd_yyyy">MM/DD/YYYY</option>
            <option value="yyyy_mm_dd">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Currency */}
        <div className="flex items-center justify-between p-4 border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40 rounded-sm hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/60 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#A67C52] dark:text-[#C9A84C]">₨</span>
            <div>
              <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">Currency</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5">Default currency for pricing and invoices.</p>
            </div>
          </div>
          <select
            value={currency}
            onChange={(e) => { setCurrency(e.target.value); setSaved(false); }}
            className="border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/80 p-2.5 rounded-sm text-xs text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-colors input-glow min-w-[140px]"
          >
            <option value="lkr">LKR (Sri Lankan Rupee)</option>
            <option value="usd">USD (US Dollar)</option>
            <option value="gbp">GBP (British Pound)</option>
            <option value="eur">EUR (Euro)</option>
          </select>
        </div>

        {/* Appearance / Theme Toggle */}
        <div className="flex items-center justify-between p-4 border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40 rounded-sm hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/60 transition-colors">
          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-[#A67C52] dark:text-[#C9A84C]" />
            <div>
              <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">Appearance</p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5">Switch between light and dark mode.</p>
            </div>
          </div>
          {mounted && (
            <select
              value={theme}
              onChange={(e) => { setTheme(e.target.value); }}
              className="border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/80 p-2.5 rounded-sm text-xs text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-colors input-glow min-w-[140px]"
            >
              <option value="system">System Default</option>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#D4C9A8] dark:border-[#C9A84C]/20 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#C9A84C] text-[#2C1E14] dark:text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#B89238] dark:hover:bg-white transition-colors btn-interactive flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
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
