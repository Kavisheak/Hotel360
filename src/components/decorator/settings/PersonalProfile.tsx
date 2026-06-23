"use client";

import React, { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';

interface PersonalProfileProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalProfile = ({ formData, handleChange }: PersonalProfileProps) => {

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
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
              PHONE NUMBER
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-xs border border-[#E0D8C3] bg-white text-gray-700 focus:outline-none focus:border-[#B08D2C]"
            />
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
