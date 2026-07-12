"use client";

import React, { useState, useEffect } from 'react';
import SettingsHeader from './SettingsHeader';
import PersonalProfile from './PersonalProfile';
import AccountSecurity from './AccountSecurity';
import Footer from '../shared/Footer';
import { validateEmail, validatePhone } from '@/lib/validation';
import { authAPI, videographerAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Check } from 'lucide-react';

const SettingsContent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    shopName: '',
    email: '',
    phone: '',
    experience: '',
    specialty: '',
    website: '',
    instagram: '',
    pinterest: '',
    bio: '',
    startingPrice: '',
    location: '',
    eventsCompleted: '',
    responseTime: '',
    depositReq: '',
    cancellation: '',
    availableIslandWide: true,
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [errors, setErrors] = useState<{email?: string, phone?: string}>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.ok && res.data?.user) {
        const userData = res.data.user;
        setUser(userData);
        setUserId(userData.id || userData._id);
        setFormData({
          fullName: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || '',
          shopName: userData.shopName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          experience: userData.vendorProfile?.experience || '',
          specialty: userData.vendorProfile?.specialty || '',
          website: userData.vendorProfile?.website || '',
          instagram: userData.vendorProfile?.instagram || '',
          pinterest: userData.vendorProfile?.pinterest || '',
          bio: userData.vendorProfile?.bio || '',
          startingPrice: userData.vendorProfile?.startingPrice || '',
          location: userData.vendorProfile?.location || '',
          eventsCompleted: userData.vendorProfile?.eventsCompleted || '',
          responseTime: userData.vendorProfile?.responseTime || '',
          depositReq: userData.vendorProfile?.depositReq || '',
          cancellation: userData.vendorProfile?.cancellation || '',
          availableIslandWide: userData.vendorProfile?.availableIslandWide !== false,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    setErrors({});
    let hasError = false;
    const newErrors: typeof errors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      hasError = true;
    }
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid Sri Lankan phone number.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setToastType('error');
      setToastMessage('Please fix the validation errors.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setSaving(true);
    try {
      const res = await videographerAPI.updateProfile({
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        shopName: formData.shopName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        specialty: formData.specialty,
        website: formData.website,
        instagram: formData.instagram,
        pinterest: formData.pinterest,
        bio: formData.bio,
        startingPrice: formData.startingPrice,
        location: formData.location,
        eventsCompleted: formData.eventsCompleted,
        responseTime: formData.responseTime,
        depositReq: formData.depositReq,
        cancellation: formData.cancellation,
        availableIslandWide: formData.availableIslandWide,
      });
      if (res.ok) {
        setToastType('success');
        setToastMessage("Settings successfully updated!");
        if (res.data?.data) {
          useAuthStore.getState().updateUser(res.data.data);
        }
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
            <PersonalProfile formData={formData} handleChange={handleChange} user={user} setUser={setUser} errors={errors} />
          </div>
          <div>
            <AccountSecurity />
          </div>
        </div>
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

export default SettingsContent;
