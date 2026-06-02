"use client";

import React, { useState } from 'react';
import { Settings, ShieldCheck, Mail, Phone, Lock, Save, BellRing } from 'lucide-react';

export default function CustomerSettingsPage() {
  const [partner1, setPartner1] = useState("Farhan Siddiqui");
  const [partner2, setPartner2] = useState("Zainab Malik");
  const [email, setEmail] = useState("farhanandzainab@gmail.com");
  const [phone, setPhone] = useState("+94 77 123 4567");

  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState(true);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setSuccessMsg("Profile details successfully updated!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1200);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    setIsSavingSecurity(true);
    setTimeout(() => {
      setIsSavingSecurity(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("Security password successfully changed!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#1A1512]">
      {/* Header */}
      <div className="pb-6 border-b border-[#E8DFC9]">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#C69C6D] block mb-1">
          ACCOUNT CONFIGURATION
        </span>
        <h2 className="text-3xl font-serif text-gray-900 leading-tight">
          Portal & Profile <span className="italic text-[#C69C6D]">Settings</span>
        </h2>
        <p className="text-xs text-gray-500 font-light mt-1">
          Update your contact details, couple names, security password, and customize email alert preferences.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 text-xs font-semibold rounded-sm flex items-center gap-2 max-w-2xl leading-none">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: General Settings */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Form */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-6">
            <h3 className="text-lg font-serif text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#C69C6D]" /> Couple Details
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-light">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">Partner 1 Name *</label>
                  <input
                    type="text"
                    required
                    value={partner1}
                    onChange={(e) => setPartner1(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans font-semibold rounded-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">Partner 2 Name *</label>
                  <input
                    type="text"
                    required
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans font-semibold rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans rounded-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-[#1A1512] text-white hover:bg-[#C69C6D] hover:text-black px-5 py-2.5 rounded-sm text-[9px] uppercase tracking-widest font-bold transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingProfile ? "Saving Details..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          </div>

          {/* Security / Password Form */}
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-6">
            <h3 className="text-lg font-serif text-gray-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C69C6D]" /> Security & Password
            </h3>

            <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs font-light">
              <div>
                <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans max-w-sm rounded-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans rounded-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase font-bold text-[8px] tracking-wider text-gray-400 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#FAF6EE] border border-[#E0D8C3] px-3 py-2 outline-none focus:border-[#C69C6D] font-sans rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingSecurity}
                  className="bg-[#1A1512] text-white hover:bg-[#C69C6D] hover:text-black px-5 py-2.5 rounded-sm text-[9px] uppercase tracking-widest font-bold transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingSecurity ? "Updating Password..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Notification Toggles */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E8DFC9] p-6 shadow-sm rounded-sm space-y-6">
            <h3 className="text-md font-serif font-bold text-gray-900 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-[#C69C6D]" /> Notifications
            </h3>

            <div className="space-y-4 text-xs font-light text-gray-500">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="email-alerts"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="accent-[#C69C6D] mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <label htmlFor="email-alerts" className="font-semibold text-gray-800 cursor-pointer">Email Customizations Alerts</label>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">Receive copy confirmation invoices & schedule modifications directly in your inbox.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sms-alerts"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="accent-[#C69C6D] mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <label htmlFor="sms-alerts" className="font-semibold text-gray-800 cursor-pointer">Concierge SMS Reminders</label>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">Receive text message reminders for urgent auspicious oil submissions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="payment-alerts"
                  checked={paymentReminders}
                  onChange={(e) => setPaymentReminders(e.target.checked)}
                  className="accent-[#C69C6D] mt-0.5 cursor-pointer shrink-0"
                />
                <div>
                  <label htmlFor="payment-alerts" className="font-semibold text-gray-800 cursor-pointer">Invoice Installment Notifications</label>
                  <p className="text-[10px] text-gray-400 font-light mt-0.5">Automated warning notices before bank transfer limits or slip vetting deadlines.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
