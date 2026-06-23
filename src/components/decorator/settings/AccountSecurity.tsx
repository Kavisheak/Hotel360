"use client";

import React, { useState } from 'react';
import { Shield, X, Check } from 'lucide-react';
import { authAPI } from '@/lib/api';

const AccountSecurity = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.ok) {
        setShowPasswordModal(false);
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
    try {
      setLoading(true);
      const res = await authAPI.revokeSessions();
      if (res.ok) {
        setShowRevokeModal(false);
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
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Account Security Card */}
      <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm">
        {/* Title */}
        <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
          <Shield size={16} className="text-[#B08D2C]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
            ACCOUNT SECURITY
          </h3>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between pb-4">
            <span className="text-xs font-semibold text-gray-700">Password</span>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="text-[10px] font-bold tracking-widest text-[#7C6A2E] hover:text-[#9B7A20] uppercase underline underline-offset-2 transition-colors"
            >
              CHANGE
            </button>
          </div>
        </div>

        {/* Info & Revoke */}
        <div className="space-y-4">
          <p className="text-[8px] font-bold text-gray-400 tracking-[0.15em] uppercase">
            LAST LOGIN: TODAY AT 09:42 AM
          </p>
          <button 
            onClick={() => setShowRevokeModal(true)}
            className="w-full border border-[#B08D2C] hover:bg-[#FDF9F1] text-[#7C6A2E] py-2 text-xs font-bold tracking-widest transition-colors uppercase"
          >
            REVOKE ALL SESSIONS
          </button>
        </div>
      </div>

      {/* Timeless Elegance Visual Card */}
      <div className="bg-white border border-[#E0D8C3] p-4 shadow-sm relative overflow-hidden h-72 group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
          alt="Timeless Elegance"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Transparent Elegant Overlay */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-5">
          <h4 className="text-white text-lg font-serif font-bold italic tracking-wide leading-tight">
            "Timeless Elegance"
          </h4>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#E0D8C3] shadow-2xl w-full max-w-md p-8 relative">
            <button 
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Change Password</h3>
              <p className="text-xs text-gray-500">Update your credentials to maintain account security.</p>
            </div>
            
            {errorMessage && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">CURRENT PASSWORD</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">NEW PASSWORD</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">CONFIRM NEW PASSWORD</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
                  required
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={loading}
                  className="px-5 py-2.5 text-[10px] font-bold tracking-widest text-gray-500 hover:text-gray-800 uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#B08D2C] hover:bg-[#9B7A20] text-white px-6 py-2.5 font-semibold text-[10px] tracking-widest transition-colors shadow-sm uppercase disabled:opacity-50"
                >
                  {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#E0D8C3] shadow-2xl w-full max-w-sm p-8 relative">
            <button 
              onClick={() => setShowRevokeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="mb-6 text-center">
              <div className="w-12 h-12 bg-[#FDF9F1] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E0D8C3]">
                <Shield size={20} className="text-[#B08D2C]" />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Revoke Sessions</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to sign out of all other devices? This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={handleRevoke}
                disabled={loading}
                className="w-full bg-[#C75A5A] hover:bg-[#B34545] text-white px-6 py-3 font-semibold text-[10px] tracking-widest transition-colors shadow-sm uppercase disabled:opacity-50"
              >
                {loading ? 'REVOKING...' : 'YES, REVOKE ALL'}
              </button>
              <button 
                onClick={() => setShowRevokeModal(false)}
                disabled={loading}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-3 font-semibold text-[10px] tracking-widest transition-colors uppercase"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Success Toast */}
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
    </div>
  );
};

export default AccountSecurity;
