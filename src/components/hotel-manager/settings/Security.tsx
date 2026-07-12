"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { authAPI } from '@/lib/api';

const Security = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      alert("Both password fields are required.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    setIsSaving(true);
    const res = await authAPI.changePassword({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword
    });
    
    setIsSaving(false);
    if (res.ok) {
      alert('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '' });
    } else {
      alert(res.data?.message || 'Failed to update password.');
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C6A2E] transition-colors"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C6A2E] transition-colors"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
};

export default Security;
