"use client";

import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProfileSettings from './ProfileSettings';
import AccountSettings from './AccountSettings';
import NotificationSettings from './NotificationSettings';
import AvailabilitySettings from './AvailabilitySettings';
import SecuritySettings from './SecuritySettings';
import Footer from '../overview/Footer';
import { authAPI, djAPI } from '@/lib/api';
import { Check } from 'lucide-react';

const SettingsMain = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    specialty: '',
    instagram: '',
    spotify: '',
    soundcloud: '',
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
          bio: user.vendorProfile?.bio || '',
          specialty: user.vendorProfile?.specialty || 'Bespoke Weddings',
          instagram: user.vendorProfile?.instagram || '',
          spotify: user.vendorProfile?.spotify || '',
          soundcloud: user.vendorProfile?.soundcloud || '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const res = await djAPI.updateProfile({
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        specialty: formData.specialty,
        instagram: formData.instagram,
        spotify: formData.spotify,
        soundcloud: formData.soundcloud,
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
      <main className="flex-1 flex flex-col bg-[#FDF9F1]">
        <div className="px-4 sm:px-8 lg:px-10 py-6 max-w-7xl mx-auto w-full">
          <Header onSave={handleSave} isSaving={saving} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] gap-6 mb-6">
            <div className="space-y-6">
              <ProfileSettings formData={formData} handleChange={handleChange} />
              <AccountSettings formData={formData} handleChange={handleChange} />
            </div>

            <div className="space-y-6">
              <AvailabilitySettings />
              <NotificationSettings />
              <SecuritySettings />
            </div>
          </div>
        </div>
      </main>
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
