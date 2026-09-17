"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { authAPI } from '@/lib/api';
import { useToastStore } from '@/store/toastStore';
import FeedbackModal from '../shared/FeedbackModal';

const Security = () => {
  const { addToast } = useToastStore();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    badgeText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      setFeedback({
        isOpen: true,
        title: "Required Fields Missing",
        message: "Both your current password and new password are required to complete this security update.",
        type: "warning"
      });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setFeedback({
        isOpen: true,
        title: "Password Strength",
        message: "For enhanced account security, your new password must be at least 6 characters long.",
        type: "warning"
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      if (res.ok) {
        setPasswords({ currentPassword: '', newPassword: '' });
        setFeedback({
          isOpen: true,
          title: "Password Updated Securely",
          message: "Your manager credentials have been encrypted and saved. Please use your new password for your next login.",
          type: "success",
          badgeText: "Security Encrypted"
        });
        addToast({ message: "Password updated successfully!", type: "success" });
      } else {
        setFeedback({
          isOpen: true,
          title: "Update Failed",
          message: res.data?.message || "Failed to update password. Please verify your current password.",
          type: "error"
        });
        addToast({ message: res.data?.message || "Failed to update password.", type: "error" });
      }
    } catch (e: any) {
      setFeedback({
        isOpen: true,
        title: "Server Error",
        message: e?.message || "A network error occurred while updating your credentials.",
        type: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-12">
      <SectionTitle title="Security" />
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                name="currentPassword" 
                value={passwords.currentPassword} 
                onChange={handleChange} 
                className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
              />
              <button 
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C6A2E] transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"} 
                name="newPassword" 
                value={passwords.newPassword} 
                onChange={handleChange} 
                className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" 
              />
              <button 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C6A2E] transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md"
        >
          {isSaving ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      {/* Luxury Feedback Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        onClose={() => setFeedback(prev => ({ ...prev, isOpen: false }))}
        title={feedback.title}
        message={feedback.message}
        type={feedback.type}
        badgeText={feedback.badgeText}
      />
    </div>
  );
};

export default Security;
