"use client";

import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { authAPI } from '@/lib/api';

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.ok) {
        setSuccessMessage("Password successfully changed!");
        setTimeout(() => setSuccessMessage(null), 4000);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(res.data?.message || "Failed to change password.");
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch (err) {
      setErrorMessage("Network error occurred.");
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!confirm("Are you sure you want to sign out of all other devices?")) return;
    try {
      setRevokeLoading(true);
      const res = await authAPI.revokeSessions();
      if (res.ok) {
        setSuccessMessage("All other sessions securely revoked!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(res.data?.message || "Failed to revoke sessions.");
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch (e) {
      setErrorMessage("Network error occurred.");
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setRevokeLoading(false);
    }
  };

  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm relative">
      <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
        <Shield size={16} className="text-[#B08D2C]" />
        <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">SECURITY SETTINGS</h3>
      </div>

      {errorMessage && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Current Password</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]" 
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2 bg-[#B08D2C] hover:bg-[#9B7A20] text-white text-[10px] font-bold tracking-widest transition-colors shadow-sm uppercase disabled:opacity-50"
        >
          {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-5">
        <div className="flex items-center justify-between border-b border-gray-50 pb-4">
          <div>
            <span className="text-xs font-semibold text-gray-700">Two-Factor Authentication</span>
            <p className="text-[8px] font-bold tracking-widest text-[#3F6897] uppercase mt-0.5">RECOMMENDED</p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactorEnabled((previous) => !previous)}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${twoFactorEnabled ? 'bg-[#7C6A2E]' : 'bg-gray-200'
              }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>

        <button 
          onClick={handleRevoke}
          disabled={revokeLoading}
          className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase disabled:opacity-50"
        >
          {revokeLoading ? 'REVOKING...' : 'Revoke All Sessions'}
        </button>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-gray-900 border border-[#B08D2C] text-white px-8 py-4 shadow-2xl flex items-center space-x-4">
            <div className="w-6 h-6 rounded-full bg-[#B08D2C] flex items-center justify-center shrink-0">
              <Check size={14} className="text-white" />
            </div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-gray-100">{successMessage}</p>
          </div>
        </div>
      )}
    </article>
  );
};

export default SecuritySettings;
