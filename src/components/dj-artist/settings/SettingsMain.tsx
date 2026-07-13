"use client";

import React, { useState, useEffect } from 'react';
import SettingsHeader from './SettingsHeader';
import PersonalProfile from './PersonalProfile';
import AccountSecurity from './AccountSecurity';
import Footer from '../overview/Footer';
import { validateEmail, validatePhone } from '@/lib/validation';
import { authAPI, djAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Check } from 'lucide-react';

const SettingsMain = () => {
  const { user, updateUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    fullName: '',
    shopName: '',
    email: '',
    phone: '',
    experience: '',
    specialty: '',
    bio: '',
    instagram: '',
    spotify: '',
    soundcloud: '',
    startingPrice: '',
    location: '',
    eventsCompleted: '',
    responseTime: '',
    depositReq: '',
    cancellation: '',
    availableIslandWide: true,
  });
  
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const setUser = (updatedUser: any) => {
    updateUser(updatedUser);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.ok && res.data?.user) {
        const userData = res.data.user;
        setUserId(userData.id);
        setFormData({
          fullName: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || '',
          shopName: userData.shopName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          experience: userData.vendorProfile?.experience || '',
          specialty: userData.vendorProfile?.specialty || '',
          bio: userData.vendorProfile?.bio || '',
          instagram: userData.vendorProfile?.instagram || '',
          spotify: userData.vendorProfile?.spotify || '',
          soundcloud: userData.vendorProfile?.soundcloud || '',
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

    // Validate email & phone
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    if (emailErr || phoneErr) {
      setErrors({
        email: emailErr || undefined,
        phone: phoneErr || undefined
      });
      setToastType('error');
      setToastMessage("Please resolve validation errors.");
      return;
    }

    setSaving(true);
    try {
      const res = await djAPI.updateProfile({
        firstName: formData.fullName.split(' ')[0] || '',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
        shopName: formData.shopName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        specialty: formData.specialty,
        bio: formData.bio,
        instagram: formData.instagram,
        spotify: formData.spotify,
        soundcloud: formData.soundcloud,
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
        setToastMessage(res.data.message || "Failed to update settings.");
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
            <PersonalProfile 
              formData={formData} 
              handleChange={handleChange} 
              user={user} 
              setUser={setUser} 
              errors={errors} 
            />
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

export default SettingsMain;
