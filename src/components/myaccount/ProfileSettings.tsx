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
    <div className="bg-white border border-[#D4C9A8] rounded-sm shadow-sm hover-glow transition-all duration-300 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F0E6D0] bg-[#F0E6D0]/20">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
          <User className="w-4 h-4 text-[#C9A84C]" />
        </div>
        <div>
          <h4 className="text-sm font-serif text-[#2C1E14]">Personal Information</h4>
          <p className="text-[10px] text-gray-400 font-light">Update your profile details and contact information.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-5">
        {/* Avatar Upload */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#F0E6D0] flex items-center justify-center text-[#C9A84C] relative group cursor-pointer overflow-hidden border-2 border-[#D4C9A8]">
            <User className="w-8 h-8" />
            <div className="absolute inset-0 bg-[#2C1E14]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#2C1E14]">Profile Photo</p>
            <p className="text-[10px] text-gray-400 font-light mt-0.5">JPG, PNG or WEBP. Max 2MB.</p>
            <button type="button" className="mt-1.5 text-[9px] font-bold uppercase tracking-widest text-[#C9A84C] hover:text-[#2C1E14] transition-colors btn-interactive">
              Upload Photo
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">First Name</label>
            <input
              value={profile.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full border border-[#D4C9A8] bg-[#F0E6D0]/20 p-3 rounded-sm text-sm focus:border-[#C9A84C] focus:bg-white outline-none transition-all input-glow"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Last Name</label>
            <input
              value={profile.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full border border-[#D4C9A8] bg-[#F0E6D0]/20 p-3 rounded-sm text-sm focus:border-[#C9A84C] focus:bg-white outline-none transition-all input-glow"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border border-[#D4C9A8] bg-[#F0E6D0]/20 p-3 rounded-sm text-sm focus:border-[#C9A84C] focus:bg-white outline-none transition-all input-glow"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border border-[#D4C9A8] bg-[#F0E6D0]/20 p-3 rounded-sm text-sm focus:border-[#C9A84C] focus:bg-white outline-none transition-all input-glow"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">Street Address</label>
            <input
              value={profile.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-[#D4C9A8] bg-[#F0E6D0]/20 p-3 rounded-sm text-sm focus:border-[#C9A84C] focus:bg-white outline-none transition-all input-glow"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1.5">City / Region</label>
            <input
              value={profile.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="w-full border border-[#D4C9A8] bg-[#F0E6D0]/20 p-3 rounded-sm text-sm focus:border-[#C9A84C] focus:bg-white outline-none transition-all input-glow"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#F0E6D0] flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#C9A84C] text-[#2C1E14] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#B89238] transition-colors btn-interactive flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
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
