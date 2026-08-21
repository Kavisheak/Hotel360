"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function ForcePasswordChangeModal() {
  const { user, fetchUser } = useAuthStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
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
    
    if (ok) {
      await fetchUser(true); // Re-fetch user to clear requiresPasswordChange
    } else {
      setErrorMsg(data.message || "Failed to update password");
      setIsLoading(false);
    }
  };

  // Only render if requiresPasswordChange is true
  if (!user || !user.requiresPasswordChange) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-lg rounded-lg shadow-2xl border border-[#C9A84C]/30 overflow-hidden animate-fadeIn">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#D4C9A8] dark:border-[#C9A84C]/20 bg-[#F0E6D0]/20 dark:bg-[#111111]/40">
          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <div>
            <h4 className="text-lg font-serif text-[#2C1E14] dark:text-white">Security Requirement</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-light mt-1">
              Please change your initial password to secure your account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Current Password</label>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter the password provided by manager"
                className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#111111]/50 p-3 pr-10 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] outline-none transition-all"
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
                  className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#111111]/50 p-3 pr-10 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] outline-none transition-all"
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
                  className="w-full border border-[#D4C9A8] dark:border-[#C9A84C]/30 bg-white dark:bg-[#111111]/50 p-3 pr-10 rounded-sm text-sm text-[#2C1E14] dark:text-white focus:border-[#C9A84C] outline-none transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-[34px] text-gray-500 hover:text-[#2C1E14] dark:text-gray-400 dark:hover:text-white transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Password Strength Hint */}
            <div className="flex gap-1.5 pt-2">
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

          <div className="pt-4 border-t border-[#D4C9A8] dark:border-[#C9A84C]/20 flex items-center justify-between">
            {errorMsg ? (
              <span className="text-[10px] text-red-500 font-bold uppercase">{errorMsg}</span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
              className="px-6 py-2.5 bg-[#C9A84C] text-[#2C1E14] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#B89238] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
