"use client";

import React, { useEffect, useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';

const PersonalProfile = () => {
  const { user, fetchUser, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    language: 'English (UK)'
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        language: user.preferences?.language || 'English (UK)'
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await authAPI.updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      preferences: { ...user?.preferences, language: formData.language }
    });
    
    setIsSaving(false);
    if (res.ok) {
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        preferences: { ...user?.preferences, language: formData.language }
      });
      alert('Profile updated successfully!');
    } else {
      alert(res.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="mb-12">
      <SectionTitle title="Personal Profile" />
      <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
          </div>
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
          </div>
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} disabled className="w-full bg-gray-100 border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed focus:outline-none" />
          </div>
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Language Preference</label>
            <select name="language" value={formData.language} onChange={handleChange} className="w-full md:w-1/2 bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C] appearance-none">
              <option>English (UK)</option>
              <option>English (US)</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#7C6A2E] hover:bg-[#635525] text-white text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>
    </div>
  );
};

export default PersonalProfile;
