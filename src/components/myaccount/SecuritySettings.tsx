"use client";

import React, { useState, useEffect } from "react";
import { Lock, ShieldCheck, Smartphone, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";
import { accountAPI, authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function SecuritySettings() {
  const { user, fetchUser } = useAuthStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [twoFA, setTwoFA] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 7) strength += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };
  
  const strength = calculateStrength(newPassword);

  useEffect(() => {
    if (user && user.twoFactorEnabled !== undefined) {
      setTwoFA(user.twoFactorEnabled);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    
    const { ok, data } = await authAPI.changePassword({ currentPassword, newPassword });
    
    setIsLoading(false);
    
    if (ok) {
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
    } else {
      setErrorMsg(data.message || "Failed to update password");
    }
  };

  const toggleTwoFactor = async () => {
    const newState = !twoFA;
    setTwoFA(newState);
    
    const { ok } = await accountAPI.toggle2FA(newState);
    if (ok) {
      fetchUser();
    } else {
      // revert if failed
      setTwoFA(!newState);
      setErrorMsg("Failed to toggle 2FA");
    }
  };

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#C9A84C]/30 rounded-lg shadow-[0_4px_20px_rgba(201,168,76,0.15)] hover:shadow-[0_8px_30px_rgba(201,168,76,0.25)] hover:border-[#C9A84C]/60 transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#D4C9A8] dark:border-[#C9A84C]/20 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
          <Lock className="w-4 h-4 text-[#C9A84C]" />
        </div>
        <div>
          <h4 className="text-sm font-serif text-[#2C1E14] dark:text-white">Security Settings</h4>
          <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light">Manage your password and authentication preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        {/* Password Change */}
        <div>
          <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] mb-4 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            Change Password
          </h5>
          <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Current Password</label>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/50 p-3 pr-10 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-all input-glow"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-[34px] text-gray-500 hover:text-[#2C1E14] dark:text-gray-400 dark:hover:text-white transition-colors">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">New Password</label>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/50 p-3 pr-10 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-all input-glow"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-[34px] text-gray-500 hover:text-[#2C1E14] dark:text-gray-400 dark:hover:text-white transition-colors">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Confirm Password</label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/50 p-3 pr-10 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] focus:bg-[#FDFBF7] dark:focus:bg-[#1A1A1A] outline-none transition-all input-glow"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-[34px] text-gray-500 hover:text-[#2C1E14] dark:text-gray-400 dark:hover:text-white transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            {/* Password Strength Hint */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((level) => (
                <div 
                  key={level} 
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    strength >= level 
                      ? strength > 2 ? 'bg-emerald-400' : 'bg-yellow-400' 
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`} 
                />
              ))}
            </div>
            <p className="text-[9px] text-gray-600 dark:text-gray-400 font-light">Use 8+ characters with a mix of letters, numbers & symbols.</p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#D4C9A8] dark:border-[#C9A84C]/20" />

        {/* Two-Factor Authentication */}
        <div>
          <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] mb-4 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            Two-Factor Authentication
          </h5>

          <div
            className={`p-4 border rounded-sm transition-all duration-300 cursor-pointer ${
              twoFA ? "border-emerald-300 bg-emerald-50" : "border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#1A1A1A]/50 hover:border-[#C9A84C]/40 dark:hover:border-[#C9A84C]/60"
            }`}
            onClick={toggleTwoFactor}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${twoFA ? "bg-emerald-100" : "bg-[#F0E6D0]/50 dark:bg-[#1A1A1A]"}`}>
                  <ShieldCheck className={`w-5 h-5 ${twoFA ? "text-emerald-600" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2C1E14] dark:text-white">
                    {twoFA ? "2FA is enabled" : "Enable Two-Factor Authentication"}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-light mt-0.5">
                    {twoFA
                      ? "Your account is protected with authenticator verification."
                      : "Add an extra layer of security via an authenticator app."}
                  </p>
                </div>
              </div>
              {/* Toggle Switch */}
              <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${twoFA ? "bg-emerald-500" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${twoFA ? "translate-x-[22px]" : "translate-x-0.5"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div>
          <h5 className="text-[10px] uppercase font-bold tracking-widest text-[#C9A84C] mb-3">Active Sessions</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-[#D4C9A8] dark:border-[#C9A84C]/30 rounded-sm bg-[#F0E6D0]/20 dark:bg-[#1A1A1A]/40">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="text-xs font-semibold text-[#2C1E14] dark:text-white">Chrome on Windows</p>
                  <p className="text-[9px] text-gray-600 dark:text-gray-400 font-light">Colombo, Sri Lanka — Active now</p>
                </div>
              </div>
              <span className="text-[8px] uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">Current</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-[#D4C9A8] dark:border-[#C9A84C]/30 rounded-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div>
                  <p className="text-xs font-semibold text-[#2C1E14] dark:text-white">Safari on iPhone</p>
                  <p className="text-[9px] text-gray-600 dark:text-gray-400 font-light">Colombo, Sri Lanka — 2 days ago</p>
                </div>
              </div>
              <button className="text-[9px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors btn-interactive">
                Revoke
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#D4C9A8] dark:border-[#C9A84C]/20 flex items-center gap-4">
          <button
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="px-6 py-2.5 bg-[#C9A84C] text-[#2C1E14] dark:text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#B89238] dark:hover:bg-white transition-colors btn-interactive flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            Update Security
          </button>
          {errorMsg && <span className="text-[10px] text-red-500 font-bold uppercase">{errorMsg}</span>}
          {saved && (
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest animate-fadeIn">
              ✓ Security updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
