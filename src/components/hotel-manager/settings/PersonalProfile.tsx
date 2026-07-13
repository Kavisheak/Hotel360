"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from "react-dom";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { User, Save, Trash2, Loader2, X, Upload } from "lucide-react";
import getCroppedImg from "@/utils/cropImage";
import { SectionTitle } from './SectionTitle';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/lib/api';
import { validatePhone } from '@/lib/validation';
import { getImageUrl } from "@/lib/utils";

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
  const [error, setError] = useState('');
  
  // Avatar upload states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => setCropImageSrc(reader.result?.toString() || null));
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropUpload = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    setUploadingAvatar(true);
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Failed to crop image");

      const form = new FormData();
      form.append("avatar", croppedBlob, "avatar.jpg");

      const { ok, data } = await authAPI.uploadAvatar(form);
      if (ok && data.avatar) {
        updateUser({ avatar: data.avatar });
      } else {
        alert(data?.message || "Failed to upload avatar");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setUploadingAvatar(false);
      setCropImageSrc(null);
    }
  };

  const handleAvatarDelete = async () => {
    setUploadingAvatar(true);
    const { ok, data } = await authAPI.deleteAvatar();
    setUploadingAvatar(false);

    if (ok) {
      updateUser({ avatar: "" });
    } else {
      alert(data?.message || "Failed to delete avatar");
    }
  };

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
    if (e.target.name === 'phone' && error) setError('');
  };

  const handleSave = async () => {
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid Sri Lankan phone number.');
      return;
    }
    setError('');
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
    <>
      <div className="mb-12">
        <SectionTitle title="Personal Profile" />
        <div className="bg-white border border-[#E0D8C3] p-6 shadow-sm">
          {/* Avatar Upload */}
          <div className="flex items-center gap-6 border-b border-[#E0D8C3] pb-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#7C6A2E] relative overflow-hidden border border-[#E0D8C3]">
              {user?.avatar ? (
                <Image 
                  src={getImageUrl(user.avatar)} 
                  alt="Profile Avatar" 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <User className="w-8 h-8" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-800">Profile Photo</p>
              <p className="text-[10px] text-gray-500 font-medium mt-1 mb-3 tracking-wide">JPG, PNG or WEBP. Max 5MB.</p>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleAvatarSelect}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#7C6A2E] border border-[#E0D8C3] rounded hover:bg-[#FDF9F1] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" strokeWidth={2} />}
                  {uploadingAvatar ? "Uploading..." : "Change Photo"}
                </button>
                {user?.avatar && (
                  <button 
                    type="button"
                    onClick={handleAvatarDelete}
                    disabled={uploadingAvatar}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

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
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#FDF9F1] border border-[#E0D8C3] px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#B08D2C]" />
            {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
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

      {/* Crop Modal */}
      {mounted && cropImageSrc && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FDF9F1] w-full max-w-lg rounded-sm shadow-2xl overflow-hidden flex flex-col border border-[#E0D8C3] animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b border-[#E0D8C3]">
              <h3 className="font-serif italic text-lg text-[#7C6A2E] font-semibold">Crop Profile Photo</h3>
              <button 
                onClick={() => setCropImageSrc(null)}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative w-full h-[300px] bg-black/5">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#7C6A2E]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCropImageSrc(null)}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-200 rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropUpload}
                  disabled={uploadingAvatar}
                  className="px-6 py-2 bg-[#7C6A2E] text-white font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#635525] transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {uploadingAvatar ? "Uploading..." : "Crop & Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PersonalProfile;
