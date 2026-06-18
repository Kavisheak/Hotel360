"use client";

import React, { useState } from "react";
import { User, Camera, Save } from "lucide-react";
import { USER_PROFILE } from "./types";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    firstName: USER_PROFILE.firstName,
    lastName: USER_PROFILE.lastName,
    email: USER_PROFILE.email,
    phone: USER_PROFILE.phone,
    address: USER_PROFILE.address,
    city: USER_PROFILE.city,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] border border-[#E8DFC9] dark:border-gray-800 rounded-lg shadow-sm hover-glow transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-4 px-8 py-6 border-b border-[#E8DFC9] dark:border-gray-800">
        <User className="w-5 h-5 text-[#C69C6D]" />
        <div>
          <h4 className="text-xl font-serif text-[#1A1512] dark:text-white">Personal Information</h4>
          <p className="text-[10px] text-gray-500 font-medium">Update your profile details and contact information.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#FAF6EE] dark:bg-[#2A2A2A] flex items-center justify-center text-[#C69C6D] relative group cursor-pointer overflow-hidden border border-[#E8DFC9] dark:border-gray-700">
            <User className="w-8 h-8" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#1A1512] dark:text-white">Profile Photo</p>
            <p className="text-[10px] text-gray-500 font-medium mt-1 mb-3">JPG, PNG or WEBP. Max 2MB.</p>
            <button type="button" className="px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#C69C6D] border border-[#C69C6D]/30 rounded hover:bg-[#FAF6EE] transition-colors btn-interactive">
              Upload Photo
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2 pl-1">First Name</label>
            <input
              value={profile.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111111] px-4 py-3.5 rounded-lg text-sm text-[#1A1512] dark:text-white focus:border-[#C69C6D] focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2 pl-1">Last Name</label>
            <input
              value={profile.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111111] px-4 py-3.5 rounded-lg text-sm text-[#1A1512] dark:text-white focus:border-[#C69C6D] focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2 pl-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111111] px-4 py-3.5 rounded-lg text-sm text-[#1A1512] dark:text-white focus:border-[#C69C6D] focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2 pl-1">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111111] px-4 py-3.5 rounded-lg text-sm text-[#1A1512] dark:text-white focus:border-[#C69C6D] focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2 pl-1">Street Address</label>
            <input
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111111] px-4 py-3.5 rounded-lg text-sm text-[#1A1512] dark:text-white focus:border-[#C69C6D] focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2 pl-1">City / Region</label>
            <input
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#111111] px-4 py-3.5 rounded-lg text-sm text-[#1A1512] dark:text-white focus:border-[#C69C6D] focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 flex items-center gap-4">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#C69C6D] text-white font-bold text-[10px] uppercase tracking-widest rounded hover:bg-[#B58A59] transition-colors btn-interactive flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          {saved && (
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest animate-fadeIn">
              ✓ Profile updated successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
