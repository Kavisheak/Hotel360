"use client";

import React, { useState, useEffect } from 'react';
import SettingsHeader from './SettingsHeader';
import PersonalProfile from './PersonalProfile';
import AccountSecurity from './AccountSecurity';
import NotificationPreferences from './NotificationPreferences';
import Footer from '../my_jobs/Footer';
import { authAPI, decoratorAPI } from '@/lib/api';
import { Check } from 'lucide-react';

const SettingsMain = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    specialty: '',
    website: '',
    instagram: '',
    pinterest: '',
    bio: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.ok && res.data?.user) {
        const user = res.data.user;
        setUserId(user.id);
        setFormData({
          fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
          email: user.email || '',
          phone: user.phone || '',
          experience: user.vendorProfile?.experience || '',
          specialty: user.vendorProfile?.specialty || '',
          website: user.vendorProfile?.website || '',
          instagram: user.vendorProfile?.instagram || '',
          pinterest: user.vendorProfile?.pinterest || '',
          bio: user.vendorProfile?.bio || ''
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      // Send updates directly to the backend decorator profile endpoint
      const res = await decoratorAPI.updateProfile({
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        specialty: formData.specialty,
        website: formData.website,
        instagram: formData.instagram,
        pinterest: formData.pinterest,
        bio: formData.bio
      });
      if (res.ok) {
        setToastType('success');
        setToastMessage("Settings successfully updated!");
      } else {
        setToastType('error');
        setToastMessage("Failed to update settings.");
      }
    } catch (e) {
      console.error(e);
      setToastType('error');
      setToastMessage("Error saving settings.");
    } finally {
      setSaving(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
        <div className="flex-1 flex items-center justify-center text-[#7C6A2E] animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF9F1]">
      <div className="flex-1 px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
        <SettingsHeader onSave={handleSave} isSaving={saving} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PersonalProfile formData={formData} handleChange={handleChange} />
          </div>
          <div>
            <AccountSecurity />
          </div>
        </div>

        <NotificationPreferences />
      </div>
      <Footer />

      {/* Premium Toast Popup */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-[fadeIn_0.3s_ease-out]">
          <div className={`border text-white px-8 py-4 shadow-2xl flex items-center space-x-4 ${toastType === 'success' ? 'bg-gray-900 border-[#B08D2C]' : 'bg-red-900 border-red-500'}`}>
            {toastType === 'success' && (
              <div className="w-6 h-6 rounded-full bg-[#B08D2C] flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
            )}
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-gray-100">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMain;
