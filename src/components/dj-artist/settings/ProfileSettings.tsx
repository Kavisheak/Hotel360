"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Camera } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { getImageUrl } from "@/lib/utils";

interface ProfileSettingsProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  user: any;
  setUser: (user: any) => void;
  errors?: {email?: string, phone?: string};
}

const ProfileSettings = ({ formData, handleChange, user, setUser, errors = {} }: ProfileSettingsProps) => {
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
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 border-b border-[#E0D8C3] pb-3 mb-6">
          <Camera size={16} className="text-[#B08D2C]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">PROFILE ARTISTRY</h3>
        </div>

        {message && (
          <div className={`p-3 mb-4 text-xs font-bold tracking-wide uppercase ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-6 border-b border-gray-100 pb-6 mb-6 md:flex-row md:items-center">
          <div className="relative h-28 w-28 overflow-hidden border border-[#E0D8C3] bg-[#FDF9F1]">
            <img
              src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : getImageUrl(user.avatar)) : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=112&h=112"}
              alt="DJ profile portrait"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-black/25 px-2 py-1 text-white">
              <Camera size={12} />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-[28px] font-serif text-gray-900 mb-2">Profile Artistry</h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              Manage how your brand is perceived by elite clients and booking partners.
            </p>
            <input 
              type="file" 
              accept="image/*" 
              id="dj-avatar-upload" 
              className="hidden" 
              onChange={handlePhotoChange} 
            />
            <label 
              htmlFor="dj-avatar-upload" 
              className="mt-4 inline-block border border-[#B08D2C] px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#7C6A2E] uppercase transition-colors hover:bg-[#FDF9F1] cursor-pointer"
            >
              {isUploadingPhoto ? 'Uploading...' : 'Replace Photo'}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Shop Name / Business Name</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName || ''}
              onChange={handleChange}
              placeholder="e.g. DJ Nova Beats"
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Starting Price (e.g. LKR 180,000)</label>
            <input
              type="text"
              name="startingPrice"
              value={formData.startingPrice || ''}
              onChange={handleChange}
              placeholder="e.g. LKR 180,000"
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Artist Stage Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Specialization</label>
            <div className="relative">
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full appearance-none bg-white border border-[#E0D8C3] px-4 py-2.5 pr-10 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#B08D2C] cursor-pointer"
              >
                <option value="Bespoke Weddings">Bespoke Weddings</option>
                <option value="Luxury Corporate">Luxury Corporate</option>
                <option value="Private Residencies">Private Residencies</option>
                <option value="Destination Events">Destination Events</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="dj@example.com"
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-[#FDF9F1] text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+94 77 123 4567"
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-[#FDF9F1] text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
            {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Additional Vendor Details */}
        <div className="border-t border-gray-100 pt-5 mb-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#7C6A2E] uppercase mb-4">
            ADDITIONAL VENDOR DETAILS & POLICIES
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Studio Address / Location */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                STUDIO ADDRESS / LOCATION
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="e.g. 75/1 Barnes Place, Colombo 07"
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>

            {/* Events Completed */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                EVENTS COMPLETED (e.g. 120+)
              </label>
              <input
                type="text"
                name="eventsCompleted"
                value={formData.eventsCompleted || ''}
                onChange={handleChange}
                placeholder="e.g. 120+"
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>

            {/* Response Time */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                RESPONSE TIME (e.g. ~24 Hours)
              </label>
              <input
                type="text"
                name="responseTime"
                value={formData.responseTime || ''}
                onChange={handleChange}
                placeholder="e.g. ~24 Hours"
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>

            {/* Deposit Required */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                DEPOSIT REQUIRED (e.g. 50%)
              </label>
              <input
                type="text"
                name="depositReq"
                value={formData.depositReq || ''}
                onChange={handleChange}
                placeholder="e.g. 50%"
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>

            {/* Cancellation Policy */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                CANCELLATION POLICY (e.g. Flexible)
              </label>
              <input
                type="text"
                name="cancellation"
                value={formData.cancellation || ''}
                onChange={handleChange}
                placeholder="e.g. Flexible"
                className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
              />
            </div>

            {/* Island-wide Availability */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="availableIslandWide"
                name="availableIslandWide"
                checked={!!formData.availableIslandWide}
                onChange={handleChange}
                className="w-4 h-4 accent-[#B08D2C] cursor-pointer"
              />
              <label htmlFor="availableIslandWide" className="ml-2 text-xs font-bold text-gray-600 tracking-wider uppercase cursor-pointer">
                AVAILABLE ISLAND-WIDE
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Curated Bio</label>
          <textarea
            name="bio"
            rows={5}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C] resize-none leading-relaxed"
          />
        </div>
      </div>
    </article>
  );
};

export default ProfileSettings;
