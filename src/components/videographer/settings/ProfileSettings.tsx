"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Camera, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { videographerAPI } from '@/lib/api';

const ProfileSettings = () => {
  const { user, fetchUser, updateUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    specialty: 'Bespoke Wedding Films',
    experience: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.vendorProfile?.bio || '',
        specialty: user.vendorProfile?.specialty || 'Bespoke Wedding Films',
        experience: user.vendorProfile?.experience || '',
      });
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    
    try {
      const { ok, data } = await videographerAPI.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        specialty: formData.specialty,
        experience: formData.experience,
      });

      if (ok && data.success) {
        setMessage('Profile updated successfully!');
        updateUser(data.data); // Update global store
      } else {
        setMessage(data.message || 'Failed to update profile.');
      }
    } catch (error: any) {
      setMessage('An error occurred while saving.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <article className="bg-white border border-[#E0D8C3] p-6 sm:p-8 shadow-sm flex flex-col justify-between relative">
      <div>
        <div className="flex items-center justify-between border-b border-[#E0D8C3] pb-3 mb-6">
          <div className="flex items-center space-x-2">
            <Camera size={16} className="text-[#B08D2C]" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#7C6A2E] uppercase">PROFILE INFORMATION</h3>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-[#7C6A2E] text-white px-4 py-2 text-[10px] font-bold tracking-[0.18em] uppercase transition-colors hover:bg-[#B08D2C] disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </div>

        {message && (
          <div className={`p-3 mb-4 text-xs font-bold tracking-wide uppercase ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        <div className="flex flex-col gap-6 border-b border-gray-100 pb-6 mb-6 md:flex-row md:items-center">
          <div className="relative h-28 w-28 overflow-hidden border border-[#E0D8C3] bg-[#FDF9F1]">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=112&h=112"}
              alt="Videographer profile portrait"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-black/25 px-2 py-1 text-white">
              <Camera size={12} />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-[28px] font-serif text-gray-900 mb-2">Profile Information</h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              Manage how your brand is perceived by clients and booking partners.
            </p>
            <button className="mt-4 border border-[#B08D2C] px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#7C6A2E] uppercase transition-colors hover:bg-[#FDF9F1]">
              Replace Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
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
                <option value="Bespoke Wedding Films">Bespoke Wedding Films</option>
                <option value="Luxury Corporate Events">Luxury Corporate Events</option>
                <option value="Destination Weddings">Destination Weddings</option>
                <option value="Engagement Sessions">Engagement Sessions</option>
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
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Years of Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">Professional Bio</label>
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
