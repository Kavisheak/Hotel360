"use client";

import React, { useState } from 'react';
import { User, ChevronDown, Camera } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface PersonalProfileProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  user: any;
  setUser: (user: any) => void;
  errors?: { email?: string, phone?: string };
}

const PersonalProfile = ({ formData, handleChange, user, setUser, errors = {} }: PersonalProfileProps) => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setMessage('');

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    try {
      const { ok, data } = await authAPI.uploadAvatar(formDataUpload);
      if (ok && data.avatar) {
        setMessage('Profile photo updated successfully!');
        setUser({ ...user, avatar: data.avatar });
        useAuthStore.getState().updateUser({ avatar: data.avatar });
      } else {
        setMessage(data.message || 'Failed to upload photo.');
      }
    } catch (error) {
      setMessage('An error occurred during photo upload.');
    } finally {
      setIsUploadingPhoto(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
      <div>
        {/* Title */}
        <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
          <User size={16} className="text-[#B08D2C]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">
            PERSONAL PROFILE
          </h3>
        </div>

        {message && (
          <div className={`p-3 mb-4 text-xs font-bold tracking-wide uppercase ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-6 border-b border-gray-100 pb-6 mb-6 md:flex-row md:items-center">
          <div className="relative h-28 w-28 overflow-hidden border border-[#E0D8C3] bg-[#FDF9F1]">
            <img
              src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`) : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=112&h=112"}
              alt="Decorator profile portrait"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-black/25 px-2 py-1 text-white">
              <Camera size={12} />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-[28px] font-serif text-gray-900 mb-2">Profile Picture</h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              Upload a high-quality logo or portrait to display on the client directory.
            </p>
            <input
              type="file"
              accept="image/*"
              id="decorator-avatar-upload"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <label
              htmlFor="decorator-avatar-upload"
              className="mt-4 inline-block border border-[#B08D2C] px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#7C6A2E] uppercase transition-colors hover:bg-[#FDF9F1] cursor-pointer"
            >
              {isUploadingPhoto ? 'Uploading...' : 'Replace Photo'}
            </label>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
              FULL NAME
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
              PHONE NUMBER
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
            {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
              YEARS OF EXPERIENCE
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>
        </div>

        {/* Full-width select fields */}
        <div className="space-y-5 mb-6">
          {/* Decorator Specialty */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
              DECORATOR SPECIALTY
            </label>
            <div className="relative">
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="e.g. Floral Architecture & Design"
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>
          </div>

          {/* Website / Portfolio */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
              WEBSITE / PORTFOLIO URL
            </label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>
        </div>

        {/* Social Media links section */}
        <div className="border-t border-gray-100 pt-5 mb-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-4">
            SOCIAL MEDIA LINKS
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Instagram */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                INSTAGRAM HANDLE
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>

            {/* Pinterest */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                PINTEREST PROFILE
              </label>
              <input
                type="text"
                name="pinterest"
                value={formData.pinterest}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>
          </div>
        </div>

        {/* Professional Bio */}
        <div className="border-t border-gray-100 pt-5">
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
            PROFESSIONAL BIO
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C] resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalProfile;